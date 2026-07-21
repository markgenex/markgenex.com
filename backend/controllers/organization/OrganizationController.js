import {
  Organization,
  Membership,
  Role,
  User,
  AuthToken,
} from "../../models/index.js";
import { JwtUtil } from "../../utils/jwt/JwtUtil.js";
import { EmailUtil } from "../../utils/email/EmailUtil.js";

export class OrganizationController {
  /**
   * Create organization
   * POST /organizations
   */
  static async createOrganization(req, res) {
    try {
      const { name, description, website, industry } = req.body;

      if (!name) {
        return res.status(400).json({ error: "Organization name is required" });
      }

      const organization = new Organization({
        name,
        description,
        website,
        industry,
      });

      await organization.save();

      // Create default roles
      const adminRole = new Role({
        name: "admin",
        description: "Administrator with full access",
        organization: organization._id,
        permissions: [
          {
            resource: "users",
            actions: ["create", "read", "update", "delete"],
          },
          {
            resource: "roles",
            actions: ["create", "read", "update", "delete"],
          },
          {
            resource: "sites",
            actions: ["create", "read", "update", "delete"],
          },
          {
            resource: "forms",
            actions: ["create", "read", "update", "delete"],
          },
          {
            resource: "leads",
            actions: ["create", "read", "update", "delete"],
          },
          {
            resource: "analytics",
            actions: ["read"],
          },
          {
            resource: "settings",
            actions: ["read", "update"],
          },
          {
            resource: "integrations",
            actions: ["create", "read", "update", "delete"],
          },
        ],
        isSystem: true,
      });

      const memberRole = new Role({
        name: "member",
        description: "Regular member with basic access",
        organization: organization._id,
        permissions: [
          {
            resource: "leads",
            actions: ["read", "update"],
          },
          {
            resource: "forms",
            actions: ["read"],
          },
          {
            resource: "analytics",
            actions: ["read"],
          },
        ],
        isSystem: true,
      });

      await adminRole.save();
      await memberRole.save();

      // Add creator as admin
      const membership = new Membership({
        user: req.user.id,
        organization: organization._id,
        role: adminRole._id,
        status: "active",
        joinedAt: new Date(),
      });

      await membership.save();

      res.status(201).json({
        message: "Organization created successfully",
        organization: {
          id: organization._id,
          name: organization.name,
          roles: [
            { id: adminRole._id, name: adminRole.name },
            { id: memberRole._id, name: memberRole.name },
          ],
        },
      });
    } catch (error) {
      res.status(500).json({ error: "Organization creation failed", details: error.message });
    }
  }

  /**
   * Get organization details
   * GET /organizations/:organizationId
   */
  static async getOrganization(req, res) {
    try {
      const organization = await Organization.findById(req.organizationId);

      if (!organization) {
        return res.status(404).json({ error: "Organization not found" });
      }

      const memberCount = await Membership.countDocuments({
        organization: organization._id,
        status: "active",
      });

      res.json({
        organization: {
          id: organization._id,
          name: organization.name,
          description: organization.description,
          website: organization.website,
          industry: organization.industry,
          timezone: organization.timezone,
          memberCount,
          settings: organization.settings,
          createdAt: organization.createdAt,
        },
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to get organization", details: error.message });
    }
  }

  /**
   * Update organization
   * PUT /organizations/:organizationId
   */
  static async updateOrganization(req, res) {
    try {
      const { name, description, website, industry, timezone, settings } = req.body;

      const organization = await Organization.findById(req.organizationId);
      if (!organization) {
        return res.status(404).json({ error: "Organization not found" });
      }

      if (name) organization.name = name;
      if (description) organization.description = description;
      if (website) organization.website = website;
      if (industry) organization.industry = industry;
      if (timezone) organization.timezone = timezone;
      if (settings) organization.settings = { ...organization.settings, ...settings };

      await organization.save();

      res.json({
        message: "Organization updated successfully",
        organization: {
          id: organization._id,
          name: organization.name,
          description: organization.description,
        },
      });
    } catch (error) {
      res.status(500).json({ error: "Organization update failed", details: error.message });
    }
  }

  /**
   * Invite user to organization
   * POST /organizations/:organizationId/invite
   */
  static async inviteUser(req, res) {
    try {
      const { email, roleId } = req.body;

      if (!email || !roleId) {
        return res.status(400).json({ error: "Email and role are required" });
      }

      const organization = await Organization.findById(req.organizationId);
      if (!organization) {
        return res.status(404).json({ error: "Organization not found" });
      }

      const role = await Role.findById(roleId);
      if (!role || role.organization.toString() !== req.organizationId.toString()) {
        return res.status(404).json({ error: "Role not found" });
      }

      // Check if user already a member
      let user = await User.findOne({ email: email.toLowerCase() });
      const existingMembership = await Membership.findOne({
        organization: req.organizationId,
        user: user ? user._id : null,
      });

      if (existingMembership) {
        return res.status(409).json({ error: "User is already a member of this organization" });
      }

      const invitationToken = JwtUtil.generateEmailVerificationToken(user ? user._id : email);
      const invitationLink = `${process.env.APP_URL || "http://localhost:3000"}/accept-invitation?token=${invitationToken}`;

      if (!user) {
        // Create temporary membership for non-existing user
        const membership = new Membership({
          organization: req.organizationId,
          role: roleId,
          status: "invited",
          invitedBy: req.user.id,
          invitationToken,
          invitationExpires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });
        await membership.save();
      } else {
        // Create membership for existing user
        const membership = new Membership({
          user: user._id,
          organization: req.organizationId,
          role: roleId,
          status: "invited",
          invitedBy: req.user.id,
          invitationToken,
          invitationExpires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });
        await membership.save();
      }

      // Save invitation token
      await AuthToken.create({
        user: user ? user._id : null,
        token: invitationToken,
        type: "invitation",
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });

      // Send invitation email
      try {
        await EmailUtil.sendInvitationEmail(email, invitationLink, organization.name);
      } catch (emailError) {
        console.error("Email send failed:", emailError);
      }

      res.status(201).json({
        message: "Invitation sent successfully",
        invitation: {
          email,
          role: role.name,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });
    } catch (error) {
      res.status(500).json({ error: "Invitation failed", details: error.message });
    }
  }

  /**
   * Accept invitation
   * POST /organizations/accept-invitation
   */
  static async acceptInvitation(req, res) {
    try {
      const { token } = req.body;

      if (!token) {
        return res.status(400).json({ error: "Invitation token is required" });
      }

      const decoded = JwtUtil.verifyEmailToken(token);
      if (!decoded) {
        return res.status(400).json({ error: "Invalid or expired invitation token" });
      }

      const membership = await Membership.findOne({
        invitationToken: token,
        status: "invited",
      }).populate("organization role");

      if (!membership) {
        return res.status(404).json({ error: "Invitation not found" });
      }

      membership.user = req.user.id;
      membership.status = "active";
      membership.joinedAt = new Date();
      membership.invitationToken = null;
      membership.invitationExpires = null;

      await membership.save();

      // Mark token as used
      await AuthToken.updateOne({ token }, { isUsed: true, usedAt: new Date() });

      res.json({
        message: "Invitation accepted successfully",
        membership: {
          organization: membership.organization.name,
          role: membership.role.name,
          status: membership.status,
        },
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to accept invitation", details: error.message });
    }
  }

  /**
   * Get organization members
   * GET /organizations/:organizationId/members
   */
  static async getMembers(req, res) {
    try {
      const memberships = await Membership.find({
        organization: req.organizationId,
      })
        .populate("user", "firstName lastName email avatar")
        .populate("role", "name permissions")
        .sort("-createdAt");

      const members = memberships.map((m) => ({
        id: m._id,
        user: m.user
          ? {
              id: m.user._id,
              firstName: m.user.firstName,
              lastName: m.user.lastName,
              email: m.user.email,
              avatar: m.user.avatar,
            }
          : null,
        role: m.role.name,
        status: m.status,
        joinedAt: m.joinedAt,
        invitedBy: m.invitedBy,
      }));

      res.json({ members });
    } catch (error) {
      res.status(500).json({ error: "Failed to get members", details: error.message });
    }
  }

  /**
   * Update member role
   * PUT /organizations/:organizationId/members/:memberId/role
   */
  static async updateMemberRole(req, res) {
    try {
      const { roleId } = req.body;

      if (!roleId) {
        return res.status(400).json({ error: "Role ID is required" });
      }

      const membership = await Membership.findById(req.params.memberId).populate("role");
      if (!membership) {
        return res.status(404).json({ error: "Membership not found" });
      }

      const role = await Role.findById(roleId);
      if (!role || role.organization.toString() !== req.organizationId.toString()) {
        return res.status(404).json({ error: "Role not found" });
      }

      membership.role = roleId;
      await membership.save();

      res.json({
        message: "Member role updated successfully",
        membership: {
          id: membership._id,
          role: role.name,
        },
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to update member role", details: error.message });
    }
  }

  /**
   * Remove member from organization
   * DELETE /organizations/:organizationId/members/:memberId
   */
  static async removeMember(req, res) {
    try {
      const membership = await Membership.findById(req.params.memberId);
      if (!membership) {
        return res.status(404).json({ error: "Membership not found" });
      }

      membership.status = "inactive";
      membership.deactivatedAt = new Date();
      await membership.save();

      res.json({ message: "Member removed successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to remove member", details: error.message });
    }
  }

  /**
   * Get roles
   * GET /organizations/:organizationId/roles
   */
  static async getRoles(req, res) {
    try {
      const roles = await Role.find({
        organization: req.organizationId,
      });

      res.json({ roles });
    } catch (error) {
      res.status(500).json({ error: "Failed to get roles", details: error.message });
    }
  }

  /**
   * Create role
   * POST /organizations/:organizationId/roles
   */
  static async createRole(req, res) {
    try {
      const { name, description, permissions } = req.body;

      if (!name) {
        return res.status(400).json({ error: "Role name is required" });
      }

      const existingRole = await Role.findOne({
        organization: req.organizationId,
        name,
      });

      if (existingRole) {
        return res.status(409).json({ error: "Role already exists" });
      }

      const role = new Role({
        name,
        description,
        organization: req.organizationId,
        permissions,
      });

      await role.save();

      res.status(201).json({
        message: "Role created successfully",
        role: {
          id: role._id,
          name: role.name,
          permissions: role.permissions,
        },
      });
    } catch (error) {
      res.status(500).json({ error: "Role creation failed", details: error.message });
    }
  }
}
