import express from "express";
import { OrganizationController } from "../../controllers/organization/OrganizationController.js";
import { isAuthenticated } from "../../middlewares/auth/tokenMiddleware.js";
import { requireOrganization, checkPermission, isAdmin, checkRoleAccess } from "../../middlewares/rbac/rbacMiddleware.js";

const router = express.Router();

// Create organization (authenticated)
router.post("/", isAuthenticated, OrganizationController.createOrganization);

// Accept invitation (authenticated)
router.post("/accept-invitation", isAuthenticated, OrganizationController.acceptInvitation);

// Organization-specific routes (require organization access)
router.get("/:organizationId", isAuthenticated, requireOrganization, OrganizationController.getOrganization);
router.put("/:organizationId", isAuthenticated, requireOrganization, isAdmin, OrganizationController.updateOrganization);

// Member management
router.post("/:organizationId/invite", isAuthenticated, requireOrganization, isAdmin, OrganizationController.inviteUser);
router.get("/:organizationId/members", isAuthenticated, requireOrganization, OrganizationController.getMembers);
router.put(
  "/:organizationId/members/:memberId/role",
  isAuthenticated,
  requireOrganization,
  isAdmin,
  OrganizationController.updateMemberRole
);
router.delete(
  "/:organizationId/members/:memberId",
  isAuthenticated,
  requireOrganization,
  isAdmin,
  OrganizationController.removeMember
);

// Role management
router.get("/:organizationId/roles", isAuthenticated, requireOrganization, OrganizationController.getRoles);
router.post(
  "/:organizationId/roles",
  isAuthenticated,
  requireOrganization,
  isAdmin,
  OrganizationController.createRole
);

export default router;
