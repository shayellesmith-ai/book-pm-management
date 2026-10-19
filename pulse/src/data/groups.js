/**
 * Peer-group matching data and rule-based matching utilities for the
 * York U Fitness reactivation MVP.
 *
 * The matching is intentionally rule-based (no AI): a student's available
 * windows and optional group preference are few and structured, so rules give
 * predictable, explainable results. A group matches when its session time falls
 * inside one of the student's available windows AND the group's preference tag
 * is compatible with the student's stated preference.
 *
 * Data model (mirrors the PRD spec):
 *   User      { id, firstName, availableWindows[], groupPreference }
 *   Group     { id, day, window, startTime, format, capacity, preference, members[] }
 *   Session   { id, groupId, date, attendees[] }   // one per weekly occurrence
 *   Booking   { id, userId, groupId, sessionId, repeatWeekly }
 *
 * For the clickable prototype, "members" and "attendees" carry only first
 * names — never schedule, workplace, or contact details (guardrail #5).
 */

// Available time windows — sessions are scheduled outside school/work hours.
export const WINDOWS = ['Mornings', 'Evenings', 'Weekends'];

export const GROUP_PREFERENCES = ['Any', 'Women-only'];

// Day labels per window, used to build human-readable session times.
const WINDOW_DAYS = {
  Mornings: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  Evenings: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  Weekends: ['Sat', 'Sun'],
};

const WINDOW_TIME = {
  Mornings: '7:30 AM',
  Evenings: '6:30 PM',
  Weekends: '10:00 AM',
};

const FORMATS = ['Pilates', 'Yoga', 'Gentle Strength', 'Mobility Flow'];

/**
 * Seed groups — about nine weekly sessions across all windows, sized so that
 * some groups are already open (>=4 matched students) and some are still
 * forming. First names only, by guardrail.
 */
export const SEED_GROUPS = [
  {
    id: 'g-morning-pilates',
    day: 'Tue',
    window: 'Mornings',
    startTime: '7:30 AM',
    format: 'Pilates',
    capacity: 8,
    preference: 'Any',
    members: ['Priya', 'Marcus', 'Aisha', 'Liam', 'Sofia'],
  },
  {
    id: 'g-morning-yoga',
    day: 'Thu',
    window: 'Mornings',
    startTime: '7:30 AM',
    format: 'Yoga',
    capacity: 6,
    preference: 'Women-only',
    members: ['Ella', 'Maya', 'Chloe', 'Rina'],
  },
  {
    id: 'g-evening-pilates',
    day: 'Mon',
    window: 'Evenings',
    startTime: '6:30 PM',
    format: 'Pilates',
    capacity: 8,
    preference: 'Any',
    members: ['Devon', 'Priya', 'Noah', 'Zara', 'Owen', 'Hana'],
  },
  {
    id: 'g-evening-strength',
    day: 'Wed',
    window: 'Evenings',
    startTime: '6:30 PM',
    format: 'Gentle Strength',
    capacity: 8,
    preference: 'Any',
    members: ['Marcus', 'Liam', 'Aisha'],
  },
  {
    id: 'g-evening-mobility',
    day: 'Thu',
    window: 'Evenings',
    startTime: '6:30 PM',
    format: 'Mobility Flow',
    capacity: 6,
    preference: 'Women-only',
    members: ['Ella', 'Maya'],
  },
  {
    id: 'g-weekend-yoga',
    day: 'Sat',
    window: 'Weekends',
    startTime: '10:00 AM',
    format: 'Yoga',
    capacity: 8,
    preference: 'Any',
    members: ['Sofia', 'Noah', 'Zara', 'Owen', 'Devon', 'Hana', 'Rina', 'Chloe'],
  },
  {
    id: 'g-weekend-pilates',
    day: 'Sun',
    window: 'Weekends',
    startTime: '10:00 AM',
    format: 'Pilates',
    capacity: 6,
    preference: 'Any',
    members: ['Aisha', 'Liam', 'Maya', 'Priya'],
  },
  {
    id: 'g-weekend-strength',
    day: 'Sat',
    window: 'Weekends',
    startTime: '11:30 AM',
    format: 'Gentle Strength',
    capacity: 8,
    preference: 'Any',
    members: ['Marcus', 'Owen'],
  },
  {
    id: 'g-weekend-mobility',
    day: 'Sun',
    window: 'Weekends',
    startTime: '11:30 AM',
    format: 'Mobility Flow',
    capacity: 6,
    preference: 'Women-only',
    members: ['Rina', 'Chloe', 'Zara'],
  },
];

/**
 * Rule-based matcher. A group matches the student when:
 *   1. the group's window is one of the student's available windows, AND
 *   2. the group's preference is compatible:
 *        - student 'Any'        -> matches 'Any' and 'Women-only'
 *        - student 'Women-only' -> matches 'Women-only' only (guardrail)
 * Groups with fewer than 4 matched/present members are "forming" and not shown
 * as joinable, EXCEPT the empty-state and edge-case test states handle that
 * explicitly in the view layer.
 */
export function matchesStudent(group, { availableWindows, groupPreference }) {
  if (!availableWindows.includes(group.window)) return false;
  if (groupPreference === 'Women-only' && group.preference !== 'Women-only') return false;
  return true;
}

export function isOpen(group) {
  return group.members.length >= 4;
}

export function isFull(group) {
  return group.members.length >= group.capacity;
}

export function spotsLeft(group) {
  return Math.max(0, group.capacity - group.members.length);
}

export function canJoin(group) {
  return isOpen(group) && !isFull(group);
}

export function describeWindow(window) {
  const days = WINDOW_DAYS[window]?.join(', ') ?? '';
  return `${window} · ${days} · ${WINDOW_TIME[window]}`;
}

export function sessionLabel(group) {
  return `${group.day} ${group.startTime} · ${group.format}`;
}

/**
 * Compute the next upcoming session date for a weekly group, given a "today".
 * Returns an ISO date string (YYYY-MM-DD).
 */
export function nextSessionDate(group, from = new Date()) {
  const dayMap = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  const target = dayMap[group.day];
  const d = new Date(from);
  const cur = d.getDay();
  let diff = (target - cur + 7) % 7;
  if (diff === 0) diff = 0; // same day = today
  d.setDate(d.getDate() + diff);
  return d.toISOString().split('T')[0];
}

export function formatDateLong(iso) {
  const d = new Date(iso + 'T12:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
}

export { WINDOW_DAYS, WINDOW_TIME, FORMATS };
