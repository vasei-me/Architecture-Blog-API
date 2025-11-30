import { NextFunction, Request, Response } from "express";
import ApiError from "../errors/ApiError";

export interface ErrorResponse {
  success: boolean;
  message: string;
  error?: any;
  stack?: string;
}

export const errorMiddleware = (
  error: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Error caught by middleware:", error);

  let statusCode = 500;
  let message = "Internal Server Error";

  if (error instanceof ApiError) {
    statusCode = error.statusCode;
    message = error.message;
  }

  // Mongoose duplicate key error
  if ((error as any).code === 11000) {
    statusCode = 400;
    message = "Duplicate field value entered";
  }

  // Mongoose validation error
  if (error.name === "ValidationError") {
    statusCode = 400;
    const errors = (error as any).errors;
    message = Object.values(errors)
      .map((val: any) => val.message)
      .join(", ");
  }

  const errorResponse: ErrorResponse = {
    success: false,
    message,
  };

  // Include stack trace in development
  if (process.env.NODE_ENV === "development") {
    errorResponse.error = error;
    errorResponse.stack = error.stack;
  }

  res.status(statusCode).json(errorResponse);
};
