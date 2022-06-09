import { urlSchema } from "./../schemas/urlSchemas.js";

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
