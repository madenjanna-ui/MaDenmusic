// =========================
// MaDenMusic 2.1
// =========================

const newSongs = document.getElementById("newSongs");
const songList = document.getElementById("songList");
const search = document.getElementById("search");
const homePage = document.getElementById("homePage");
const catalogPage = document.getElementById("catalogPage");
const showAllSongs = document.getElementById("showAllSongs");
const backHome = document.getElementById("backHome");
const sortSongs = document.getElementById("sortSongs");
const favoritesFilter = document.getElementById("favoritesFilter");
const catalogCount = document.getElementById("catalogCount");

const player = document.getElementById("player");
const audio = document.getElementById("audio");
const cover = document.getElementById("cover");
const songTitle = document.getElementById("songTitle");
const songArtist = document.getElementById("songArtist");
const lyrics = document.getElementById("lyrics");
const playBtn = document.getElementById("play");
const playIcon = document.getElementById("playIcon");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const closePlayer = document.getElementById("closePlayer");
const favoritePlayer = document.getElementById("favoritePlayer");
const shuffleBtn = document.getElementById("shuffle");
const repeatBtn = document.getElementById("repeat");
const repeatBadge = document.getElementById("repeatBadge");
const progress = document.getElementById("progress");
const currentTime = document.getElementById("currentTime");
const duration = document.getElementById("duration");
const toast = document.getElementById("toast");

let currentSong = 0;

// =========================
// Мини-плеер
// =========================

const miniPlayer = document.getElementById("miniPlayer");
const miniCover = document.getElementById("miniCover");
const miniTitle = document.getElementById("miniTitle");
const miniArtist = document.getElementById("miniArtist");
const miniPlay = document.getElementById("miniPlay");
const miniOpen = document.getElementById("miniOpen");

function updateMiniPlayer(){
    if (!songs[currentSong] || !miniPlayer) return;

    const song = songs[currentSong];

    miniCover.src = song.cover;
    miniTitle.textContent = song.title;
    miniArtist.textContent = song.artist || "MaDen";

    miniPlayer.classList.remove("hidden-mini");

    miniPlay.textContent = audio.paused ? "▶" : "⏸";
}

miniPlay.addEventListener("click", (event) => {
    event.stopPropagation();

    if (audio.paused) {
        audio.play();
    } else {
        audio.pause();
    }
});

miniOpen.addEventListener("click", (event) => {
    event.stopPropagation();

    player.classList.remove("hidden");
    updateMiniPlayer();
});

miniPlayer.addEventListener("click", () => {
    player.classList.remove("hidden");
});

let playing = false;
let shuffleMode = localStorage.getItem("madenmusic_shuffle") === "true";
let repeatMode = localStorage.getItem("madenmusic_repeat") || "off";
let favoritesOnly = false;
let playHistory = [];
let toastTimer = null;

const FAVORITES_KEY = "madenmusic_favorites";

function getFavorites(){
    try { return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || []; }
    catch { return []; }
}

function saveFavorites(list){
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(list));
}

function isFavorite(id){
    return getFavorites().includes(id);
}

function showToast(message){
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 1800);
}

function toggleFavorite(id){
    const favorites = getFavorites();
    const index = favorites.indexOf(id);

    if(index === -1){
        favorites.push(id);
        showToast("♥ Добавлено в любимые");
    } else {
        favorites.splice(index, 1);
        showToast("♡ Убрано из любимых");
    }

    saveFavorites(favorites);
    renderHome();
    if(!catalogPage.classList.contains("hiddenPage")) renderCatalog();
    updatePlayerFavorite();
}

function heartSVG(){
    return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 8.6c0 5-8.8 10-8.8 10s-8.8-5-8.8-10A4.6 4.6 0 0 1 12 5.7a4.6 4.6 0 0 1 8.8 2.9Z"/></svg>`;
}

function playSVG(){
    return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>`;
}

function createSongCard(song,index){
    const card = document.createElement("div");
    card.className = "song";

    const favoriteClass = isFavorite(song.id) ? "active" : "";
    const releaseText = song.release ? new Date(song.release + "T00:00:00").toLocaleDateString("ru-RU", {day:"numeric",month:"long"}) : "";

    card.innerHTML = `
        <img src="${song.cover}" alt="Обложка: ${song.title}" loading="lazy">
        <div class="info">
            <h2>${song.title}</h2>
            <p>${song.artist}</p>
            ${releaseText ? `<div class="songDate">${releaseText}</div>` : ""}
        </div>
        <button class="heartButton ${favoriteClass}" type="button" aria-label="Любимая песня">${heartSVG()}</button>
        <div class="playIcon" aria-hidden="true">${playSVG()}</div>
    `;

    card.addEventListener("click", () => openSong(index));

    card.querySelector(".heartButton").addEventListener("click", (event) => {
        event.stopPropagation();
        toggleFavorite(song.id);
    });

    return card;
}

function renderSongs(list, container){
    container.innerHTML = "";

    if(!list.length){
        container.innerHTML = `<div class="emptyState">Пока здесь ничего нет</div>`;
        return;
    }

    list.forEach(song => {
        const index = songs.findIndex(item => item.id === song.id);
        container.appendChild(createSongCard(song,index));
    });
}

function getNewSongs(){
    const now = new Date();
    return songs.filter(song => {
        if(!song.release) return false;
        const release = new Date(song.release + "T00:00:00");
        const days = (now - release) / 86400000;
        return days >= -1 && days <= 14;
    }).sort((a,b) => new Date(b.release) - new Date(a.release));
}

function renderHome(){
    renderSongs(getNewSongs(), newSongs);
}

function getCatalogSongs(){
    let list = [...songs];

    if(favoritesOnly){
        list = list.filter(song => isFavorite(song.id));
    }

    const query = search.value.trim().toLowerCase();
    if(query){
        list = list.filter(song =>
            song.title.toLowerCase().includes(query) ||
            song.artist.toLowerCase().includes(query)
        );
    }

    switch(sortSongs.value){
        case "old":
            list.sort((a,b) => new Date(a.release || 0) - new Date(b.release || 0));
            break;
        case "name":
            list.sort((a,b) => a.title.localeCompare(b.title,"ru"));
            break;
        default:
            list.sort((a,b) => new Date(b.release || 0) - new Date(a.release || 0));
    }

    return list;
}

function renderCatalog(){
    const list = getCatalogSongs();
    renderSongs(list, songList);
    catalogCount.textContent = `${list.length} ${list.length === 1 ? "песня" : "песен"}`;
}

function openCatalog(){
    homePage.classList.add("hiddenPage");
    catalogPage.classList.remove("hiddenPage");
    renderCatalog();
}

showAllSongs.addEventListener("click", openCatalog);

backHome.addEventListener("click", () => {
    catalogPage.classList.add("hiddenPage");
    homePage.classList.remove("hiddenPage");
    renderHome();
});

search.addEventListener("input", () => {
    if(catalogPage.classList.contains("hiddenPage")) openCatalog();
    else renderCatalog();
});

sortSongs.addEventListener("change", renderCatalog);

favoritesFilter.addEventListener("click", () => {
    favoritesOnly = !favoritesOnly;
    favoritesFilter.classList.toggle("active", favoritesOnly);
    favoritesFilter.textContent = favoritesOnly ? "♥ Любимые" : "♡ Любимые";
    renderCatalog();
});

function updatePlayerFavorite(){
    const song = songs[currentSong];
    if(!song) return;
    const active = isFavorite(song.id);
    favoritePlayer.classList.toggle("active", active);
    favoritePlayer.textContent = active ? "♥" : "♡";
}

function setPlayerBackground(song){
    player.style.setProperty("--player-bg", `url("${CSS.escape(song.cover)}")`);
}

function openSong(index, autoPlay = false){
    if(!songs[index]) return;

    currentSong = index;
    const song = songs[index];

    cover.src = song.cover;
    cover.alt = `Обложка: ${song.title}`;
    songTitle.textContent = song.title;
    songArtist.textContent = song.artist;
    lyrics.textContent = song.lyrics || "";
    setPlayerBackground(song);
    updatePlayerFavorite();

    audio.pause();
    audio.src = song.audio;
    audio.load();

    progress.value = 0;
    currentTime.textContent = "0:00";
    duration.textContent = "0:00";
    setPlayIcon(false);
    setCoverPlaying(false);

    player.classList.remove("hidden");

    if(autoPlay){
        const promise = audio.play();
        if(promise) promise.catch(() => {});
    }
}

function setCoverPlaying(isPlaying){
    cover.classList.toggle("playing", isPlaying);
}

function setPlayIcon(isPlaying){
    playIcon.innerHTML = isPlaying
        ? `<path d="M7 5h3v14H7zM14 5h3v14h-3z"/>`
        : `<path d="M8 5v14l11-7z"/>`;
    playBtn.setAttribute("aria-label", isPlaying ? "Пауза" : "Воспроизвести");
}

playBtn.addEventListener("click", () => {
    if(!audio.src) return;
    if(audio.paused){
        const promise = audio.play();
        if(promise) promise.catch(() => {});
    } else {
        audio.pause();
    }
});

function getNextIndex(){
    if(repeatMode === "one") return currentSong;

    if(shuffleMode){
        const candidates = songs.map((_,i) => i).filter(i => i !== currentSong && !playHistory.includes(i));
        const pool = candidates.length ? candidates : songs.map((_,i) => i).filter(i => i !== currentSong);
        if(!pool.length) return currentSong;
        const index = pool[Math.floor(Math.random() * pool.length)];
        playHistory.push(index);
        if(playHistory.length >= songs.length) playHistory = [index];
        return index;
    }

    const next = currentSong + 1;
    if(next >= songs.length) return repeatMode === "all" ? 0 : 0;
    return next;
}

function getPrevIndex(){
    if(shuffleMode && playHistory.length > 1){
        playHistory.pop();
        return playHistory[playHistory.length - 1] ?? 0;
    }
    return currentSong <= 0 ? songs.length - 1 : currentSong - 1;
}

nextBtn.addEventListener("click", () => {
    const wasPlaying = !audio.paused && !audio.ended;
    openSong(getNextIndex(), wasPlaying);
});

prevBtn.addEventListener("click", () => {
    const wasPlaying = !audio.paused && !audio.ended;
    openSong(getPrevIndex(), wasPlaying);
});

closePlayer.addEventListener("click", () => {
    audio.pause();
    player.classList.add("hidden");
    miniPlayer.classList.add("hidden-mini");
});

favoritePlayer.addEventListener("click", () => toggleFavorite(songs[currentSong].id));

shuffleBtn.addEventListener("click", () => {
    shuffleMode = !shuffleMode;
    playHistory = [currentSong];
    localStorage.setItem("madenmusic_shuffle", shuffleMode);
    shuffleBtn.classList.toggle("active", shuffleMode);
    showToast(shuffleMode ? "🔀 Случайное воспроизведение включено" : "Порядок воспроизведения обычный");
});

repeatBtn.addEventListener("click", () => {
    if(repeatMode === "off") repeatMode = "all";
    else if(repeatMode === "all") repeatMode = "one";
    else repeatMode = "off";
    localStorage.setItem("madenmusic_repeat", repeatMode);
    updateRepeatButton();
});

function updateRepeatButton(){
    repeatBtn.classList.toggle("active", repeatMode !== "off");
    repeatBadge.textContent = repeatMode === "one" ? "1" : "";
    repeatBtn.title = repeatMode === "off" ? "Повтор выключен" : repeatMode === "all" ? "Повтор списка" : "Повтор песни";
}

audio.addEventListener("ended", () => {
    openSong(getNextIndex(), true);
});

audio.addEventListener("play", () => {
    playing = true;
    setPlayIcon(true);
    setCoverPlaying(true);
});

audio.addEventListener("pause", () => {
    playing = false;
    setPlayIcon(false);
    setCoverPlaying(false);
});

audio.addEventListener("loadedmetadata", () => {
    progress.max = Math.floor(audio.duration) || 0;
    duration.textContent = formatTime(audio.duration);
});

audio.addEventListener("timeupdate", () => {
    progress.value = Math.floor(audio.currentTime) || 0;
    currentTime.textContent = formatTime(audio.currentTime);
});

progress.addEventListener("input", () => {
    audio.currentTime = Number(progress.value);
});

function formatTime(sec){
    if(!Number.isFinite(sec)) return "0:00";
    const min = Math.floor(sec / 60);
    const seconds = Math.floor(sec % 60);
    return `${min}:${seconds.toString().padStart(2,"0")}`;
}

shuffleBtn.classList.toggle("active", shuffleMode);
updateRepeatButton();
renderHome();
renderCatalog();
player.classList.add("hidden");
