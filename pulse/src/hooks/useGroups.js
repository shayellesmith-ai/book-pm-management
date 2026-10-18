import { useState, useEffect, useCallback, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { SEED_GROUPS, matchesStudent, isOpen } from '../data/groups';

const PROFILE_KEY = 'pulse.groupProfile';
const GROUP_STATE_KEY = 'pulse.groupState';

/**
 * Custom hook for the peer-group reactivation feature.
 *
 * Owns three pieces of browser state:
 *   - profile:  the student's availability windows + group preference, set in
 *               onboarding. Null until onboarding is complete.
 *   - joinedGroupId: the group the student joined (one-tap), or null.
 *   - bookings:  list of weekly session bookings with a repeatWeekly flag and a
 *               per-booking status (confirmed | cancelled). Cancellation never
 *               carries a fee (guardrail).
 *
 * All mutations are idempotent: joining a group you already belong to does not
 * create a duplicate booking; cancelling an already-cancelled booking is a
 * no-op. This is what makes the connection-drop retry (error test state) safe.
 */
export default function useGroups() {
  const [profile, setProfile] = useState(null);
  const [joinedGroupId, setJoinedGroupId] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [groups] = useState(SEED_GROUPS);

  // Load persisted state on mount.
  useEffect(() => {
    try {
      const p = localStorage.getItem(PROFILE_KEY);
      if (p) setProfile(JSON.parse(p));
    } catch { /* ignore */ }
    try {
      const s = localStorage.getItem(GROUP_STATE_KEY);
      if (s) {
        const parsed = JSON.parse(s);
        setJoinedGroupId(parsed.joinedGroupId ?? null);
        setBookings(parsed.bookings ?? []);
      }
    } catch { /* ignore */ }
  }, []);

  const persist = useCallback((nextJoined, nextBookings) => {
    setJoinedGroupId(nextJoined);
    setBookings(nextBookings);
    localStorage.setItem(
      GROUP_STATE_KEY,
      JSON.stringify({ joinedGroupId: nextJoined, bookings: nextBookings })
    );
  }, []);

  /** Save onboarding profile. */
  const saveProfile = useCallback((p) => {
    const next = { ...p, id: p.id || uuidv4() };
    setProfile(next);
    localStorage.setItem(PROFILE_KEY, JSON.stringify(next));
    return next;
  }, []);

  /**
   * Join a group with one tap. Idempotent: re-joining the same group while
   * already a member is a no-op (no duplicate booking). Throws a wrapped error
   * on failure so the caller can surface a retry affordance (error test state).
   */
  const joinGroup = useCallback(
    (groupId, { simulateFailure = false } = {}) => {
      return new Promise((resolve, reject) => {
        // Simulated network latency so the error/retry path is demonstrable.
        setTimeout(() => {
          if (simulateFailure) {
            reject(new Error('NETWORK'));
            return;
          }
          try {
            const group = groups.find((g) => g.id === groupId);
            if (!group) {
              reject(new Error('NOT_FOUND'));
              return;
            }
            // Idempotency: already a member of this group -> no duplicate.
            if (joinedGroupId === groupId) {
              resolve({ groupId, alreadyMember: true });
              return;
            }
            const sessionId = `s-${groupId}-${nextSessionDate(group)}`;
            const existing = bookings.find(
              (b) => b.groupId === groupId && b.sessionId === sessionId
            );
            let nextBookings;
            if (existing) {
              // Re-confirm a previously cancelled session instead of duplicating.
              nextBookings = bookings.map((b) =>
                b.id === existing.id ? { ...b, status: 'confirmed' } : b
              );
            } else {
              nextBookings = [
                ...bookings,
                {
                  id: uuidv4(),
                  userId: profile?.id,
                  groupId,
                  sessionId,
                  repeatWeekly: true,
                  status: 'confirmed',
                  createdAt: new Date().toISOString(),
                },
              ];
            }
            persist(groupId, nextBookings);
            resolve({ groupId, alreadyMember: false });
          } catch (err) {
            reject(new Error('FAILED'));
          }
        }, 700);
      });
    },
    [groups, joinedGroupId, bookings, profile, persist]
  );

  /**
   * Cancel a booking with no penalty, up to the start time. The group sees the
   * member is not coming (reflected in roster/attendee counts). Idempotent.
   */
  const cancelBooking = useCallback(
    (bookingId) => {
      const nextBookings = bookings.map((b) =>
        b.id === bookingId ? { ...b, status: 'cancelled' } : b
      );
      persist(joinedGroupId, nextBookings);
    },
    [bookings, joinedGroupId, persist]
  );

  /** Leave the group entirely (also cancels all its bookings). */
  const leaveGroup = useCallback(() => {
    const nextBookings = bookings
      .filter((b) => b.groupId !== joinedGroupId)
      .concat(
        bookings
          .filter((b) => b.groupId === joinedGroupId)
          .map((b) => ({ ...b, status: 'cancelled' }))
      );
    persist(null, nextBookings);
  }, [bookings, joinedGroupId, persist]);

  /** Reset the whole feature state (used by the test-state switcher). */
  const resetFeature = useCallback(() => {
    setProfile(null);
    setJoinedGroupId(null);
    setBookings([]);
    localStorage.removeItem(PROFILE_KEY);
    localStorage.removeItem(GROUP_STATE_KEY);
  }, []);

  const joinedGroup = useMemo(
    () => groups.find((g) => g.id === joinedGroupId) || null,
    [groups, joinedGroupId]
  );

  const myBookings = useMemo(
    () => bookings.filter((b) => b.groupId === joinedGroupId),
    [bookings, joinedGroupId]
  );

  return {
    groups,
    profile,
    joinedGroupId,
    joinedGroup,
    bookings,
    myBookings,
    saveProfile,
    joinGroup,
    cancelBooking,
    leaveGroup,
    resetFeature,
  };
}

function nextSessionDate(group) {
  const dayMap = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  const target = dayMap[group.day];
  const d = new Date();
  const cur = d.getDay();
  const diff = (target - cur + 7) % 7;
  d.setDate(d.getDate() + diff);
  return d.toISOString().split('T')[0];
}

// Re-export rule helpers for components.
export { matchesStudent, isOpen };
