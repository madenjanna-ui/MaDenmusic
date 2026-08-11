// =====================================================
// MaDenMusic 2.6
// =====================================================

const newSongs = document.getElementById("newSongs");
const songList = document.getElementById("songList");
const search = document.getElementById("search");
const homePage = document.getElementById("homePage");
const catalogPage = document.getElementById("catalogPage");
const showAllSongs = document.getElementById("showAllSongs");
const backHome = document.getElementById("backHome");
const sortSongs = document.getElementById("sortSongs");
const catalogCount = document.getElementById("catalogCount");
const catalogLabel = document.getElementById("catalogLabel");

const songsTab = document.getElementById("songsTab");
const favoritesTab = document.getElementById("favoritesTab");

const player = document.getElementById("player");
const audio = document.getElementById("audio");
const cover = document.getElementById("cover");
const playerBg = document.querySelector(".player-bg");
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

const miniPlayer = document.getElementById("miniPlayer");
const miniCover = document.getElementById("miniCover");
const miniTitle = document.getElementById("miniTitle");
const miniArtist = document.getElementById("miniArtist");
const miniPlay = document.getElementById("miniPlay");
const miniOpen = document.getElementById("miniOpen");

let currentSong = 0;
let playing = false;
let favoritesOnly = false;
let playHistory = [];
let toastTimer = null;

const FAVORITES_KEY = "madenmusic_favorites";
let shuffleMode = localStorage.getItem("madenmusic_shuffle") === "true";
let repeatMode = localStorage.getItem("madenmusic_repeat") || "off";

function getFavorites(){
    try{
        return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
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
    toastTimer = setTimeout(() => toast.classList.remove("show"), 1800);
}

function heartSVG(){
    return `<svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.8 8.6c0 5-8.8 10-8.8 10s-8.8-5-8.8-10A4.6 4.6 0 0 1 12 5.7a4.6 4.6 0 0 1 8.8 2.9Z"/>
    </svg>`;
}

function playSVG(){
    return `<svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8 5v14l11-7z"/>
    </svg>`;
}

function toggleFavorite(id){
    const favorites = getFavorites();
    const index = favorites.indexOf(id);

    if(index === -1){
        favorites.push(id);
        showToast("♥ Добавлено в любимые");
    }else{
        favorites.splice(index,1);
        showToast("♡ Убрано из любимых");
    }

    saveFavorites(favorites);
    updatePlayerFavorite();
    renderHome();

    if(!catalogPage.classList.contains("hiddenPage")){
        renderCatalog();
    }
}

function createSongCard(song,index){
    const card = document.createElement("div");
    card.className = "song";

    const active = isFavorite(song.id);
    const releaseText = song.release
        ? new Date(song.release + "T00:00:00").toLocaleDateString("ru-RU",{day:"numeric",month:"long"})
        : "";

    const isCurrent = songs[currentSong]?.id === song.id && !audio.paused;

    card.innerHTML = `
        <img src="${song.cover}" alt="Обложка: ${song.title}" loading="lazy">

        <div class="info">
            <h2>${song.title}</h2>
            <p>${song.artist || "MaDen"}</p>
            ${releaseText ? `<div class="songDate">${releaseText}</div>` : ""}
        </div>

        <button class="heartButton ${active ? "active" : ""}" type="button" aria-label="Любимая песня">
            ${heartSVG()}
        </button>

        <div class="playIcon" aria-hidden="true">
            ${isCurrent ? "▮▮" : playSVG()}
        </div>
    `;

    card.addEventListener("click", () => {
        const wasPlaying = !audio.paused && !audio.ended;
        openSong(index,wasPlaying);
    });

    card.querySelector(".heartButton").addEventListener("click",(event)=>{
        event.stopPropagation();
        toggleFavorite(song.id);
    });

    return card;
}

function renderSongs(list,container){
    container.innerHTML = "";

    if(!list.length){
        container.innerHTML = `<div class="emptyState">Пока здесь ничего нет</div>`;
        return;
    }

    list.forEach(song=>{
        const index = songs.findIndex(item=>item.id === song.id);
        container.appendChild(createSongCard(song,index));
    });
}

function getNewSongs(){
    const now = new Date();

    return songs
        .filter(song=>{
            if(!song.release) return false;
            const release = new Date(song.release + "T00:00:00");
            const days = (now-release)/86400000;
            return days >= -1 && days <= 14;
        })
        .sort((a,b)=>new Date(b.release)-new Date(a.release));
}

function renderHome(){
    renderSongs(getNewSongs(),newSongs);
}

function getCatalogSongs(){
    let list = [...songs];

    if(favoritesOnly){
        list = list.filter(song=>isFavorite(song.id));
    }

    const query = search.value.trim().toLowerCase();

    if(query){
        list = list.filter(song=>
            song.title.toLowerCase().includes(query) ||
            (song.artist || "MaDen").toLowerCase().includes(query)
        );
    }

    switch(sortSongs.value){
        case "old":
            list.sort((a,b)=>new Date(a.release || 0)-new Date(b.release || 0));
            break;

        case "name":
            list.sort((a,b)=>a.title.localeCompare(b.title,"ru"));
            break;

        default:
            list.sort((a,b)=>new Date(b.release || 0)-new Date(a.release || 0));
    }

    return list;
}

function renderCatalog(){
    const list = getCatalogSongs();
    renderSongs(list,songList);

    catalogCount.textContent =
        `${list.length} ${list.length === 1 ? "песня" : "песен"}`;

    catalogLabel.textContent = favoritesOnly ? "Любимые песни" : "Все песни";
}

function openCatalog(){
    homePage.classList.add("hiddenPage");
    catalogPage.classList.remove("hiddenPage");
    renderCatalog();
}

showAllSongs.addEventListener("click",openCatalog);

backHome.addEventListener("click",()=>{
    catalogPage.classList.add("hiddenPage");
    homePage.classList.remove("hiddenPage");
    favoritesOnly = false;
    favoritesTab.classList.remove("active");
    songsTab.classList.add("active");
    renderHome();
});

songsTab.addEventListener("click",()=>{
    favoritesOnly = false;
    songsTab.classList.add("active");
    favoritesTab.classList.remove("active");
    homePage.classList.remove("hiddenPage");
    catalogPage.classList.add("hiddenPage");
    search.value = "";
    renderHome();
});

favoritesTab.addEventListener("click",()=>{
    favoritesOnly = true;
    songsTab.classList.remove("active");
    favoritesTab.classList.add("active");
    openCatalog();
});

search.addEventListener("input",()=>{
    openCatalog();
});

sortSongs.addEventListener("change",renderCatalog);

// =========================
// Плеер
// =========================

function updatePlayerFavorite(){
    const song = songs[currentSong];
    if(!song) return;

    const active = isFavorite(song.id);
    favoritePlayer.textContent = active ? "♥" : "♡";
    favoritePlayer.classList.toggle("active",active);
}

function updatePlayerBackground(song){
    playerBg.style.backgroundImage = `url("${song.cover}")`;
}

function setCoverPlaying(isPlaying){
    cover.classList.toggle("playing",isPlaying);
}

function setPlayIcon(isPlaying){
    playIcon.innerHTML = isPlaying
        ? `<path d="M7 5h3v14H7zM14 5h3v14h-3z"/>`
        : `<path d="M8 5v14l11-7z"/>`;

    playBtn.setAttribute("aria-label",isPlaying ? "Пауза" : "Воспроизвести");
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
    miniPlay.setAttribute("aria-label",audio.paused ? "Воспроизвести" : "Пауза");

    // Мини-плеер всегда остаётся доступным после выбора песни.
    miniPlayer.classList.remove("hidden-mini");
}

function openSong(index,autoPlay=false){
    if(!songs[index]) return;

    currentSong = index;
    const song = songs[index];

    cover.src = song.cover;
    cover.alt = `Обложка: ${song.title}`;

    songTitle.textContent = song.title;
    songArtist.textContent = song.artist || "MaDen";
    lyrics.textContent = song.lyrics || "";

    updatePlayerBackground(song);
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

    // Мини-плеер получает новую песню сразу.
    updateMiniPlayer();

    if(autoPlay){
        const promise = audio.play();
        if(promise) promise.catch(()=>{});
    }
}

playBtn.addEventListener("click",()=>{
    if(!audio.src) return;

    if(audio.paused){
        const promise = audio.play();
        if(promise) promise.catch(()=>{});
    }else{
        audio.pause();
    }
});

// Кнопки перелистывания сохраняют состояние воспроизведения.
nextBtn.addEventListener("click",()=>{
    const wasPlaying = !audio.paused && !audio.ended;
    openSong(getNextIndex(),wasPlaying);
});

prevBtn.addEventListener("click",()=>{
    const wasPlaying = !audio.paused && !audio.ended;
    openSong(getPrevIndex(),wasPlaying);
});

// ВАЖНО: закрытие большого плеера НЕ останавливает audio.
// Показываем мини-плеер вместо него.
closePlayer.addEventListener("click",()=>{
    // Музыка НЕ останавливается.
    player.classList.add("hidden");
    updateMiniPlayer();
});

miniPlayer.addEventListener("click",(event)=>{
    if(event.target.closest("#miniPlay")) return;
    if(event.target.closest("#miniOpen")) return;

    player.classList.remove("hidden");
});

miniOpen.addEventListener("click",()=>{
    player.classList.remove("hidden");
});

miniPlay.addEventListener("click",()=>{
    if(!audio.src) return;

    if(audio.paused){
        const promise = audio.play();
        if(promise) promise.catch(()=>{});
    }else{
        audio.pause();
    }
});

favoritePlayer.addEventListener("click",()=>{
    if(songs[currentSong]) toggleFavorite(songs[currentSong].id);
});

// =========================
// Shuffle / Repeat
// =========================

function getNextIndex(){
    if(repeatMode === "one") return currentSong;

    if(shuffleMode){
        const candidates = songs
            .map((_,i)=>i)
            .filter(i=>i !== currentSong && !playHistory.includes(i));

        const pool = candidates.length
            ? candidates
            : songs.map((_,i)=>i).filter(i=>i !== currentSong);

        if(!pool.length) return currentSong;

        const index = pool[Math.floor(Math.random()*pool.length)];

        playHistory.push(index);

        if(playHistory.length >= songs.length){
            playHistory = [index];
        }

        return index;
    }

    const next = currentSong + 1;

    if(next >= songs.length){
        return repeatMode === "all" ? 0 : 0;
    }

    return next;
}

function getPrevIndex(){
    if(shuffleMode && playHistory.length > 1){
        playHistory.pop();
        return playHistory[playHistory.length-1] ?? 0;
    }

    return currentSong <= 0 ? songs.length-1 : currentSong-1;
}

shuffleBtn.addEventListener("click",()=>{
    shuffleMode = !shuffleMode;
    playHistory = [currentSong];

    localStorage.setItem("madenmusic_shuffle",shuffleMode);

    shuffleBtn.classList.toggle("active",shuffleMode);

    showToast(
        shuffleMode
        ? "🔀 Случайное воспроизведение включено"
        : "Порядок воспроизведения обычный"
    );
});

repeatBtn.addEventListener("click",()=>{
    if(repeatMode === "off") repeatMode = "all";
    else if(repeatMode === "all") repeatMode = "one";
    else repeatMode = "off";

    localStorage.setItem("madenmusic_repeat",repeatMode);
    updateRepeatButton();
});

function updateRepeatButton(){
    repeatBtn.classList.toggle("active",repeatMode !== "off");
    repeatBadge.textContent = repeatMode === "one" ? "1" : "";

    repeatBtn.setAttribute(
        "aria-label",
        repeatMode === "off"
        ? "Повтор выключен"
        : repeatMode === "all"
        ? "Повтор списка"
        : "Повтор одной песни"
    );
}

// =========================
// Audio
// =========================

audio.addEventListener("ended",()=>{
    openSong(getNextIndex(),true);
});

audio.addEventListener("play",()=>{
    playing = true;
    setPlayIcon(true);
    setCoverPlaying(true);
    updateMiniPlayer();
});

audio.addEventListener("pause",()=>{
    playing = false;
    setPlayIcon(false);
    setCoverPlaying(false);
    updateMiniPlayer();
});

audio.addEventListener("loadedmetadata",()=>{
    progress.max = Math.floor(audio.duration) || 0;
    duration.textContent = formatTime(audio.duration);
});

audio.addEventListener("timeupdate",()=>{
    progress.value = Math.floor(audio.currentTime) || 0;
    currentTime.textContent = formatTime(audio.currentTime);
});

progress.addEventListener("input",()=>{
    audio.currentTime = Number(progress.value);
});

function formatTime(sec){
    if(!Number.isFinite(sec)) return "0:00";

    const min = Math.floor(sec/60);
    const seconds = Math.floor(sec%60);

    return `${min}:${seconds.toString().padStart(2,"0")}`;
}

// =========================
// Старт
// =========================

shuffleBtn.classList.toggle("active",shuffleMode);
updateRepeatButton();

player.classList.add("hidden");
miniPlayer.classList.add("hidden-mini");

homePage.classList.remove("hiddenPage");
catalogPage.classList.add("hiddenPage");
songsTab.classList.add("active");
favoritesTab.classList.remove("active");

renderHome();
