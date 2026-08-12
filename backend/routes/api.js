import express from "express";
import multer from "multer";
import { LeadController } from "../controllers/leads/LeadController.js";
import { IndustryController } from "../controllers/cms/IndustryController.js";
import { CareerController } from "../controllers/careers/CareerController.js";
import { isAuthenticated } from "../middlewares/auth/tokenMiddleware.js";

const router = express.Router();
const resumeUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter(req, file, callback) {
    const allowed = new Set(["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]);
    callback(allowed.has(file.mimetype) ? null : new Error("Resume must be a PDF, DOC, or DOCX file"), allowed.has(file.mimetype));
  },
});
const acceptResume = (req, res, next) => resumeUpload.single("resume")(req, res, (error) => {
  if (error) return res.status(400).json({ error: error.code === "LIMIT_FILE_SIZE" ? "Resume must be 5 MB or smaller" : error.message });
  return next();
});

router.get("/", (req, res) => {
  res.json({ message: "API is working" });
});

router.post("/v1/public/leads", LeadController.publicLead);
router.post("/v1/public/contact", LeadController.publicContact);
router.post("/v1/public/consultations", LeadController.publicConsultation);
router.post("/v1/public/service-enquiries", LeadController.publicServiceEnquiry);
router.get("/v1/public/industries", IndustryController.publicList);
router.get("/v1/public/jobs", CareerController.publicJobs);
router.post("/v1/public/jobs/:id/applications", acceptResume, CareerController.apply);

router.get("/v1/admin/jobs", isAuthenticated, CareerController.adminJobs);
router.post("/v1/admin/jobs", isAuthenticated, CareerController.createJob);
router.patch("/v1/admin/jobs/:id", isAuthenticated, CareerController.updateJob);
router.delete("/v1/admin/jobs/:id", isAuthenticated, CareerController.deleteJob);
router.get("/v1/admin/job-applications", isAuthenticated, CareerController.applications);
router.post("/v1/admin/job-applications/sync", isAuthenticated, CareerController.syncMailbox);
router.patch("/v1/admin/job-applications/:id", isAuthenticated, CareerController.updateApplication);
router.get("/v1/admin/job-applications/:id/resume", isAuthenticated, CareerController.resume);

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
