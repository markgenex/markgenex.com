import {
  FormDefinition,
  FormSubmission,
  Lead,
  Organization,
  Service,
  Site,
} from "../../models/index.js";

const DEFAULT_ORG_SLUG = "markgenexes";
const DEFAULT_SITE_SUBDOMAIN = "markgenexes";

const statusFromClient = {
  new: "new",
  contacted: "contacted",
  qualified: "qualified",
  won: "converted",
  converted: "converted",
  lost: "lost",
  archived: "archived",
};

const statusToClient = {
  converted: "won",
};

function slugify(value) {
  return String(value || "general")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function splitName(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] || "Website",
    lastName: parts.slice(1).join(" ") || "Lead",
  };
}

function normalizeUtm(utm = {}) {
  return {
    source: utm.utm_source || utm.source || "",
    medium: utm.utm_medium || utm.medium || "",
    campaign: utm.utm_campaign || utm.campaign || "",
    content: utm.utm_content || utm.content || "",
    term: utm.utm_term || utm.term || "",
  };
}

async function getDefaultWorkspace() {
  const organization = await Organization.findOneAndUpdate(
    { slug: DEFAULT_ORG_SLUG },
    {
      $setOnInsert: {
        name: "MarkGenexes",
        slug: DEFAULT_ORG_SLUG,
        industry: "Technology",
        status: "active",
      },
    },
    { new: true, upsert: true },
  );

  const site = await Site.findOneAndUpdate(
    { subdomain: DEFAULT_SITE_SUBDOMAIN },
    {
      $setOnInsert: {
        organization: organization._id,
        name: "MarkGenexes Website",
        subdomain: DEFAULT_SITE_SUBDOMAIN,
        status: "published",
        isLive: true,
        publishedAt: new Date(),
      },
    },
    { new: true, upsert: true },
  );

  return { organization, site };
}

async function getForm(site, type) {
  const slug = slugify(type || "lead");
  return FormDefinition.findOneAndUpdate(
    { site: site._id, slug },
    {
      $setOnInsert: {
        site: site._id,
        name: `${slug.replace(/-/g, " ")} form`,
        slug,
        status: "published",
        captchaEnabled: false,
      },
    },
    { new: true, upsert: true },
  );
}

async function getService(site, requiredService) {
  if (!requiredService) return null;

  return Service.findOneAndUpdate(
    { site: site._id, slug: slugify(requiredService) },
    {
      $setOnInsert: {
        site: site._id,
        name: requiredService,
        slug: slugify(requiredService),
        status: "active",
      },
    },
    { new: true, upsert: true },
  );
}

function toClientLead(lead) {
  const serviceName = lead.service?.name || "";
  const submission = lead.submission?.data || {};
  const name = [lead.firstName, lead.lastName].filter(Boolean).join(" ").trim();

  return {
    id: String(lead._id),
    name: submission.name || name,
    phone: lead.phone || submission.phone || "",
    email: lead.email || submission.email || "",
    companyName: lead.company || submission.companyName || "",
    industry: lead.industry || submission.industry || "",
    requiredService: submission.requiredService || serviceName || "",
    budgetRange: submission.budgetRange || "",
    cityOrLocation: submission.cityOrLocation || "",
    leadSource: lead.attribution?.source || submission.leadSource || "direct",
    campaignSource: lead.attribution?.campaign || submission.campaignSource || "",
    enquiredAt: lead.createdAt,
    leadStatus: statusToClient[lead.status] || lead.status || "new",
    assignedTo: submission.assignedTo || "",
    noteText: lead.notes || "",
    message: submission.message || lead.notes || "",
    type: submission.type || "lead",
  };
}

export class LeadController {
  static async create(req, res) {
    try {
      const payload = req.body || {};
      const { organization, site } = await getDefaultWorkspace();
      const form = await getForm(site, payload.type);
      const service = await getService(site, payload.requiredService);
      const { firstName, lastName } = splitName(payload.name);
      const utm = normalizeUtm(payload.utm);

      const submission = await FormSubmission.create({
        site: site._id,
        form: form._id,
        data: payload,
        email: payload.email,
        phone: payload.phone,
        name: payload.name,
        utm,
        referrer: payload.referrer,
        userAgent: req.get("user-agent"),
        ipAddress: req.ip,
        language: req.get("accept-language"),
        status: "processed",
        processedAt: new Date(),
      });

      const lead = await Lead.create({
        site: site._id,
        organization: organization._id,
        firstName,
        lastName,
        email: payload.email,
        phone: payload.phone,
        company: payload.companyName,
        industry: payload.industry,
        service: service?._id,
        source: "website_form",
        submission: submission._id,
        attribution: {
          source: payload.leadSource || utm.source || "direct",
          medium: utm.medium,
          campaign: payload.campaignSource || utm.campaign,
          gclid: payload.gclid,
          fbclid: payload.fbclid,
        },
        status: statusFromClient[payload.leadStatus] || "new",
        tags: [payload.type || "lead"].filter(Boolean),
        notes: payload.noteText || payload.message,
        lastActivity: new Date(),
      });

      submission.lead = lead._id;
      await submission.save();
      await FormDefinition.updateOne({ _id: form._id }, { $inc: { submissionCount: 1 } });

      const populated = await Lead.findById(lead._id).populate("service").populate("submission");

      res.status(201).json({
        message: "Lead captured successfully",
        lead: toClientLead(populated),
      });
    } catch (error) {
      res.status(500).json({ error: "Lead capture failed", details: error.message });
    }
  }

  static async list(req, res) {
    try {
      const leads = await Lead.find({})
        .sort({ createdAt: -1 })
        .limit(250)
        .populate("service")
        .populate("submission");

      res.json({ leads: leads.map(toClientLead) });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch leads", details: error.message });
    }
  }

  static async update(req, res) {
    try {
      const patch = {};
      const submissionPatch = {};

      if (req.body.leadStatus) patch.status = statusFromClient[req.body.leadStatus] || req.body.leadStatus;
      if (typeof req.body.noteText === "string") patch.notes = req.body.noteText;
      if (typeof req.body.assignedTo === "string") submissionPatch.assignedTo = req.body.assignedTo;

      const lead = await Lead.findByIdAndUpdate(
        req.params.id,
        { $set: { ...patch, lastActivity: new Date() } },
        { new: true },
      );

      if (!lead) {
        return res.status(404).json({ error: "Lead not found" });
      }

      if (Object.keys(submissionPatch).length && lead.submission) {
        await FormSubmission.updateOne(
          { _id: lead.submission },
          { $set: Object.fromEntries(Object.entries(submissionPatch).map(([key, value]) => [`data.${key}`, value])) },
        );
      }

      const populated = await Lead.findById(lead._id).populate("service").populate("submission");
      res.json({ message: "Lead updated successfully", lead: toClientLead(populated) });
    } catch (error) {
      res.status(500).json({ error: "Failed to update lead", details: error.message });
    }
  }
}
