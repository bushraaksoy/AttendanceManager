import express from "express";
import { body, param, query } from "express-validator";
import { validate } from "../middleware/validation";
import { authenticate, requireAdmin } from "../middleware/auth";
import {
  getFaculties,
  getFacultyById,
  createFaculty,
  updateFaculty,
  deleteFaculty,
} from "../controllers/facultyController";

const router = express.Router();

// Validation schemas
const createFacultyValidation = [
  body("name")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Faculty name is required"),
  body("description").optional().trim(),
];

const updateFacultyValidation = [
  param("id")
    .isString()
    .isLength({ min: 1 })
    .withMessage("Valid faculty ID is required"),
  body("name")
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage("Faculty name cannot be empty"),
  body("description").optional().trim(),
];

const getFacultyValidation = [
  param("id")
    .isString()
    .isLength({ min: 1 })
    .withMessage("Valid faculty ID is required"),
];

const getFacultiesValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
  query("search")
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage("Search term cannot be empty"),
];

// Routes - Admin only for CUD operations, authenticated users can read
router.get("/", authenticate, validate(getFacultiesValidation), getFaculties);
router.get(
  "/:id",
  authenticate,
  validate(getFacultyValidation),
  getFacultyById,
);
router.post(
  "/",
  authenticate,
  requireAdmin,
  validate(createFacultyValidation),
  createFaculty,
);
router.put(
  "/:id",
  authenticate,
  requireAdmin,
  validate(updateFacultyValidation),
  updateFaculty,
);
router.delete(
  "/:id",
  authenticate,
  requireAdmin,
  validate(getFacultyValidation),
  deleteFaculty,
);

export default router;
