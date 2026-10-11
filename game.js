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

/** A local-only conversation game. Mount once inside #side-quest-game. */
export function initGame(root) {
  if (!root || root.dataset.questReady) return;
  root.dataset.questReady = 'true';
  let step = -1;
  let answers = [];

  root.innerHTML = '<div class="quest-screen"></div><p class="quest-status" role="status" aria-live="polite" aria-atomic="true"></p>';
  const screen = root.querySelector('.quest-screen');
  const status = root.querySelector('.quest-status');

  function render(moveFocus = true) {
    status.textContent = '';
    if (step === -1) {
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
      const activity = activities[answers[0]];
      const soundtrack = answers[1] === 'classics'
        ? 'Put on old-school favourites. Everyone is allowed one dramatic chorus.'
        : 'Trade a surprise playlist. Polite skipping is allowed.';
      const route = answers[2] === 'scenic'
        ? 'Take the scenic route. The journey gets a supporting role.'
        : 'Take the quickest route and spend the saved time on an unhurried conversation.';
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
          <button class="quest-button quest-primary" type="button" data-action="replay">Plan another escape <span aria-hidden="true">↻</span></button>
          <button class="quest-button quest-back" type="button" data-action="back">Change a choice</button>
        </div>`;
      status.textContent = 'Your afternoon plan is ready.';
    }
    if (moveFocus) screen.querySelector('.quest-heading').focus({ preventScroll: true });
  }

  function onClick(event) {
    const button = event.target.closest('button');
    if (!button || !root.contains(button)) return;
    if (button.dataset.choice && step >= 0 && step < questions.length) {
      answers[step] = button.dataset.choice;
      step += 1;
    } else if (button.dataset.action === 'start') {
      step = 0;
    } else if (button.dataset.action === 'back') {
      step = Math.max(-1, step - 1);
    } else if (button.dataset.action === 'replay') {
      answers = [];
      step = 0;
    } else {
      return;
    }
    render();
  }

  root.addEventListener('click', onClick);
  render(false);
  return () => {
    root.removeEventListener('click', onClick);
    delete root.dataset.questReady;
  };
}
