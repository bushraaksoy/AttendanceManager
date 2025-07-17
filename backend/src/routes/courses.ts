import express from "express";
import { body, param, query } from "express-validator";
import { validate } from "../middleware/validation";
import {
  authenticate,
  requireAdmin,
  requireTeacherOrAdmin,
} from "../middleware/auth";
import {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getTeacherCourses,
  getStudentCourses,
} from "../controllers/courseController";

const router = express.Router();

// Validation schemas
const createCourseValidation = [
  body("code")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Course code is required"),
  body("name")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Course name is required"),
  body("departmentId")
    .isString()
    .isLength({ min: 1 })
    .withMessage("Department ID is required"),
  body("teacherId")
    .isString()
    .isLength({ min: 1 })
    .withMessage("Teacher ID is required"),
  body("credits")
    .isInt({ min: 1, max: 10 })
    .withMessage("Credits must be between 1 and 10"),
  body("description").optional().trim(),
];

const updateCourseValidation = [
  param("id")
    .isString()
    .isLength({ min: 1 })
    .withMessage("Valid course ID is required"),
  body("code")
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage("Course code cannot be empty"),
  body("name")
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage("Course name cannot be empty"),
  body("departmentId")
    .optional()
    .isString()
    .isLength({ min: 1 })
    .withMessage("Department ID cannot be empty"),
  body("teacherId")
    .optional()
    .isString()
    .isLength({ min: 1 })
    .withMessage("Teacher ID cannot be empty"),
  body("credits")
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage("Credits must be between 1 and 10"),
  body("description").optional().trim(),
];

const getCourseValidation = [
  param("id")
    .isString()
    .isLength({ min: 1 })
    .withMessage("Valid course ID is required"),
];

const getCoursesValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
  query("departmentId")
    .optional()
    .isString()
    .isLength({ min: 1 })
    .withMessage("Department ID cannot be empty"),
  query("teacherId")
    .optional()
    .isString()
    .isLength({ min: 1 })
    .withMessage("Teacher ID cannot be empty"),
  query("search")
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage("Search term cannot be empty"),
];

// Routes
router.get("/", authenticate, validate(getCoursesValidation), getCourses);
router.get(
  "/my-courses/teacher",
  authenticate,
  requireTeacherOrAdmin,
  getTeacherCourses,
);
router.get("/my-courses/student", authenticate, getStudentCourses);
router.get("/:id", authenticate, validate(getCourseValidation), getCourseById);
router.post(
  "/",
  authenticate,
  requireAdmin,
  validate(createCourseValidation),
  createCourse,
);
router.put(
  "/:id",
  authenticate,
  requireAdmin,
  validate(updateCourseValidation),
  updateCourse,
);
router.delete(
  "/:id",
  authenticate,
  requireAdmin,
  validate(getCourseValidation),
  deleteCourse,
);

export default router;
