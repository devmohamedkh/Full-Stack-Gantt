import { type Task } from 'gantt-task-react';
import Box from '@mui/material/Box';

import { Typography } from '@mui/material';

interface GanttChartTooltipContentProps {
  task: Task;
}

export const GanttChartTooltipContent = ({
  task
}: GanttChartTooltipContentProps) => {
  return (
    <Box sx={styles.container}  >
      <Typography variant="subtitle1" sx={styles.title}>
        {task.name}
      </Typography>
      <Typography variant="body2" sx={styles.data}>
        <b>Type:</b> {task.type}
      </Typography>
      <Typography variant="body2" sx={styles.data}>
        <b>Start:</b> {task.start.toLocaleDateString()}
      </Typography>
      <Typography variant="body2" sx={styles.data}>
        <b>End:</b> {task.end.toLocaleDateString()}
      </Typography>
      <Typography variant="body2" sx={styles.data}>
        <b>Progress:</b> {task.progress}%
      </Typography>

      <Typography variant="caption" sx={styles.info}>
        click to select or Double click to see more info
      </Typography>
    </Box>
  )
};



const styles = {
  container: {
    backgroundColor: 'background.paper',
    color: 'text.primary',
    borderRadius: 2,
    boxShadow: 3,
    p: 2,
    minWidth: 200,
    fontSize: 14,
  },
  title: { fontWeight: 700 },
  data: { mt: 0.5 },
  info: { mt: 1, display: 'block', color: 'text.secondary', fontStyle: 'italic' }

}

