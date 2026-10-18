import React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import EventRepeatIcon from '@mui/icons-material/EventRepeat';
import { tokens } from '../../theme';
import { sessionLabel, nextSessionDate, formatDateLong } from '../../data/groups';

/**
 * Booking confirmation: shown immediately after a successful one-tap join.
 * Confirms the weekly recurring booking, the no-penalty cancellation policy,
 * and routes the student to "My group".
 */
export default function BookingConfirmation({ group, onGoToMyGroup, onBrowseGroups }) {
  const next = nextSessionDate(group);

  return (
    <Box sx={{ maxWidth: 520, mx: 'auto', px: 2, py: 3 }}>
      <Card id="booking-confirmation-card">
        <CardContent sx={{ textAlign: 'center', py: 4, px: 3, display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
          <CheckCircleIcon sx={{ fontSize: 56, color: tokens.teal || 'primary.light' }} />
          <Typography variant="h5" sx={{ fontSize: '1.2rem' }}>
            You're in!
          </Typography>
          <Typography variant="body2" color="text.secondary">
            You've joined this weekly group session.
          </Typography>

          <Box sx={{ width: '100%', p: 2, borderRadius: 2, backgroundColor: tokens.accentDim08, border: `1px solid ${tokens.borderViolet}` }}>
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Your weekly session
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600, mt: 0.25 }}>
              {sessionLabel(group)}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mt: 1 }}>
              <EventAvailableIcon sx={{ fontSize: 16, color: 'primary.light' }} />
              <Typography variant="body2">
                Next: {formatDateLong(next)} · {group.startTime}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
            <EventRepeatIcon sx={{ fontSize: 18 }} />
            <Typography variant="body2">
              Repeats weekly · Cancel any week, no fee, up to start time
            </Typography>
          </Box>

          <Chip
            label="Included in your membership"
            size="small"
            sx={{
              backgroundColor: tokens.tealDim12 || tokens.accentDim12,
              color: tokens.teal || tokens.violetBright,
              border: `1px solid ${tokens.tealBorder40 || tokens.accentBorder40}`,
              fontFamily: '"Space Grotesk", sans-serif',
              fontWeight: 600,
            }}
          />

          <Button variant="contained" size="large" fullWidth onClick={onGoToMyGroup} id="confirmation-go-my-group">
            Go to My group
          </Button>
          <Button variant="text" size="small" onClick={onBrowseGroups} id="confirmation-browse">
            Browse other groups
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
