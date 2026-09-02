// MaDenMusic 2.7 — controlled player and interface update
"use strict";

const $ = (id) => document.getElementById(id);

const newSongs = $("newSongs");
const songList = $("songList");
const albumsHome = $("albumsHome");
const albumsList = $("albumsList");
const albumSongList = $("albumSongList");
const search = $("search");
const sortSongs = $("sortSongs");
const catalogLabel = $("catalogLabel");
const catalogCount = $("catalogCount");

const homePage = $("homePage");
const catalogPage = $("catalogPage");
const albumCatalogPage = $("albumCatalogPage");
const albumPage = $("albumPage");
const pages = [homePage, catalogPage, albumCatalogPage, albumPage];

const songsTab = $("songsTab");
const allSongsTab = $("allSongsTab");
const albumsTab = $("albumsTab");
const favoritesTab = $("favoritesTab");
const tabs = [songsTab, allSongsTab, albumsTab, favoritesTab];

const albumHeroCover = $("albumHeroCover");
const albumTitle = $("albumTitle");
const albumSubtitle = $("albumSubtitle");
const playAlbum = $("playAlbum");
const lumeyaWelcome = $("lumeyaWelcome");
const lumeyaEnter = $("lumeyaEnter");
const lumeyaInside = $("lumeyaInside");

const player = $("player");
const audio = $("audio");
const cover = $("cover");
const playerBg = document.querySelector(".player-bg");
const songTitle = $("songTitle");
const songArtist = $("songArtist");
const playBtn = $("play");
const playIcon = $("playIcon");
const prevBtn = $("prev");
const nextBtn = $("next");
const closePlayer = $("closePlayer");
const favoritePlayer = $("favoritePlayer");
const shuffleBtn = $("shuffle");
const repeatBtn = $("repeat");
const repeatBadge = $("repeatBadge");
const progress = $("progress");
const currentTime = $("currentTime");
const duration = $("duration");
const wordsBtn = $("wordsBtn");
const lyricsView = $("lyricsView");
const closeLyrics = $("closeLyrics");
const lyricsViewTitle = $("lyricsViewTitle");
const lyricsViewText = $("lyricsViewText");
const toast = $("toast");

const miniPlayer = $("miniPlayer");
const miniCover = $("miniCover");
const miniTitle = $("miniTitle");
const miniArtist = $("miniArtist");
const miniEqualizer = $("miniEqualizer");
const miniPlay = $("miniPlay");
const miniOpen = $("miniOpen");

const FAVORITES_KEY = "madenmusic_favorites";
const SHUFFLE_KEY = "madenmusic_shuffle";
const REPEAT_KEY = "madenmusic_repeat";
const LUMEYA_ALBUM = "Люмейя";

const ALBUM_COVERS = {
    "Моя": "covers/moya.png",
    "Новый": "covers/novyi.png",
    "Мой ангел": "covers/My angel.PNG",
    "Новая веха": "covers/Novaya veha.png",
    "Remixes": "covers/Remixes.png",
    "Люмейя": "covers/album_lumeya.jpeg"
};

let currentSong = -1;
let currentAlbum = null;
let favoritesOnly = false;
let lumeyaEntered = false;
let toastTimer = null;
let shuffleMode = localStorage.getItem(SHUFFLE_KEY) === "true";
let repeatMode = localStorage.getItem(REPEAT_KEY) || "off";
let currentQueue = [];
let shuffleBag = [];
let shuffleHistory = [];
let shuffleCursor = -1;
let mediaPositionUpdatedAt = 0;
const lyricsCache = new Map();

function getFavorites(){
    try{
        const stored = JSON.parse(localStorage.getItem(FAVORITES_KEY));
        return Array.isArray(stored) ? stored : [];
    }catch{
        return [];
    }
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
    toastTimer = setTimeout(() => toast.classList.remove("show"), 1900);
}

function escapeHTML(value){
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function heartSVG(){
    return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 8.6c0 5-8.8 10-8.8 10s-8.8-5-8.8-10A4.6 4.6 0 0 1 12 5.7a4.6 4.6 0 0 1 8.8 2.9Z"/></svg>`;
}

function playSVG(){
    return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>`;
}

function isPlayable(song){
    return Boolean(song && song.available !== false && song.audio);
}

function songIndex(song){
    return songs.findIndex((item) => item.id === song.id);
}

function playableIndices(list = songs){
    return list.map(songIndex).filter((index) => index >= 0 && isPlayable(songs[index]));
}

function albumNames(){
    if(typeof albumOrder !== "undefined" && Array.isArray(albumOrder)){
        return [...albumOrder];
    }

    return [...new Set(songs.map((song) => song.album).filter(Boolean))];
}

function albumDetails(name){
    const metadata = typeof albumMeta !== "undefined" ? albumMeta[name] : null;
    return {
        cover: ALBUM_COVERS[name] || metadata?.cover || songs.find((song) => song.album === name)?.cover || "",
        subtitle: metadata?.subtitle || `${songs.filter((song) => song.album === name).length} композиций`
    };
}

function albumSongs(name){
    return songs.filter((song) => song.album === name);
}

function toggleFavorite(id){
    const favorites = getFavorites();
    const index = favorites.indexOf(id);

    if(index === -1){
        favorites.push(id);
        showToast("♥ Добавлено в любимые");
    }else{
        favorites.splice(index, 1);
        showToast("♡ Убрано из любимых");
    }

    saveFavorites(favorites);
    updatePlayerFavorite();
    refreshVisibleContent();
}

function createSongCard(song, queue, showAvailability = true){
    const index = songIndex(song);
    const card = document.createElement("div");
    const available = isPlayable(song);
    const releaseText = song.release
        ? new Date(`${song.release}T00:00:00`).toLocaleDateString("ru-RU", {day: "numeric", month: "long"})
        : "";

    card.className = `song${available ? "" : " unavailable"}`;
    card.innerHTML = `
        <img src="${escapeHTML(song.cover)}" alt="Обложка: ${escapeHTML(song.title)}" loading="lazy">
        <div class="info">
            <h2>${escapeHTML(song.title)}</h2>
            <p>${escapeHTML(song.artist || "MaDen")}</p>
            ${releaseText ? `<div class="songDate">${escapeHTML(releaseText)}</div>` : ""}
            ${showAvailability && !available ? '<span class="availability">Скоро будет</span>' : ""}
        </div>
        <button class="heartButton ${isFavorite(song.id) ? "active" : ""}" type="button" aria-label="${isFavorite(song.id) ? "Убрать из любимых" : "Добавить в любимые"}">${heartSVG()}</button>
        <div class="playIcon" aria-hidden="true">${currentSong === index && !audio.paused ? "▮▮" : playSVG()}</div>
    `;

    card.addEventListener("click", () => {
        if(!available){
            showToast("🎵 Скоро будет");
            return;
        }

        openSong(index, !audio.paused && !audio.ended, queue);
    });

    card.querySelector(".heartButton").addEventListener("click", (event) => {
        event.stopPropagation();
        toggleFavorite(song.id);
    });

    return card;
}

function renderSongs(list, container, queue = playableIndices(list), showAvailability = true){
    container.replaceChildren();

    if(!list.length){
        container.innerHTML = '<div class="emptyState">Пока здесь ничего нет</div>';
        return;
    }

    list.forEach((song) => container.appendChild(createSongCard(song, queue, showAvailability)));
}

function getNewSongs(){
    const now = new Date();

    return songs
        .filter((song) => {
            if(!song.release) return false;
            const release = new Date(`${song.release}T00:00:00`);
            const days = (now - release) / 86400000;
            return days >= -1 && days <= 14;
        })
        .sort((a, b) => new Date(b.release) - new Date(a.release));
}

function renderHome(){
    const allPlayable = playableIndices(songs);
    renderSongs(getNewSongs().filter(isPlayable), newSongs, allPlayable, false);
    renderAlbumGrid(albumsHome);
}

function getCatalogSongs(){
    let list = [...songs];

    if(favoritesOnly){
        list = list.filter((song) => isFavorite(song.id));
    }

    const query = search.value.trim().toLocaleLowerCase("ru");
    if(query){
        list = list.filter((song) =>
            song.title.toLocaleLowerCase("ru").includes(query) ||
            (song.artist || "MaDen").toLocaleLowerCase("ru").includes(query) ||
            (song.album || "").toLocaleLowerCase("ru").includes(query)
        );
    }

    if(sortSongs.value === "old"){
        list.sort((a, b) => new Date(a.release || 0) - new Date(b.release || 0));
    }else if(sortSongs.value === "name"){
        list.sort((a, b) => a.title.localeCompare(b.title, "ru"));
    }else{
        list.sort((a, b) => new Date(b.release || 0) - new Date(a.release || 0));
    }

    return list;
}

function renderCatalog(){
    const list = getCatalogSongs();
    const queue = playableIndices(list);
    renderSongs(list, songList, queue, true);
    catalogLabel.textContent = favoritesOnly ? "Любимые песни" : "Все песни";
    catalogCount.textContent = `${list.length} ${list.length === 1 ? "песня" : "песен"}`;
}

function createAlbumCard(name){
    const details = albumDetails(name);
    const count = albumSongs(name).length;
    const button = document.createElement("button");
    button.className = "album-card";
    button.type = "button";
    button.innerHTML = `
        <div class="album-art"><img src="${escapeHTML(details.cover)}" alt="Альбом ${escapeHTML(name)}" loading="lazy"><span class="album-count">${count}</span></div>
        <div class="album-name">${escapeHTML(name)}</div>
        <div class="album-sub">${escapeHTML(details.subtitle)}</div>
    `;
    button.addEventListener("click", () => openAlbum(name));
    return button;
}

function renderAlbumGrid(container){
    container.replaceChildren();
    albumNames().forEach((name) => container.appendChild(createAlbumCard(name)));
}

function showPage(page){
    pages.forEach((item) => item.classList.toggle("hiddenPage", item !== page));
}

function activateTab(tab){
    tabs.forEach((item) => item.classList.toggle("active", item === tab));
}

function showHome(){
    currentAlbum = null;
    favoritesOnly = false;
    search.value = "";
    showPage(homePage);
    activateTab(songsTab);
    renderHome();
}

function openCatalog(showFavorites = false){
    currentAlbum = null;
    favoritesOnly = showFavorites;
    showPage(catalogPage);
    activateTab(showFavorites ? favoritesTab : allSongsTab);
    renderCatalog();
}

function openAlbums(){
    currentAlbum = null;
    showPage(albumCatalogPage);
    activateTab(albumsTab);
    renderAlbumGrid(albumsList);
}

function openAlbum(name){
    currentAlbum = name;
    lumeyaEntered = false;

    // Всегда очищаем повторно используемый контейнер до смены раздела.
    // Так список «Все песни» или предыдущего альбома не может остаться в Люмейе.
    albumSongList.replaceChildren();
    albumSongList.classList.add("hiddenPage");

    const details = albumDetails(name);
    albumHeroCover.src = details.cover;
    albumHeroCover.alt = `Обложка альбома ${name}`;
    albumTitle.textContent = name;
    albumSubtitle.textContent = details.subtitle;

    showPage(albumPage);
    activateTab(albumsTab);

    if(name === LUMEYA_ALBUM){
        lumeyaWelcome.classList.remove("hiddenPage");
        lumeyaInside.classList.add("hiddenPage");
        lumeyaInside.setAttribute("aria-hidden", "true");
        lumeyaEnter.setAttribute("aria-expanded", "false");
        lumeyaEnter.textContent = "Войти в Люмейю →";
    }else{
        lumeyaWelcome.classList.add("hiddenPage");
        albumSongList.classList.remove("hiddenPage");
        const list = albumSongs(name);
        renderSongs(list, albumSongList, playableIndices(list), true);
    }
}

function enterLumeya(){
    if(currentAlbum !== LUMEYA_ALBUM) return;
    lumeyaEntered = true;
    lumeyaInside.classList.remove("hiddenPage");
    lumeyaInside.setAttribute("aria-hidden", "false");
    lumeyaEnter.setAttribute("aria-expanded", "true");
    lumeyaEnter.textContent = "Вы в Люмейе ✦";
    albumSongList.replaceChildren();
    albumSongList.classList.remove("hiddenPage");
    const list = albumSongs(LUMEYA_ALBUM);
    renderSongs(list, albumSongList, playableIndices(list), true);
}

function refreshVisibleContent(){
    if(!homePage.classList.contains("hiddenPage")) renderHome();
    if(!catalogPage.classList.contains("hiddenPage")) renderCatalog();
    if(!albumCatalogPage.classList.contains("hiddenPage")) renderAlbumGrid(albumsList);
    if(!albumPage.classList.contains("hiddenPage") && currentAlbum){
        if(currentAlbum !== LUMEYA_ALBUM || lumeyaEntered){
            const list = albumSongs(currentAlbum);
            renderSongs(list, albumSongList, playableIndices(list), true);
        }
    }
}

function updatePlayerFavorite(){
    const song = songs[currentSong];
    if(!song) return;
    const active = isFavorite(song.id);
    favoritePlayer.textContent = active ? "♥" : "♡";
    favoritePlayer.classList.toggle("active", active);
    favoritePlayer.setAttribute("aria-label", active ? "Убрать из любимых" : "Добавить в любимые");
}

function updatePlayerBackground(song){
    playerBg.style.backgroundImage = `url("${song.cover}")`;
}

function setPlayIcon(isPlaying){
    playIcon.innerHTML = isPlaying
        ? '<path d="M7 5h3v14H7zM14 5h3v14h-3z"/>'
        : '<path d="M8 5v14l11-7z"/>';
    playBtn.setAttribute("aria-label", isPlaying ? "Пауза" : "Воспроизвести");
}

function setCoverPlaying(isPlaying){
    cover.classList.toggle("playing", isPlaying);
}

function setMiniPlaying(isPlaying){
    miniEqualizer.classList.toggle("is-playing", isPlaying);
}

function updateMiniPlayer(){
    const song = songs[currentSong];
    if(!song){
        miniPlayer.classList.add("hidden-mini");
        return;
    }

    miniCover.src = song.cover;
    miniCover.alt = `Обложка: ${song.title}`;
    miniTitle.textContent = song.title;
    miniArtist.textContent = song.artist || "MaDen";
    miniPlay.textContent = audio.paused ? "▶" : "Ⅱ";
    miniPlay.setAttribute("aria-label", audio.paused ? "Воспроизвести" : "Пауза");
    miniPlayer.classList.remove("hidden-mini");
}

function shuffle(items){
    const result = [...items];
    for(let index = result.length - 1; index > 0; index -= 1){
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
    }
    return result;
}

function normalizeQueue(queue){
    const seen = new Set();
    return queue
        .map((item) => typeof item === "number" ? item : songIndex(item))
        .filter((index) => index >= 0 && isPlayable(songs[index]))
        .filter((index) => {
            if(seen.has(index)) return false;
            seen.add(index);
            return true;
        });
}

function resetShuffleCycle(startIndex = currentSong){
    shuffleBag = shuffle(currentQueue.filter((index) => index !== startIndex));
    shuffleHistory = startIndex >= 0 ? [startIndex] : [];
    shuffleCursor = shuffleHistory.length - 1;
}

function setActiveQueue(queue, startIndex){
    currentQueue = normalizeQueue(queue);
    if(startIndex >= 0 && isPlayable(songs[startIndex]) && !currentQueue.includes(startIndex)){
        currentQueue.unshift(startIndex);
    }
    resetShuffleCycle(startIndex);
}

function ensureQueue(){
    if(!currentQueue.length){
        setActiveQueue(playableIndices(songs), currentSong);
    }
}

function getNextIndex(){
    if(repeatMode === "one" && currentSong >= 0) return currentSong;
    ensureQueue();
    if(!currentQueue.length) return -1;

    if(shuffleMode){
        if(shuffleCursor < shuffleHistory.length - 1){
            shuffleCursor += 1;
            return shuffleHistory[shuffleCursor];
        }

        if(!shuffleBag.length){
            // Новый круг начинается только после полного исчерпания текущей очереди.
            shuffleBag = shuffle(currentQueue.filter((index) => index !== currentSong));
        }

        if(!shuffleBag.length) return currentSong;
        const nextIndex = shuffleBag.shift();
        shuffleHistory = shuffleHistory.slice(0, shuffleCursor + 1);
        shuffleHistory.push(nextIndex);
        shuffleCursor = shuffleHistory.length - 1;

        if(shuffleHistory.length > 200){
            shuffleHistory.shift();
            shuffleCursor -= 1;
        }

        return nextIndex;
    }

    const position = currentQueue.indexOf(currentSong);
    return currentQueue[position < 0 || position === currentQueue.length - 1 ? 0 : position + 1];
}

function getPreviousIndex(){
    ensureQueue();
    if(!currentQueue.length) return -1;

    if(shuffleMode){
        if(shuffleCursor > 0){
            shuffleCursor -= 1;
            return shuffleHistory[shuffleCursor];
        }
        return currentSong;
    }

    const position = currentQueue.indexOf(currentSong);
    return currentQueue[position <= 0 ? currentQueue.length - 1 : position - 1];
}

function mediaArtworkType(path){
    const cleanPath = path.split("?")[0].toLowerCase();
    if(cleanPath.endsWith(".jpg") || cleanPath.endsWith(".jpeg")) return "image/jpeg";
    if(cleanPath.endsWith(".webp")) return "image/webp";
    return "image/png";
}

function updateMediaMetadata(song){
    if(!("mediaSession" in navigator) || !song) return;

    try{
        const artwork = song.cover ? [{
            src: new URL(song.cover, document.baseURI).href,
            sizes: "512x512",
            type: mediaArtworkType(song.cover)
        }] : [];

        navigator.mediaSession.metadata = new MediaMetadata({
            title: song.title || "MaDenMusic",
            artist: song.artist || "MaDen",
            album: song.album || "MaDenMusic",
            artwork
        });
    }catch(error){
        console.debug("Media Session metadata is unavailable", error);
    }
}

function updateMediaPlaybackState(state){
    if(!("mediaSession" in navigator)) return;
    try{
        navigator.mediaSession.playbackState = state;
    }catch{
        // Некоторые мобильные браузеры поддерживают metadata, но не playbackState.
    }
}

function updateMediaPosition(force = false){
    if(!("mediaSession" in navigator) || typeof navigator.mediaSession.setPositionState !== "function") return;
    if(!Number.isFinite(audio.duration) || audio.duration <= 0) return;

    const now = performance.now();
    if(!force && now - mediaPositionUpdatedAt < 1000) return;
    mediaPositionUpdatedAt = now;

    try{
        navigator.mediaSession.setPositionState({
            duration: audio.duration,
            playbackRate: audio.playbackRate || 1,
            position: Math.min(Math.max(audio.currentTime, 0), audio.duration)
        });
    }catch{
        // Игнорируем частичную реализацию API на старых устройствах.
    }
}

function setMediaAction(action, handler){
    try{
        navigator.mediaSession.setActionHandler(action, handler);
    }catch{
        // Поддерживаем только действия, доступные в конкретном браузере/ОС.
    }
}

function setupMediaSession(){
    if(!("mediaSession" in navigator)) return;

    setMediaAction("play", () => {
        const promise = audio.play();
        if(promise) promise.catch(() => {});
    });
    setMediaAction("pause", () => audio.pause());
    setMediaAction("stop", () => {
        audio.pause();
        audio.currentTime = 0;
        updateMediaPosition(true);
    });
    setMediaAction("nexttrack", () => {
        const nextIndex = getNextIndex();
        if(nextIndex >= 0) openSong(nextIndex, !audio.paused && !audio.ended);
    });
    setMediaAction("previoustrack", () => {
        if(audio.currentTime > 4){
            audio.currentTime = 0;
            updateMediaPosition(true);
            return;
        }
        const previousIndex = getPreviousIndex();
        if(previousIndex >= 0) openSong(previousIndex, !audio.paused && !audio.ended);
    });
    setMediaAction("seekbackward", (details) => {
        audio.currentTime = Math.max(0, audio.currentTime - (details.seekOffset || 10));
        updateMediaPosition(true);
    });
    setMediaAction("seekforward", (details) => {
        audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + (details.seekOffset || 10));
        updateMediaPosition(true);
    });
    setMediaAction("seekto", (details) => {
        if(!Number.isFinite(details.seekTime)) return;
        const target = Math.min(Math.max(details.seekTime, 0), audio.duration || details.seekTime);
        if(details.fastSeek && typeof audio.fastSeek === "function") audio.fastSeek(target);
        else audio.currentTime = target;
        updateMediaPosition(true);
    });
}

async function loadLyrics(song){
    if(!song) return "Текст песни скоро появится";
    if(lyricsCache.has(song.id)) return lyricsCache.get(song.id);

    try{
        const path = new URL(`lyrics/${encodeURIComponent(String(song.id))}.txt`, document.baseURI);
        const response = await fetch(path, {cache: "no-cache"});
        if(!response.ok) throw new Error(`Lyrics ${response.status}`);
        const text = (await response.text()).replace(/^\uFEFF/, "").trim();
        if(text){
            lyricsCache.set(song.id, text);
            return text;
        }
    }catch{
        // При локальном file:// или отсутствии файла используем текст из songs.js.
    }

    const fallback = String(song.lyrics || "").trim() || "Текст песни скоро появится";
    lyricsCache.set(song.id, fallback);
    return fallback;
}

async function openLyricsView(){
    const song = songs[currentSong];
    if(!song) return;
    const requestedId = song.id;
    lyricsViewTitle.textContent = song.title;
    lyricsViewText.textContent = "Загрузка текста…";
    player.classList.add("hidden");
    lyricsView.classList.remove("hidden");
    const text = await loadLyrics(song);
    if(songs[currentSong]?.id === requestedId) lyricsViewText.textContent = text;
}

async function openSong(index, autoPlay = false, queue = null){
    const song = songs[index];
    if(!isPlayable(song)){
        showToast("🎵 Скоро будет");
        return;
    }

    if(queue) setActiveQueue(queue, index);
    else{
        ensureQueue();
        if(!currentQueue.includes(index)) setActiveQueue(playableIndices(songs), index);
    }

    currentSong = index;
    audio.pause();
    setMiniPlaying(false);

    cover.src = song.cover;
    cover.alt = `Обложка: ${song.title}`;
    songTitle.textContent = song.title;
    songArtist.textContent = song.artist || "MaDen";
    updatePlayerBackground(song);
    updatePlayerFavorite();
    updateMediaMetadata(song);

    try{
        audio.src = new URL(song.audio, document.baseURI).href;
    }catch{
        audio.src = song.audio;
    }
    audio.load();

    progress.value = 0;
    progress.max = 0;
    currentTime.textContent = "0:00";
    duration.textContent = "0:00";
    setPlayIcon(false);
    setCoverPlaying(false);
    player.classList.remove("hidden");
    lyricsView.classList.add("hidden");
    updateMiniPlayer();

    if(autoPlay){
        const promise = audio.play();
        if(promise) promise.catch(() => showToast("Нажмите Play для воспроизведения"));
    }
}

function startQueue(queue){
    const normalized = normalizeQueue(queue);
    if(!normalized.length){
        showToast("🎵 Здесь пока нет доступных песен");
        return;
    }

    const firstIndex = shuffleMode
        ? normalized[Math.floor(Math.random() * normalized.length)]
        : normalized[0];
    setActiveQueue(normalized, firstIndex);
    openSong(firstIndex, true);
}

function togglePlayback(){
    if(!audio.src){
        startQueue(playableIndices(songs));
        return;
    }

    if(audio.paused){
        const promise = audio.play();
        if(promise) promise.catch(() => {});
    }else{
        audio.pause();
    }
}

function updateRepeatButton(){
    repeatBtn.classList.toggle("active", repeatMode !== "off");
    repeatBadge.textContent = repeatMode === "one" ? "1" : "";
    repeatBtn.setAttribute(
        "aria-label",
        repeatMode === "off" ? "Повтор выключен" : repeatMode === "all" ? "Повтор очереди" : "Повтор одной песни"
    );
}

function formatTime(seconds){
    if(!Number.isFinite(seconds)) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const rest = Math.floor(seconds % 60);
    return `${minutes}:${String(rest).padStart(2, "0")}`;
}

songsTab.addEventListener("click", showHome);
allSongsTab.addEventListener("click", () => openCatalog(false));
albumsTab.addEventListener("click", openAlbums);
favoritesTab.addEventListener("click", () => openCatalog(true));
$("backHomeFromAlbums").addEventListener("click", showHome);
$("backHomeFromCatalog").addEventListener("click", showHome);
$("backAlbums").addEventListener("click", openAlbums);
$("playAllHome").addEventListener("click", () => startQueue(playableIndices(songs)));
playAlbum.addEventListener("click", () => startQueue(playableIndices(albumSongs(currentAlbum))));
lumeyaEnter.addEventListener("click", enterLumeya);

document.querySelectorAll(".lumeya-word").forEach((button) => {
    button.setAttribute("aria-expanded", "false");
    button.addEventListener("click", () => {
        const open = button.classList.toggle("is-open");
        button.setAttribute("aria-expanded", String(open));
        button.querySelector(".lumeya-word-arrow").textContent = open ? "−" : "+";
    });
});

search.addEventListener("input", () => {
    if(catalogPage.classList.contains("hiddenPage")) openCatalog(false);
    else renderCatalog();
});
sortSongs.addEventListener("change", renderCatalog);

playBtn.addEventListener("click", togglePlayback);
miniPlay.addEventListener("click", togglePlayback);
nextBtn.addEventListener("click", () => {
    const nextIndex = getNextIndex();
    if(nextIndex >= 0) openSong(nextIndex, !audio.paused && !audio.ended);
});
prevBtn.addEventListener("click", () => {
    const previousIndex = getPreviousIndex();
    if(previousIndex >= 0) openSong(previousIndex, !audio.paused && !audio.ended);
});

closePlayer.addEventListener("click", () => {
    player.classList.add("hidden");
    updateMiniPlayer();
});
miniOpen.addEventListener("click", () => player.classList.remove("hidden"));
miniPlayer.addEventListener("click", (event) => {
    if(event.target.closest("#miniPlay") || event.target.closest("#miniOpen")) return;
    player.classList.remove("hidden");
});
favoritePlayer.addEventListener("click", () => {
    if(songs[currentSong]) toggleFavorite(songs[currentSong].id);
});
wordsBtn.addEventListener("click", openLyricsView);
closeLyrics.addEventListener("click", () => {
    lyricsView.classList.add("hidden");
    player.classList.remove("hidden");
});

shuffleBtn.addEventListener("click", () => {
    shuffleMode = !shuffleMode;
    localStorage.setItem(SHUFFLE_KEY, String(shuffleMode));
    shuffleBtn.classList.toggle("active", shuffleMode);
    resetShuffleCycle(currentSong);
    showToast(shuffleMode ? "🔀 Перемешивание без повторов" : "Обычный порядок");
});

repeatBtn.addEventListener("click", () => {
    repeatMode = repeatMode === "off" ? "all" : repeatMode === "all" ? "one" : "off";
    localStorage.setItem(REPEAT_KEY, repeatMode);
    updateRepeatButton();
});

audio.addEventListener("play", () => {
    setPlayIcon(true);
    setCoverPlaying(true);
    updateMiniPlayer();
    updateMediaPlaybackState("playing");
});

audio.addEventListener("playing", () => {
    setMiniPlaying(true);
    updateMediaPlaybackState("playing");
});

audio.addEventListener("pause", () => {
    setPlayIcon(false);
    setCoverPlaying(false);
    setMiniPlaying(false);
    updateMiniPlayer();
    updateMediaPlaybackState("paused");
});

["waiting", "stalled", "seeking"].forEach((eventName) => {
    audio.addEventListener(eventName, () => setMiniPlaying(false));
});

audio.addEventListener("seeked", () => {
    if(!audio.paused) setMiniPlaying(true);
    updateMediaPosition(true);
});

audio.addEventListener("ended", () => {
    setMiniPlaying(false);
    const nextIndex = getNextIndex();
    if(nextIndex >= 0) openSong(nextIndex, true);
});

audio.addEventListener("loadedmetadata", () => {
    progress.max = Math.floor(audio.duration) || 0;
    duration.textContent = formatTime(audio.duration);
    updateMediaPosition(true);
});

audio.addEventListener("durationchange", () => updateMediaPosition(true));
audio.addEventListener("ratechange", () => updateMediaPosition(true));
audio.addEventListener("timeupdate", () => {
    progress.value = Math.floor(audio.currentTime) || 0;
    currentTime.textContent = formatTime(audio.currentTime);
    updateMediaPosition(false);
});

audio.addEventListener("error", () => {
    setMiniPlaying(false);
    if(audio.src) showToast("Не удалось загрузить аудиофайл");
});

progress.addEventListener("input", () => {
    audio.currentTime = Number(progress.value);
    updateMediaPosition(true);
});

shuffleBtn.classList.toggle("active", shuffleMode);
updateRepeatButton();
setupMediaSession();
showHome();
player.classList.add("hidden");
lyricsView.classList.add("hidden");
miniPlayer.classList.add("hidden-mini");
setMiniPlaying(false);
