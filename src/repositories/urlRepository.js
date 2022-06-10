import connection from "./../config/database.js";

async function createUrl({ url, shortUrl, userId }) {
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

  const result = await connection.query(query);

  return result;
}

async function getUrlById(id) {
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

  const result = await connection.query(query);

  return result;
}

async function getShortUrlByUrl({ url, userId }) {
  const query = {
    text: `
      SELECT
        *
      FROM
        urls
      WHERE
        (url = $1) AND ("userId" = $2);
    `,
    values: [url, userId],
  };

  const result = await connection.query(query);

  return result;
}

async function updateShortUrl({ id, shortUrl, userId }) {
  const query = {
    text: `
      UPDATE
        urls
      SET
        "shortUrl" = $1
      WHERE
        id = $2 AND "userId" = $3;`,
    values: [shortUrl, id, userId],
  };

  await connection.query(query);
}

async function getUrlByShortUrl(shortUrl) {
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

  const result = await connection.query(query);

  return result;
}

async function deleteUrl(id) {
  const query = {
    text: `
      DELETE FROM
        urls
      WHERE
        id = $1;`,
    values: [id],
  };

  await connection.query(query);
}

async function incrementVisit(shortUrl) {
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
}

const urlRepository = {
  createUrl,
  getUrlById,
  getUrlByShortUrl,
  getShortUrlByUrl,
  updateShortUrl,
  deleteUrl,
  incrementVisit,
};

export default urlRepository;
