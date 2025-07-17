import express from "express";
import { body } from "express-validator";
import { validate } from "../middleware/validation";
import { authenticate } from "../middleware/auth";
import {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
} from "../controllers/authController";

const router = express.Router();

// Register validation
const registerValidation = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("firstName")
    .trim()
    .isLength({ min: 1 })
    .withMessage("First name is required"),
  body("lastName")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Last name is required"),
  body("role")
    .isIn(["ADMIN", "TEACHER", "STUDENT"])
    .withMessage("Role must be ADMIN, TEACHER, or STUDENT"),
  body("studentId")
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage("Student ID cannot be empty if provided"),
];

// Login validation
const loginValidation = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  body("password").isLength({ min: 1 }).withMessage("Password is required"),
  body("userType")
    .isIn(["ADMIN", "TEACHER", "STUDENT"])
    .withMessage("User type must be ADMIN, TEACHER, or STUDENT"),
];

// Profile update validation
const updateProfileValidation = [
  body("firstName")
    .trim()
    .isLength({ min: 1 })
    .withMessage("First name is required"),
  body("lastName")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Last name is required"),
];

// Change password validation
const changePasswordValidation = [
  body("currentPassword")
    .isLength({ min: 1 })
    .withMessage("Current password is required"),
  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters long"),
];

// Routes
router.post("/register", validate(registerValidation), register);
router.post("/login", validate(loginValidation), login);
router.get("/profile", authenticate, getProfile);
router.put(
  "/profile",
  authenticate,
  validate(updateProfileValidation),
  updateProfile,
);
router.put(
  "/change-password",
  authenticate,
  validate(changePasswordValidation),
  changePassword,
);

export default router;
