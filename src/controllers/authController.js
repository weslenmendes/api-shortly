import connection from "./../config/database.js";

import bcrypt from "bcrypt";

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

export function signIn(req, res) {}
