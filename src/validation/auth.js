import Joi from 'joi';

export const registerUserSchema = Joi.object({
  name: Joi.string().trim().min(2).max(30).required(),
  email: Joi.string().trim().email().required(),
  password: Joi.string().required(),
});

export const loginUserSchema = Joi.object({
  email: Joi.string().trim().email().required(),
  password: Joi.string().required(),
});
