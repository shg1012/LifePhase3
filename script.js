import { initGame } from './game.js?v=ist-slider-1';
import { galleryPhotos } from './photo-data.js';

initGame(document.querySelector('#side-quest-game'));

const galleryItems = galleryPhotos;
const collapsedPhotoCount = 8;
let galleryExpanded = false;
let currentIndex = 0;
const gallery = document.querySelector('#gallery-grid');
const lightbox = document.querySelector('#lightbox');
const contact = document.querySelector('#contact-dialog');
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
let paused = motionPreference.matches;
let motionOverridden = false;

const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 }) : null;
if (observer) {
  if (!paused) document.documentElement.classList.add('js-motion');
  document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
}
function updateMotion() {
  document.documentElement.classList.toggle('motion-paused', paused);
  const control = document.querySelector('#motion-toggle');
  control.textContent = paused ? 'Motion paused' : 'Pause motion';
  control.setAttribute('aria-pressed', String(paused));
}
document.querySelector('#motion-toggle').addEventListener('click', () => {
  if (motionPreference.matches && paused) {
    document.querySelector('#motion-toggle').textContent = 'Reduced motion is on';
    return;
  }
  paused = !paused;
  motionOverridden = true;
  updateMotion();
});
motionPreference.addEventListener('change', event => {
  if (event.matches || !motionOverridden) paused = event.matches;
  updateMotion();
});
updateMotion();

function openDialog(dialog) {
  dialog.showModal();
}
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
  });
});
document.querySelector('#contact-open').addEventListener('click', () => openDialog(contact));
document.querySelector('#copy-number').addEventListener('click', async () => {
  const status = document.querySelector('#copy-status');
  try {
    await navigator.clipboard.writeText('+91 7060 76 2001');
    status.textContent = 'Number copied. The opening line is all yours.';
  } catch {
    status.textContent = 'Copying isn’t available here. You can select and copy the number above.';
  }
});
contact.addEventListener('close', () => { document.querySelector('#copy-status').textContent = ''; });

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
  document.querySelector('#gallery-description').textContent = 'Big views, little moments, and the occasional leap of faith.';
  updateGalleryControls();
}

function updateGalleryControls() {
  const toggle = document.querySelector('#gallery-toggle');
  toggle.hidden = galleryItems.length <= collapsedPhotoCount;
  toggle.setAttribute('aria-expanded', String(galleryExpanded));
  toggle.textContent = galleryExpanded ? 'Show fewer photos ↑' : `View all ${galleryItems.length} photos ↗`;
  document.querySelector('#gallery-count').textContent = `${galleryExpanded ? galleryItems.length : Math.min(collapsedPhotoCount, galleryItems.length)} of ${galleryItems.length} little moments`;
}
document.querySelector('#gallery-toggle').addEventListener('click', () => {
  galleryExpanded = !galleryExpanded;
  [...gallery.children].forEach((card, index) => { card.hidden = !galleryExpanded && index >= collapsedPhotoCount; });
  updateGalleryControls();
  if (galleryExpanded) gallery.children[collapsedPhotoCount]?.focus({ preventScroll: true });
  else document.querySelector('#gallery-toggle').scrollIntoView({ block: 'nearest', behavior: paused ? 'instant' : 'smooth' });
});
renderGallery();
