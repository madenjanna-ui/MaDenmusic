// MaDenMusic — единый каталог для альбомного вида
// Реально выпущенные треки и их release/пути сохранены из рабочего songs.js.
// Недостающие позиции добавлены как available: false и отображаются в альбомах как «Скоро будет».

const albumOrder = [
    "Моя",
    "Новый",
    "Мой ангел",
    "Новая веха",
    "Remixes",
    "Люмейя"
];

const albumMeta = {
    "Моя": { cover: "covers/moya.png", subtitle: "6 композиций" },
    "Новый": { cover: "covers/novyi.png", subtitle: "7 композиций" },
    "Мой ангел": { cover: "covers/My angel.PNG", subtitle: "5 композиций" },
    "Новая веха": { cover: "covers/Novaya veha.png", subtitle: "9 композиций" },
    "Remixes": { cover: "covers/Remixes.png", subtitle: "7 композиций" },
    "Люмейя": { cover: "covers/album_lumeya.jpeg", subtitle: "5 композиций" }
};

const songs = [
  {
    id: 28,
    title: "Как в океане",
    artist: "MaDen",
    release: "2026-08-20",
    album: "Новая веха",
    available: true,
    audio: "songs/Как в океане.mp3",
    cover: "covers/Novaya veha.png",
    lyrics: `
Здесь будет текст песни "Как в океане"
`
  },
  {
    id: 40,
    title: "Ты - мой кофе - remix",
    artist: "MaDen",
    release: "2026-09-01",
	album: "Remixes",
	 available: true,
    audio: "songs/My coffe ремикс.mp3",
    cover: "covers/My coffe ремикс.png",
    lyrics: `
Здесь будет текст песни "Ты - мой кофе - remix"
`
  },
{
    id: 39,
    title: "От Эдема ... remix",
    artist: "MaDen",
    release: "2026-08-28",
    album: "Remixes",
    available: true,
    audio: "songs/От Эдема (ремикс).mp3",
    cover: "covers/От Эдема (ремикс).png",
    lyrics: `
Текст песни "От Эдема ... remix" [Intro]

[Whisper]
В начале Бог создал человека...
Он дал ему совершенную жизнь...
Но человек сделал свой выбор...

[Chorus]

От Эдема до нового дня,
За руку Бог ведёт тебя.
То, что потерял Адам тогда,
Совершенство вернёт навсегда.

[Whisper]
Адам согрешил...
И грех вошёл в мир.
Но Бог не отказался от человечества...

[Chorus]

От Эдема до нового дня,
За руку Бог ведёт тебя.
То, что потерял Адам тогда,
Совершенство вернёт навсегда.

[Whisper]
Пришёл Потоп...
Но Ной и его семья были спасены.
И начался новый путь...

[Chorus]

От Эдема до нового дня,
За руку Бог ведёт тебя.
То, что потерял Адам тогда,
Совершенство вернёт навсегда.

[Whisper]
Но люди снова отступали...
Забывали Бога...
Забывали чистое поклонение...

[Half Chorus]
От Эдема до нового дня,
За руку Бог ведёт тебя.

[Instrumental Build]

[Whisper]
И тогда пришёл Иисус...
Он восстановил чистое поклонение.
Он открыл людям путь.
И дал надежду...

[Chorus]

От Эдема до нового дня,
За руку Бог ведёт тебя.
То, что потерял Адам тогда,
Совершенство вернёт навсегда.

[Whisper]
Божье Царство принесёт новую жизнь...
Боль закончится...
Страдания исчезнут...
И человечество вновь станет совершенным...

[Final Chorus]

От Эдема до нового дня,
За руку Бог ведёт тебя.
То, что потерял Адам тогда,
Совершенство вернёт навсегда.

[Spoken Whisper]
Вот суть всего сказанного:
бойся истинного Бога
и соблюдай его заповеди.
Это самое важное в жизни человека.

Ведь истинный Бог оценит каждое дело,
даже тайное,
и решит —
хорошее оно
или плохое.

[Outro Whisper]
От Эдема...
до нового дня...
`
  },
{
    id: 38,
    title: "Твой взгляд (dance remix 70')",
    artist: "MaDen",
    release: "2026-08-28",
    album: "Remixes",
    available: true,
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
    album: "Новая веха",
    available: true,
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
    album: "Новая веха",
    available: true,
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
    album: "Новая веха",
    available: true,
    audio: "songs/odno-serdtse-na-dvoih.mp3",
    cover: "covers/odno-serdtse-na-dvoih.png",
    lyrics: `
Здесь будет текст песни "Одно сердце на двоих"
`
  },
{
    id: 34,
    title: "Целуй меня нежно...",
    artist: "MaDen",
    release: "2026-08-17",
    album: "Новая веха",
    available: true,
    audio: "songs/17.08-2.mp3",
    cover: "covers/17.08-2.png",
    lyrics: `
Здесь будет текст песни "Целуй меня нежно..."
`
  },
{
    id: 27,
    title: "Одним воздухом дышать (Remix)",
    artist: "MaDen",
    release: "2026-08-13",
    album: "Remixes",
    available: true,
    audio: "songs/13.08-2.mp3",
    cover: "covers/album_remixes.png",
    lyrics: `
Здесь будет текст песни "Одним воздухом дышать (Remix)"
`
  },
{
    id: 15,
    title: "Мы растворяемся вдвоём (Remix)",
    artist: "MaDen",
    release: "2026-08-13",
    album: "Remixes",
    available: true,
    audio: "songs/мы растворяемся вдвоём (remix).mp3",
    cover: "covers/мы растворяемся вдвоём (remix).jpg",
    lyrics: `
Здесь будет текст песни "Мы растворяемся вдвоём (Remix)"
`
  },
{
    id: 14,
    title: "История любви (Nordic Remix)",
    artist: "MaDen",
    release: "2026-08-13",
    album: "Remixes",
    available: true,
    audio: "songs/история любви (nordic remix).mp3",
    cover: "covers/история любви (nordic remix).jpg",
    lyrics: `
Здесь будет текст песни "История любви (Nordic Remix)"
`
  },
{
    id: 13,
    title: "Мы растворяемся вдвоем",
    artist: "MaDen",
    release: "2026-08-06",
    album: "Новая веха",
    available: true,
    audio: "songs/Растворяемся вдвоем.mp3",
    cover: "covers/растворяемся.png",
    lyrics: `
Здесь будет текст песни "Мы растворяемся вдвоем"
`
  },
{
    id: 12,
    title: "Одним воздухом дышать",
    artist: "MaDen",
    release: "2026-08-05",
    album: "Мой ангел",
    available: true,
    audio: "songs/Одним воздухом дышать.mp3",
    cover: "covers/Одним воздухом дышать.png",
    lyrics: `
Здесь будет текст песни "Одним воздухом дышать"
`
  },
{
    id: 11,
    title: "Ты мой кофе",
    artist: "MaDen",
    release: "2026-08-05",
    album: "Новый",
    available: true,
    audio: "songs/kofe.mp3",
    cover: "covers/kofe.jpg",
    lyrics: `
Здесь будет текст песни "Ты мой кофе"
`
  },
{
    id: 10,
    title: "Твой взгляд",
    artist: "MaDen",
    release: "2026-08-05",
    album: "Новый",
    available: true,
    audio: "songs/tvoy vzglayd.mp3",
    cover: "covers/Together.png",
    lyrics: `
Здесь будет текст песни "Твой взгляд"
`
  },
{
    id: 9,
    title: "Папина дочка",
    artist: "MaDen",
    release: "2026-08-04",
    album: "Мой ангел",
    available: true,
    audio: "songs/Папина дочка.mp3",
    cover: "covers/Папина дочка.png",
    lyrics: `
Здесь будет текст песни "Папина дочка"
`
  },
{
    id: 8,
    title: "Эсфирь",
    artist: "MaDen",
    release: "2026-08-03",
    album: "Моя",
    available: true,
    audio: "songs/Моя – Эсфирь.mp3",
    cover: "covers/Together.png",
    lyrics: `
Здесь будет текст песни "Эсфирь"
`
  },
{
    id: 7,
    title: "Жизнь моей души",
    artist: "MaDen",
    release: "2026-08-02",
    album: "Моя",
    available: true,
    audio: "songs/Моя – Жизнь моей души.mp3",
    cover: "covers/Together.png",
    lyrics: `
Здесь будет текст песни "Жизнь моей души"
`
  },
{
    id: 6,
    title: "Мой свет, гори 🔥",
    artist: "MaDen",
    release: "2026-08-01",
    album: "Мой ангел",
    available: true,
    audio: "songs/Moy svet.mp3",
    cover: "covers/Together.png",
    lyrics: `
Здесь будет текст песни "Мой свет, гори 🔥"
`
  },
{
    id: 5,
    title: "Мой ангел",
    artist: "MaDen",
    release: "2026-07-31",
    album: "Мой ангел",
    available: true,
    audio: "songs/Мой ангел.mp3",
    cover: "covers/Together.png",
    lyrics: `
Здесь будет текст песни "Мой ангел"
`
  },
{
    id: 4,
    title: "Комета",
    artist: "MaDen",
    release: "2026-07-30",
    album: "Новый",
    available: true,
    audio: "songs/Комета.mp3",
    cover: "covers/Comet.png",
    lyrics: `
Здесь будет текст песни "Комета"
`
  },
{
    id: 3,
    title: "Сегодня мы считаем звёзды",
    artist: "MaDen",
    release: "2026-07-20",
    album: "Новая веха",
    available: true,
    audio: "songs/сегодня мы считаем звёзды.mp3",
    cover: "covers/IMG_3387.jpeg",
    lyrics: `
Здесь будет текст песни "Сегодня мы считаем звёзды"
`
  },
{
    id: 2,
    title: "История Любви",
    artist: "MaDen",
    release: "2026-07-10",
    album: "Новая веха",
    available: true,
    audio: "songs/История любви.mp3",
    cover: "covers/Screenshot_20260803-134440-display-0.png.png",
    lyrics: `
Здесь будет текст песни "История Любви"
`
  },
{
    id: 1,
    title: "Ты лилия (Nordic Remix)",
    artist: "MaDen",
    release: "2026-07-01",
    album: "Remixes",
    available: true,
    audio: "songs/ты лилия (nordic remix).mp3",
    cover: "covers/IMG_1576.jpeg",
    lyrics: `
Здесь будет текст песни "Ты лилия (Nordic Remix)"
`
  },
{
    id: 16,
    title: "Наша жизнь — это сила",
    artist: "MaDen",
    release: "2026-09-02",
    album: "Моя",
    available: true,
    audio: "songs/Наша жизнь — это сила.mp3",
    cover: "covers/moya.png",
    lyrics: `
Здесь будет текст песни "Наша жизнь — это сила"
`
},
{
    id: 41,
    title: "Ты лилия",
    artist: "MaDen",
    release: null,
    album: "Моя",
    available: false,
    audio: "songs/ты лилия.mp3",
    cover: "covers/moya.png",
    lyrics: `
Здесь будет текст песни "Ты лилия"
`
},
{
    id: 42,
    title: "Смыслом жизнь полна",
    artist: "MaDen",
    release: null,
    album: "Моя",
    available: false,
    audio: "songs/Смыслом жизнь полна.mp3",
    cover: "covers/moya.png",
    lyrics: `
Здесь будет текст песни "Смыслом жизнь полна"
`
},
{
    id: 43,
    title: "10.01",
    artist: "MaDen",
    release: null,
    album: "Моя",
    available: false,
    audio: "songs/10.01.mp3",
    cover: "covers/moya.png",
    lyrics: `
Здесь будет текст песни "10.01"
`
},
{
    id: 44,
    title: "Танец жизни",
    artist: "MaDen",
    release: null,
    album: "Новый",
    available: false,
    audio: "songs/Танец жизни.mp3",
    cover: "covers/novyi.png",
    lyrics: `
Здесь будет текст песни "Танец жизни"
`
},
{
    id: 45,
    title: "Взрыв далёкой звезды",
    artist: "MaDen",
    release: null,
    album: "Новый",
    available: false,
    audio: "songs/Взрыв далекой звезды.mp3",
    cover: "covers/novyi.png",
    lyrics: `
Здесь будет текст песни "Взрыв далёкой звезды"
`
},
{
    id: 46,
    title: "Целого мира мало",
    artist: "MaDen",
    release: null,
    album: "Новый",
    available: false,
    audio: "songs/Целого мира мало.mp3",
    cover: "covers/novyi.png",
    lyrics: `
Здесь будет текст песни "Целого мира мало"
`
},
{
    id: 47,
    title: "Моих желаний аромат",
    artist: "MaDen",
    release: null,
    album: "Новый",
    available: false,
    audio: "songs/Моих желаний аромат.mp3",
    cover: "covers/novyi.png",
    lyrics: `
Здесь будет текст песни "Моих желаний аромат"
`
},
{
    id: 48,
    title: "Петербург — город любви",
    artist: "MaDen",
    release: null,
    album: "Мой ангел",
    available: false,
    audio: "songs/Петербург — город любви.mp3",
    cover: "covers/My angel.PNG",
    lyrics: `
Здесь будет текст песни "Петербург — город любви"
`
},
{
    id: 49,
    title: "Когда мы вместе",
    artist: "MaDen",
    release: null,
    album: "Новая веха",
    available: false,
    audio: "songs/Когда мы вместе.mp3",
    cover: "covers/Novaya veha.png",
    lyrics: `
Здесь будет текст песни "Когда мы вместе"
`
},
{
    id: 50,
    title: "Гармония",
    artist: "MaDen",
    release: null,
    album: "Новая веха",
    available: false,
    audio: "songs/Гармония.mp3",
    cover: "covers/Novaya veha.png",
    lyrics: `
Здесь будет текст песни "Гармония"
`
},
{
    id: 51,
    title: "Ритмы Люмейя",
    artist: "MaDen",
     release: "2026-07-01",
    album: "Люмейя",
    available: true,
    audio: "songs/Ритмы Люмейя.mp3",
    cover: "covers/album_lumeya.jpeg",
    lyrics: `
Здесь будет текст песни "Ритмы Люмейя"
`
},
{
    id: 52,
    title: "Народ Люмейя",
    artist: "MaDen",
     release: "2026-07-01",
    album: "Люмейя",
    available: true,
    audio: "songs/Народ Люмейя.mp3",
    cover: "covers/album_lumeya.jpeg",
    lyrics: `
Здесь будет текст песни "Народ Люмейя"
`
},
{
    id: 53,
    title: "Lum",
    artist: "MaDen",
     release: "2026-07-01",
    album: "Люмейя",
    available: true,
    audio: "songs/Lum.mp3",
    cover: "covers/album_lumeya.jpeg",
    lyrics: `
Здесь будет текст песни "Lum"
`
},
{
    id: 54,
    title: "Soliah",
    artist: "MaDen",
    release: "2026-07-01",
    album: "Люмейя",
    available: true,
    audio: "songs/soliah.mp3",
    cover: "covers/album_lumeya.jpeg",
    lyrics: `
Здесь будет текст песни "Soliah"
`
},
{
    id: 55,
    title: "Одно сердце",
    artist: "MaDen",
    release: "2026-07-01",
    album: "Люмейя",
    available: true,
    audio: "songs/Одно сердце.mp3",
    cover: "covers/album_lumeya.jpeg",
    lyrics: `
Здесь будет текст песни "Одно сердце"
`
}
];
