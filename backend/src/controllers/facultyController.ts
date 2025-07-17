import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { createError } from "../middleware/errorHandler";

const prisma = new PrismaClient();

interface CreateFacultyRequest {
  name: string;
  description?: string;
}

interface UpdateFacultyRequest {
  name?: string;
  description?: string;
}

export const getFaculties = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    // Get faculties with pagination
    const [faculties, total] = await Promise.all([
      prisma.faculty.findMany({
        where,
        include: {
          departments: {
            select: {
              id: true,
              name: true,
              _count: {
                select: {
                  courses: true,
                },
              },
            },
          },
          _count: {
            select: {
              departments: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { name: "asc" },
      }),
      prisma.faculty.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        faculties,
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

export const getFacultyById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const faculty = await prisma.faculty.findUnique({
      where: { id },
      include: {
        departments: {
          include: {
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
                    email: true,
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
        },
        _count: {
          select: {
            departments: true,
          },
        },
      },
    });

    if (!faculty) {
      throw createError("Faculty not found", 404);
    }

    res.json({
      success: true,
      data: { faculty },
    });
  } catch (error) {
    throw error;
  }
};

export const createFaculty = async (req: Request, res: Response) => {
  try {
    const { name, description }: CreateFacultyRequest = req.body;

    // Check if faculty with same name already exists
    const existingFaculty = await prisma.faculty.findUnique({
      where: { name },
    });

    if (existingFaculty) {
      throw createError("Faculty with this name already exists", 400);
    }

    // Create faculty
    const faculty = await prisma.faculty.create({
      data: {
        name,
        description,
      },
      include: {
        _count: {
          select: {
            departments: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: "Faculty created successfully",
      data: { faculty },
    });
  } catch (error) {
    throw error;
  }
};

export const updateFaculty = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description }: UpdateFacultyRequest = req.body;

    // Check if faculty exists
    const existingFaculty = await prisma.faculty.findUnique({
      where: { id },
    });

    if (!existingFaculty) {
      throw createError("Faculty not found", 404);
    }

    // Check if name is being changed and is unique
    if (name && name !== existingFaculty.name) {
      const nameExists = await prisma.faculty.findUnique({
        where: { name },
      });

      if (nameExists) {
        throw createError("Faculty with this name already exists", 400);
      }
    }

    // Update faculty
    const faculty = await prisma.faculty.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
      },
      include: {
        departments: {
          select: {
            id: true,
            name: true,
            _count: {
              select: {
                courses: true,
              },
            },
          },
        },
        _count: {
          select: {
            departments: true,
          },
        },
      },
    });

    res.json({
      success: true,
      message: "Faculty updated successfully",
      data: { faculty },
    });
  } catch (error) {
    throw error;
  }
};

export const deleteFaculty = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if faculty exists
    const existingFaculty = await prisma.faculty.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            departments: true,
          },
        },
      },
    });

    if (!existingFaculty) {
      throw createError("Faculty not found", 404);
    }

    // Check if faculty has departments
    if (existingFaculty._count.departments > 0) {
      throw createError("Cannot delete faculty with existing departments", 400);
    }

    // Delete faculty
    await prisma.faculty.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: "Faculty deleted successfully",
    });
  } catch (error) {
    throw error;
  }
};
