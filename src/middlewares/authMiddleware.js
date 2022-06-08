import { stripHtml } from "string-strip-html";
import bcrypt from "bcrypt";

import connection from "./../config/database.js";

import { signUpSchema, signInSchema } from "./../schemas/authSchema.js";

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
    return res.status(422).send({ msg: errorMessages });
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
      return res.status(422).send({
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

function sanitizeSignInBody(body) {
  const sanitizedBody = {
    email: stripHtml(String(body.email) || "<br/>").result,
    password: stripHtml(String(body.password) || "<br/>").result,
  };

  return sanitizedBody;
}

export async function validateSignIn(req, res, next) {
  const bodySanitized = sanitizeSignInBody(req.body);

  const { error } = signInSchema.validate(bodySanitized, { abortEarly: false });

  if (error) {
    const errorMessages = error.details
      .map((detail) => detail.message)
      .join(", ");
    return res.status(422).send({ msg: errorMessages });
  }

  try {
    const { email, password } = bodySanitized;

    const query = {
      text: `
        SELECT 
          * 
        FROM 
          users 
        WHERE 
          (email = $1)`,
      values: [email],
    };

    const { rows } = await connection.query(query);

    if (rows.length === 0) {
      return res.status(401).send({
        msg: "This user does not exist.",
      });
    }

    if (!(await bcrypt.compare(password, rows[0].password))) {
      return res.status(401).send({
        msg: "Wrong password.",
      });
    }

    res.locals.user = rows[0];
    next();
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
}
