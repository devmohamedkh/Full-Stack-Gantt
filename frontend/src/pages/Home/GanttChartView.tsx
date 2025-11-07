
import React from "react";
import { ViewMode } from "gantt-task-react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Tooltip from "@mui/material/Tooltip";
import { useTheme } from "@mui/material/styles";
import { Typography, Menu, MenuItem, IconButton, useMediaQuery } from "@mui/material";
import ViewCompactIcon from "@mui/icons-material/ViewCompact";

type GanttChartViewProps = {
  onViewModeChange: (viewMode: ViewMode) => void;
  viewMode?: ViewMode;
};

const VIEW_MODES = [
  { mode: ViewMode.Hour, label: "Hour" },
  { mode: ViewMode.QuarterDay, label: "Quarter Day" },
  { mode: ViewMode.HalfDay, label: "Half Day" },
  { mode: ViewMode.Day, label: "Day" },
  { mode: ViewMode.Week, label: "Week" },
  { mode: ViewMode.Month, label: "Month" },
  { mode: ViewMode.Year, label: "Year" },
];

export const GanttChartView: React.FC<GanttChartViewProps> = ({
  onViewModeChange,
  viewMode = ViewMode.Year,
}) => {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));

  // Menu state for mobile view
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuSelect = (mode: ViewMode) => {
    onViewModeChange(mode);
    handleMenuClose();
  };

  return (
    <Box
      sx={styles.container}
      className="ViewContainer"
    >
      {isXs ? (
        <Box display="flex" alignItems="center">
          <IconButton
            onClick={handleMenuOpen}
            color="primary"
            aria-label="View mode menu"
            size="small"
          >
            <ViewCompactIcon />
          </IconButton>
          <Typography variant="body2" sx={{ ml: 1, fontWeight: 500 }}>
            {VIEW_MODES.find(v => v.mode === viewMode)?.label || "View"}
          </Typography>
          <Menu
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            transformOrigin={{ vertical: "top", horizontal: "left" }}
          >
            {VIEW_MODES.map(({ mode, label }) => (
              <MenuItem
                key={mode}
                selected={viewMode === mode}
                onClick={() => handleMenuSelect(mode)}
                sx={{ minWidth: 120 }}
              >
                {label}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      ) : (
        <ButtonGroup variant="outlined" color="primary" size="small">
          {VIEW_MODES.map(({ mode, label }) => (
            <Tooltip title={label} arrow key={label}>
              <Button
                sx={{ height: '36px' }}
                variant={viewMode === mode ? "contained" : "outlined"}
                onClick={() => onViewModeChange(mode)}
              >
                {label}
              </Button>
            </Tooltip>
          ))}
        </ButtonGroup>
      )}
    </Box>
  );
};


const styles = {
  container: {
    display: "flex",
    alignItems: { xs: "stretch", sm: "end" },
    justifyContent: { xs: "stretch", sm: "end" },
    gap: { xs: 1, sm: 3 },
    p: 2,
    bgcolor: 'palette.background.paper',
    borderRadius: 2,
    flexDirection: { xs: "column", sm: "row" },
  }
}
