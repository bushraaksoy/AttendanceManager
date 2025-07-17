import express from "express";
import { body, param, query } from "express-validator";
import { validate } from "../middleware/validation";
import { authenticate, requireAdmin } from "../middleware/auth";
import {
  getDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "../controllers/departmentController";

const router = express.Router();

// Validation schemas
const createDepartmentValidation = [
  body("name")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Department name is required"),
  body("facultyId")
    .isString()
    .isLength({ min: 1 })
    .withMessage("Faculty ID is required"),
  body("description").optional().trim(),
];

const updateDepartmentValidation = [
  param("id")
    .isString()
    .isLength({ min: 1 })
    .withMessage("Valid department ID is required"),
  body("name")
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage("Department name cannot be empty"),
  body("facultyId")
    .optional()
    .isString()
    .isLength({ min: 1 })
    .withMessage("Faculty ID cannot be empty"),
  body("description").optional().trim(),
];

const getDepartmentValidation = [
  param("id")
    .isString()
    .isLength({ min: 1 })
    .withMessage("Valid department ID is required"),
];

const getDepartmentsValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
  query("facultyId")
    .optional()
    .isString()
    .isLength({ min: 1 })
    .withMessage("Faculty ID cannot be empty"),
  query("search")
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage("Search term cannot be empty"),
];

// Routes - Admin only for CUD operations, authenticated users can read
router.get(
  "/",
  authenticate,
  validate(getDepartmentsValidation),
  getDepartments,
);
router.get(
  "/:id",
  authenticate,
  validate(getDepartmentValidation),
  getDepartmentById,
);
router.post(
  "/",
  authenticate,
  requireAdmin,
  validate(createDepartmentValidation),
  createDepartment,
);
router.put(
  "/:id",
  authenticate,
  requireAdmin,
  validate(updateDepartmentValidation),
  updateDepartment,
);
router.delete(
  "/:id",
  authenticate,
  requireAdmin,
  validate(getDepartmentValidation),
  deleteDepartment,
);

export default router;
