const recipient = 'shg1012@gmail.com';

function dateParts(date, timeZone) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone, year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
  }).formatToParts(date);
  return Object.fromEntries(parts.filter(part => part.type !== 'literal').map(part => [part.type, Number(part.value)]));
}

export function todayInZone(timeZone, now = new Date()) {
  const parts = dateParts(now, timeZone);
  return `${parts.year}-${String(parts.month).padStart(2, '0')}-${String(parts.day).padStart(2, '0')}`;
}

/** Convert a selected wall-clock time without silently shifting a DST gap or overlap. */
export function calendarStart(date, time, timeZone) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time)) throw new Error('Choose a date and start time.');
  const [year, month, day] = date.split('-').map(Number);
  const [hour, minute] = time.split(':').map(Number);
  const wall = Date.UTC(year, month - 1, day, hour, minute);
  const check = new Date(wall);
  if (check.getUTCFullYear() !== year || check.getUTCMonth() !== month - 1 || check.getUTCDate() !== day || hour > 23 || minute > 59) throw new Error('Choose a valid date and time.');
  const offsets = new Set();
  for (const delta of [-86400000, 0, 86400000]) {
    const sample = wall + delta;
    const p = dateParts(new Date(sample), timeZone);
    offsets.add(Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second) - sample);
  }
  const matches = [...offsets].map(offset => new Date(wall - offset)).filter(candidate => {
    const p = dateParts(candidate, timeZone);
    return p.year === year && p.month === month && p.day === day && p.hour === hour && p.minute === minute;
  });
  if (matches.length !== 1) throw new Error('The clocks change around this time. Choose another start time so the invitation is unambiguous.');
  return matches[0];
}

export function buildCalendarDraft({date, time, duration, location, title, plan, soundtrack, route, starter}, now = new Date()) {
  const timeZone = 'Asia/Kolkata';
  const start = calendarStart(date, time, timeZone);
  if (start <= now) throw new Error('That moment has already passed. Pick a future date and time.');
  if (![60, 120, 180, 240, 300, 360].includes(Number(duration))) throw new Error('Choose how long we should make room for.');
  const end = new Date(start.getTime() + Number(duration) * 60000);
  const stamp = value => value.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const url = new URL('https://calendar.google.com/calendar/render');
  url.search = new URLSearchParams({
    action: 'TEMPLATE', text: `A little escape with Shubham — ${title}`,
    dates: `${stamp(start)}/${stamp(end)}`, ctz: timeZone, add: recipient,
    location: location.trim(),
    details: `The plan: ${plan}\n\nThe soundtrack: ${soundtrack}\n\nThe way there: ${route}\n\nSomething to talk about: ${starter}\n\nA proposed adventure, pending Shubham’s acceptance.\nhttps://shg1012.github.io/LifePhase3/#play`,
  }).toString();
  return {url: url.href, start, end, recipient};
}
