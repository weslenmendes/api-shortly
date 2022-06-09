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

export async function getUrl(req, res) {
  try {
    const { id } = req.params;

    const query = {
      text: `
        SELECT
          id,
          "shortUrl",
          url
        FROM
          urls
        WHERE
          id = $1;
      `,
      values: [id],
    };

    const { rows } = await connection.query(query);

    if (rows.length === 0) {
      return res.sendStatus(404);
    }

    const { url, shortUrl } = rows[0];

    res.send({ id, shortUrl, url });
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
}

export async function redirect(req, res) {
  try {
    const { shortUrl } = req.params;

    const query = {
      text: `
        SELECT
          *
        FROM
          urls
        WHERE
          "shortUrl" = $1;
      `,
      values: [shortUrl],
    };

    const { rows } = await connection.query(query);

    if (rows.length === 0) {
      return res.sendStatus(404);
    }

    const queryUpdate = {
      text: `
        UPDATE
          urls
        SET
          "visitCount" = "visitCount" + 1
        WHERE
          "shortUrl" = $1;
      `,
      values: [shortUrl],
    };

    await connection.query(queryUpdate);

    res.redirect(rows[0].url);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
}
