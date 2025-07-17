import { Request, Response } from "express";
import { PrismaClient, UserRole } from "@prisma/client";
import { createError } from "../middleware/errorHandler";
import { AuthenticatedRequest } from "../middleware/auth";

const prisma = new PrismaClient();

interface CreateCourseRequest {
  code: string;
  name: string;
  departmentId: string;
  teacherId: string;
  credits: number;
  description?: string;
}

interface UpdateCourseRequest {
  code?: string;
  name?: string;
  departmentId?: string;
  teacherId?: string;
  credits?: number;
  description?: string;
}

export const getCourses = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const departmentId = req.query.departmentId as string;
    const teacherId = req.query.teacherId as string;
    const search = req.query.search as string;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (departmentId) {
      where.departmentId = departmentId;
    }

    if (teacherId) {
      where.teacherId = teacherId;
    }

    if (search) {
      where.OR = [
        { code: { contains: search, mode: "insensitive" } },
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    // Get courses with pagination
    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where,
        include: {
          department: {
            select: {
              id: true,
              name: true,
              faculty: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          teacher: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          sections: {
            select: {
              id: true,
              name: true,
              schedule: true,
              room: true,
              capacity: true,
              _count: {
                select: {
                  enrollments: true,
                },
              },
            },
          },
          _count: {
            select: {
              sections: true,
              enrollments: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { code: "asc" },
      }),
      prisma.course.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        courses,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    throw error;
  }
};

export const getCourseById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        department: {
          include: {
            faculty: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        sections: {
          include: {
            lessons: {
              select: {
                id: true,
                date: true,
                startTime: true,
                endTime: true,
                topic: true,
                status: true,
              },
              orderBy: { date: "desc" },
              take: 10,
            },
            _count: {
              select: {
                enrollments: true,
                lessons: true,
              },
            },
          },
        },
        enrollments: {
          include: {
            student: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                studentId: true,
              },
            },
            section: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        _count: {
          select: {
            sections: true,
            enrollments: true,
          },
        },
      },
    });

    if (!course) {
      throw createError("Course not found", 404);
    }

    res.json({
      success: true,
      data: { course },
    });
  } catch (error) {
    throw error;
  }
};

export const createCourse = async (req: Request, res: Response) => {
  try {
    const {
      code,
      name,
      departmentId,
      teacherId,
      credits,
      description,
    }: CreateCourseRequest = req.body;

    // Check if department exists
    const department = await prisma.department.findUnique({
      where: { id: departmentId },
    });

    if (!department) {
      throw createError("Department not found", 404);
    }

    // Check if teacher exists and has TEACHER role
    const teacher = await prisma.user.findUnique({
      where: { id: teacherId },
    });

    if (!teacher) {
      throw createError("Teacher not found", 404);
    }

    if (teacher.role !== UserRole.TEACHER) {
      throw createError("User is not a teacher", 400);
    }

    // Check if course code is unique
    const existingCourse = await prisma.course.findUnique({
      where: { code },
    });

    if (existingCourse) {
      throw createError("Course with this code already exists", 400);
    }

    // Create course
    const course = await prisma.course.create({
      data: {
        code,
        name,
        departmentId,
        teacherId,
        credits,
        description,
      },
      include: {
        department: {
          select: {
            id: true,
            name: true,
            faculty: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        _count: {
          select: {
            sections: true,
            enrollments: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: { course },
    });
  } catch (error) {
    throw error;
  }
};

export const updateCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      code,
      name,
      departmentId,
      teacherId,
      credits,
      description,
    }: UpdateCourseRequest = req.body;

    // Check if course exists
    const existingCourse = await prisma.course.findUnique({
      where: { id },
    });

    if (!existingCourse) {
      throw createError("Course not found", 404);
    }

    // Check if department exists (if being changed)
    if (departmentId && departmentId !== existingCourse.departmentId) {
      const department = await prisma.department.findUnique({
        where: { id: departmentId },
      });

      if (!department) {
        throw createError("Department not found", 404);
      }
    }

    // Check if teacher exists and has TEACHER role (if being changed)
    if (teacherId && teacherId !== existingCourse.teacherId) {
      const teacher = await prisma.user.findUnique({
        where: { id: teacherId },
      });

      if (!teacher) {
        throw createError("Teacher not found", 404);
      }

      if (teacher.role !== UserRole.TEACHER) {
        throw createError("User is not a teacher", 400);
      }
    }

    // Check if course code is unique (if being changed)
    if (code && code !== existingCourse.code) {
      const codeExists = await prisma.course.findUnique({
        where: { code },
      });

      if (codeExists) {
        throw createError("Course with this code already exists", 400);
      }
    }

    // Update course
    const course = await prisma.course.update({
      where: { id },
      data: {
        ...(code && { code }),
        ...(name && { name }),
        ...(departmentId && { departmentId }),
        ...(teacherId && { teacherId }),
        ...(credits && { credits }),
        ...(description !== undefined && { description }),
      },
      include: {
        department: {
          select: {
            id: true,
            name: true,
            faculty: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        sections: {
          select: {
            id: true,
            name: true,
            schedule: true,
            room: true,
            capacity: true,
          },
        },
        _count: {
          select: {
            sections: true,
            enrollments: true,
          },
        },
      },
    });

    res.json({
      success: true,
      message: "Course updated successfully",
      data: { course },
    });
  } catch (error) {
    throw error;
  }
};

export const deleteCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if course exists
    const existingCourse = await prisma.course.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            sections: true,
            enrollments: true,
          },
        },
      },
    });

    if (!existingCourse) {
      throw createError("Course not found", 404);
    }

    // Check if course has sections or enrollments
    if (
      existingCourse._count.sections > 0 ||
      existingCourse._count.enrollments > 0
    ) {
      throw createError(
        "Cannot delete course with existing sections or enrollments",
        400,
      );
    }

    // Delete course
    await prisma.course.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    throw error;
  }
};

export const getTeacherCourses = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const teacherId = req.user!.id;

    const courses = await prisma.course.findMany({
      where: { teacherId },
      include: {
        department: {
          select: {
            id: true,
            name: true,
            faculty: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        sections: {
          include: {
            _count: {
              select: {
                enrollments: true,
                lessons: true,
              },
            },
          },
        },
        _count: {
          select: {
            sections: true,
            enrollments: true,
          },
        },
      },
      orderBy: { code: "asc" },
    });

    res.json({
      success: true,
      data: { courses },
    });
  } catch (error) {
    throw error;
  }
};

export const getStudentCourses = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const studentId = req.user!.id;

    const enrollments = await prisma.enrollment.findMany({
      where: { studentId },
      include: {
        course: {
          include: {
            department: {
              select: {
                id: true,
                name: true,
                faculty: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
            teacher: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
        section: {
          include: {
            lessons: {
              select: {
                id: true,
                date: true,
                startTime: true,
                endTime: true,
                topic: true,
                status: true,
                attendances: {
                  where: { studentId },
                  select: {
                    status: true,
                  },
                },
              },
              orderBy: { date: "desc" },
              take: 5,
            },
            _count: {
              select: {
                lessons: true,
              },
            },
          },
        },
      },
      orderBy: {
        course: {
          code: "asc",
        },
      },
    });

    res.json({
      success: true,
      data: { enrollments },
    });
  } catch (error) {
    throw error;
  }
};
