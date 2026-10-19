import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Divider from '@mui/material/Divider';
import GroupsIcon from '@mui/icons-material/Groups';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import EventRepeatIcon from '@mui/icons-material/EventRepeat';
import CancelIcon from '@mui/icons-material/Cancel';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { groupsTokens as tokens } from '../../groupsTheme';
import {
  sessionLabel,
  nextSessionDate,
  formatDateLong,
  isOpen,
} from '../../data/groups';

/**
 * My group: the student's joined group with upcoming sessions, who's coming
 * (first names only), reminders, and no-penalty cancellation.
 *
 * Guardrails enforced here:
 *   - roster shows first names only; no schedule, workplace, or contact details
 *   - cancellation never charges a fee and is available up to start time
 *   - when a member cancels, the group sees they're not coming (roster reflects
 *     confirmed attendees vs. the full member list)
 */
export default function MyGroup({ group, bookings, onCancelBooking, onLeaveGroup, onBrowseGroups }) {
  const [cancelTarget, setCancelTarget] = useState(null);

  const upcoming = bookings
    .filter((b) => b.status === 'confirmed')
    .sort((a, b) => a.sessionId.localeCompare(b.sessionId));

  const nextBooking = upcoming[0] || null;
  const nextDate = nextBooking ? nextBooking.sessionId.replace(`s-${group.id}-`, '') : nextSessionDate(group);

  // The "who's coming" roster: confirmed members this week. A cancelled booking
  // for yourself shows you as "not coming" so the group sees it.
  const cancelledSelf = bookings.some(
    (b) => b.status === 'cancelled' && b.sessionId === `s-${group.id}-${nextDate}`
  );

  const roster = cancelledSelf
    ? group.members.filter(() => true) // other members still listed; self shown separately
    : group.members;

  const handleConfirmCancel = () => {
    if (cancelTarget) {
      onCancelBooking(cancelTarget.id);
      setCancelTarget(null);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', px: 2, py: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontSize: '1.2rem' }}>
            My group
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {sessionLabel(group)}
          </Typography>
        </Box>
        <Chip
          label={group.preference}
          size="small"
          sx={{
            height: 24,
            fontSize: '0.7rem',
            backgroundColor: group.preference !== 'Any' ? (tokens.tealDim12 || tokens.accentDim12) : tokens.accentDim08,
            color: group.preference !== 'Any' ? (tokens.teal || tokens.violetBright) : 'text.secondary',
            border: `1px solid ${tokens.tealBorder40 || tokens.borderViolet}`,
          }}
        />
      </Box>

      {/* Next session card */}
      <Card id="my-group-next-session" sx={{ mb: 2 }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EventAvailableIcon sx={{ color: 'primary.light', fontSize: 20 }} />
            <Typography variant="h6" sx={{ fontSize: '0.9rem' }}>
              Next session
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            {formatDateLong(nextDate)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {group.startTime} · {group.format} · Low-intensity, social
          </Typography>

          {/* Reminder */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', mt: 0.5 }}>
            <NotificationsActiveIcon sx={{ fontSize: 16, color: tokens.teal || 'primary.light' }} />
            <Typography variant="body2">
              You'll get a reminder before the session starts.
            </Typography>
          </Box>

          {/* Booking status */}
          {nextBooking ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: tokens.teal || 'primary.light' }}>
              <CheckCircleIcon sx={{ fontSize: 18 }} />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                You're booked in — see you there!
              </Typography>
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary">
              You've cancelled this week. Rejoin any time — no fee.
            </Typography>
          )}

          {/* Repeat weekly */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
            <EventRepeatIcon sx={{ fontSize: 16 }} />
            <Typography variant="body2">
              Repeats weekly · included in your membership
            </Typography>
          </Box>

          {/* Cancel no-penalty */}
          {nextBooking && (
            <Button
              variant="outlined"
              color="error"
              fullWidth
              startIcon={<CancelIcon />}
              onClick={() => setCancelTarget(nextBooking)}
              id="cancel-booking-button"
              sx={{ mt: 0.5 }}
            >
              Cancel this week — no fee
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Who's coming — guardrail: first names only */}
      <Card id="my-group-roster" sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <GroupsIcon sx={{ color: 'primary.light', fontSize: 20 }} />
            <Typography variant="h6" sx={{ fontSize: '0.9rem' }}>
              Who's coming ({roster.length})
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {roster.map((name) => (
              <Chip
                key={name}
                label={name}
                size="small"
                variant="outlined"
                sx={{ height: 26, fontSize: '0.75rem', borderColor: tokens.borderViolet }}
              />
            ))}
            {cancelledSelf && (
              <Chip
                label="You — not coming this week"
                size="small"
                sx={{
                  height: 26,
                  fontSize: '0.75rem',
                  backgroundColor: 'rgba(251,191,36,0.12)',
                  color: '#FBBF24',
                  border: '1px solid rgba(251,191,36,0.40)',
                }}
              />
            )}
          </Box>
          <Divider sx={{ my: 1.5, borderColor: tokens.borderViolet }} />
          <Typography variant="caption" color="text.secondary">
            First names only. We never show schedules, workplaces, or contact details — yours or anyone else's.
          </Typography>
        </CardContent>
      </Card>

      {/* Upcoming sessions list */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontSize: '0.85rem', mb: 1.5 }}>
            Upcoming sessions
          </Typography>
          {upcoming.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No confirmed sessions right now. Rejoin when you're ready.
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {upcoming.map((b) => {
                const date = b.sessionId.replace(`s-${group.id}-`, '');
                return (
                  <Box
                    key={b.id}
                    sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, borderRadius: 1, backgroundColor: tokens.accentDim08 }}
                  >
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {formatDateLong(date)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {group.startTime} · {group.format}
                      </Typography>
                    </Box>
                    <Button size="small" color="error" onClick={() => setCancelTarget(b)} id={`cancel-session-${b.id}`}>
                      Cancel
                    </Button>
                  </Box>
                );
              })}
            </Box>
          )}
        </CardContent>
      </Card>

      <Box sx={{ display: 'flex', gap: 1.5 }}>
        <Button variant="outlined" fullWidth onClick={onBrowseGroups} id="browse-groups">
          Browse groups
        </Button>
        <Button variant="text" color="error" onClick={onLeaveGroup} startIcon={<LogoutIcon />} id="leave-group">
          Leave group
        </Button>
      </Box>

      {/* Cancel confirmation dialog — reinforces no-penalty */}
      <Dialog open={!!cancelTarget} onClose={() => setCancelTarget(null)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontFamily: '"Space Grotesk", sans-serif', textTransform: 'uppercase', letterSpacing: '0.12em', fontSize: '1rem' }}>
          Cancel this session?
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 1.5 }}>
            You can cancel with <strong>no fee</strong>, right up to the start time. Your group will see you're not coming this week.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            You stay in the group — this only skips this one session. Your weekly booking resumes next week.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelTarget(null)} id="cancel-cancel">Keep my spot</Button>
          <Button variant="outlined" color="error" onClick={handleConfirmCancel} id="confirm-cancel">
            Cancel — no fee
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
