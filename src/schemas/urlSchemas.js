import Joi from "joi";

export const urlSchema = Joi.object().keys({
  url: Joi.string()
    .uri()
    .pattern(new RegExp("^http(s)?://"))
    .required()
    .messages({
      "string.empty": "URL is required",
      "string.base": "URL must be a string",
      "string.uri": "URL must be a valid URL",
      "string.pattern.base": "URL must be a valid URL",
    }),
});
