import { signUpSchema, signInSchema } from "./../schemas/authSchema.js";
import { urlSchema } from "./../schemas/urlSchemas.js";

import {
  sanitizeSignInBody,
  sanitizeSignUpBody,
} from "./../utils/sanitization.js";

export function validateSignUpBody(req, res, next) {
  const bodySanitized = sanitizeSignUpBody(req.body);

  const { error } = signUpSchema.validate(bodySanitized, { abortEarly: false });

  if (error) {
    const errorMessages = error.details
      .map((detail) => detail.message)
      .join(", ");
    return res.status(422).send({ msg: errorMessages });
  }

  res.locals.bodySanitized = bodySanitized;

  next();
}

export function validateSignInBody(req, res, next) {
  const bodySanitized = sanitizeSignInBody(req.body);

  const { error } = signInSchema.validate(bodySanitized, { abortEarly: false });

  if (error) {
    const errorMessages = error.details
      .map((detail) => detail.message)
      .join(", ");
    return res.status(422).send({ msg: errorMessages });
  }

  res.locals.bodySanitized = bodySanitized;

  next();
}

export function validateUrl(req, res, next) {
  const { error } = urlSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errorMessages = error.details
      .map((detail) => detail.message)
      .join(", ");
    return res.status(422).send({ msg: errorMessages });
  }

  next();
}
