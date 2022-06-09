import { nanoid } from "nanoid";

import UrlRepository from "./../repositories/urlRepository.js";

export async function urlShorten(req, res) {
  try {
    const { url } = req.body;
    const { userId } = res.locals;

    const idSize = 10;
    const shortUrl = nanoid(idSize);

    await UrlRepository.createUrl({ url, shortUrl, userId });

    res.send({ shortUrl });
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
}

export async function getUrl(req, res) {
  try {
    const { id } = req.params;

    const url = await UrlRepository.getUrlById(id);

    if (!url) {
      return res.sendStatus(404);
    }

    delete url.userId;

    res.send(url);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
}

export async function redirect(req, res) {
  try {
    const { shortUrl } = req.params;

    const url = await UrlRepository.getUrlByShortUrl(shortUrl);

    if (!url) {
      return res.status(404).send({ msg: "Url not found." });
    }

    await UrlRepository.incrementVisit(shortUrl);

    res.redirect(url.url);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
}

export async function deleteUrl(req, res) {
  try {
    const { id } = req.params;
    const { userId } = res.locals;

    const url = await UrlRepository.getUrlById(id);

    if (!url) {
      return res.status(404).send({
        msg: "Url not found",
      });
    }

    if (url.userId !== userId) {
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
