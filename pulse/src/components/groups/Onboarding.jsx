import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import GroupIcon from '@mui/icons-material/Group';
import { tokens } from '../../theme';
import { WINDOWS, GROUP_PREFERENCES, describeWindow } from '../../data/groups';

/**
 * Onboarding screen: the student sets when they're available outside school and
 * work (mornings, evenings, weekends) and an optional group preference.
 *
 * Guardrail: the student is never placed in a group outside their stated
 * availability or group preference — the matcher honors exactly these inputs.
 */
export default function Onboarding({ onSubmit }) {
  const [windows, setWindows] = useState([]);
  const [preference, setPreference] = useState('Any');

  const toggleWindow = (w) => {
    setWindows((prev) =>
      prev.includes(w) ? prev.filter((x) => x !== w) : [...prev, w]
    );
  };

  const canSubmit = windows.length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit({ availableWindows: windows, groupPreference: preference });
  };

  return (
    <Box sx={{ maxWidth: 560, mx: 'auto', px: 2, py: 3 }}>
      <Typography variant="h5" sx={{ fontSize: '1.2rem', mb: 0.5 }}>
        Find your group
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Small on-campus peer workout groups — included in your membership. Tell us when you're free and we'll match you.
      </Typography>

      <Card id="onboarding-card">
        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Availability */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <AccessTimeIcon sx={{ color: 'primary.light', fontSize: 20 }} />
              <Typography variant="h6" sx={{ fontSize: '0.85rem' }}>
                When are you free outside school & work?
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: '0.8rem' }}>
              Pick any that work. Sessions run outside class and work hours.
            </Typography>
            <FormGroup>
              {WINDOWS.map((w) => (
                <FormControlLabel
                  key={w}
                  control={
                    <Checkbox
                      checked={windows.includes(w)}
                      onChange={() => toggleWindow(w)}
                      id={`onboarding-window-${w.toLowerCase()}`}
                      sx={{
                        color: tokens.borderViolet,
                        '&.Mui-checked': { color: tokens.violetBright },
                      }}
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {w}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {describeWindow(w)}
                      </Typography>
                    </Box>
                  }
                />
              ))}
            </FormGroup>
          </Box>

          {/* Group preference */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <GroupIcon sx={{ color: 'primary.light', fontSize: 20 }} />
              <Typography variant="h6" sx={{ fontSize: '0.85rem' }}>
                Group preference (optional)
              </Typography>
            </Box>
            <ToggleButtonGroup
              value={preference}
              exclusive
              onChange={(_, v) => v && setPreference(v)}
              fullWidth
              size="small"
              aria-label="Group preference"
            >
              {GROUP_PREFERENCES.map((p) => (
                <ToggleButton
                  key={p}
                  value={p}
                  id={`onboarding-pref-${p.toLowerCase().replace(/[^a-z]/g, '')}`}
                  sx={{
                    textTransform: 'uppercase',
                    fontSize: '0.75rem',
                    letterSpacing: '0.08em',
                    fontFamily: '"Space Grotesk", sans-serif',
                    '&.Mui-selected': {
                      backgroundColor: tokens.accentDim15,
                      color: tokens.violetBright,
                      borderColor: tokens.accentBorder40,
                    },
                  }}
                >
                  {p}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Box>

          {/* Summary chips */}
          {windows.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {windows.map((w) => (
                <Chip
                  key={w}
                  label={w}
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{
                    fontFamily: '"Space Grotesk", sans-serif',
                    fontWeight: 600,
                    borderColor: tokens.accentBorder40,
                  }}
                />
              ))}
              <Chip
                label={preference}
                size="small"
                sx={{
                  fontFamily: '"Space Grotesk", sans-serif',
                  fontWeight: 600,
                  backgroundColor: tokens.tealDim12 || tokens.accentDim12,
                  color: tokens.teal || tokens.violetBright,
                  border: `1px solid ${tokens.tealBorder40 || tokens.accentBorder40}`,
                }}
              />
            </Box>
          )}

          <Button
            variant="contained"
            size="large"
            fullWidth
            disabled={!canSubmit}
            onClick={handleSubmit}
            id="onboarding-submit"
          >
            See matching groups
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
