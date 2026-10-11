import { initGame } from './game.js';
import { galleryPhotos } from './photo-data.js';

initGame(document.querySelector('#side-quest-game'));

const suggestedBoundaries = [
  'Honesty and trust, even when the conversation is difficult.',
  'Respect during disagreements, with room to listen to each other.',
  'Support for both our careers, personal goals, and independence.',
];
let galleryItems = galleryPhotos;
const previewPhotoCount = 8;
let galleryExpanded = false;
let pendingMedia = [];
let currentIndex = 0;
const allocatedURLs = new Set();
const gallery = document.querySelector('#gallery-grid');
const lightbox = document.querySelector('#lightbox');
const personalise = document.querySelector('#personalise-dialog');
const contact = document.querySelector('#contact-dialog');
const boundariesInput = document.querySelector('#boundaries-input');
const mediaStatus = document.querySelector('#media-status');
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
document.querySelector('#personalise-open').addEventListener('click', () => openDialog(personalise));
document.querySelector('#gallery-personalise').addEventListener('click', () => openDialog(personalise));
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
  const media = document.createElement(item.type === 'video' ? 'video' : 'img');
  media.src = !inLightbox && item.thumb ? item.thumb : item.src;
  if (!inLightbox && item.position) media.style.objectPosition = item.position;
  if (item.type === 'video') {
    media.controls = inLightbox;
    media.playsInline = true;
    media.preload = 'metadata';
    media.setAttribute('aria-label', item.caption);
    if (!inLightbox) media.muted = true;
  } else {
    media.alt = item.alt || item.caption;
    media.decoding = 'async';
    if (!inLightbox) media.loading = 'lazy';
  }
  return media;
}

function showSlide(index) {
  currentIndex = (index + galleryItems.length) % galleryItems.length;
  const item = galleryItems[currentIndex];
  const container = document.querySelector('#lightbox-media');
  container.querySelector('video')?.pause();
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
  if (event.target.tagName === 'VIDEO') return;
  if (event.key === 'ArrowLeft') { event.preventDefault(); showSlide(currentIndex - 1); }
  if (event.key === 'ArrowRight') { event.preventDefault(); showSlide(currentIndex + 1); }
});
lightbox.addEventListener('close', () => {
  lightbox.querySelector('video')?.pause();
  document.querySelector('#lightbox-media').replaceChildren();
});

function renderGallery() {
  gallery.replaceChildren();
  galleryItems.forEach((item, index) => {
    const button = document.createElement('a');
    button.href = item.src;
    button.hidden = !galleryExpanded && index >= previewPhotoCount;
    button.className = 'gallery-card';
    button.setAttribute('aria-label', `View ${item.caption}`);
    const picture = document.createElement('span');
    picture.className = 'gallery-image';
    picture.append(createMedia(item));
    if (item.type === 'video') {
      const play = document.createElement('span');
      play.className = 'video-mark';
      play.textContent = '▷';
      play.setAttribute('aria-hidden', 'true');
      picture.append(play);
    }
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
    label.textContent = item.label || (item.type === 'video' ? 'FROM THE CAMERA ROLL / VIDEO' : 'FROM THE CAMERA ROLL');
    meta.append(caption, label);
    button.append(picture, meta);
    gallery.append(button);
  });
  document.querySelector('#gallery-description').textContent = 'Big views, little moments, and the occasional leap of faith.';
  updateGalleryControls();
}

function renderBoundaries(values, draft = false) {
  const section = document.querySelector('#boundaries');
  const list = document.querySelector('#boundaries-list');
  list.replaceChildren();
  values.forEach(value => {
    const item = document.createElement('li');
    item.textContent = value;
    list.append(item);
  });
  section.hidden = values.length === 0;
  document.querySelector('#boundaries-draft').hidden = !draft;
}
boundariesInput.value = suggestedBoundaries.join('\n');
renderBoundaries(suggestedBoundaries, true);

function renderMediaEditor() {
  const editor = document.querySelector('#media-editor');
  editor.replaceChildren();
  pendingMedia.forEach((item, index) => {
    const row = document.createElement('div');
    row.className = 'media-edit-row';
    row.append(createMedia(item));
    const group = document.createElement('div');
    const label = document.createElement('label');
    label.htmlFor = `caption-${index}`;
    label.textContent = `${item.type === 'video' ? 'Video' : 'Photo'} ${index + 1} caption`;
    const input = document.createElement('input');
    input.id = `caption-${index}`;
    input.className = 'media-caption';
    input.maxLength = 120;
    input.value = item.caption;
    input.addEventListener('input', () => { item.caption = input.value.trim() || `A little moment ${index + 1}`; });
    group.append(label, input);
    const remove = document.createElement('button');
    remove.className = 'icon-button';
    remove.type = 'button';
    remove.textContent = '×';
    remove.setAttribute('aria-label', `Remove ${item.caption}`);
    remove.addEventListener('click', () => {
      pendingMedia.splice(index, 1);
      renderMediaEditor();
      mediaStatus.textContent = `${pendingMedia.length} files selected. Apply to update your gallery.`;
      editor.querySelector('.icon-button')?.focus();
      if (!pendingMedia.length) document.querySelector('#media-input').focus();
    });
    row.append(group, remove);
    editor.append(row);
  });
}

document.querySelector('#media-input').addEventListener('change', event => {
  const accepted = ['image/jpeg','image/png','image/webp','image/gif','video/mp4','video/webm','video/quicktime'];
  const errors = [];
  let count = 0;
  [...event.target.files].forEach(file => {
    if (pendingMedia.length >= 8) { errors.push('You can preview up to 8 extra files.'); return; }
    if (!accepted.includes(file.type)) { errors.push(`${file.name}: use JPG, PNG, WebP, GIF, MP4, or WebM.`); return; }
    if (file.size > 25 * 1024 * 1024) { errors.push(`${file.name}: choose a file under 25 MB.`); return; }
    if (file.type.startsWith('video') && !document.createElement('video').canPlayType(file.type)) { errors.push(`${file.name}: this browser can’t play that format. Try MP4 or WebM.`); return; }
    const src = URL.createObjectURL(file);
    allocatedURLs.add(src);
    const type = file.type.startsWith('video') ? 'video' : 'image';
    pendingMedia.push({ src, type, caption: `A little moment ${pendingMedia.length + 1}` });
    count += 1;
  });
  renderMediaEditor();
  mediaStatus.textContent = `${count ? `${count} ${count === 1 ? 'file' : 'files'} added. Write a caption, then apply to preview. ` : ''}${[...new Set(errors)].join(' ')}`;
  event.target.value = '';
});

document.querySelector('#personalise-form').addEventListener('submit', event => {
  event.preventDefault();
  galleryItems = [...galleryPhotos, ...pendingMedia.map(item => ({ ...item }))];
  renderGallery();
  const values = boundariesInput.value.split('\n').map(line => line.trim()).filter(Boolean);
  const isOriginal = JSON.stringify(values) === JSON.stringify(suggestedBoundaries);
  renderBoundaries(values, isOriginal);
  const usedURLs = new Set(pendingMedia.map(item => item.src));
  allocatedURLs.forEach(url => { if (!usedURLs.has(url)) { URL.revokeObjectURL(url); allocatedURLs.delete(url); } });
  personalise.close();
});
document.querySelector('#reset-preview').addEventListener('click', () => {
  pendingMedia = [];
  galleryItems = galleryPhotos;
  galleryExpanded = false;
  allocatedURLs.forEach(url => URL.revokeObjectURL(url));
  allocatedURLs.clear();
  boundariesInput.value = suggestedBoundaries.join('\n');
  renderMediaEditor();
  renderGallery();
  renderBoundaries(suggestedBoundaries, true);
  mediaStatus.textContent = 'Preview reset to your saved photos and suggested boundaries.';
});
window.addEventListener('beforeunload', () => allocatedURLs.forEach(url => URL.revokeObjectURL(url)));

function updateGalleryControls() {
  const toggle = document.querySelector('#gallery-toggle');
  toggle.hidden = galleryItems.length <= previewPhotoCount;
  toggle.setAttribute('aria-expanded', String(galleryExpanded));
  toggle.textContent = galleryExpanded ? 'Show fewer photos ↑' : `View all ${galleryItems.length} photos ↗`;
  document.querySelector('#gallery-count').textContent = `${galleryExpanded ? galleryItems.length : Math.min(previewPhotoCount, galleryItems.length)} of ${galleryItems.length} little moments`;
}
document.querySelector('#gallery-toggle').addEventListener('click', () => {
  galleryExpanded = !galleryExpanded;
  [...gallery.children].forEach((card, index) => { card.hidden = !galleryExpanded && index >= previewPhotoCount; });
  updateGalleryControls();
  if (galleryExpanded) gallery.children[previewPhotoCount]?.focus({ preventScroll: true });
  else document.querySelector('#gallery-toggle').scrollIntoView({ block: 'nearest', behavior: paused ? 'instant' : 'smooth' });
});
renderGallery();
