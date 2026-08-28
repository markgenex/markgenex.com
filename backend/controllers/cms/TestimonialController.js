import mongoose from "mongoose";
import { Testimonial, Site } from "../../models/index.js";

const DEFAULT_SITE_SUBDOMAIN = "markgenexes";

async function getSite() {
  return Site.findOne({ subdomain: DEFAULT_SITE_SUBDOMAIN });
}

function serialize(item) {
  return {
    id: String(item._id),
    author: {
      name: item.author?.name || "",
      jobTitle: item.author?.jobTitle || "",
      company: item.author?.company || "",
    },
    content: item.content || "",
    type: item.type || "text",
    videoUrl: item.videoUrl || "",
    rating: item.rating || null,
    service: item.service || null,
    caseStudy: item.caseStudy || null,
    verifiedCustomer: Boolean(item.verifiedCustomer),
    featured: Boolean(item.featured),
    status: item.status || "pending",
    approvedAt: item.approvedAt || null,
    order: Number.isFinite(Number(item.order)) ? Number(item.order) : 0,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

function buildPayload(body, current = {}) {
  const content = String(body.content ?? current.content ?? "").trim();
  if (!content) throw new Error("Testimonial content is required");
  return {
    author: {
      name: String(body.author?.name ?? current.author?.name ?? "").trim(),
      jobTitle: String(body.author?.jobTitle ?? current.author?.jobTitle ?? "").trim(),
      company: String(body.author?.company ?? current.author?.company ?? "").trim(),
    },
    content,
    type: body.type === "video" ? "video" : "text",
    videoUrl: String(body.videoUrl ?? current.videoUrl ?? "").trim(),
    rating: body.rating ? Number(body.rating) : current.rating || null,
    service: body.service || current.service || null,
    caseStudy: body.caseStudy || current.caseStudy || null,
    verifiedCustomer: Boolean(body.verifiedCustomer ?? current.verifiedCustomer ?? false),
    featured: Boolean(body.featured ?? current.featured ?? false),
    status: ["pending", "approved", "rejected"].includes(body.status) ? body.status : current.status || "pending",
    approvedAt: body.status === "approved" && !current.approvedAt ? new Date() : current.approvedAt || null,
    order: Math.max(0, Number(body.order ?? current.order ?? 0)),
  };
}

export class TestimonialController {
  static async publicList(req, res) {
    try {
      const site = await getSite();
      if (!site) return res.json({ testimonials: [] });
      const items = await Testimonial.find({ site: site._id, status: "approved" }).sort({ featured: -1, order: 1, createdAt: -1 }).limit(50);
      return res.json({ testimonials: items.map(serialize) });
    } catch (e) {
      return res.status(500).json({ error: "Failed to load testimonials", details: e.message });
    }
  }

  static async adminList(req, res) {
    try {
      const site = await getSite();
      if (!site) return res.json({ testimonials: [] });
      const items = await Testimonial.find({ site: site._id }).sort({ order: 1, createdAt: -1 });
      return res.json({ testimonials: items.map(serialize) });
    } catch (e) {
      return res.status(500).json({ error: "Failed to load testimonials", details: e.message });
    }
  }

  static async create(req, res) {
    try {
      const site = await getSite();
      if (!site) return res.status(404).json({ error: "Site not found" });
      const payload = buildPayload(req.body);
      const item = await Testimonial.create({ site: site._id, ...payload });
      return res.status(201).json({ testimonial: serialize(item) });
    } catch (e) {
      return res.status(400).json({ error: "Failed to create testimonial", details: e.message });
    }
  }

  static async update(req, res) {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ error: "Invalid testimonial ID" });
      const item = await Testimonial.findById(req.params.id);
      if (!item) return res.status(404).json({ error: "Testimonial not found" });
      const payload = buildPayload(req.body, item.toObject());
      Object.assign(item, payload);
      await item.save();
      return res.json({ testimonial: serialize(item) });
    } catch (e) {
      return res.status(400).json({ error: "Failed to update testimonial", details: e.message });
    }
  }

  static async remove(req, res) {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ error: "Invalid testimonial ID" });
      const item = await Testimonial.findByIdAndDelete(req.params.id);
      if (!item) return res.status(404).json({ error: "Testimonial not found" });
      return res.json({ message: "Testimonial deleted" });
    } catch (e) {
      return res.status(500).json({ error: "Failed to delete testimonial", details: e.message });
    }
  }
}
