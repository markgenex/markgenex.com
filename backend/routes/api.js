import express from "express";
import { LeadController } from "../controllers/leads/LeadController.js";
import { IndustryController } from "../controllers/cms/IndustryController.js";
import { isAuthenticated } from "../middlewares/auth/tokenMiddleware.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "API is working" });
});

router.post("/v1/public/leads", LeadController.publicLead);
router.post("/v1/public/contact", LeadController.publicContact);
router.post("/v1/public/consultations", LeadController.publicConsultation);
router.post("/v1/public/service-enquiries", LeadController.publicServiceEnquiry);
router.get("/v1/public/industries", IndustryController.publicList);

router.get("/v1/admin/industries", isAuthenticated, IndustryController.adminList);
router.post("/v1/admin/industries", isAuthenticated, IndustryController.create);
router.patch("/v1/admin/industries/:id", isAuthenticated, IndustryController.update);
router.delete("/v1/admin/industries/:id", isAuthenticated, IndustryController.remove);

router.get("/v1/admin/leads/export", isAuthenticated, LeadController.export);
router.get("/v1/admin/service-enquiries", isAuthenticated, LeadController.listServiceEnquiries);
router.get("/v1/admin/leads", isAuthenticated, LeadController.list);
router.get("/v1/admin/leads/:id", isAuthenticated, LeadController.getById);
router.post("/v1/admin/leads", isAuthenticated, LeadController.adminCreate);
router.patch("/v1/admin/leads/:id", isAuthenticated, LeadController.update);
router.patch("/v1/admin/leads/:id/status", isAuthenticated, LeadController.updateStatus);
router.patch("/v1/admin/leads/:id/assign", isAuthenticated, LeadController.assign);
router.post("/v1/admin/leads/:id/activities", isAuthenticated, LeadController.addActivity);
router.post("/v1/admin/leads/:id/tasks", isAuthenticated, LeadController.addTask);
router.get("/v1/admin/leads/:id/timeline", isAuthenticated, LeadController.timeline);

router.post("/leads", LeadController.create);
router.post("/forms/contact-enquiries", LeadController.create);
router.post("/forms/consultation-bookings", LeadController.create);
router.post("/forms/service-enquiries", LeadController.create);
router.post("/careers/applications", LeadController.create);
router.post("/partnerships/applications", LeadController.create);
router.get("/leads", isAuthenticated, LeadController.list);
router.patch("/leads/:id", isAuthenticated, LeadController.update);

export default router;
