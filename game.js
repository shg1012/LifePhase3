import { buildCalendarDraft, todayInZone } from './calendar.js?v=ist-slider-1';

const questions = [
  {
    title: 'A free afternoon. What’s the plan?',
    note: 'The calendar has finally decided to be nice.',
    options: [
      ['camera', 'A camera walk', 'Good light. Questionable poses.'],
      ['drive', 'A long drive', 'Windows down, responsibilities on mute.'],
      ['food', 'Find great food', 'A very respectable research project.'],
    ],
  },
  {
    title: 'And the soundtrack?',
    note: 'Excellent singing is entirely optional.',
    options: [
      ['classics', 'Old-school favourites', 'Some songs have earned their encore.'],
      ['surprise', 'A surprise playlist', 'We each get to introduce a favourite.'],
    ],
  },
  {
    title: 'One last decision: which way?',
    note: 'This is where the navigation app gets an opinion.',
    options: [
      ['scenic', 'The scenic route', 'A small detour. For the plot.'],
      ['quick', 'The quickest route', 'More time for the actual adventure.'],
    ],
  },
];

const activities = {
  camera: {
    title: 'Good light. Better company.',
    plan: 'Take a camera for a walk, find a little good light, and make a stop for vegetarian food.',
    starter: 'What’s a photo you’ve taken that has a story behind it?',
  },
  drive: {
    title: 'A drive with a very loose agenda.',
    plan: 'Pick a place worth driving to, make room for a food stop, and let the conversation wander.',
    starter: 'If we could take a road trip anywhere, where would you point the car?',
  },
  food: {
    title: 'A very serious snack expedition.',
    plan: 'Find a promising vegetarian place and order something worth remembering. This counts as an adventure.',
    starter: 'Which food would you happily travel across the city for?',
  },
};

const escapeHTML = value => String(value).replace(/[&<>"']/g, character => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[character]));

/** Conversation game with an explicit handoff to Google Calendar. */
export function initGame(root) {
  if (!root || root.dataset.questReady) return;
  root.dataset.questReady = 'true';
  let step = -1;
  let answers = [];
  let bookingStage = '';
  let booking = {date: '', time: '', duration: '60', location: '', timeZone: 'Asia/Kolkata'};

  root.innerHTML = '<div class="quest-screen"></div><p class="quest-status" role="status" aria-live="polite" aria-atomic="true"></p>';
  const screen = root.querySelector('.quest-screen');
  const status = root.querySelector('.quest-status');

  function itinerary() {
    return {
      ...activities[answers[0]],
      soundtrack: answers[1] === 'classics'
        ? 'Put on old-school favourites. Everyone is allowed one dramatic chorus.'
        : 'Trade a surprise playlist. Polite skipping is allowed.',
      route: answers[2] === 'scenic'
        ? 'Take the scenic route. The journey gets a supporting role.'
        : 'Take the quickest route and spend the saved time on an unhurried conversation.',
    };
  }

  function renderBooking() {
    screen.innerHTML = `
      <span class="quest-eyebrow">Let’s give this a date</span>
      <h3 class="quest-heading" tabindex="-1">When’s our little escape?</h3>
      <p class="quest-description">Good company deserves a spot on the calendar.</p>
      <form id="quest-date-form" class="quest-date-form">
        <div class="quest-fields"><label for="quest-date">Date<input id="quest-date" name="date" type="date" required min="${todayInZone(booking.timeZone)}" value="${escapeHTML(booking.date)}"></label><label for="quest-time">Start time<input id="quest-time" name="time" type="time" required value="${escapeHTML(booking.time)}"></label></div>
        <p class="quest-time-hint">All times in India · IST (UTC+05:30)</p>
        <div class="quest-duration-field">
          <div class="quest-duration-heading"><label for="quest-duration">Make room for</label><output id="quest-duration-value" for="quest-duration">${Number(booking.duration) / 60} ${Number(booking.duration) === 60 ? 'hour' : 'hours'}</output></div>
          <input id="quest-duration" name="duration" type="range" min="60" max="360" step="60" value="${escapeHTML(booking.duration)}" aria-valuetext="${Number(booking.duration) / 60} ${Number(booking.duration) === 60 ? 'hour' : 'hours'}">
          <div class="quest-duration-stops" aria-hidden="true"><span>1 hr</span><span>2 hr</span><span>3 hr</span><span>4 hr</span><span>5 hr</span><span>6 hr</span></div>
        </div>
        <label for="quest-location">Meeting place <span>(optional)</span><input id="quest-location" name="location" type="text" maxlength="200" value="${escapeHTML(booking.location)}" placeholder="A café, park, or somewhere worth a detour"></label>
        <p class="quest-calendar-note">This proposes a time; Shubham’s availability still needs confirming.</p>
        <p id="quest-date-error" class="quest-date-error" role="alert"></p>
        <div class="quest-actions"><button class="quest-button quest-primary" type="submit">Continue to Google Calendar <span aria-hidden="true">↗</span></button><button class="quest-button quest-back" type="button" data-action="back-to-plan">Back to the adventure</button></div>
      </form>`;
    screen.querySelector('#quest-duration').value = booking.duration;
  }

  function render(moveFocus = true) {
    status.textContent = '';
    if (bookingStage) {
      renderBooking();
    } else if (step === -1) {
      screen.innerHTML = `
        <span class="quest-eyebrow">A tiny side quest</span>
        <h3 class="quest-heading" tabindex="-1">Plan our little escape.</h3>
        <p class="quest-description">Three small decisions. One excellent excuse to start a conversation.</p>
        <p class="quest-aside">No score. No grand predictions. Just a free afternoon.</p>
        <button class="quest-button quest-primary" type="button" data-action="start">Let’s make a plan <span aria-hidden="true">↗</span></button>`;
    } else if (step < questions.length) {
      const question = questions[step];
      screen.innerHTML = `
        <div class="quest-progress" aria-label="Question ${step + 1} of ${questions.length}">
          <span class="quest-step-label">${String(step + 1).padStart(2, '0')} / 03</span>
          <span class="quest-progress-track" aria-hidden="true">${questions.map((_, index) => `<span class="quest-progress-dot${index <= step ? ' is-active' : ''}"></span>`).join('')}</span>
        </div>
        <h3 class="quest-heading" tabindex="-1">${question.title}</h3>
        <p class="quest-description">${question.note}</p>
        <div class="quest-options">${question.options.map(([value, label, detail]) => `
          <button class="quest-option${answers[step] === value ? ' is-selected' : ''}" type="button" data-choice="${value}"${answers[step] === value ? ' aria-label="' + label + '. Your previous choice. ' + detail + '"' : ''}>
            <span class="quest-option-label">${label}</span>
            <span class="quest-option-detail">${detail}</span>
            <span class="quest-option-arrow" aria-hidden="true">↗</span>
          </button>`).join('')}
        </div>
        <button class="quest-button quest-back" type="button" data-action="back"><span aria-hidden="true">←</span> ${step === 0 ? 'Back to the start' : 'Previous question'}</button>`;
    } else {
      const activity = itinerary();
      const { soundtrack, route } = activity;
      screen.innerHTML = `
        <span class="quest-eyebrow">Your afternoon, loosely scheduled</span>
        <h3 class="quest-heading" tabindex="-1">${activity.title}</h3>
        <ol class="quest-itinerary">
          <li><span class="quest-itinerary-label">The plan</span><p>${activity.plan}</p></li>
          <li><span class="quest-itinerary-label">The soundtrack</span><p>${soundtrack}</p></li>
          <li><span class="quest-itinerary-label">The way there</span><p>${route}</p></li>
        </ol>
        <div class="quest-conversation"><span class="quest-itinerary-label">Something to talk about</span><p>${activity.starter}</p></div>
        <div class="quest-actions">
          <button class="quest-button quest-primary" type="button" data-action="schedule">Find a day for this <span aria-hidden="true">↗</span></button>
          <button class="quest-button quest-back" type="button" data-action="back"><span aria-hidden="true">←</span> Back</button>
        </div>`;
      status.textContent = 'Your afternoon plan is ready.';
    }
    if (moveFocus) screen.querySelector('.quest-heading').focus({ preventScroll: true });
  }

  function onClick(event) {
    const button = event.target.closest('button');
    if (!button || !root.contains(button)) return;
    if (button.dataset.action === 'schedule') {
      bookingStage = 'date';
    } else if (button.dataset.action === 'back-to-plan') {
      bookingStage = '';
    } else if (button.dataset.choice && step >= 0 && step < questions.length) {
      answers[step] = button.dataset.choice;
      step += 1;
    } else if (button.dataset.action === 'start') {
      step = 0;
    } else if (button.dataset.action === 'back') {
      step = Math.max(-1, step - 1);
    } else {
      return;
    }
    render();
  }

  function onInput(event) {
    if (!event.target.closest('#quest-date-form') || !event.target.name) return;
    booking[event.target.name] = event.target.value;
    screen.querySelector('#quest-date-error').textContent = '';
    if (event.target.name === 'duration') {
      const hours = Number(event.target.value) / 60;
      const label = `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
      screen.querySelector('#quest-duration-value').value = label;
      event.target.setAttribute('aria-valuetext', label);
    }
  }

  function onSubmit(event) {
    if (event.target.id !== 'quest-date-form') return;
    event.preventDefault();
    try {
      booking = {...Object.fromEntries(new FormData(event.target)), timeZone: 'Asia/Kolkata'};
      const draft = buildCalendarDraft({...booking, ...itinerary()});
      window.location.assign(draft.url);
    } catch (error) {
      screen.querySelector('#quest-date-error').textContent = error.message;
    }
  }

  root.addEventListener('click', onClick);
  root.addEventListener('input', onInput);
  root.addEventListener('change', onInput);
  root.addEventListener('submit', onSubmit);
  render(false);
  return () => {
    root.removeEventListener('click', onClick);
    root.removeEventListener('input', onInput);
    root.removeEventListener('change', onInput);
    root.removeEventListener('submit', onSubmit);
    delete root.dataset.questReady;
  };
}
