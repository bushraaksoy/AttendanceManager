import express from "express";
import { body, param, query } from "express-validator";
import { validate } from "../middleware/validation";
import { authenticate, requireAdmin } from "../middleware/auth";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController";

const router = express.Router();

// Validation schemas
const createUserValidation = [
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

const updateUserValidation = [
  param("id")
    .isString()
    .isLength({ min: 1 })
    .withMessage("Valid user ID is required"),
  body("email")
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  body("firstName")
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage("First name cannot be empty"),
  body("lastName")
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage("Last name cannot be empty"),
  body("role")
    .optional()
    .isIn(["ADMIN", "TEACHER", "STUDENT"])
    .withMessage("Role must be ADMIN, TEACHER, or STUDENT"),
];

const getUserValidation = [
  param("id")
    .isString()
    .isLength({ min: 1 })
    .withMessage("Valid user ID is required"),
];

const getUsersValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
  query("role")
    .optional()
    .isIn(["ADMIN", "TEACHER", "STUDENT"])
    .withMessage("Role must be ADMIN, TEACHER, or STUDENT"),
  query("search")
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage("Search term cannot be empty"),
];

// Routes - All routes require admin access
router.get(
  "/",
  authenticate,
  requireAdmin,
  validate(getUsersValidation),
  getUsers,
);
router.get(
  "/:id",
  authenticate,
  requireAdmin,
  validate(getUserValidation),
  getUserById,
);
router.post(
  "/",
  authenticate,
  requireAdmin,
  validate(createUserValidation),
  createUser,
);
router.put(
  "/:id",
  authenticate,
  requireAdmin,
  validate(updateUserValidation),
  updateUser,
);
router.delete(
  "/:id",
  authenticate,
  requireAdmin,
  validate(getUserValidation),
  deleteUser,
);

export default router;
