// ===============================
// MaDenMusic
// app.js
// Часть 1
// ===============================

const songList = document.getElementById("songList");
const search = document.getElementById("search");

const player = document.getElementById("player");

const audio = document.getElementById("audio");

const cover = document.getElementById("cover");
const songTitle = document.getElementById("songTitle");
const songArtist = document.getElementById("songArtist");
const lyrics = document.getElementById("lyrics");

const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

const closeBtn = document.getElementById("closePlayer");

const progress = document.getElementById("progress");

const currentTime = document.getElementById("currentTime");
const duration = document.getElementById("duration");


let currentSong = 0;


// =====================================
// Создание карточек
// =====================================

function renderSongs(list = songs){

    songList.innerHTML = "";

    list.forEach(song=>{

        const card = document.createElement("div");

        card.className = "song";

        card.innerHTML = `

        <img src="${song.cover}" alt="">

        <div class="info">

            <h2>${song.title}</h2>

            <p>${song.artist}</p>

        </div>

        <div class="playIcon">

            ▶

        </div>

        `;

        card.addEventListener("click",()=>{

            const index = songs.findIndex(s=>s.id===song.id);

            openSong(index);

        });

        songList.appendChild(card);

    });

}


// =====================================
// Поиск
// =====================================

search.addEventListener("input",()=>{

    const value = search.value
    .toLowerCase()
    .trim();

    const filtered = songs.filter(song=>

        song.title
        .toLowerCase()
        .includes(value)

    );

    renderSongs(filtered);

});


// =====================================
// Открыть песню
// =====================================

function openSong(index){

    currentSong = index;

    const song = songs[index];

    cover.src = song.cover;

    songTitle.textContent = song.title;

    songArtist.textContent = song.artist;

    lyrics.textContent = song.lyrics;

    audio.src = song.audio;

    player.classList.remove("hidden");

}

// =====================================
// Play / Pause
// =====================================

playBtn.addEventListener("click", () => {

    if (audio.paused) {

        audio.play();

    } else {

        audio.pause();

    }

});

audio.addEventListener("play", () => {

    playBtn.textContent = "⏸";

});

audio.addEventListener("pause", () => {

    playBtn.textContent = "▶";

});


// =====================================
// Следующая песня
// =====================================

nextBtn.addEventListener("click", () => {

    currentSong++;

    if (currentSong >= songs.length) {

        currentSong = 0;

    }

    openSong(currentSong);

    audio.play();

});


// =====================================
// Предыдущая песня
// =====================================

prevBtn.addEventListener("click", () => {

    currentSong--;

    if (currentSong < 0) {

        currentSong = songs.length - 1;

    }

    openSong(currentSong);

    audio.play();

});


// =====================================
// Закрыть плеер
// =====================================

closeBtn.addEventListener("click", () => {

    audio.pause();

    player.classList.add("hidden");

});


// =====================================
// Формат времени
// =====================================

function formatTime(seconds) {

    if (isNaN(seconds)) return "0:00";

    const min = Math.floor(seconds / 60);

    const sec = Math.floor(seconds % 60);

    return `${min}:${sec.toString().padStart(2, "0")}`;

}

// =====================================
// Обновление прогресса
// =====================================

audio.addEventListener("timeupdate", () => {

    if (!audio.duration) return;

    progress.value =
        (audio.currentTime / audio.duration) * 100;

    currentTime.textContent =
        formatTime(audio.currentTime);

});


// =====================================
// Когда песня загрузилась
// =====================================

audio.addEventListener("loadedmetadata", () => {

    duration.textContent =
        formatTime(audio.duration);

});


// =====================================
// Перемотка
// =====================================

progress.addEventListener("input", () => {

    if (!audio.duration) return;

    audio.currentTime =
        (progress.value / 100) * audio.duration;

});


// =====================================
// Следующая песня после окончания
// =====================================

audio.addEventListener("ended", () => {

    currentSong++;

    if (currentSong >= songs.length) {

        currentSong = 0;

    }

    openSong(currentSong);

    audio.play();

});


// =====================================
// Запуск приложения
// =====================================

renderSongs();


// =====================================
// Горячие клавиши
// =====================================

document.addEventListener("keydown", (e) => {

    if (e.code === "Space") {

        e.preventDefault();

        playBtn.click();

    }

    if (e.code === "ArrowRight") {

        nextBtn.click();

    }

    if (e.code === "ArrowLeft") {

        prevBtn.click();

    }

});


console.log("🎵 MaDenMusic готов к работе");
