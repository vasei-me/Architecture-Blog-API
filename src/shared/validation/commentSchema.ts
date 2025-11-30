import Joi from "joi";

export const createCommentSchema = Joi.object({
  content: Joi.string().trim().min(2).max(1000).required().messages({
    "string.min": "Comment must be at least 2 characters long",
    "string.max": "Comment cannot be longer than 1000 characters",
    "any.required": "Comment content is required",
  }),

  post: Joi.string().hex().length(24).required().messages({
    "string.hex": "Post ID must be a valid MongoDB ID",
    "string.length": "Post ID must be 24 characters long",
    "any.required": "Post ID is required",
  }),

  parentComment: Joi.string().hex().length(24).optional().allow(null),
});

export const updateCommentSchema = Joi.object({
  content: Joi.string().trim().min(2).max(1000).optional(),

  status: Joi.string().valid("approved", "pending", "spam").optional(),
});
