import connection from "./../config/database.js";

async function createUser({ name, email, password }) {
  const query = {
    text: `
      INSERT INTO 
        users(name, email, password) 
      VALUES 
        ($1, $2, $3);`,
    values: [name, email, password],
  };

  await connection.query(query);
}

async function getUserByEmail(email) {
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

  const result = await connection.query(query);

  return result;
}

async function getUserDetails(id) {
  const query = {
    text: `
      SELECT
        users.id,
        users.name,
        COALESCE(SUM(urls."visitCount"), 0)::INTEGER AS "visitCount",
        COALESCE(json_agg(json_build_object(
          'id', urls.id,
          'url', urls.url,
          'shortUrl', urls."shortUrl",
          'visitCount', urls."visitCount"
        )) FILTER (WHERE urls.id IS NOT NULL), '[]') AS "shortenedUrls"
      FROM 
        users 
      LEFT JOIN 
        urls 
      ON 
        urls."userId" = users.id
      WHERE 
        users.id = $1 
      GROUP BY users.id, users.name;`,
    values: [id],
  };

  const result = await connection.query(query);

  return result;
}

async function getRanking() {
  const query = {
    text: `
      SELECT 
        users.id,
        users.name,
        COUNT(urls.id)::INTEGER AS "linksCount",
        COALESCE(SUM(urls."visitCount"),0)::INTEGER AS "visitCount"
      FROM 
        users 
      LEFT JOIN 
        urls 
      ON 
        urls."userId" = users.id
      GROUP BY 
        users.id, users.name
      ORDER BY 
        "visitCount" DESC, "linksCount" DESC
      LIMIT 10;`,
  };

  const result = await connection.query(query);

  return result;
}

const userRepository = {
  createUser,
  getUserByEmail,
  getUserDetails,
  getRanking,
};

export default userRepository;
