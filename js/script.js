/* ----- CONFIG: edit these ----- */
const HER_NAME = "Neena";
const YOUR_NAME = "Journ";
const PLAYLIST_URL = "https://open.spotify.com/playlist/6eq7TsNtsYyOno7dog51NO?si=bb5e5db7d564428d";
/* ------------------------------- */

/* --- pages: 21 slots. Replace text/images with your content --- */
const pages = Array.from({length:21}, (_,i) => ({
  title: `reason #${i+1}`,
  text: `replace this with reason ${i+1} — tell a memory, a joke, or why they matter.`,
  img: i === 0 ? 'assets/images/meowl.jpg' : `assets/images/photo${i+1}.jpg`
}));

/* --- minimal app --- */
let current = 0;
const total = pages.length;

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("her-name").textContent = HER_NAME;
  document.querySelector(".sub").textContent = `a tiny digital scrapbook — made with ♥ by ${YOUR_NAME}`;

  // elements
  const photo = document.getElementById("photo");
  const title = document.getElementById("page-title");
  const text = document.getElementById("page-text");
  const counter = document.getElementById("pageCounter");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const dotsWrap = document.getElementById("dots");
  const playlistQR = document.getElementById("playlistQR");
  const pageQR = document.getElementById("pageQR");
  const qrSelect = document.getElementById("qrSelect");
  const toggleQR = document.getElementById("toggleQR");
  const downloadPageQR = document.getElementById("downloadPageQR");
  const downloadPlaylistQR = document.getElementById("downloadPlaylistQR");
  const openPlaylist = document.getElementById("openPlaylist");
  const stickersEl = document.getElementById('stickers');
  const toast = document.getElementById('toast');
  const heartCountEl = document.getElementById('heartCount');
  const giveHeartBtn = document.getElementById('giveHeart');

  // heart counter persisted
  const HEART_KEY = 'neena_heart_count_v1';
  function getHearts(){ return Number(localStorage.getItem(HEART_KEY) || 0); }
  function setHearts(n){ localStorage.setItem(HEART_KEY, String(n)); heartCountEl.textContent = n; }
  // restore
  setHearts(getHearts());

  // toast helper
  let toastTimeout = null;
  function showToast(msg){
    if(!toast) return; toast.textContent = msg; toast.classList.add('show');
    clearTimeout(toastTimeout); toastTimeout = setTimeout(()=> toast.classList.remove('show'), 2200);
  }

  // spawn stickers periodically (small, cute images from assets/images)
  const STICKER_SRC = [
    'assets/images/meowl.jpg',
    'assets/images/download (1).jpg',
    'assets/images/download (2).jpg',
    'assets/images/download (3).jpg'
  ];
  function spawnSticker(){
    if(!stickersEl) return;
    const s = document.createElement('div'); s.className = 'sticker pop';
    const img = document.createElement('img'); img.src = STICKER_SRC[Math.floor(Math.random()*STICKER_SRC.length)];
    s.appendChild(img);
    // random pos inside card area
    const rect = document.querySelector('.polaroid').getBoundingClientRect();
    const x = rect.left + Math.random()*(rect.width-48);
    const y = rect.top + Math.random()*(rect.height-48);
    s.style.left = x + 'px'; s.style.top = y + 'px';
    // when clicked, collect a heart
    s.addEventListener('click', (e)=>{
      e.stopPropagation();
      const current = getHearts(); setHearts(current+1);
      showToast('+1 ♥ — collected!');
      s.remove();
    });
    document.body.appendChild(s);
    // auto-remove after some time
    setTimeout(()=> s.remove(), 7000);
  }
  // spawn every 3.5-6s randomly
  let spawnInterval = setInterval(spawnSticker, 4200);
  // one initial sticker
  setTimeout(spawnSticker, 900);

  // clicking the big photo also gives a heart
  if(photo){ photo.addEventListener('click', ()=>{ const current = getHearts(); setHearts(current+1); showToast('Thanks! +1 ♥'); }); }
  if(giveHeartBtn){ giveHeartBtn.addEventListener('click', ()=>{ const current = getHearts(); setHearts(current+1); showToast('You gave a heart! +1 ♥'); }); }

  // build dots
  for(let i=0;i<total;i++){
    const d = document.createElement("div");
    d.className = "dot";
    d.dataset.index = i;
    d.addEventListener("click", ()=>goTo(i));
    dotsWrap.appendChild(d);
  }

  function render(i){
    const p = pages[i];
    title.textContent = p.title;
    text.textContent = p.text;
    photo.src = p.img;
    photo.onerror = ()=>{ photo.src = "https://via.placeholder.com/360x240?text=add+photo+assets/images/photo"+(i+1)+".jpg"; };
    counter.textContent = `${i+1} / ${total}`;
    // update dots
    document.querySelectorAll(".dot").forEach((el,idx)=> el.classList.toggle("active", idx===i));
    // update QR to this page (useful after deploy)
    setTimeout(()=> {
      const pageUrl = window.location.href;
      pageQR.src = "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=" + encodeURIComponent(pageUrl);
      downloadPageQR.href = pageQR.src;
    }, 80);
  }

  function goTo(i){
    if(i<0) i=0;
    if(i>total-1) i=total-1;
    current = i;
    render(current);
  }
  prevBtn.addEventListener("click", ()=>goTo(current-1));
  nextBtn.addEventListener("click", ()=>goTo(current+1));

  // keyboard
  window.addEventListener("keydown", (e)=>{
    if(e.key === "ArrowRight") goTo(current+1);
    if(e.key === "ArrowLeft") goTo(current-1);
  });

  // swipe support
  let touchStartX = 0;
  window.addEventListener("touchstart", e => touchStartX = e.changedTouches[0].clientX);
  window.addEventListener("touchend", e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if(dx < -40) goTo(current+1);
    if(dx > 40) goTo(current-1);
  });

  // playlist QR
  playlistQR.src = "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=" + encodeURIComponent(PLAYLIST_URL);
  downloadPlaylistQR.href = playlistQR.src;
  openPlaylist.addEventListener("click", ()=> window.open(PLAYLIST_URL, "_blank"));

  // QR selector: show both / page / playlist
  function updateQRVisibility(choice){
    document.querySelectorAll('.qr-item').forEach(el => {
      const type = el.dataset.type;
      let visible = true;
      if(choice === 'both') visible = true;
      else if(choice === 'none') visible = false;
      else if(choice === 'page') visible = (type === 'page');
      else if(choice === 'playlist') visible = (type === 'playlist');
      el.style.display = visible ? '' : 'none';
      el.setAttribute('aria-hidden', visible ? 'false' : 'true');
    });
  }
  if(qrSelect){
    qrSelect.addEventListener('change', e => updateQRVisibility(e.target.value));
    // initial
    updateQRVisibility(qrSelect.value || 'both');
  }

  // Mobile toggle for QR area
  if(toggleQR){
    const qrWrap = document.getElementById('qrWrap') || document.querySelector('.qr-wrap');
    // set initial aria-hidden based on whether qrWrap is visible
    if(qrWrap){
      const isHidden = window.getComputedStyle(qrWrap).display === 'none' && !qrWrap.classList.contains('show');
      qrWrap.setAttribute('aria-hidden', isHidden ? 'true' : 'false');
    }
    toggleQR.addEventListener('click', ()=>{
      const expanded = toggleQR.getAttribute('aria-expanded') === 'true';
      const willExpand = !expanded;
      toggleQR.setAttribute('aria-expanded', String(willExpand));
      toggleQR.textContent = willExpand ? 'Hide QR' : 'Show QR';
      if(qrWrap) {
        qrWrap.classList.toggle('show');
        qrWrap.setAttribute('aria-hidden', qrWrap.classList.contains('show') ? 'false' : 'true');
      }
    });
  }

  // initial render
  goTo(0);
});
