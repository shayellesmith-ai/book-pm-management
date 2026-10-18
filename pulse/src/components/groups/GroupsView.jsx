import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { tokens } from '../../theme';
import { matchesStudent, isOpen } from '../../data/groups';
import useGroups from '../../hooks/useGroups';
import Onboarding from './Onboarding';
import GroupList from './GroupList';
import GroupDetail from './GroupDetail';
import MyGroup from './MyGroup';
import BookingConfirmation from './BookingConfirmation';

/**
 * GroupsView — orchestrates the peer-group reactivation MVP screens:
 *   onboarding -> group list -> group detail -> booking confirmation -> my group
 *
 * A test-state switcher (matching the WeeklySummary pattern) lets a reviewer
 * click through the five required test states:
 *   1. happyPath   – join a matching group, see who's coming, get a reminder
 *   2. emptyState  – no matching group: honest empty state + "we'll let you know"
 *   3. errorState  – connection drops while joining: clear message, retry, no dup
 *   4. edgeCase    – group with only 3 matched students doesn't open; nearest open offered
 *   5. guardrail   – another member views the roster: first names only, no PII
 *
 * The switcher seeds the feature into the right state; the student then walks
 * the real flow. Selecting "happyPath" resets to a clean onboarding.
 */

const TEST_STATES = [
  { key: 'happyPath', label: 'Happy path' },
  { key: 'emptyState', label: 'Empty state' },
  { key: 'errorState', label: 'Error' },
  { key: 'edgeCase', label: 'Edge case' },
  { key: 'guardrail', label: 'Guardrail' },
];

// Profiles that put the matcher into each test state.
const PROFILES = {
  happyPath: { availableWindows: ['Mornings', 'Evenings'], groupPreference: 'Any' },
  // No open women-only group in evenings -> empty state with "we'll let you know".
  emptyState: { availableWindows: ['Evenings'], groupPreference: 'Women-only' },
  errorState: { availableWindows: ['Evenings'], groupPreference: 'Any' },
  edgeCase: { availableWindows: ['Weekends'], groupPreference: 'Women-only' },
  guardrail: { availableWindows: ['Mornings', 'Evenings'], groupPreference: 'Women-only' },
};

export default function GroupsView() {
  const {
    groups,
    profile,
    joinedGroupId,
    joinedGroup,
    myBookings,
    saveProfile,
    joinGroup,
    cancelBooking,
    leaveGroup,
    resetFeature,
  } = useGroups();

  const [screen, setScreen] = useState('onboarding'); // onboarding | list | detail | confirmation | mygroup
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [testState, setTestState] = useState('happyPath');
  const [toast, setToast] = useState(null);

  // First mount: if no profile is saved, show onboarding. We do NOT auto-seed
  // on mount — that would wipe a returning user's joined group. The test-state
  // switcher below is the only thing that resets + seeds.
  useEffect(() => {
    if (!profile) {
      setScreen('onboarding');
    } else if (joinedGroupId) {
      setScreen('mygroup');
    } else {
      setScreen('list');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When the user picks a test state, reset the feature and seed the matching
  // profile so the reviewer lands in the right scenario. Skipped on first mount.
  const firstMount = useRef(true);
  useEffect(() => {
    if (firstMount.current) {
      firstMount.current = false;
      return;
    }
    resetFeature();
    const p = PROFILES[testState];
    if (testState === 'emptyState') {
      // Seed the profile that produces no open matches, then go straight to the
      // list so the empty state shows.
      saveProfile(p);
      setScreen('list');
    } else if (testState === 'guardrail') {
      saveProfile(p);
      // Auto-join the morning women-only group to show the roster view.
      const target = groups.find(
        (g) => g.preference === 'Women-only' && g.window === 'Mornings'
      );
      if (target) {
        // Defer the join so profile state has flushed before joinGroup reads it.
        setTimeout(() => {
          joinGroup(target.id).then(() => setScreen('mygroup')).catch(() => {
            setScreen('list');
          });
        }, 0);
      } else {
        setScreen('list');
      }
    } else {
      saveProfile(p);
      setScreen('list');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testState]);

  const matchingGroups = useMemo(() => {
    if (!profile) return [];
    return groups
      .filter((g) => matchesStudent(g, profile))
      .filter(isOpen); // only open groups shown as joinable
  }, [groups, profile]);

  // Edge case: if the student's only matches are forming (<4), surface the
  // nearest open group as an alternative.
  const formingMatches = useMemo(() => {
    if (!profile) return [];
    return groups.filter(
      (g) => matchesStudent(g, profile) && !isOpen(g)
    );
  }, [groups, profile]);

  const handleOnboardSubmit = (p) => {
    saveProfile(p);
    setScreen('list');
  };

  const handleSelectGroup = (group) => {
    setSelectedGroupId(group.id);
    setScreen('detail');
  };

  const handleJoin = useCallback(
    async (group, opts) => {
      // In errorState test, force the first join attempt to fail so the
      // reviewer sees the error + retry path (no duplicate booking).
      if (testState === 'errorState') {
        try {
          await joinGroup(group.id, { simulateFailure: true });
        } catch {
          // surface failure to GroupDetail so it shows the error UI
          throw new Error('NETWORK');
        }
        return;
      }
      await joinGroup(group.id, opts);
      setScreen('confirmation');
    },
    [joinGroup, testState]
  );

  const handleCancelBooking = (bookingId) => {
    cancelBooking(bookingId);
    setToast({ type: 'success', msg: "Cancelled — no fee. Your group sees you're not coming this week." });
  };

  const handleLeaveGroup = () => {
    leaveGroup();
    setScreen('list');
    setToast({ type: 'info', msg: "You've left the group. You can rejoin any time." });
  };

  const handleNotifyMe = () => {
    setToast({ type: 'info', msg: "Got it — we'll let you know when a group opens for your availability." });
  };

  const selectedGroup = groups.find((g) => g.id === selectedGroupId);

  // --- Render the active screen ---
  let content;
  if (screen === 'onboarding' || !profile) {
    content = <Onboarding onSubmit={handleOnboardSubmit} />;
  } else if (screen === 'mygroup' && joinedGroup) {
    content = (
      <MyGroup
        group={joinedGroup}
        bookings={myBookings}
        onCancelBooking={handleCancelBooking}
        onLeaveGroup={handleLeaveGroup}
        onBrowseGroups={() => setScreen('list')}
      />
    );
  } else if (screen === 'confirmation' && joinedGroup) {
    content = (
      <BookingConfirmation
        group={joinedGroup}
        onGoToMyGroup={() => setScreen('mygroup')}
        onBrowseGroups={() => setScreen('list')}
      />
    );
  } else if (screen === 'detail' && selectedGroup) {
    content = (
      <GroupDetail
        group={selectedGroup}
        onJoin={handleJoin}
        onBack={() => setScreen('list')}
      />
    );
  } else {
    // Group list, with the edge-case banner when only forming groups match.
    content = (
      <Box>
        {testState === 'edgeCase' && formingMatches.length > 0 && matchingGroups.length === 0 && (
          <EdgeCaseBanner
            forming={formingMatches}
            openAlternatives={groups.filter(
              (g) => isOpen(g) && g.window === profile.availableWindows[0]
            )}
          />
        )}
        {testState === 'edgeCase' && formingMatches.length > 0 && matchingGroups.length === 0 && (
          // In the edge case, show nearest open groups in the same window as
          // joinable alternatives (relaxing the preference constraint, since
          // the stated-preference group can't open yet).
          <GroupList
            groups={groups.filter((g) => isOpen(g) && g.window === profile.availableWindows[0])}
            onJoin={handleSelectGroup}
            onNotifyMe={handleNotifyMe}
          />
        )}
        {joinedGroup && (
          <Box sx={{ maxWidth: 640, mx: 'auto', px: 2, pt: 2 }}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                backgroundColor: tokens.tealDim12 || tokens.accentDim08,
                border: `1px solid ${tokens.tealBorder40 || tokens.borderViolet}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
              }}
              onClick={() => setScreen('mygroup')}
            >
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Your group
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {joinedGroup.day} {joinedGroup.startTime} · {joinedGroup.format}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: tokens.teal || 'primary.light', fontWeight: 600 }}>
                View →
              </Typography>
            </Box>
          </Box>
        )}
        {/* In the edge case, the strict-match list is empty and alternatives
            are rendered above — skip the main (empty-state) list here. */}
        {!(testState === 'edgeCase' && formingMatches.length > 0 && matchingGroups.length === 0) && (
          <GroupList
            groups={matchingGroups}
            onJoin={handleSelectGroup}
            onNotifyMe={handleNotifyMe}
          />
        )}
      </Box>
    );
  }

  return (
    <Box>
      {content}

      {/* Test-state switcher */}
      <Box sx={{ maxWidth: 640, mx: 'auto', px: 2, py: 3 }}>
        <Typography
          variant="subtitle1"
          sx={{ fontSize: '0.75rem', color: 'text.secondary', mb: 1.5, textTransform: 'uppercase', letterSpacing: '0.12em' }}
        >
          Test states
        </Typography>
        <ToggleButtonGroup
          value={testState}
          exclusive
          onChange={(_, v) => v && setTestState(v)}
          aria-label="Groups test state"
          sx={{ flexWrap: 'wrap', gap: 1, '& .MuiToggleButton-root': { borderRadius: '10px !important', border: '1px solid', borderColor: 'divider', px: 2 } }}
        >
          {TEST_STATES.map((s) => (
            <ToggleButton key={s.key} value={s.key} id={`groups-test-${s.key}`} sx={{ fontSize: '0.72rem' }}>
              {s.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>

      {/* Toast */}
      <Snackbar
        open={!!toast}
        autoHideDuration={4000}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        {toast ? (
          <Alert severity={toast.type} onClose={() => setToast(null)} variant="filled">
            {toast.msg}
          </Alert>
        ) : undefined}
      </Snackbar>
    </Box>
  );
}

/** Edge-case banner: forming groups don't open; offer the nearest open one. */
function EdgeCaseBanner({ forming, openAlternatives }) {
  return (
    <Box sx={{ maxWidth: 640, mx: 'auto', px: 2, pt: 3 }}>
      <Box
        sx={{
          p: 2,
          borderRadius: 2,
          backgroundColor: 'rgba(251,191,36,0.10)',
          border: '1px solid rgba(251,191,36,0.40)',
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
          These groups are still forming
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: '0.85rem' }}>
          A group only opens once at least four students match its time. {forming.length} group{forming.length === 1 ? '' : 's'} matched you but {forming.length === 1 ? 'has' : 'have'} only {forming.map((g) => g.members.length).join(', ')} student{forming.length === 1 ? '' : 's'} so far.
        </Typography>
        {openAlternatives.length > 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
            We've shown you the nearest open groups below instead — tap one to join.
          </Typography>
        )}
      </Box>
    </Box>
  );
}
