import { stripHtml } from "string-strip-html";
import jwt from "jsonwebtoken";
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

export async function validateToken(req, res, next) {
  const { authorization } = req.headers;
  const token = authorization?.split(" ")[1]?.trim();

  if (!token) {
    return res.status(401).send({
      msg: "You must be logged in to do this.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).send({
        msg: "Invalid token provided.",
      });
    }

    const { userId, sessionId } = decoded;

    const query = {
      text: `
        SELECT
          *
        FROM
          sessions
        WHERE
          ("userId" = $1) AND (id = $2) AND ("updatedAt" IS NULL);
      `,
      values: [userId, sessionId],
    };

    const { rows } = await connection.query(query);

    if (rows.length === 0) {
      return res.status(401).send({
        msg: "Invalid token provided.",
      });
    }

    res.locals.userId = userId;

    next();
  } catch (e) {
    if (e.name === "TokenExpiredError") {
      return res.status(401).send({
        msg: "Your session has expired.",
      });
    }

    res.sendStatus(500);
  }
}
