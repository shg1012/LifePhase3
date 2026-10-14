import { galleryPhotos } from './photo-data.js';

const galleryItems = galleryPhotos;
const collapsedPhotoCount = 6;
let galleryExpanded = false;
let currentIndex = 0;
let lastPhotoLink;
const gallery = document.querySelector('#gallery-grid');
const lightbox = document.querySelector('#lightbox');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
function openDialog(dialog) {
  lastPhotoLink = document.activeElement;
  dialog.showModal();
}
lightbox.querySelector('[data-close]').addEventListener('click', () => lightbox.close());
lightbox.addEventListener('click', event => {
  if (event.target !== lightbox) return;
  const box = lightbox.getBoundingClientRect();
  if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) lightbox.close();
});
lightbox.addEventListener('close', () => lastPhotoLink?.focus({preventScroll: true}));

function createMedia(item, inLightbox = false) {
  const image = document.createElement('img');
  image.src = !inLightbox && item.thumb ? item.thumb : item.src;
  if (!inLightbox && item.position) image.style.objectPosition = item.position;
  image.alt = item.alt || item.caption;
  image.decoding = 'async';
  if (!inLightbox) image.loading = 'lazy';
  return image;
}

function showSlide(index) {
  currentIndex = (index + galleryItems.length) % galleryItems.length;
  const item = galleryItems[currentIndex];
  const container = document.querySelector('#lightbox-media');
  container.replaceChildren(createMedia(item, true));
  document.querySelector('#lightbox-title').textContent = item.caption;
  document.querySelector('#lightbox-counter').textContent = `${currentIndex + 1} of ${galleryItems.length}`;
  document.querySelector('#gallery-prev').disabled = galleryItems.length === 1;
  document.querySelector('#gallery-next').disabled = galleryItems.length === 1;
}

gallery.addEventListener('click', event => {
  const card = event.target.closest('.gallery-card');
  if (!card || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  showSlide([...gallery.children].indexOf(card));
  openDialog(lightbox);
});
document.querySelector('#gallery-prev').addEventListener('click', () => showSlide(currentIndex - 1));
document.querySelector('#gallery-next').addEventListener('click', () => showSlide(currentIndex + 1));
lightbox.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft') { event.preventDefault(); showSlide(currentIndex - 1); }
  if (event.key === 'ArrowRight') { event.preventDefault(); showSlide(currentIndex + 1); }
});
lightbox.addEventListener('close', () => {
  document.querySelector('#lightbox-media').replaceChildren();
});

function renderGallery() {
  gallery.replaceChildren();
  galleryItems.forEach((item, index) => {
    const button = document.createElement('a');
    button.href = item.src;
    button.hidden = !galleryExpanded && index >= collapsedPhotoCount;
    button.className = 'gallery-card';
    button.setAttribute('aria-label', `View ${item.caption}`);
    const picture = document.createElement('span');
    picture.className = 'gallery-image';
    picture.append(createMedia(item));
    const expand = document.createElement('span');
    expand.className = 'gallery-expand';
    expand.setAttribute('aria-hidden', 'true');
    expand.textContent = '↗';
    picture.append(expand);
    const meta = document.createElement('span');
    meta.className = 'gallery-meta';
    const caption = document.createElement('span');
    caption.textContent = item.caption;
    const label = document.createElement('small');
    label.textContent = item.label || 'FROM THE CAMERA ROLL';
    meta.append(caption, label);
    button.append(picture, meta);
    gallery.append(button);
  });
  document.querySelector('#gallery-description').textContent = 'Travel, everyday moments, and a camera that comes along.';
  updateGalleryControls();
}

function updateGalleryControls() {
  const toggle = document.querySelector('#gallery-toggle');
  toggle.hidden = galleryItems.length <= collapsedPhotoCount;
  toggle.setAttribute('aria-expanded', String(galleryExpanded));
  toggle.textContent = galleryExpanded ? 'Show fewer photos ↑' : 'View more photos ↓';
  document.querySelector('#gallery-count').textContent = `${galleryExpanded ? galleryItems.length : Math.min(collapsedPhotoCount, galleryItems.length)} of ${galleryItems.length} photos`;
}
document.querySelector('#gallery-toggle').addEventListener('click', () => {
  galleryExpanded = !galleryExpanded;
  [...gallery.children].forEach((card, index) => { card.hidden = !galleryExpanded && index >= collapsedPhotoCount; });
  updateGalleryControls();
  if (galleryExpanded) gallery.children[collapsedPhotoCount]?.focus({ preventScroll: true });
  else document.querySelector('#gallery-toggle').scrollIntoView({ block: 'nearest', behavior: reducedMotion.matches ? 'instant' : 'smooth' });
});
renderGallery();

// Load and play the muted film only while it is visible in the active tab.
const travelVideo = document.querySelector('#travel-video');
if (travelVideo) {
  let videoInView = false;
  travelVideo.muted = true;
  function updateVideoPlayback() {
    const shouldPlay = videoInView && !document.hidden && !reducedMotion.matches;
    if (!shouldPlay) {
      travelVideo.pause();
      return;
    }
    if (!travelVideo.getAttribute('src')) {
      travelVideo.src = travelVideo.dataset.src;
    }
    const playback = travelVideo.play();
    playback?.then(() => {
      if (!videoInView || document.hidden || reducedMotion.matches) travelVideo.pause();
    }).catch(() => {
      // Some browsers or power-saving modes may prevent autoplay.
    });
  }
  if ('IntersectionObserver' in window) {
    const videoObserver = new IntersectionObserver(entries => {
      videoInView = entries[0].isIntersecting && entries[0].intersectionRatio >= 0.15;
      updateVideoPlayback();
    }, {threshold: [0, 0.15]});
    videoObserver.observe(travelVideo);
  }
  document.addEventListener('visibilitychange', updateVideoPlayback);
  reducedMotion.addEventListener('change', updateVideoPlayback);
  window.addEventListener('pagehide', () => travelVideo.pause());
}
