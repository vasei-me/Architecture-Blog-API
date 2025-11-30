import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import ApiError from "../errors/ApiError";

const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(", ");

      return next(new ApiError(400, errorMessage));
    }

    next();
  };
};

export default validate;
