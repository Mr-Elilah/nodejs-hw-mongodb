import Joi from 'joi';
import { isValidObjectId } from 'mongoose';

export const createContactSchema = Joi.object({
  name: Joi.string().trim().min(2).max(30).required(),
  email: Joi.string().trim().email().required(),
  phoneNumber: Joi.string()
    .trim()
    .pattern(/^\+?[0-9\s\-()]{7,20}$/)
    .required(),
  isFavourite: Joi.boolean().optional(),
  contactType: Joi.string().valid('work', 'home', 'personal').required(),
  userId: Joi.string()
    .custom((value, helper) => {
      if (value && !isValidObjectId(value)) {
        return helper.message('User id should be a valid mongo id');
      }
      return value;
    })
    .optional(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(2).max(30).optional(),
  email: Joi.string().email().optional(),
  phoneNumber: Joi.string()
    .trim()
    .pattern(/^\+?[0-9\s\-()]{7,20}$/)
    .optional(),
  isFavourite: Joi.boolean().optional(),
  contactType: Joi.string().valid('work', 'home', 'personal').optional(),
}).min(1);
