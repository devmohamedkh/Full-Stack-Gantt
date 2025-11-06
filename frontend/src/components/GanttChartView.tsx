
import React from "react";
import { ViewMode } from "gantt-task-react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Tooltip from "@mui/material/Tooltip";
import { useTheme } from "@mui/material/styles";

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

  return (
    <Box
      display="flex"
      alignItems="center"
      gap={3}
      p={2}
      bgcolor={theme.palette.background.paper}
      sx={{ borderRadius: 2, boxShadow: 1 }}
      className="ViewContainer"
    >
      <ButtonGroup variant="outlined" color="primary" size="small">
        {VIEW_MODES.map(({ mode, label }) => (
          <Tooltip title={label} arrow key={label}>
            <Button
              variant={viewMode === mode ? "contained" : "outlined"}
              onClick={() => onViewModeChange(mode)}>{label}</Button>
          </Tooltip>
        ))}
      </ButtonGroup>

    </Box>
  );
};
