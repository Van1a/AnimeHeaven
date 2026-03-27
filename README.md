# 🌸 AnimeHeaven Scraper

> A Node.js scraper for [AnimeHeaven](https://animeheaven.me) — fetch anime lists, details, episodes, tags, search results, and random picks with ease.

Built with **axios** + **cheerio**.

---

## 📦 Installation

```bash
git clone https://github.com/Van1a/AnimeHeaven.git
cd AnimeHeaven
npm install axios cheerio
```

Then place `AnimeHeaven.js` in your project root.

---

## 🚀 Quick Start

```js
const AnimeHeaven = require("./AnimeHeaven");

const anime = new AnimeHeaven("https://animeheaven.me/");

(async () => {
  const list   = await anime.getAnimeList();
  const info   = await anime.getAnimeInfo("https://animeheaven.me/anime-info.php?id=123");
  const watch  = await anime.getAnimeWatch("https://animeheaven.me/gate.php", "your_key_here");
  const tag    = await anime.getAnimeTag("https://animeheaven.me/tag.php?id=1");
  const search = await anime.getAnimeSearch("Naruto");
  const random = await anime.getAnimeRandom();

  console.log(list, info, watch, tag, search, random);
})();
```

---

## 🛠️ Methods

| Method | Parameters | Description |
|---|---|---|
| `getAnimeList(customUrl?)` | `customUrl` *(optional)* | Fetch a list of anime. Supports popular list. |
| `getAnimeInfo(url)` | `url` | Fetch detailed info for a single anime. |
| `getAnimeWatch(gateway, key)` | `gateway`, `key` | Fetch streaming links and episode navigation. |
| `getAnimeTag(url)` | `url` | Fetch anime grouped by a tag. |
| `getAnimeSearch(keyword)` | `keyword` | Search anime by keyword. |
| `getAnimeRandom()` | *(none)* | Fetch a random anime. |

---

## 📋 Response Format

```json
{
  "meta": {
    "status": 200,
    "responseTime": "120ms",
    "message": "ok!"
  },
  "data": { }
}
```

---

## 📄 Example Responses

### `getAnimeList()`

```json
{
  "meta": { "status": 200, "responseTime": "120ms", "message": "ok!" },
  "data": [
    {
      "title": "Attack on Titan",
      "japaneseTitle": "進撃の巨人",
      "coverImage": "https://animeheaven.me/images/aot.jpg",
      "episodes": "75",
      "releaseDate": "2013",
      "url": "https://animeheaven.me/anime-info.php?id=1"
    },
    {
      "title": "Naruto",
      "japaneseTitle": "ナルト",
      "coverImage": "https://animeheaven.me/images/naruto.jpg",
      "episodes": "220",
      "releaseDate": "2002",
      "url": "https://animeheaven.me/anime-info.php?id=2"
    }
  ]
}
```

---

### `getAnimeInfo(url)`

```json
{
  "meta": { "status": 200, "responseTime": "145ms", "message": "ok!" },
  "data": {
    "title": "Attack on Titan",
    "japaneseTitle": "進撃の巨人",
    "description": "Humans fight against Titans who threaten humanity.",
    "tags": [
      { "name": "Action",    "url": "/tag.php?id=1" },
      { "name": "Adventure", "url": "/tag.php?id=2" }
    ],
    "episodes": "75",
    "year": "2013",
    "score": "9.0",
    "detail": { "detail": "TV Series", "info": "Completed" },
    "episodeList": [
      {
        "key": "ep1",
        "gateway": "https://animeheaven.me/gate.php",
        "episode": "Episode 1",
        "released": "2013-04-07"
      },
      {
        "key": "ep2",
        "gateway": "https://animeheaven.me/gate.php",
        "episode": "Episode 2",
        "released": "2013-04-14"
      }
    ],
    "similarShows": [
      { "link": "/anime-info.php?id=3", "image": "/images/other.jpg", "title": "Other Anime" }
    ]
  }
}
```

---

### `getAnimeWatch(gateway, key)`

```json
{
  "meta": { "status": 200, "responseTime": "130ms", "message": "ok!" },
  "data": {
    "title": "Attack on Titan Episode 1",
    "url": "https://animeheaven.me/anime-info.php?id=1",
    "video": "https://cdn.animeheaven.me/videos/ep1.mp4",
    "fallback": "https://backup.animeheaven.me/videos/ep1.mp4",
    "previous": { "title": "Prev Ep", "url": "#", "key": "prev_key" },
    "next":     { "title": "Next Ep", "url": "#", "key": "next_key" },
    "episodeList": [
      {
        "key": "ep1",
        "gateway": "https://animeheaven.me/gate.php",
        "episode": "Episode 1",
        "released": "2013-04-07"
      }
    ]
  }
}
```

---

### `getAnimeSearch(keyword)` / `getAnimeTag(url)`

```json
{
  "meta": { "status": 200, "responseTime": "110ms", "message": "ok!" },
  "data": [
    {
      "title": "Naruto",
      "url": "/anime-info.php?id=2",
      "coverImage": "https://animeheaven.me/images/naruto.jpg"
    },
    {
      "title": "Naruto Shippuden",
      "url": "/anime-info.php?id=5",
      "coverImage": "https://animeheaven.me/images/shippuden.jpg"
    }
  ]
}
```

---

### `getAnimeRandom()`

```json
{
  "meta": { "status": 200, "responseTime": "160ms", "message": "ok!" },
  "data": {
    "title": "One Piece",
    "japaneseTitle": "ワンピース",
    "description": "A pirate adventure across the Grand Line.",
    "tags": [
      { "name": "Adventure", "url": "/tag.php?id=2" }
    ],
    "episodes": "1000+",
    "year": "1999",
    "score": "9.5"
  }
}
```

---

## ⚠️ Disclaimer

This project is intended for **educational purposes only**. Scraping websites may violate their Terms of Service. Always check [AnimeHeaven's ToS](https://animeheaven.me) before use.

---

## 📝 License

MIT
