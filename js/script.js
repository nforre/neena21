/* ----- CONFIG: edit these ----- */
const HER_NAME = "Neena";
const YOUR_NAME = "Journ";
const PLAYLIST_URL = "https://open.spotify.com/playlist/6eq7TsNtsYyOno7dog51NO?si=bb5e5db7d564428d";
/* ------------------------------- */

/* --- pages: 21 slots. Replace text/images with your content --- */
const pages = Array.from({length:21}, (_,i) => ({
  title: `reason #${i+1}`,
  text: `replace this with reason ${i+1} — tell a memory, a joke, or why they matter.`,
  img: `assets/images/photo${i+1}.jpg`
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
