import Joi from "joi";

export const signUpSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "Name is required",
    "string.base": "Name must be a string",
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.base": "Email must be a string",
    "string.email": "Email must be a valid email",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required",
    "string.base": "Password must be a string",
  }),
  confirmPassword: Joi.string().equal(Joi.ref("password")).required().messages({
    "string.empty": "Confirm password is required",
    "string.base": "Confirm password must be a string",
    "any.only": "Password and confirm password does not match",
  }),
});
