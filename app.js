// =====================================================
// MaDenMusic — Album Edition
// =====================================================

const $ = (id) => document.getElementById(id);

const homePage = $("homePage");
const albumCatalogPage = $("albumCatalogPage");
const albumPage = $("albumPage");
const catalogPage = $("catalogPage");

const newSongs = $("newSongs");
const albumsHome = $("albumsHome");
const albumsList = $("albumsList");
const songList = $("songList");
const albumSongList = $("albumSongList");

const search = $("search");
const songsTab = $("songsTab");
const allSongsTab = $("allSongsTab");
const albumsTab = $("albumsTab");
const favoritesTab = $("favoritesTab");
const backHome = $("backHome");
const backAlbums = $("backAlbums");
const albumTitle = $("albumTitle");
const albumSubtitle = $("albumSubtitle");
const albumHeroCover = $("albumHeroCover");
const playAllHome = $("playAllHome");
const playAlbum = $("playAlbum");
const sortSongs = $("sortSongs");
const catalogCount = $("catalogCount");
const catalogLabel = $("catalogLabel");

const player = $("player");
const audio = $("audio");
const cover = $("cover");
const playerBg = document.querySelector(".player-bg");
const songTitle = $("songTitle");
const songArtist = $("songArtist");
const lyricsBox = $("lyrics");
const playBtn = $("play");
const playIcon = $("playIcon");
const prevBtn = $("prev");
const nextBtn = $("next");
const closePlayer = $("closePlayer");
const favoritePlayer = $("favoritePlayer");
const shuffleBtn = $("shuffle");
const repeatBtn = $("repeat");
const repeatBadge = $("repeatBadge");
const wordsBtn = $("wordsBtn");
const progress = $("progress");
const currentTime = $("currentTime");
const duration = $("duration");
const toast = $("toast");
const miniPlayer = $("miniPlayer");
const miniCover = $("miniCover");
const miniTitle = $("miniTitle");
const miniArtist = $("miniArtist");
const miniPlay = $("miniPlay");
const miniOpen = $("miniOpen");

const lyricsView = $("lyricsView");
const lyricsViewTitle = $("lyricsViewTitle");
const lyricsViewText = $("lyricsViewText");
const closeLyrics = $("closeLyrics");

const lumeyaWelcome = $("lumeyaWelcome");
const lumeyaEnter = $("lumeyaEnter");
const lumeyaInside = $("lumeyaInside");

let currentSong = -1;
let playing = false;
let favoritesOnly = false;
let currentAlbum = null;
let playQueue = [];
let queuePosition = -1;
let lyricsToken = 0;
let toastTimer = null;

const FAVORITES_KEY = "madenmusic_favorites";
let shuffleMode = localStorage.getItem("madenmusic_shuffle") === "true";
let repeatMode = localStorage.getItem("madenmusic_repeat") || "off";

const albumOrderLocal = typeof albumOrder !== "undefined" && Array.isArray(albumOrder)
  ? albumOrder
  : ["Моя", "Новый", "Мой ангел", "Новая веха", "Remixes", "Люмейя"];

function getAlbumMeta(album) {
    return (typeof albumMeta !== "undefined" && albumMeta[album]) || {};
}

function getAlbumCover(album) {
    const meta = getAlbumMeta(album);
    return meta.cover || "";
}

function getFavorites() {
    try {
        const value = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
        return Array.isArray(value) ? value : [];
    } catch {
        return [];
    }
}

function saveFavorites(list) {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(list));
}

function isFavorite(id) {
    return getFavorites().includes(id);
}

function getAvailable(list = songs) {
    return list.filter(song => song.available !== false);
}

function getAlbumSongs(album) {
    return songs.filter(song => song.album === album);
}

function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 1800);
}

function svgHeart() {
    return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 8.6c0 5-8.8 10-8.8 10s-8.8-5-8.8-10A4.6 4.6 0 0 1 12 5.7a4.6 4.6 0 0 1 8.8 2.9Z"/></svg>`;
}

function svgPlay() {
    return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>`;
}

function toggleFavorite(id) {
    const list = getFavorites();
    const index = list.indexOf(id);
    if (index === -1) {
        list.push(id);
        showToast("♥ Добавлено в любимые");
    } else {
        list.splice(index, 1);
        showToast("♡ Убрано из любимых");
    }
    saveFavorites(list);
    updatePlayerFavorite();
    renderHome();
    renderAlbumsHome();
    renderAlbumsList();
    if (!albumPage.classList.contains("hiddenPage")) renderCurrentAlbum();
    if (!catalogPage.classList.contains("hiddenPage")) renderCatalog();
}

function createSongCard(song, queue = []) {
    const index = songs.findIndex(item => item.id === song.id);
    const card = document.createElement("article");
    const playable = song.available !== false;
    const active = isFavorite(song.id);
    const isCurrent = songs[currentSong]?.id === song.id && !audio.paused && !audio.ended;
    const releaseText = song.release
        ? new Date(`${song.release}T00:00:00`).toLocaleDateString("ru-RU", { day: "numeric", month: "long" })
        : "";

    card.className = `song ${playable ? "" : "unavailable"}`;
    card.setAttribute("aria-disabled", playable ? "false" : "true");

    card.innerHTML = `
        <img src="${song.cover || getAlbumCover(song.album)}" alt="Обложка: ${song.title}" loading="lazy">
        <div class="info">
            <h2>${song.title}</h2>
            <p>${song.artist || "MaDen"}</p>
            ${releaseText ? `<div class="songDate">${releaseText}</div>` : ""}
            ${!playable ? `<div class="comingSoon">Скоро будет</div>` : ""}
        </div>
        <button class="heartButton ${active ? "active" : ""}" type="button" aria-label="${active ? "Убрать из любимых" : "Добавить в любимые"}">${svgHeart()}</button>
        <div class="playIcon" aria-hidden="true">${isCurrent ? "▮▮" : playable ? svgPlay() : "•"}</div>
    `;

    card.addEventListener("click", () => {
        if (!playable) return;
        const wasPlaying = !audio.paused && !audio.ended;
        const selectedQueue = queue.length ? queue : getAvailable(songs);
        setQueue(selectedQueue, song.id);
        openSong(index, wasPlaying);
    });

    card.querySelector(".heartButton").addEventListener("click", (event) => {
        event.stopPropagation();
        toggleFavorite(song.id);
    });

    return card;
}

function renderSongList(list, container, queue = []) {
    if (!container) return;
    container.innerHTML = "";
    if (!list.length) {
        container.innerHTML = `<div class="emptyState">Пока здесь ничего нет</div>`;
        return;
    }
    list.forEach(song => container.appendChild(createSongCard(song, queue)));
}

function getNewSongs() {
    const now = new Date();
    return getAvailable(songs)
        .filter(song => {
            if (!song.release) return false;
            const release = new Date(`${song.release}T00:00:00`);
            const days = (now - release) / 86400000;
            return days >= -1 && days <= 14;
        })
        .sort((a, b) => new Date(b.release) - new Date(a.release));
}

function renderHome() {
    const list = getNewSongs();

    // На главной карточки новых релизов запускаются,
    // но очередь всегда строится из ВСЕХ доступных песен.
    const homeQueue = getAvailable(songs);
    renderSongList(list, newSongs, homeQueue);
}

function albumCard(album) {
    const meta = getAlbumMeta(album);
    const all = getAlbumSongs(album);
    const available = getAvailable(all).length;
    const coverPath = meta.cover || "";

    const card = document.createElement("article");
    card.className = "album-card";
    card.innerHTML = `
        <img src="${coverPath}" alt="Обложка альбома ${album}" loading="lazy">
        <div class="album-card-body">
            <h3>${album}</h3>
            <p>${all.length} композиций · ${available} доступно</p>
        </div>
    `;
    card.addEventListener("click", () => openAlbum(album));
    return card;
}

function renderAlbumsHome() {
    if (!albumsHome) return;
    albumsHome.innerHTML = "";
    albumOrderLocal.forEach(album => albumsHome.appendChild(albumCard(album)));
}

function renderAlbumsList() {
    if (!albumsList) return;
    albumsList.innerHTML = "";
    albumOrderLocal.forEach(album => albumsList.appendChild(albumCard(album)));
}

function getCatalogSongs() {
    let list = [...getAvailable(songs)];
    if (favoritesOnly) list = list.filter(song => isFavorite(song.id));

    const query = search.value.trim().toLowerCase();
    if (query) {
        list = list.filter(song =>
            song.title.toLowerCase().includes(query) ||
            (song.artist || "MaDen").toLowerCase().includes(query)
        );
    }

    switch (sortSongs.value) {
        case "old":
            list.sort((a, b) => new Date(a.release || 0) - new Date(b.release || 0));
            break;
        case "name":
            list.sort((a, b) => a.title.localeCompare(b.title, "ru"));
            break;
        default:
            list.sort((a, b) => new Date(b.release || 0) - new Date(a.release || 0));
    }
    return list;
}

function renderCatalog() {
    const list = getCatalogSongs();
    renderSongList(list, songList, list);
    catalogCount.textContent = `${list.length} ${list.length === 1 ? "песня" : "песен"}`;
    catalogLabel.textContent = favoritesOnly ? "Любимые песни" : "Все песни";
}

function setActiveTab(tab) {
    [songsTab, allSongsTab, albumsTab, favoritesTab].forEach(button => button?.classList.remove("active"));
    tab?.classList.add("active");
}

function hideAllPages() {
    [homePage, albumCatalogPage, albumPage, catalogPage].forEach(page => page?.classList.add("hiddenPage"));
}

function openHome() {
    hideAllPages();
    homePage.classList.remove("hiddenPage");
    favoritesOnly = false;
    search.value = "";
    setActiveTab(songsTab);
    renderHome();
    renderAlbumsHome();
}

function openAlbumsList() {
    hideAllPages();
    albumCatalogPage.classList.remove("hiddenPage");
    setActiveTab(albumsTab);
    renderAlbumsList();
}

function openCatalog() {
    hideAllPages();
    catalogPage.classList.remove("hiddenPage");
    setActiveTab(favoritesOnly ? favoritesTab : allSongsTab);
    renderCatalog();
}

function openAlbum(album) {
    currentAlbum = album;
    hideAllPages();
    albumPage.classList.remove("hiddenPage");
    albumTitle.textContent = album;
    const meta = getAlbumMeta(album);
    albumSubtitle.textContent = `${getAlbumSongs(album).length} композиций`;
    albumHeroCover.src = meta.cover || "";

    if (album === "Люмейя") {
        setupLumeyaEntrance();
    } else {
        lumeyaWelcome?.classList.add("hiddenPage");
        lumeyaInside?.classList.add("hiddenPage");
        albumSongList?.classList.remove("hiddenPage");
        renderCurrentAlbum();
    }
}

function renderCurrentAlbum() {
    if (!currentAlbum) return;
    const all = getAlbumSongs(currentAlbum);
    renderSongList(all, albumSongList, getAvailable(all));
    if (playAlbum) {
        playAlbum.disabled = getAvailable(all).length === 0;
        playAlbum.textContent = playAlbum.disabled ? "Скоро появится музыка" : "▶ Играть всё";
    }
}

function playAllAlbum() {
    if (!currentAlbum) return;
    const queue = getAvailable(getAlbumSongs(currentAlbum));
    if (!queue.length) return;
    setQueue(queue, queue[0].id);
    const index = songs.findIndex(song => song.id === queue[0].id);
    openSong(index, true);
}

function setQueue(list, songId) {
    playQueue = getAvailable(list);
    queuePosition = playQueue.findIndex(song => song.id === songId);
    if (queuePosition < 0) queuePosition = 0;
}

function getNextIndex() {
    if (!playQueue.length) {
        playQueue = getAvailable(songs);
        queuePosition = Math.max(0, playQueue.findIndex(song => song.id === songs[currentSong]?.id));
    }

    if (repeatMode === "one") return songs.findIndex(song => song.id === playQueue[queuePosition].id);

    if (shuffleMode && playQueue.length > 1) {
        let next = Math.floor(Math.random() * playQueue.length);
        while (next === queuePosition) next = Math.floor(Math.random() * playQueue.length);
        queuePosition = next;
    } else {
        queuePosition += 1;
        if (queuePosition >= playQueue.length) {
            if (repeatMode === "all") queuePosition = 0;
            else return -1;
        }
    }

    return songs.findIndex(song => song.id === playQueue[queuePosition].id);
}

function getPrevIndex() {
    if (!playQueue.length) playQueue = getAvailable(songs);
    queuePosition = Math.max(0, queuePosition - 1);
    return songs.findIndex(song => song.id === playQueue[queuePosition]?.id);
}

function openSong(index, autoPlay = false) {
    const song = songs[index];
    if (!song || song.available === false) return;

    currentSong = index;
    if (!playQueue.length || !playQueue.some(item => item.id === song.id)) setQueue(getAvailable(songs), song.id);

    cover.src = song.cover || getAlbumCover(song.album);
    cover.alt = `Обложка: ${song.title}`;
    songTitle.textContent = song.title;
    songArtist.textContent = song.artist || "MaDen";
    updatePlayerBackground(song);
    updatePlayerFavorite();
    loadLyrics(song);

    audio.pause();
    audio.src = song.audio;
    audio.load();
    progress.value = 0;
    currentTime.textContent = "0:00";
    duration.textContent = "0:00";
    setPlayIcon(false);
    setCoverPlaying(false);
    updateMediaSession(song);
    updateMiniPlayer();
    player.classList.remove("hidden");

    if (autoPlay) {
        const promise = audio.play();
        promise?.catch(() => showToast("Не удалось начать воспроизведение"));
    }
}

function updatePlayerFavorite() {
    const song = songs[currentSong];
    if (!song) return;
    const active = isFavorite(song.id);
    favoritePlayer.textContent = active ? "♥" : "♡";
    favoritePlayer.classList.toggle("active", active);
}

function updatePlayerBackground(song) {
    if (playerBg) playerBg.style.backgroundImage = `url("${song.cover || getAlbumCover(song.album)}")`;
}

function setCoverPlaying(active) {
    cover.classList.toggle("playing", active);
}

function setPlayIcon(active) {
    playIcon.innerHTML = active
        ? `<path d="M7 5h3v14H7zM14 5h3v14h-3z"/>`
        : `<path d="M8 5v14l11-7z"/>`;
    playBtn.setAttribute("aria-label", active ? "Пауза" : "Воспроизвести");
}

function updateMiniPlayer() {
    const song = songs[currentSong];
    if (!song) {
        miniPlayer.classList.add("hidden-mini");
        return;
    }
    miniCover.src = song.cover || getAlbumCover(song.album);
    miniCover.alt = `Обложка: ${song.title}`;
    miniTitle.textContent = song.title;
    miniArtist.textContent = song.artist || "MaDen";
    miniPlay.textContent = audio.paused ? "▶" : "Ⅱ";
    miniPlayer.classList.remove("hidden-mini");
}

async function loadLyrics(song) {
    const token = ++lyricsToken;
    const loadingText = "Загрузка текста…";

    if (lyricsBox) lyricsBox.textContent = loadingText;
    if (lyricsViewText) lyricsViewText.textContent = loadingText;

    // Основной вариант: lyrics/ID.txt
    // Дополнительный вариант: lyrics/Название песни.txt
    const candidates = [
        `lyrics/${song.id}.txt`,
        song.title ? `lyrics/${encodeURIComponent(song.title)}.txt` : null
    ].filter(Boolean);

    for (const path of candidates) {
        try {
            const response = await fetch(path, { cache: "no-store" });
            if (!response.ok) continue;

            const text = (await response.text()).trim();
            const finalText = text || "Текст песни скоро появится";

            if (token === lyricsToken) {
                if (lyricsBox) lyricsBox.textContent = finalText;
                if (lyricsViewText) lyricsViewText.textContent = finalText;
            }
            return;
        } catch {
            // Пробуем следующий вариант, затем используем резерв из songs.js.
        }
    }

    const fallback = (song.lyrics || "").trim() || "Текст песни скоро появится";
    if (token === lyricsToken) {
        if (lyricsBox) lyricsBox.textContent = fallback;
        if (lyricsViewText) lyricsViewText.textContent = fallback;
    }
}

function showLyricsView() {
    const song = songs[currentSong];
    if (!song) return;

    lyricsViewTitle.textContent = song.title;
    lyricsViewText.textContent = "Загрузка текста…";
    lyricsView.classList.remove("hidden");

    // Важно: отдельно загружаем текст для полноэкранного режима «Слова».
    loadLyrics(song);
}

function hideLyricsView() {
    lyricsView.classList.add("hidden");
}

function updateMediaSession(song) {
    if (!("mediaSession" in navigator) || !song) return;
    try {
        const artwork = song.cover || getAlbumCover(song.album);
        navigator.mediaSession.metadata = new MediaMetadata({
            title: song.title,
            artist: song.artist || "MaDen",
            album: song.album || "MaDenMusic",
            artwork: artwork ? [{ src: artwork, sizes: "1200x1200", type: artwork.toLowerCase().endsWith(".png") ? "image/png" : "image/jpeg" }] : []
        });

        const set = (action, handler) => {
            try { navigator.mediaSession.setActionHandler(action, handler); } catch { /* unsupported */ }
        };

        set("play", () => audio.play());
        set("pause", () => audio.pause());
        set("nexttrack", () => {
            const next = getNextIndex();
            if (next >= 0) openSong(next, true);
        });
        set("previoustrack", () => {
            const prev = getPrevIndex();
            if (prev >= 0) openSong(prev, true);
        });
        set("seekbackward", details => {
            audio.currentTime = Math.max(0, audio.currentTime - (details.seekOffset || 10));
        });
        set("seekforward", details => {
            audio.currentTime = Math.min(audio.duration || Infinity, audio.currentTime + (details.seekOffset || 10));
        });
    } catch {
        // Media Session is optional.
    }
}

function updateMediaPosition() {
    if (!navigator.mediaSession || !Number.isFinite(audio.duration)) return;
    try {
        navigator.mediaSession.setPositionState({
            duration: audio.duration,
            playbackRate: audio.playbackRate || 1,
            position: Math.min(audio.currentTime, audio.duration)
        });
    } catch {
        // Some browsers do not accept position updates in every state.
    }
}

songsTab?.addEventListener("click", openHome);
allSongsTab?.addEventListener("click", () => { favoritesOnly = false; search.value = ""; openCatalog(); });
albumsTab?.addEventListener("click", openAlbumsList);
favoritesTab?.addEventListener("click", () => {
    favoritesOnly = true;
    search.value = "";
    openCatalog();
});
backHome?.addEventListener("click", openHome);
backAlbums?.addEventListener("click", openAlbumsList);

playAllHome?.addEventListener("click", () => {
    const queue = getAvailable(songs);
    if (!queue.length) return;
    setQueue(queue, queue[0].id);
    const index = songs.findIndex(song => song.id === queue[0].id);
    if (shuffleMode && queue.length > 1) {
        // Первая песня тоже выбирается случайно при запуске с главной.
        const random = Math.floor(Math.random() * queue.length);
        queuePosition = random;
        const randomIndex = songs.findIndex(song => song.id === queue[random].id);
        openSong(randomIndex, true);
    } else {
        openSong(index, true);
    }
});

playAlbum?.addEventListener("click", playAllAlbum);
sortSongs?.addEventListener("change", renderCatalog);
search?.addEventListener("input", () => {
    const value = search.value.trim();
    if (value) {
        favoritesOnly = false;
        openCatalog();
    } else if (!catalogPage.classList.contains("hiddenPage")) {
        renderCatalog();
    }
});

playBtn.addEventListener("click", () => {
    if (!audio.src) return;
    if (audio.paused) audio.play().catch(() => showToast("Не удалось начать воспроизведение"));
    else audio.pause();
});

prevBtn.addEventListener("click", () => {
    if (currentSong < 0) return;
    const prev = getPrevIndex();
    if (prev >= 0) openSong(prev, true);
});

nextBtn.addEventListener("click", () => {
    if (currentSong < 0) return;
    const next = getNextIndex();
    if (next >= 0) openSong(next, true);
    else showToast("Это последняя доступная песня");
});

closePlayer.addEventListener("click", () => {
    player.classList.add("hidden");
    updateMiniPlayer();
});

miniOpen.addEventListener("click", () => player.classList.remove("hidden"));
miniPlayer.addEventListener("click", event => {
    if (!event.target.closest("#miniPlay") && !event.target.closest("#miniOpen")) player.classList.remove("hidden");
});
miniPlay.addEventListener("click", () => {
    if (!audio.src) return;
    if (audio.paused) audio.play().catch(() => {});
    else audio.pause();
});

favoritePlayer.addEventListener("click", () => {
    if (songs[currentSong]) toggleFavorite(songs[currentSong].id);
});

shuffleBtn.addEventListener("click", () => {
    shuffleMode = !shuffleMode;
    localStorage.setItem("madenmusic_shuffle", shuffleMode);
    shuffleBtn.classList.toggle("active", shuffleMode);
    showToast(shuffleMode ? "🔀 Перемешивание включено" : "Перемешивание выключено");
});

repeatBtn.addEventListener("click", () => {
    repeatMode = repeatMode === "off" ? "all" : repeatMode === "all" ? "one" : "off";
    localStorage.setItem("madenmusic_repeat", repeatMode);
    updateRepeatButton();
});

function updateRepeatButton() {
    repeatBtn.classList.toggle("active", repeatMode !== "off");
    repeatBadge.textContent = repeatMode === "one" ? "1" : "";
    repeatBtn.setAttribute("aria-label", repeatMode === "off" ? "Повтор выключен" : repeatMode === "all" ? "Повтор списка" : "Повтор одной песни");
}

wordsBtn.addEventListener("click", showLyricsView);
closeLyrics.addEventListener("click", hideLyricsView);

progress.addEventListener("input", () => {
    audio.currentTime = Number(progress.value);
});

audio.addEventListener("play", () => {
    playing = true;
    setPlayIcon(true);
    setCoverPlaying(true);
    updateMiniPlayer();
    updateMediaPosition();
});

audio.addEventListener("pause", () => {
    playing = false;
    setPlayIcon(false);
    setCoverPlaying(false);
    updateMiniPlayer();
});

audio.addEventListener("ended", () => {
    const next = getNextIndex();
    if (next >= 0) openSong(next, true);
    else {
        playing = false;
        setPlayIcon(false);
        setCoverPlaying(false);
        updateMiniPlayer();
    }
});

audio.addEventListener("loadedmetadata", () => {
    progress.max = Math.floor(audio.duration) || 0;
    duration.textContent = formatTime(audio.duration);
    updateMediaPosition();
});

audio.addEventListener("timeupdate", () => {
    progress.value = Math.floor(audio.currentTime) || 0;
    currentTime.textContent = formatTime(audio.currentTime);
    updateMediaPosition();
});

audio.addEventListener("error", () => {
    showToast("Файл песни не найден — пропускаю");
    const next = getNextIndex();
    if (next >= 0) openSong(next, true);
});

function formatTime(sec) {
    if (!Number.isFinite(sec)) return "0:00";
    return `${Math.floor(sec / 60)}:${String(Math.floor(sec % 60)).padStart(2, "0")}`;
}

function setupLumeyaEntrance() {
    lumeyaWelcome.classList.remove("hiddenPage");
    albumSongList.classList.add("hiddenPage");
    lumeyaInside.classList.add("hiddenPage");
    lumeyaInside.setAttribute("aria-hidden", "true");
    lumeyaEnter.textContent = "Войти в Люмейю →";
    lumeyaEnter.setAttribute("aria-expanded", "false");

    lumeyaEnter.onclick = () => {
        const entered = lumeyaInside.classList.toggle("hiddenPage");
        if (!entered) {
            albumSongList.classList.remove("hiddenPage");
            lumeyaInside.setAttribute("aria-hidden", "false");
            lumeyaEnter.textContent = "Закрыть вступление ↑";
            lumeyaEnter.setAttribute("aria-expanded", "true");
            renderCurrentAlbum();
            setTimeout(() => lumeyaInside.scrollIntoView({ behavior: "smooth", block: "start" }), 120);
        } else {
            albumSongList.classList.add("hiddenPage");
            lumeyaInside.setAttribute("aria-hidden", "true");
            lumeyaEnter.textContent = "Войти в Люмейю →";
            lumeyaEnter.setAttribute("aria-expanded", "false");
        }
    };

    lumeyaInside.querySelectorAll(".lumeya-word").forEach(button => {
        button.onclick = () => {
            const wasOpen = button.classList.contains("open");
            lumeyaInside.querySelectorAll(".lumeya-word.open").forEach(other => {
                other.classList.remove("open");
                const arrow = other.querySelector(".lumeya-word-arrow");
                if (arrow) arrow.textContent = "+";
            });
            button.classList.toggle("open", !wasOpen);
            const arrow = button.querySelector(".lumeya-word-arrow");
            if (arrow) arrow.textContent = button.classList.contains("open") ? "−" : "+";
        };
    });
}

shuffleBtn.classList.toggle("active", shuffleMode);
updateRepeatButton();
openHome();
renderAlbumsHome();
miniPlayer.classList.add("hidden-mini");
player.classList.add("hidden");
lyricsView.classList.add("hidden");
