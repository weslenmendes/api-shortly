import connection from "./../config/database.js";

export default class UrlRepository {
  static createUrl = async ({ url, shortUrl, userId }) => {
    const query = {
      text: `
          INSERT INTO
            urls(url, "shortUrl", "userId")
          VALUES
            ($1, $2, $3)
          RETURNING *;
        `,
      values: [url, shortUrl, userId],
    };

    const { rows } = await connection.query(query);

    return rows[0];
  };

  static getUrlById = async (id) => {
    const query = {
      text: `
        SELECT
          id,
          "userId",
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

    return rows[0];
  };

  static getUrlByShortUrl = async (shortUrl) => {
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

    return rows[0];
  };

  static deleteUrl = async (id) => {
    const query = {
      text: `
        DELETE FROM
          urls
        WHERE
          id = $1;`,
      values: [id],
    };

    await connection.query(query);
  };

  static incrementVisit = async (shortUrl) => {
    const query = {
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

    await connection.query(query);
  };
}
