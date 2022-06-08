import { stripHtml } from "string-strip-html";

import connection from "./../config/database.js";

import { signUpSchema } from "./../schemas/authSchema.js";

function sanitizeSignUpBody(body) {
  const sanitizedBody = {
    name: stripHtml(String(body.name) || "<br/>").result,
    email: stripHtml(String(body.email) || "<br/>").result,
    password: stripHtml(String(body.password) || "<br/>").result,
    confirmPassword: stripHtml(String(body.confirmPassword) || "<br/>").result,
  };

  return sanitizedBody;
}

export async function validateSignUp(req, res, next) {
  const bodySanitized = sanitizeSignUpBody(req.body);

  const { error } = signUpSchema.validate(bodySanitized, { abortEarly: false });

  if (error) {
    const errorMessages = error.details
      .map((detail) => detail.message)
      .join(", ");
    return res.status(422).json({ msg: errorMessages });
  }

  try {
    const { email } = bodySanitized;

    const query = {
      text: `
        SELECT 
          * 
        FROM 
          users 
        WHERE 
          email = $1`,
      values: [email],
    };

    const { rows } = await connection.query(query);

    if (rows.length > 0) {
      return res.status(422).json({
        msg: "This email already exists.",
      });
    }

    res.locals.body = bodySanitized;
    next();
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
}
