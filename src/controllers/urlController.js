import { nanoid } from "nanoid";

import connection from "./../config/database.js";

export async function urlShorten(req, res) {
  try {
    const { url } = req.body;
    const { userId } = res.locals;

    const idSize = 8;
    const shortUrl = nanoid(idSize);

    const query = {
      text: `
        INSERT INTO
          urls(url, "shortUrl", "userId")
        VALUES
          ($1, $2, $3);
      `,
      values: [url, shortUrl, userId],
    };

    await connection.query(query);

    res.send({ shortUrl });
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
}
