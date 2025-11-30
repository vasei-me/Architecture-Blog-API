import Joi from "joi";

export const createPostSchema = Joi.object({
  title: Joi.string().trim().min(5).max(200).required().messages({
    "string.min": "Title must be at least 5 characters long",
    "string.max": "Title cannot be longer than 200 characters",
    "any.required": "Title is required",
  }),

  content: Joi.string().min(50).required().messages({
    "string.min": "Content must be at least 50 characters long",
    "any.required": "Content is required",
  }),

  excerpt: Joi.string().max(300).optional().allow(""),

  categories: Joi.array().items(Joi.string().hex().length(24)).optional(),

  tags: Joi.array().items(Joi.string().trim().max(20)).optional(),

  featuredImage: Joi.string().uri().optional().allow(""),

  status: Joi.string().valid("published", "draft", "archived").default("draft"),

  metaTitle: Joi.string().max(200).optional().allow(""),

  metaDescription: Joi.string().max(300).optional().allow(""),
});

export const updatePostSchema = Joi.object({
  title: Joi.string().trim().min(5).max(200).optional(),

  content: Joi.string().min(50).optional(),

  excerpt: Joi.string().max(300).optional().allow(""),

  categories: Joi.array().items(Joi.string().hex().length(24)).optional(),

  tags: Joi.array().items(Joi.string().trim().max(20)).optional(),

  featuredImage: Joi.string().uri().optional().allow(""),

  status: Joi.string().valid("published", "draft", "archived").optional(),

  metaTitle: Joi.string().max(200).optional().allow(""),

  metaDescription: Joi.string().max(300).optional().allow(""),
});
