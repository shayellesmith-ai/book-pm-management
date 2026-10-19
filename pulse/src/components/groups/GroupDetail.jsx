import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import GroupsIcon from '@mui/icons-material/Groups';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import EventRepeatIcon from '@mui/icons-material/EventRepeat';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { groupsTokens as tokens } from '../../groupsTheme';
import {
  sessionLabel,
  spotsLeft,
  isOpen,
  isFull,
  nextSessionDate,
  formatDateLong,
} from '../../data/groups';

/**
 * Group detail: full roster (first names only), the next session date, the
 * low-intensity format, and the one-tap Join action.
 *
 * Error handling: the join call can fail (simulated connection drop). On
 * failure we show a clear message and a Retry button. Because joinGroup is
 * idempotent, retrying never creates a duplicate or partial booking (error
 * test state).
 */
export default function GroupDetail({ group, onJoin, onBack }) {
  const [status, setStatus] = useState('idle'); // idle | loading | error | success
  const [errorMsg, setErrorMsg] = useState('');
  const [attempts, setAttempts] = useState(0); // failed attempts so far

  const handleJoin = async () => {
    setStatus('loading');
    setErrorMsg('');
    try {
      await onJoin(group, { simulateFailure: false });
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setAttempts(1);
      setErrorMsg(
        "We couldn't reach the booking system — your spot wasn't booked. No duplicate was created. Please retry."
      );
    }
  };

  const handleRetry = async () => {
    setStatus('loading');
    setErrorMsg('');
    try {
      await onJoin(group, { simulateFailure: false });
      setStatus('success');
    } catch (err) {
      const next = attempts + 1;
      setAttempts(next);
      setStatus('error');
      setErrorMsg(
        next === 2
          ? "Still no connection — your spot still isn't booked, and no duplicate was created. You can try again, or come back and book later."
          : next === 3
          ? "We're still unable to reach the booking system. Your booking is safe to retry — nothing partial was saved. If this keeps happening, try again in a few minutes."
          : "Connection still down. No booking was created and no duplicate exists. Please try again later."
      );
    }
  };

  const open = isOpen(group);
  const full = isFull(group);
  const left = spotsLeft(group);
  const next = nextSessionDate(group);

  return (
    <Box sx={{ maxWidth: 560, mx: 'auto', px: 2, py: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <IconButton onClick={onBack} aria-label="Back to groups" size="small">
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" sx={{ fontSize: '1.2rem' }}>
          Group details
        </Typography>
      </Box>

      <Card id="group-detail-card">
        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {/* Session headline */}
          <Box>
            <Typography variant="h6" sx={{ fontSize: '1.1rem', mb: 0.5 }}>
              {sessionLabel(group)}
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
              <Chip
                icon={<FitnessCenterIcon sx={{ fontSize: 14 }} />}
                label={group.format}
                size="small"
                variant="outlined"
                sx={{ height: 22, fontSize: '0.7rem', borderColor: tokens.borderViolet, color: 'text.secondary' }}
              />
              <Chip
                label={`${group.window}`}
                size="small"
                variant="outlined"
                sx={{ height: 22, fontSize: '0.7rem', borderColor: tokens.borderViolet, color: 'text.secondary' }}
              />
              {group.preference !== 'Any' && (
                <Chip
                  label={group.preference}
                  size="small"
                  sx={{
                    height: 22,
                    fontSize: '0.7rem',
                    backgroundColor: tokens.tealDim12 || tokens.accentDim12,
                    color: tokens.teal || tokens.violetBright,
                    border: `1px solid ${tokens.tealBorder40 || tokens.accentBorder40}`,
                  }}
                />
              )}
            </Box>
          </Box>

          {/* Next session */}
          <Box sx={{ p: 1.5, borderRadius: 2, backgroundColor: tokens.accentDim08, border: `1px solid ${tokens.borderViolet}` }}>
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Next session
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600, mt: 0.25 }}>
              {formatDateLong(next)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {group.startTime} · Low-intensity, social format
            </Typography>
          </Box>

          {/* Roster — first names only. Guardrail case: no schedule, workplace,
              or contact details ever appear here. */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <GroupsIcon sx={{ fontSize: 18, color: 'primary.light' }} />
              <Typography variant="h6" sx={{ fontSize: '0.85rem' }}>
                Who's coming ({group.members.length}/{group.capacity})
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {group.members.map((name) => (
                <Chip
                  key={name}
                  label={name}
                  size="small"
                  variant="outlined"
                  sx={{ height: 26, fontSize: '0.75rem', borderColor: tokens.borderViolet }}
                />
              ))}
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1.5 }}>
              First names only — we never share schedules, workplaces, or contact details.
            </Typography>
          </Box>

          {/* Included-in-membership note */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: tokens.teal || 'primary.light' }}>
            <CheckCircleIcon sx={{ fontSize: 18 }} />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Included in your membership — no extra cost
            </Typography>
          </Box>

          {/* Repeat-weekly note */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
            <EventRepeatIcon sx={{ fontSize: 18 }} />
            <Typography variant="body2">
              Joining books you into this weekly session. Cancel any week with no fee, up to start time.
            </Typography>
          </Box>

          {/* Full-group notice — a full group can't be joined. */}
          {full && (
            <Alert severity="info" id="group-full-notice" icon={<GroupsIcon />}>
              This group is full ({group.members.length}/{group.capacity}). Pick another group from the list, or ask to be notified when a spot opens.
            </Alert>
          )}

          {/* Error state */}
          {status === 'error' && (
            <Alert severity="error" id="join-error" sx={{ alignItems: 'center' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, width: '100%' }}>
                <Typography variant="body2">{errorMsg}</Typography>
                {attempts > 1 && (
                  <Typography variant="caption" color="error" sx={{ opacity: 0.8 }}>
                    Attempt {attempts} of booking failed.
                  </Typography>
                )}
                <Button variant="outlined" color="error" size="small" onClick={handleRetry} id="retry-join">
                  {attempts >= 3 ? 'Try again later' : 'Retry booking'}
                </Button>
              </Box>
            </Alert>
          )}

          {/* Join action — hidden once an error is showing, so the retry
              button inside the error alert is the only booking action.
              Also hidden when the group is full (no spots to book). */}
          {status !== 'success' && status !== 'error' && !full && (
            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={handleJoin}
              disabled={status === 'loading' || !open}
              id="detail-join-button"
              startIcon={status === 'loading' ? <CircularProgress size={18} color="inherit" /> : null}
            >
              {status === 'loading' ? 'Booking…' : open ? 'Join with one tap' : 'Forming — not open yet'}
            </Button>
          )}

          {status === 'success' && (
            <Alert severity="success" id="join-success" icon={<CheckCircleIcon />}>
              You're in! Redirecting to your group…
            </Alert>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
