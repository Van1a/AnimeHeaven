const axios = require("axios");
const cheerio = require("cheerio");

class AnimeHeaven {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async fetchHtml(url, headers = {}) {
    const { data } = await axios.get(url, {
      headers: { "User-Agent": "Mozilla/5.0", ...headers },
      maxRedirects: 0,
      validateStatus: null
    });
    return cheerio.load(data);
  }

  async getAnimeList(customUrl) {
    const start = Date.now();
    try {
      const url = customUrl || this.baseUrl;
      const isPopular = url.includes("popular.php");
      const $ = await this.fetchHtml(url);

      const animeList = $(".chart.bc1")
        .map((_, el) => {
          const $el = $(el);
          const item = {
            title: $el.find(".charttitle a").text().trim(),
            japaneseTitle: $el.find(".charttitlejp").text().trim(),
            coverImage: `${this.baseUrl}${$el.find(".coverimg").attr("src")}`,
            episodes: $el.find(".chartep").text().trim(),
            releaseDate: $el.find(".charttimer").text().trim(),
            url: `${this.baseUrl}${$el.find("a:first").attr("href")}`
          };
          if (isPopular) {
            item.rank = item.episodes;
            item.rating = item.releaseDate;
            delete item.episodes;
            delete item.releaseDate;
          }
          return item;
        })
        .get();

      return { meta: { status: 200, responseTime: `${Date.now() - start}ms`, message: "ok!" }, data: animeList };
    } catch (err) {
      return { meta: { status: err.response?.status || 500, responseTime: `${Date.now() - start}ms`, message: "error" }, error: err.message };
    }
  }

  async getAnimeInfo(url) {
    const start = Date.now();
    try {
      const $ = await this.fetchHtml(url, { Referer: this.baseUrl });
      const infoParent = $(".info.bc1");
      const infoParent2 = $(".info2.bc1");
      const infoYearDiv = infoParent.find(".infoyear.c");

      const result = {
        title: infoParent.find(".infotitle").text().trim(),
        japaneseTitle: infoParent.find(".infotitlejp").text().trim(),
        description: infoParent.find(".infodes").text().trim(),
        tags: infoParent
          .find(".infotags a")
          .map((_, el) => ({ name: $(el).find(".boxitem").text().trim(), url: $(el).attr("href") }))
          .get(),
        episodes: infoYearDiv.find(".inline.c2").eq(0).text().trim(),
        year: infoYearDiv.find(".inline.c2").eq(1).text().trim(),
        score: infoYearDiv.find(".inline.c2").eq(2).text().trim(),
        detail: {
          detail: infoParent2.find(".inline.c").text().trim(),
          info: infoParent2.find(".inline.c2").text().trim()
        },
        episodeList: $(".linetitle2.c2 a.c")
          .map((_, el) => ({
            key: $(el).attr("id"),
            gateway: "https://animeheaven.me/gate.php",
            episode: $(el).find(".watch2.bc").text().trim(),
            released: $(el).find(".watch1.bc.c").last().text().trim()
          }))
          .get(),
        similarShows: $(".info3.bc1 .similarimg")
          .map((_, el) => {
            const $el = $(el);
            return { link: $el.find("a.c").attr("href"), image: $el.find("img.coverimg").attr("src"), title: $el.find("img.coverimg").attr("alt") };
          })
          .get()
      };

      return { meta: { status: 200, responseTime: `${Date.now() - start}ms`, message: "ok!" }, data: result };
    } catch (err) {
      return { meta: { status: err.response?.status || 500, responseTime: `${Date.now() - start}ms`, message: "error" }, error: err.message };
    }
  }

  async getAnimeWatch(gateway, key) {
    const start = Date.now();
    try {
      const $ = await this.fetchHtml(gateway, { Referer: this.baseUrl, Cookie: `_poprepop=1; key=${key}`, "X-Requested-With": "XMLHttpRequest" });
      const title = $(".linetitle3 a").text().trim();
      const url = `${this.baseUrl}${$(".linetitle3 a").attr("href")}`;
      const sources = $("source").map((_, el) => $(el).attr("src")).get();
      const nav = $(".linetitle2 a")
        .map((_, el) => {
          const key = $(el).attr("onclick")?.match(/['"]([^'"]+)['"]/)?.[1];
          return { title: $(el).text().trim(), url: `${this.baseUrl}${$(el).attr("href")}`, key };
        })
        .get();
      const infoRes = await this.getAnimeInfo(url);

      return { meta: { status: 200, responseTime: `${Date.now() - start}ms`, message: "ok!" }, data: { title, url, video: sources[0] || null, fallback: sources[1] || null, previous: nav[0] || null, next: nav[1] || null, episodeList: infoRes.data?.episodeList || [] } };
    } catch (err) {
      return { meta: { status: err.response?.status || 500, responseTime: `${Date.now() - start}ms`, message: "error" }, error: err.message };
    }
  }

  async getAnimeTag(url) {
    const start = Date.now();
    try {
      const $ = await this.fetchHtml(url);
      const results = $(".info3.bc1 .similarimg")
        .map((_, el) => {
          const $el = $(el);
          return { title: $el.find(".similarname a.c").text().trim() || $el.find("img.coverimg").attr("alt"), url: `${this.baseUrl}${$el.find("a.c").attr("href")}`, coverImage: `${this.baseUrl}${$el.find(".coverimg").attr("src")}` };
        })
        .get();
      return { meta: { status: 200, responseTime: `${Date.now() - start}ms`, message: "ok!" }, data: results };
    } catch (err) {
      return { meta: { status: err.response?.status || 500, responseTime: `${Date.now() - start}ms`, message: "error" }, error: err.message };
    }
  }

  async getAnimeSearch(keyword) {
    const start = Date.now();
    try {
      const $ = await this.fetchHtml(`${this.baseUrl}search.php?s=${encodeURIComponent(keyword)}`);
      const results = $(".info3.bc1 .similarimg")
        .map((_, el) => {
          const $el = $(el);
          return { title: $el.find(".similarname a.c").text().trim() || $el.find("img.coverimg").attr("alt"), url: `${this.baseUrl}${$el.find("a.c").attr("href")}`, coverImage: `${this.baseUrl}${$el.find(".coverimg").attr("src")}` };
        })
        .get();
      return { meta: { status: 200, responseTime: `${Date.now() - start}ms`, message: "ok!" }, data: results };
    } catch (err) {
      return { meta: { status: err.response?.status || 500, responseTime: `${Date.now() - start}ms`, message: "error" }, error: err.message };
    }
  }

  async getAnimeRandom() {
    const start = Date.now();
    try {
      const res = await axios.get(`${this.baseUrl}random.php`, { maxRedirects: 0, validateStatus: null });
      return { meta: { status: 200, responseTime: `${Date.now() - start}ms`, message: "ok!" }, data: await this.getAnimeInfo(res.headers.location) || null };
    } catch (err) {
      return { meta: { status: err.response?.status || 500, responseTime: `${Date.now() - start}ms`, message: "error" }, error: err.message };
    }
  }
}

module.exports = AnimeHeaven;

