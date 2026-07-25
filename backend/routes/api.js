import express from "express";
import { LeadController } from "../controllers/leads/LeadController.js";
import { isAuthenticated } from "../middlewares/auth/tokenMiddleware.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "API is working" });
});

router.post("/leads", LeadController.create);
router.post("/forms/contact-enquiries", LeadController.create);
router.post("/forms/consultation-bookings", LeadController.create);
router.post("/forms/service-enquiries", LeadController.create);
router.post("/careers/applications", LeadController.create);
router.post("/partnerships/applications", LeadController.create);
router.get("/leads", isAuthenticated, LeadController.list);
router.patch("/leads/:id", isAuthenticated, LeadController.update);

export default router;
