const list=document.getElementById('songList');
const player=document.getElementById('player');
const audio=document.getElementById('audio');
const cover=document.getElementById('cover');
const title=document.getElementById('title');
const lyrics=document.getElementById('lyrics');
const search=document.getElementById('search');
const close=document.getElementById('close');

function render(items=songs){
 list.innerHTML='';
 items.forEach(s=>{
  const d=document.createElement('div');
  d.className='song';
  d.textContent=s.title;
  d.onclick=async()=>{
    title.textContent=s.title;
    cover.src=s.cover;
    audio.src=s.audio;
    try{lyrics.textContent=await (await fetch(s.lyrics)).text();}
    catch{lyrics.textContent='Добавьте файл lyrics/demo.txt';}
    player.classList.remove('hidden');
  };
  list.appendChild(d);
 });
}
search.oninput=()=>render(songs.filter(s=>s.title.toLowerCase().includes(search.value.toLowerCase())));
close.onclick=()=>{audio.pause();player.classList.add('hidden');};
render();
