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
const title = document.getElementById("title");
const artist = document.getElementById("artist");
const lyrics = document.getElementById("lyrics");

let currentSong = 0;


// ===============================
// Создание карточек
// ===============================

function renderSongs(list = songs) {

    songList.innerHTML = "";

    list.forEach((song) => {

        const card = document.createElement("div");

        card.className = "song";

        card.innerHTML = `
            <img src="${song.cover}" alt="${song.title}">

            <div class="song-info">
                <div class="song-title">${song.title}</div>
                <div class="song-duration">${song.duration}</div>
            </div>
        `;

        card.addEventListener("click", () => {

            const realIndex = songs.findIndex(s => s.id === song.id);

            openSong(realIndex);

        });

        songList.appendChild(card);

    });

}



// ===============================
// Поиск
// ===============================

search.addEventListener("input", () => {

    const value = search.value.toLowerCase().trim();

    const filtered = songs.filter(song =>

        song.title.toLowerCase().includes(value) ||

        song.artist.toLowerCase().includes(value) ||

        song.category.toLowerCase().includes(value)

    );

    renderSongs(filtered);

});



// ===============================
// Открыть песню
// ===============================

async function openSong(index) {

    currentSong = index;

    const song = songs[index];

    cover.src = song.cover;

    title.textContent = song.title;

    artist.textContent = song.artist;

    audio.src = song.audio;

    player.classList.remove("hidden");

    try {

        const response = await fetch(song.lyrics);

        lyrics.textContent = await response.text();

    } catch {

        lyrics.textContent = "Текст песни пока отсутствует.";

    }

}
// ===============================
// Элементы управления
// ===============================

const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

const progress = document.getElementById("progress");

const currentTimeLabel = document.getElementById("current");
const durationLabel = document.getElementById("duration");


// ===============================
// Play / Pause
// ===============================

playBtn.addEventListener("click", () => {

    if (audio.paused) {

        audio.play();

    } else {

        audio.pause();

    }

});

audio.addEventListener("play", () => {

    playBtn.textContent = "⏸";

    player.classList.add("playing");

});

audio.addEventListener("pause", () => {

    playBtn.textContent = "▶";

    player.classList.remove("playing");

});


// ===============================
// Следующая песня
// ===============================

nextBtn.addEventListener("click", () => {

    currentSong++;

    if (currentSong >= songs.length) {

        currentSong = 0;

    }

    openSong(currentSong);

    audio.play();

});


// ===============================
// Предыдущая песня
// ===============================

prevBtn.addEventListener("click", () => {

    currentSong--;

    if (currentSong < 0) {

        currentSong = songs.length - 1;

    }

    openSong(currentSong);

    audio.play();

});


// ===============================
// Прогресс
// ===============================

audio.addEventListener("timeupdate", () => {

    if (!audio.duration) return;

    progress.value =

        (audio.currentTime / audio.duration) * 100;

    currentTimeLabel.textContent =

        formatTime(audio.currentTime);

});

audio.addEventListener("loadedmetadata", () => {

    durationLabel.textContent =

        formatTime(audio.duration);

});

progress.addEventListener("input", () => {

    if (!audio.duration) return;

    audio.currentTime =

        (progress.value / 100) * audio.duration;

});


// ===============================
// Формат времени
// ===============================

function formatTime(seconds) {

    const min = Math.floor(seconds / 60);

    const sec = Math.floor(seconds % 60);

    return `${min}:${sec.toString().padStart(2, "0")}`;

}
// ===============================
// Закрыть плеер
// ===============================

const closePlayer = document.getElementById("closePlayer");

closePlayer.addEventListener("click", () => {

    audio.pause();

    player.classList.add("hidden");

});


// ===============================
// Следующая песня автоматически
// ===============================

audio.addEventListener("ended", () => {

    currentSong++;

    if(currentSong >= songs.length){

        currentSong = 0;

    }

    openSong(currentSong);

    audio.play();

});


// ===============================
// Запуск приложения
// ===============================

renderSongs();


// ===============================
// Горячие клавиши
// ===============================

document.addEventListener("keydown",(e)=>{

    if(e.code==="Space"){

        e.preventDefault();

        playBtn.click();

    }

    if(e.code==="ArrowRight"){

        nextBtn.click();

    }

    if(e.code==="ArrowLeft"){

        prevBtn.click();

    }

});


// ===============================
// Приветствие
// ===============================

console.log("🎵 MaDenMusic запущен");