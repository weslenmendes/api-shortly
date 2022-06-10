import { nanoid } from "nanoid";

import UrlRepository from "./../repositories/urlRepository.js";

export async function urlShorten(req, res) {
  try {
    const { url } = req.body;
    const { userId } = res.locals;

    const idSize = 10;
    const shortUrl = nanoid(idSize);

    const result = await UrlRepository.getShortUrlByUrl({ url, userId });

    if (result.rowCount === 0) {
      await UrlRepository.createUrl({ url, shortUrl, userId });
      return res.send({ shortUrl });
    }

    const { id } = result.rows[0];

    await UrlRepository.updateShortUrl({ id, shortUrl, userId });

    res.send({ shortUrl });
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
}

export async function getUrl(req, res) {
  try {
    const { id } = req.params;

    const result = await UrlRepository.getUrlById(id);

    if (result.rowCount === 0) {
      return res.sendStatus(404);
    }

    const { userId, ...url } = result.rows[0];

    res.send(url);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
}

export async function redirect(req, res) {
  try {
    const { shortUrl } = req.params;

    const result = await UrlRepository.getUrlByShortUrl(shortUrl);

    if (result.rowCount === 0) {
      return res.status(404).send({ msg: "Url not found." });
    }

    await UrlRepository.incrementVisit(shortUrl);

    res.redirect(result.rows[0].url);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
}

export async function deleteUrl(req, res) {
  try {
    const { id } = req.params;
    const { userId } = res.locals;

    const result = await UrlRepository.getUrlById(id);

    if (result.rowCount === 0) {
      return res.status(404).send({
        msg: "Url not found",
      });
    }

    if (result.rows[0].userId !== userId) {
      return res.status(401).send({
        msg: "You are not authorized to delete this url",
      });
    }

    await UrlRepository.deleteUrl(id);

    res.status(204).send({ msg: "Url deleted" });
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
}
