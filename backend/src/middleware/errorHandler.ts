import { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  console.error(err);

  // Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      // Unique constraint violation
      const field = err.meta?.target as string[];
      error.message = `Duplicate value for ${field?.join(", ") || "field"}`;
      error.statusCode = 400;
    } else if (err.code === "P2025") {
      // Record not found
      error.message = "Resource not found";
      error.statusCode = 404;
    } else if (err.code === "P2003") {
      // Foreign key constraint violation
      error.message = "Invalid reference to related resource";
      error.statusCode = 400;
    }
  }

  // Prisma validation errors
  if (err instanceof Prisma.PrismaClientValidationError) {
    error.message = "Invalid data provided";
    error.statusCode = 400;
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    error.message = "Invalid token";
    error.statusCode = 401;
  }

  if (err.name === "TokenExpiredError") {
    error.message = "Token expired";
    error.statusCode = 401;
  }

  // Default error
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export const createError = (message: string, statusCode: number): AppError => {
  const error = new Error(message) as AppError;
  error.statusCode = statusCode;
  error.isOperational = true;
  return error;
};
