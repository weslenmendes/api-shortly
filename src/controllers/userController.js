import connection from "./../config/database.js";

export async function getUser(req, res) {
  try {
    const { id } = req.params;

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

    const { rows } = await connection.query(query);

    if (rows.length === 0) {
      return res.status(404).send({ msg: "This user does not exist." });
    }

    res.send(rows[0]);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
}

export async function ranking(req, res) {
  try {
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

    const { rows } = await connection.query(query);

    res.send(rows);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
}
