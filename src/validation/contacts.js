import Joi from 'joi';

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string()
    .pattern(/^\+?[0-9\s\-()]{7,20}$/)
    .required(),
  favorite: Joi.boolean(),
  contactType: Joi.string().valid('work', 'home', 'personal').required(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(30),
  email: Joi.string().email(),
  phoneNumber: Joi.string().pattern(/^\+?[0-9\s\-()]{7,20}$/),
  favorite: Joi.boolean(),
  contactType: Joi.string().valid('work', 'home', 'personal'),
}).min(1);
