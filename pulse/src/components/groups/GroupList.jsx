import React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';
import GroupsIcon from '@mui/icons-material/Groups';
import ScheduleIcon from '@mui/icons-material/Schedule';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { tokens } from '../../theme';
import { spotsLeft, isOpen, isFull, sessionLabel } from '../../data/groups';

/**
 * Group list: shows matching, open groups of 4–8 students. Each card is a
 * one-tap "Join" entry into the group detail.
 *
 * Empty state: when no group matches the student's windows/preference, an
 * honest empty state is shown with a "we'll let you know" option — no
 * mismatched groups are ever displayed (empty-state test).
 */
export default function GroupList({ groups, onJoin, onNotifyMe }) {
  if (groups.length === 0) {
    return (
      <Box sx={{ maxWidth: 560, mx: 'auto', px: 2, py: 3 }}>
        <Card id="group-empty-state">
          <CardContent sx={{ textAlign: 'center', py: 5, px: 3 }}>
            <GroupsIcon sx={{ fontSize: 56, color: 'text.secondary', opacity: 0.4, mb: 2 }} />
            <Typography variant="h6" sx={{ fontSize: '1rem', mb: 1 }}>
              No groups match — yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 380, mx: 'auto' }}>
              We don't have an open group for your exact availability right now. We won't show you groups that don't fit — instead, we'll let you know the moment one opens.
            </Typography>
            <Button
              variant="outlined"
              onClick={onNotifyMe}
              id="notify-me-button"
              startIcon={<ScheduleIcon />}
            >
              We'll let you know
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 640, mx: 'auto', px: 2, py: 3 }}>
      <Typography variant="h5" sx={{ fontSize: '1.2rem', mb: 0.5 }}>
        Matching groups
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {groups.length} open {groups.length === 1 ? 'group' : 'groups'} fit your availability. Tap one to join.
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {groups.map((g) => {
          const left = spotsLeft(g);
          const open = isOpen(g);
          const full = isFull(g);
          return (
            <Card key={g.id} id={`group-card-${g.id}`}>
              <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontSize: '1rem', mb: 0.25 }}>
                      {sessionLabel(g)}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
                      <Chip
                        icon={<FitnessCenterIcon sx={{ fontSize: 14 }} />}
                        label={g.format}
                        size="small"
                        variant="outlined"
                        sx={{ height: 22, fontSize: '0.7rem', borderColor: tokens.borderViolet, color: 'text.secondary' }}
                      />
                      {g.preference !== 'Any' && (
                        <Chip
                          label={g.preference}
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
                  <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: full ? 'text.secondary' : 'primary.light' }}>
                      {g.members.length}/{g.capacity}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {full ? 'full' : `${left} spot${left === 1 ? '' : 's'}`}
                    </Typography>
                  </Box>
                </Box>

                {/* Roster preview — first names only, by guardrail. */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap' }}>
                  <GroupsIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                  {g.members.slice(0, 5).map((name) => (
                    <Chip
                      key={name}
                      label={name}
                      size="small"
                      variant="outlined"
                      sx={{ height: 22, fontSize: '0.7rem', borderColor: tokens.borderViolet, color: 'text.secondary' }}
                    />
                  ))}
                  {g.members.length > 5 && (
                    <Typography variant="caption" color="text.secondary">
                      +{g.members.length - 5} more
                    </Typography>
                  )}
                </Box>

                {/* Fill indicator */}
                <LinearProgress
                  variant="determinate"
                  value={(g.members.length / g.capacity) * 100}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: tokens.accentDim08,
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: full ? 'text.disabled' : open ? (tokens.teal || tokens.violetBright) : tokens.violetBright,
                      borderRadius: 3,
                    },
                  }}
                />

                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => onJoin(g)}
                  id={`join-group-${g.id}`}
                  disabled={!open || full}
                >
                  {full ? 'Full — try another group' : open ? 'Join with one tap' : 'Forming — not open yet'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </Box>
    </Box>
  );
}

/**
 * FormingGroupCard: shows a group that matches the student's availability and
 * preference but hasn't opened yet (fewer than 4 matched members). The student
 * can see exactly which group is forming — its time, format, who's in it so far
 * — and how many more students are needed. A "we'll let you know" action lets
 * them opt in to a notification when the group opens.
 *
 * This is used in the edge-case test state so the forming group is visible,
 * not just described in banner text.
 */
export function FormingGroupCard({ group, onNotifyMe }) {
  const needed = Math.max(0, 4 - group.members.length);
  const left = spotsLeft(group);
  return (
    <Card id={`forming-group-card-${group.id}`} sx={{ opacity: 0.92 }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
          <Box>
            <Typography variant="h6" sx={{ fontSize: '1rem', mb: 0.25 }}>
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
          <Chip
            icon={<HourglassEmptyIcon sx={{ fontSize: 14 }} />}
            label="Forming"
            size="small"
            sx={{
              height: 24,
              fontSize: '0.7rem',
              backgroundColor: 'rgba(251,191,36,0.12)',
              color: '#FBBF24',
              border: '1px solid rgba(251,191,36,0.40)',
              fontWeight: 600,
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, p: 1.25, borderRadius: 1.5, backgroundColor: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.30)' }}>
          <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
            {group.members.length} {group.members.length === 1 ? 'student' : 'students'} so far — needs {needed} more to open. We'll start this group the moment four students match.
          </Typography>
        </Box>

        {/* Roster preview — first names only, by guardrail. */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap' }}>
          <GroupsIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          {group.members.map((name) => (
            <Chip
              key={name}
              label={name}
              size="small"
              variant="outlined"
              sx={{ height: 22, fontSize: '0.7rem', borderColor: tokens.borderViolet, color: 'text.secondary' }}
            />
          ))}
        </Box>

        <LinearProgress
          variant="determinate"
          value={Math.min(100, (group.members.length / 4) * 100)}
          sx={{
            height: 6,
            borderRadius: 3,
            backgroundColor: 'rgba(251,191,36,0.15)',
            '& .MuiLinearProgress-bar': {
              backgroundColor: '#FBBF24',
              borderRadius: 3,
            },
          }}
        />
        <Typography variant="caption" color="text.secondary">
          {group.members.length}/4 to open · {left} {left === 1 ? 'spot' : 'spots'} total once open
        </Typography>

        <Button
          variant="outlined"
          fullWidth
          onClick={onNotifyMe}
          id={`notify-when-forming-${group.id}`}
          startIcon={<ScheduleIcon />}
        >
          Notify me when it opens
        </Button>
      </CardContent>
    </Card>
  );
}
