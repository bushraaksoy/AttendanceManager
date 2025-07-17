import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { createError } from "../middleware/errorHandler";

const prisma = new PrismaClient();

interface CreateDepartmentRequest {
  name: string;
  facultyId: string;
  description?: string;
}

interface UpdateDepartmentRequest {
  name?: string;
  facultyId?: string;
  description?: string;
}

export const getDepartments = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const facultyId = req.query.facultyId as string;
    const search = req.query.search as string;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (facultyId) {
      where.facultyId = facultyId;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    // Get departments with pagination
    const [departments, total] = await Promise.all([
      prisma.department.findMany({
        where,
        include: {
          faculty: {
            select: {
              id: true,
              name: true,
            },
          },
          courses: {
            select: {
              id: true,
              code: true,
              name: true,
              credits: true,
              teacher: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
          _count: {
            select: {
              courses: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { name: "asc" },
      }),
      prisma.department.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        departments,
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

export const getDepartmentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const department = await prisma.department.findUnique({
      where: { id },
      include: {
        faculty: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
        courses: {
          include: {
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
        },
        _count: {
          select: {
            courses: true,
          },
        },
      },
    });

    if (!department) {
      throw createError("Department not found", 404);
    }

    res.json({
      success: true,
      data: { department },
    });
  } catch (error) {
    throw error;
  }
};

export const createDepartment = async (req: Request, res: Response) => {
  try {
    const { name, facultyId, description }: CreateDepartmentRequest = req.body;

    // Check if faculty exists
    const faculty = await prisma.faculty.findUnique({
      where: { id: facultyId },
    });

    if (!faculty) {
      throw createError("Faculty not found", 404);
    }

    // Check if department with same name already exists in this faculty
    const existingDepartment = await prisma.department.findFirst({
      where: {
        name,
        facultyId,
      },
    });

    if (existingDepartment) {
      throw createError(
        "Department with this name already exists in this faculty",
        400,
      );
    }

    // Create department
    const department = await prisma.department.create({
      data: {
        name,
        facultyId,
        description,
      },
      include: {
        faculty: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            courses: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: "Department created successfully",
      data: { department },
    });
  } catch (error) {
    throw error;
  }
};

export const updateDepartment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, facultyId, description }: UpdateDepartmentRequest = req.body;

    // Check if department exists
    const existingDepartment = await prisma.department.findUnique({
      where: { id },
    });

    if (!existingDepartment) {
      throw createError("Department not found", 404);
    }

    // Check if faculty exists (if facultyId is being changed)
    if (facultyId && facultyId !== existingDepartment.facultyId) {
      const faculty = await prisma.faculty.findUnique({
        where: { id: facultyId },
      });

      if (!faculty) {
        throw createError("Faculty not found", 404);
      }
    }

    // Check if name is being changed and is unique within the faculty
    if (name && name !== existingDepartment.name) {
      const targetFacultyId = facultyId || existingDepartment.facultyId;
      const nameExists = await prisma.department.findFirst({
        where: {
          name,
          facultyId: targetFacultyId,
          NOT: { id },
        },
      });

      if (nameExists) {
        throw createError(
          "Department with this name already exists in this faculty",
          400,
        );
      }
    }

    // Update department
    const department = await prisma.department.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(facultyId && { facultyId }),
        ...(description !== undefined && { description }),
      },
      include: {
        faculty: {
          select: {
            id: true,
            name: true,
          },
        },
        courses: {
          select: {
            id: true,
            code: true,
            name: true,
            credits: true,
          },
        },
        _count: {
          select: {
            courses: true,
          },
        },
      },
    });

    res.json({
      success: true,
      message: "Department updated successfully",
      data: { department },
    });
  } catch (error) {
    throw error;
  }
};

export const deleteDepartment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if department exists
    const existingDepartment = await prisma.department.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            courses: true,
          },
        },
      },
    });

    if (!existingDepartment) {
      throw createError("Department not found", 404);
    }

    // Check if department has courses
    if (existingDepartment._count.courses > 0) {
      throw createError("Cannot delete department with existing courses", 400);
    }

    // Delete department
    await prisma.department.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: "Department deleted successfully",
    });
  } catch (error) {
    throw error;
  }
};
