import mongoose from "mongoose";
import { Industry, Site } from "../../models/index.js";

const DEFAULT_SITE_SUBDOMAIN = "markgenexes";
const INDUSTRY_MIGRATION = "industries-v1";
const defaultIndustries = [
  {
    name: "SaaS & Technology",
    slug: "saas-technology",
    icon: "Code2",
    mainImage: "/images/saas-technology.png",
    description: "From PLG to enterprise sales, we help SaaS companies shorten sales cycles, increase trial-to-paid conversion, and build category-defining brands.",
    challenges: ["Long, multi-stakeholder sales cycles", "Differentiating in crowded categories", "Proving ROI to technical buyers"],
    outcomes: ["Higher trial-to-paid conversion", "Shorter sales cycles", "Category leadership positioning"],
    featured: true,
    keywords: ["SaaS", "technology", "growth marketing"],
  },
  {
    name: "Education", slug: "education", icon: "GraduationCap",
    description: "Enrollment-focused campaigns and digital experiences that connect institutions with the right students and partners.",
    challenges: ["Seasonal admission cycles", "Complex course discovery", "Lead follow-up across teams"],
    outcomes: ["More qualified applications", "Clearer program positioning", "Faster admission follow-up"],
    keywords: ["education", "enrollment", "admissions"],
  },
  {
    name: "Healthcare", slug: "healthcare", icon: "HeartPulse",
    description: "Trust-led growth systems for healthcare providers, wellness brands, clinics, and patient-focused services.",
    challenges: ["Building patient trust", "Local service visibility", "Managing sensitive enquiries"],
    outcomes: ["Stronger local discovery", "Higher-quality appointments", "Clear patient journeys"],
    keywords: ["healthcare", "patient acquisition", "clinics"],
  },
  {
    name: "Real Estate", slug: "real-estate", icon: "House",
    description: "Performance campaigns and lead operations for developers, brokers, commercial properties, and residential projects.",
    challenges: ["High lead acquisition costs", "Long consideration periods", "Inconsistent sales follow-up"],
    outcomes: ["Qualified property enquiries", "Better campaign attribution", "Faster lead routing"],
    keywords: ["real estate", "property leads", "developers"],
  },
  {
    name: "Retail & Commerce", slug: "retail-commerce", icon: "ShoppingBag",
    description: "Customer acquisition and retention programs designed for modern retail, ecommerce, and consumer brands.",
    challenges: ["Rising acquisition costs", "Low repeat purchase rates", "Fragmented customer data"],
    outcomes: ["Improved conversion rates", "Stronger customer retention", "Connected commerce reporting"],
    keywords: ["retail", "ecommerce", "customer retention"],
  },
  {
    name: "Financial Services", slug: "financial-services", icon: "Landmark",
    description: "Credible, compliant growth experiences for finance, insurance, lending, and professional advisory businesses.",
    challenges: ["Complex products and decisions", "Trust and compliance demands", "Lengthy qualification processes"],
    outcomes: ["Better-qualified prospects", "Clearer product education", "Measurable acquisition funnels"],
    keywords: ["financial services", "insurance", "lending"],
  },
  {
    name: "Hospitality", slug: "hospitality", icon: "Hotel",
    description: "Demand-generation systems that help hotels, venues, and travel businesses increase direct customer relationships.",
    challenges: ["Dependence on aggregators", "Seasonal demand changes", "Disconnected guest journeys"],
    outcomes: ["More direct enquiries", "Stronger seasonal campaigns", "Improved guest engagement"],
    keywords: ["hospitality", "hotels", "travel marketing"],
  },
  {
    name: "Manufacturing", slug: "manufacturing", icon: "Factory",
    description: "B2B positioning and lead generation for manufacturers, industrial suppliers, and engineering-led organizations.",
    challenges: ["Technical buying journeys", "Limited digital visibility", "Long distributor sales cycles"],
    outcomes: ["More relevant B2B leads", "Clear technical positioning", "Stronger sales enablement"],
    keywords: ["manufacturing", "B2B leads", "industrial marketing"],
  },
];

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeItems(items, includeHighlight = false) {
  if (!Array.isArray(items)) return [];
  return items
    .map((item, index) => ({
      text: String(typeof item === "string" ? item : item?.text || "").trim(),
      order: Number.isFinite(Number(item?.order)) ? Number(item.order) : index,
      ...(includeHighlight ? { highlighted: item?.highlighted !== false } : {}),
    }))
    .filter((item) => item.text)
    .sort((a, b) => a.order - b.order)
    .map((item, index) => ({ ...item, order: index }));
}

function normalizeImage(value) {
  const image = String(value || "").trim();
  if (!image) return "";
  if (/^data:image\/(png|jpe?g|webp);base64,/i.test(image) || /^https?:\/\//i.test(image) || image.startsWith("/")) {
    return image;
  }
  throw new Error("Main image must be an image upload or a valid URL");
}

async function getSite() {
  return Site.findOne({ subdomain: DEFAULT_SITE_SUBDOMAIN });
}

async function migrateExistingIndustries(site) {
  if (site.contentMigrations?.includes(INDUSTRY_MIGRATION)) return;

  await Industry.bulkWrite(
    defaultIndustries.map((industry, index) => ({
      updateOne: {
        filter: { site: site._id, slug: industry.slug },
        update: {
          $setOnInsert: {
            site: site._id,
            ...industry,
            industryNumber: String(index + 1).padStart(2, "0"),
            challenges: industry.challenges.map((text, order) => ({ text, order })),
            outcomes: industry.outcomes.map((text, order) => ({ text, highlighted: true, order })),
            ctaText: "Talk to an Industry Specialist",
            ctaLink: "/consultation",
            order: index,
            status: "active",
            seoTitle: `${industry.name} Growth Services | MarkGenexes`,
            metaDescription: industry.description,
          },
        },
        upsert: true,
      },
    })),
  );
  await Site.updateOne({ _id: site._id }, { $addToSet: { contentMigrations: INDUSTRY_MIGRATION } });
  site.contentMigrations = [...(site.contentMigrations || []), INDUSTRY_MIGRATION];
}

function serialize(industry) {
  return {
    id: String(industry._id),
    name: industry.name,
    title: industry.name,
    industryNumber: industry.industryNumber || String(Number(industry.order || 0) + 1).padStart(2, "0"),
    slug: industry.slug,
    icon: industry.icon || "Building2",
    mainImage: industry.mainImage || "",
    imageAlt: industry.imageAlt || "",
    description: industry.description || "",
    challenges: [...(industry.challenges || [])].sort((a, b) => a.order - b.order),
    outcomes: [...(industry.outcomes || [])].sort((a, b) => a.order - b.order),
    ctaText: industry.ctaText,
    ctaLink: industry.ctaLink,
    displayOrder: industry.order,
    featured: industry.featured,
    status: industry.status,
    seoTitle: industry.seoTitle || "",
    metaDescription: industry.metaDescription || "",
    keywords: industry.keywords || [],
    createdAt: industry.createdAt,
    updatedAt: industry.updatedAt,
  };
}

function buildPayload(body, current = {}) {
  const name = String(body.name ?? current.name ?? "").trim();
  if (!name) throw new Error("Industry name is required");
  const slug = slugify(body.slug ?? current.slug ?? name);
  if (!slug) throw new Error("A valid slug is required");

  return {
    name,
    slug,
    industryNumber: String(body.industryNumber ?? current.industryNumber ?? "").trim(),
    mainImage: normalizeImage(body.mainImage ?? current.mainImage),
    imageAlt: String(body.imageAlt ?? current.imageAlt ?? name).trim(),
    description: String(body.description ?? current.description ?? "").trim(),
    challenges: normalizeItems(body.challenges ?? current.challenges),
    outcomes: normalizeItems(body.outcomes ?? current.outcomes, true),
    ctaText: String(body.ctaText ?? current.ctaText ?? "Talk to an Industry Specialist").trim(),
    ctaLink: String(body.ctaLink ?? current.ctaLink ?? "/consultation").trim(),
    order: Math.max(0, Number(body.displayOrder ?? body.order ?? current.order ?? 0)),
    featured: Boolean(body.featured ?? current.featured),
    status: (body.status ?? current.status) === "inactive" ? "inactive" : "active",
    seoTitle: String(body.seoTitle ?? current.seoTitle ?? "").trim(),
    metaDescription: String(body.metaDescription ?? current.metaDescription ?? "").trim(),
    keywords: Array.isArray(body.keywords)
      ? body.keywords.map((item) => String(item).trim()).filter(Boolean)
      : String(body.keywords ?? current.keywords ?? "")
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
  };
}

export class IndustryController {
  static async publicList(req, res) {
    try {
      const site = await getSite();
      if (!site) return res.json({ industries: [], managed: false });
      await migrateExistingIndustries(site);
      const [industries, managedCount] = await Promise.all([
        Industry.find({ site: site._id, status: "active" }).sort({ order: 1, createdAt: 1 }),
        Industry.countDocuments({ site: site._id }),
      ]);
      return res.json({ industries: industries.map(serialize), managed: managedCount > 0 });
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch industries", details: error.message });
    }
  }

  static async adminList(req, res) {
    try {
      const site = await getSite();
      if (!site) return res.json({ industries: [] });
      await migrateExistingIndustries(site);
      const industries = await Industry.find({ site: site._id }).sort({ order: 1, createdAt: 1 });
      return res.json({ industries: industries.map(serialize) });
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch industries", details: error.message });
    }
  }

  static async create(req, res) {
    try {
      const site = await getSite();
      if (!site) return res.status(404).json({ error: "Website workspace not found" });
      const payload = buildPayload(req.body);
      const existing = await Industry.findOne({ site: site._id, slug: payload.slug });
      if (existing) return res.status(409).json({ error: "An industry with this slug already exists" });
      const industry = await Industry.create({ site: site._id, ...payload });
      return res.status(201).json({ message: "Industry created", industry: serialize(industry) });
    } catch (error) {
      return res.status(400).json({ error: "Failed to create industry", details: error.message });
    }
  }

  static async update(req, res) {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ error: "Invalid industry ID" });
      const industry = await Industry.findById(req.params.id);
      if (!industry) return res.status(404).json({ error: "Industry not found" });
      const payload = buildPayload(req.body, industry.toObject());
      const duplicate = await Industry.findOne({ site: industry.site, slug: payload.slug, _id: { $ne: industry._id } });
      if (duplicate) return res.status(409).json({ error: "An industry with this slug already exists" });
      Object.assign(industry, payload);
      await industry.save();
      return res.json({ message: "Industry updated", industry: serialize(industry) });
    } catch (error) {
      return res.status(400).json({ error: "Failed to update industry", details: error.message });
    }
  }

  static async remove(req, res) {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ error: "Invalid industry ID" });
      const industry = await Industry.findByIdAndDelete(req.params.id);
      if (!industry) return res.status(404).json({ error: "Industry not found" });
      return res.json({ message: "Industry deleted" });
    } catch (error) {
      return res.status(500).json({ error: "Failed to delete industry", details: error.message });
    }
  }
}
