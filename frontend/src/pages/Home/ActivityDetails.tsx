import { Drawer, Box, Typography, Chip, Divider, IconButton, Button } from '@mui/material';
import { Close as CloseIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { type Task } from 'gantt-task-react';
import { type Activity } from '../../types';

interface ActivityDetailsProps {
  open: boolean;
  onClose: () => void;
  task: Task | null;
  activity: Activity | null;
  onDelete?: (taskId: string) => void;
}



export const ActivityDetails = ({
  open,
  onClose,
  task,
  activity,
  onDelete,
}: ActivityDetailsProps) => {
  const handleDelete = () => {
    if (onDelete && task) {
      onDelete(task.id);
      onClose();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo':
        return 'default';
      case 'in_progress':
        return 'primary';
      case 'completed':
        return 'success';
      case 'blocked':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={styles.drawerBox}>
        {task && activity ? (
          <>
            <Box sx={styles.headerBox}>
              <Typography variant="h5" component="h2">
                Activity Details
              </Typography>
              <IconButton onClick={onClose}>
                <CloseIcon />
              </IconButton>
            </Box>

            <Divider sx={styles.dividerMb3} />

            <Box sx={styles.mainBox}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Name
                </Typography>
                <Typography variant="body1">{activity.name}</Typography>
              </Box>

              {activity.description && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Description
                  </Typography>
                  <Typography variant="body1">{activity.description}</Typography>
                </Box>
              )}

              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Status
                </Typography>
                <Chip
                  label={activity.status.replace('_', ' ').toUpperCase()}
                  color={getStatusColor(activity.status)}
                  size="small"
                />
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Type
                </Typography>
                <Chip
                  label={activity.type.toUpperCase()}
                  size="small"
                  variant="outlined"
                />
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Start Date
                </Typography>
                <Typography variant="body1">
                  {new Date(activity.start).toLocaleString()}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  End Date
                </Typography>
                <Typography variant="body1">
                  {new Date(activity.end).toLocaleString()}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Progress
                </Typography>
                <Typography variant="body1">{activity.progress}%</Typography>
              </Box>

              {activity.color && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Color
                  </Typography>
                  <Box
                    sx={styles.colorBox(activity.color)}
                  />
                </Box>
              )}

              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Created
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(activity.createdAt).toLocaleString()}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Last Updated
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(activity.updatedAt).toLocaleString()}
                </Typography>
              </Box>
            </Box>

            <Divider sx={styles.dividerMy3} />

            {onDelete && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleDelete}
                fullWidth
              >
                Delete Activity
              </Button>
            )}
          </>
        ) : (
          <Box sx={styles.headerBox}>
            <Typography variant="h5" component="h2">
              Activity Details
            </Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        )}
      </Box>
    </Drawer>
  );
};

const styles = {
  drawerBox: { width: 400, p: 3 },
  headerBox: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 },
  mainBox: { display: 'flex', flexDirection: 'column', gap: 2 },
  colorBox: (color: string) => ({
    width: 40,
    height: 40,
    backgroundColor: color,
    borderRadius: 1,
    border: '1px solid',
    borderColor: 'divider',
  }),
  dividerMb3: { mb: 3 },
  dividerMy3: { my: 3 },
};
