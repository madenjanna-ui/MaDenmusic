// =========================
// MaDenMusic 2.0
// =========================

const newSongs = document.getElementById("newSongs");
const songList = document.getElementById("songList");

const search = document.getElementById("search");

const homePage = document.getElementById("homePage");
const catalogPage = document.getElementById("catalogPage");

const showAllSongs = document.getElementById("showAllSongs");
const backHome = document.getElementById("backHome");

const sortSongs = document.getElementById("sortSongs");

// ===== Плеер =====

const player = document.getElementById("player");

const audio = document.getElementById("audio");

const cover = document.getElementById("cover");

const songTitle = document.getElementById("songTitle");

const songArtist = document.getElementById("songArtist");

const lyrics = document.getElementById("lyrics");

const playBtn = document.getElementById("play");

const prevBtn = document.getElementById("prev");

const nextBtn = document.getElementById("next");

const closePlayer = document.getElementById("closePlayer");

const progress = document.getElementById("progress");

const currentTime = document.getElementById("currentTime");

const duration = document.getElementById("duration");

let currentSong = 0;

let playing = false;
// =========================
// Открытие песни
// =========================

function openSong(index, autoPlay = false){

    currentSong = index;

    const song = songs[index];

    cover.src = song.cover;

    songTitle.textContent = song.title;

    songArtist.textContent = song.artist;

    lyrics.textContent = song.lyrics;

    audio.pause();

    audio.src = song.audio;

    audio.load();

    progress.value = 0;

    currentTime.textContent = "0:00";

    duration.textContent = "0:00";

    playBtn.textContent = "▶️";

    playing = false;

    player.classList.remove("hidden");
    
    if (autoPlay) {

    audio.play();

    playing = true;

    playBtn.textContent = "⏸";

}
}

// =========================
// Карточка песни
// =========================

function createSongCard(song,index){

    const card = document.createElement("div");

    card.className = "song";

    card.innerHTML = `

        <img src="${song.cover}" alt="">

        <div class="info">

            <h2>${song.title}</h2>

            <p>${song.artist}</p>

        </div>

        <div class="playIcon">▶️</div>

    `;

    card.onclick = ()=>{

        openSong(index);

    };

    return card;

}

// =========================
// Рендер списка
// =========================

function renderSongs(list,container){

    container.innerHTML = "";

    list.forEach(song=>{

        const index = songs.findIndex(s=>s.id===song.id);

        container.appendChild(

            createSongCard(song,index)

        );

    });

}
// =========================
// Новые релизы
// =========================

function getNewSongs(){

    const now = new Date();

    return songs.filter(song=>{

        if(!song.release){

            return false;

        }

        const release = new Date(song.release);

        const days =

        (now-release)/(1000*60*60*24);

        return days<=14;

    });

}

// =========================
// Главная
// =========================

function renderHome(){

    renderSongs(

        getNewSongs(),

        newSongs

    );

}

// =========================
// Каталог
// =========================

function renderCatalog(){

    let list=[...songs];

    switch(sortSongs.value){

        case "old":

            list.sort((a,b)=>

                new Date(a.release)-

                new Date(b.release)

            );

            break;

        case "name":

            list.sort((a,b)=>

                a.title.localeCompare(

                    b.title,

                    "ru"

                )

            );

            break;

        default:

            list.sort((a,b)=>

                new Date(b.release)-

                new Date(a.release)

            );

    }

    renderSongs(

        list,

        songList

    );

}

// =========================
// Переходы
// =========================

showAllSongs.onclick=()=>{

    homePage.classList.add("hiddenPage");

    catalogPage.classList.remove(

        "hiddenPage"

    );

    renderCatalog();

};

backHome.onclick=()=>{

    catalogPage.classList.add(

        "hiddenPage"

    );

    homePage.classList.remove(

        "hiddenPage"

    );

};

// =========================
// Поиск
// =========================

search.oninput=()=>{

    const value=

    search.value.toLowerCase();

    const filtered=songs.filter(song=>

        song.title.toLowerCase().includes(value) ||

        song.artist.toLowerCase().includes(value)

    );

    renderSongs(filtered,songList);

};

sortSongs.onchange=renderCatalog;

// =========================
// Первый запуск
// =========================

// =========================
// Воспроизведение
// =========================

playBtn.onclick = () => {

    if (playing) {

        audio.pause();

        playBtn.textContent = "▶️";

        playing = false;

    } else {

        audio.play();

        playBtn.textContent = "⏸";

        playing = true;

    }

};

// =========================
// Следующая песня
// =========================

nextBtn.onclick = () => {

    currentSong++;

    if (currentSong >= songs.length) {

        currentSong = 0;

    }

    openSong(currentSong);

};

// =========================
// Предыдущая песня
// =========================

prevBtn.onclick = () => {

    currentSong--;

    if (currentSong < 0) {

        currentSong = songs.length - 1;

    }

    openSong(currentSong);

};

// =========================
// Закрыть плеер
// =========================

closePlayer.onclick = () => {

    audio.pause();

    playing = false;

    playBtn.textContent = "▶️";

    player.classList.add("hidden");

};

// =========================
// Конец песни
// =========================

audio.onended = () => {

    currentSong++;

    if (currentSong >= songs.length) {

        currentSong = 0;

    }

    openSong(currentSong, true);

};
// =========================
// Загрузка длительности
// =========================

audio.addEventListener("loadedmetadata", () => {

    progress.max = Math.floor(audio.duration);

    duration.textContent = formatTime(audio.duration);

});

// =========================
// Во время воспроизведения
// =========================

audio.addEventListener("timeupdate", () => {

    progress.value = Math.floor(audio.currentTime);

    currentTime.textContent = formatTime(audio.currentTime);

});

// =========================
// Перемотка
// =========================

progress.addEventListener("input", () => {

    audio.currentTime = progress.value;

});

// =========================
// Формат времени
// =========================

function formatTime(sec) {

    if (isNaN(sec)) return "0:00";

    const min = Math.floor(sec / 60);

    const seconds = Math.floor(sec % 60);

    return `${min}:${seconds.toString().padStart(2, "0")}`;

}
// =========================
// Автоматическое обновление
// =========================

audio.addEventListener("play", () => {

    playing = true;

    playBtn.textContent = "⏸";

});

audio.addEventListener("pause", () => {

    playing = false;

    playBtn.textContent = "▶️";

});

// =========================
// Обновление поиска
// =========================

search.addEventListener("focus", () => {

    if (!catalogPage.classList.contains("hiddenPage")) {

        renderCatalog();

    }

});

// =========================
// Первый запуск
// =========================

window.addEventListener("load", () => {

    renderHome();

    renderCatalog();

    player.classList.add("hidden");

});
