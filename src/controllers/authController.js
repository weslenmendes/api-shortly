import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import connection from "./../config/database.js";

export async function signUp(req, res) {
  try {
    const { name, email, password } = res.locals.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const query = {
      text: `
        INSERT INTO 
          users(name, email, password) 
        VALUES 
          ($1, $2, $3);`,
      values: [name, email, hashedPassword],
    };

    await connection.query(query);

    res.sendStatus(201);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
}

export async function signIn(req, res) {
  try {
    const { id, name } = res.locals.user;

    const queryUpdateSession = {
      text: `
        UPDATE
          sessions
        SET
          "updatedAt" = NOW()
        WHERE
          ("userId" = $1 AND "updatedAt" IS NULL);`,
      values: [parseInt(id)],
    };

    await connection.query(queryUpdateSession);

    const queryCreateSession = {
      text: `
        INSERT INTO 
          sessions("userId") 
        VALUES 
          ($1)
        RETURNING
          id;`,
      values: [id],
    };

    const { rows } = await connection.query(queryCreateSession);

    const data = { userId: id, sessionId: rows[0].id };
    const secretKey = process.env.JWT_SECRET;
    const expiresIn = { expiresIn: "1h" };

    const token = jwt.sign(data, secretKey, expiresIn);

    res.status(200).send({ name, token });
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
}
