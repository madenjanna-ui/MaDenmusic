const songs = [
  {
    id: 39,
    title: "От Эдема ... remix",
    artist: "MaDen",
    release: "2026-08-28",
    audio: "songs/От Эдема (remix).mp3",
    cover: "covers/От Эдема (remix).png",
    lyrics: `
Здесь будет текст песни "От Эдема ... remix"
`
  },
  {
    id: 38,
    title: "Твой взгляд (dance remix 70')",
    artist: "MaDen",
    release: "2026-08-28",
    audio: "songs/Твой взгляд (remix).mp3",
    cover: "covers/Твой взгляд (remix).png",
    lyrics: `
Здесь будет текст песни "Твой взгляд (dance remix 70')"
`
  },

  {
    id: 37,
    title: "От Эдема до Нового дня",
    artist: "MaDen",
    release: "2026-08-25",
    audio: "songs/От Эдема до нового дня.mp3",
    cover: "covers/От Эдема до нового дня.png",
    lyrics: `
Здесь будет текст песни "От Эдема до Нового дня"
`
  },

  {
    id: 36,
    title: "Счастье нас обнимает",
    artist: "MaDen",
    release: "2026-08-24",
    audio: "songs/Счастье нас обнимает.mp3",
    cover: "covers/Счастье нас обнимает.png",
    lyrics: `
Здесь будет текст песни "Счастье нас обнимает"
`
  },

  {
    id: 35,
    title: "Одно сердце на двоих",
    artist: "MaDen",
    release: "2026-08-21",
    audio: "songs/odno-serdtse-na-dvoih.mp3",
    cover: "odno-serdtse-na-dvoih.png",
    lyrics: `
Здесь будет текст песни "Одно сердце на двоих"
`
  },

  {
    id: 34,
    title: "Целуй меня нежно...",
    artist: "MaDen",
    release: "2026-08-17",
    audio: "17.08-2.mp3",
    cover: "17.08-2.png",
    lyrics: `
Здесь будет текст песни "Целуй меня нежно..."
`
  },

  {
    id: 27,
    title: "Одним воздухом дышать (Remix)",
    artist: "MaDen",
    release: "2026-08-13",
    audio: "13.08-2.mp3",
    cover: "album_remixes.png",
    lyrics: `
Здесь будет текст песни "Одним воздухом дышать (Remix)"
`
  },

  {
    id: 15,
    title: "Мы растворяемся вдвоём (Remix)",
    artist: "MaDen",
    release: "2026-08-13",
    audio: "мы растворяемся вдвоём (remix).mp3",
    cover: "мы растворяемся вдвоём (remix).jpg",
    lyrics: `
Здесь будет текст песни "Мы растворяемся вдвоём (Remix)"
`
  },

  {
    id: 14,
    title: "История любви (Nordic Remix)",
    artist: "MaDen",
    release: "2026-08-13",
    audio: "история любви (nordic remix).mp3",
    cover: "история любви (nordic remix).jpg",
    lyrics: `
Здесь будет текст песни "История любви (Nordic Remix)"
`
  },

  {
    id: 13,
    title: "Мы растворяемся вдвоем",
    artist: "MaDen",
    release: "2026-08-06",
    audio: "Растворяемся вдвоем.mp3",
    cover: "растворяемся.png",
    lyrics: `
Здесь будет текст песни "Мы растворяемся вдвоем"
`
  },

  {
    id: 12,
    title: "Одним воздухом дышать",
    artist: "MaDen",
    release: "2026-08-05",
    audio: "Одним воздухом дышать.mp3",
    cover: "Одним воздухом дышать.png",
    lyrics: `
Здесь будет текст песни "Одним воздухом дышать"
`
  },

  {
    id: 11,
    title: "Ты мой кофе",
    artist: "MaDen",
    release: "2026-08-05",
    audio: "kofe.mp3",
    cover: "kofe.jpg",
    lyrics: `
Здесь будет текст песни "Ты мой кофе"
`
  },

  {
    id: 10,
    title: "Твой взгляд",
    artist: "MaDen",
    release: "2026-08-05",
    audio: "tvoy vzglayd.mp3",
    cover: "Together.png",
    lyrics: `
Здесь будет текст песни "Твой взгляд"
`
  },

  {
    id: 9,
    title: "Папина дочка",
    artist: "MaDen",
    release: "2026-08-04",
    audio: "Папина дочка.mp3",
    cover: "Папина дочка.png",
    lyrics: `
Здесь будет текст песни "Папина дочка"
`
  },

  {
    id: 8,
    title: "Эсфирь",
    artist: "MaDen",
    release: "2026-08-03",
    audio: "Моя – Эсфирь.mp3",
    cover: "Together.png",
    lyrics: `
Здесь будет текст песни "Эсфирь"
`
  },

  {
    id: 7,
    title: "Жизнь моей души",
    artist: "MaDen",
    release: "2026-08-02",
    audio: "Моя – Жизнь моей души.mp3",
    cover: "Together.png",
    lyrics: `
Здесь будет текст песни "Жизнь моей души"
`
  },

  {
    id: 6,
    title: "Мой свет, гори 🔥",
    artist: "MaDen",
    release: "2026-08-01",
    audio: "Moy svet.mp3",
    cover: "Together.png",
    lyrics: `
Здесь будет текст песни "Мой свет, гори 🔥"
`
  },

  {
    id: 5,
    title: "Мой ангел",
    artist: "MaDen",
    release: "2026-07-31",
    audio: "Moy angel.mp3",
    cover: "Together.png",
    lyrics: `
Здесь будет текст песни "Мой ангел"
`
  },

  {
    id: 4,
    title: "Комета",
    artist: "MaDen",
    release: "2026-07-30",
    audio: "Комета.mp3",
    cover: "Comet.png",
    lyrics: `
Здесь будет текст песни "Комета"
`
  },

  {
    id: 3,
    title: "Сегодня мы считаем звёзды",
    artist: "MaDen",
    release: "2026-07-20",
    audio: "сегодня мы считаем звёзды.mp3",
    cover: "IMG_3387.jpeg",
    lyrics: `
Здесь будет текст песни "Сегодня мы считаем звёзды"
`
  },

  {
    id: 2,
    title: "История Любви",
    artist: "MaDen",
    release: "2026-07-10",
    audio: "История любви.mp3",
    cover: "Screenshot_20260803-134440-display-0.png.png",
    lyrics: `
Здесь будет текст песни "История Любви"
`
  },

  {
    id: 1,
    title: "Ты лилия (Nordic Remix)",
    artist: "MaDen",
    release: "2026-07-01",
    audio: "ты лилия (nordic remix).mp3",
    cover: "IMG_1576.jpeg",
    lyrics: `
Здесь будет текст песни "Ты лилия (Nordic Remix)"
`
  }

];
