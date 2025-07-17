import express from "express";
import { body, param, query } from "express-validator";
import { validate } from "../middleware/validation";
import {
  authenticate,
  requireTeacherOrAdmin,
  requireAdmin,
} from "../middleware/auth";
import {
  getSections,
  getSectionById,
  createSection,
  updateSection,
  deleteSection,
  enrollStudent,
  unenrollStudent,
} from "../controllers/sectionController";

const router = express.Router();

// Validation schemas
const createSectionValidation = [
  body("name")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Section name is required"),
  body("courseId")
    .isString()
    .isLength({ min: 1 })
    .withMessage("Course ID is required"),
  body("schedule")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Schedule is required"),
  body("room").trim().isLength({ min: 1 }).withMessage("Room is required"),
  body("capacity")
    .isInt({ min: 1 })
    .withMessage("Capacity must be a positive integer"),
];

const updateSectionValidation = [
  param("id")
    .isString()
    .isLength({ min: 1 })
    .withMessage("Valid section ID is required"),
  body("name")
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage("Section name cannot be empty"),
  body("schedule")
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage("Schedule cannot be empty"),
  body("room")
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage("Room cannot be empty"),
  body("capacity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Capacity must be a positive integer"),
];

const getSectionValidation = [
  param("id")
    .isString()
    .isLength({ min: 1 })
    .withMessage("Valid section ID is required"),
];

const getSectionsValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
  query("courseId")
    .optional()
    .isString()
    .isLength({ min: 1 })
    .withMessage("Course ID cannot be empty"),
];

const enrollmentValidation = [
  param("id")
    .isString()
    .isLength({ min: 1 })
    .withMessage("Valid section ID is required"),
  body("studentId")
    .isString()
    .isLength({ min: 1 })
    .withMessage("Student ID is required"),
];

// Routes
router.get("/", authenticate, validate(getSectionsValidation), getSections);
router.get(
  "/:id",
  authenticate,
  validate(getSectionValidation),
  getSectionById,
);
router.post(
  "/",
  authenticate,
  requireTeacherOrAdmin,
  validate(createSectionValidation),
  createSection,
);
router.put(
  "/:id",
  authenticate,
  requireTeacherOrAdmin,
  validate(updateSectionValidation),
  updateSection,
);
router.delete(
  "/:id",
  authenticate,
  requireAdmin,
  validate(getSectionValidation),
  deleteSection,
);
router.post(
  "/:id/enroll",
  authenticate,
  requireAdmin,
  validate(enrollmentValidation),
  enrollStudent,
);
router.delete(
  "/:id/unenroll",
  authenticate,
  requireAdmin,
  validate(enrollmentValidation),
  unenrollStudent,
);

export default router;
