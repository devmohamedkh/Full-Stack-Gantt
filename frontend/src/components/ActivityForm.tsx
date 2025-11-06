import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  Slider,
  Typography,
} from '@mui/material';
import { type Activity, ActivityStatus, ActivityType } from '../types';
import { type CreateActivityDto, type UpdateActivityDto } from '../services/api';

interface ActivityFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateActivityDto | UpdateActivityDto) => Promise<void>;
  activity?: Activity | null;
  mode: 'create' | 'edit';
}

// Validation schema
const validationSchema = Yup.object({
  name: Yup.string()
    .required('Name is required')
    .max(255, 'Name must be less than 255 characters'),
  description: Yup.string().max(5000, 'Description must be less than 5000 characters'),
  type: Yup.string()
    .oneOf([ActivityType.TASK, ActivityType.MILESTONE], 'Invalid type')
    .required('Type is required'),
  status: Yup.string()
    .oneOf(
      [ActivityStatus.TODO, ActivityStatus.IN_PROGRESS, ActivityStatus.COMPLETED, ActivityStatus.BLOCKED],
      'Invalid status'
    )
    .required('Status is required'),
  start: Yup.string().required('Start date is required'),
  end: Yup.string()
    .required('End date is required')
    .test('is-after-start', 'End date must be after start date', function (value) {
      const { start } = this.parent;
      if (!value || !start) return true;
      return new Date(value) > new Date(start);
    }),
  progress: Yup.number()
    .min(0, 'Progress must be between 0 and 100')
    .max(100, 'Progress must be between 0 and 100')
    .required('Progress is required'),
  color: Yup.string()
    .matches(/^#[0-9A-Fa-f]{6}$/, 'Color must be a valid hex code (e.g., #60C0E0)')
    .nullable(),
});

export const ActivityForm = ({
  open,
  onClose,
  onSubmit,
  activity,
  mode,
}: ActivityFormProps) => {
  const formatDateForInput = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toISOString().slice(0, 16);
  };

  const initialValues = {
    name: activity?.name || '',
    description: activity?.description || '',
    type: activity?.type || ActivityType.TASK,
    status: activity?.status || ActivityStatus.TODO,
    start: activity
      ? formatDateForInput(activity.start)
      : formatDateForInput(new Date()),
    end: activity
      ? formatDateForInput(activity.end)
      : formatDateForInput(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)),
    progress: activity?.progress || 0,
    color: activity?.color || '',
  };

  const handleSubmit = async (
    values: typeof initialValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    try {
      const data = {
        name: values.name,
        description: values.description || undefined,
        start: new Date(values.start).toISOString(),
        end: new Date(values.end).toISOString(),
        type: values.type as ActivityType,
        status: values.status as ActivityStatus,
        progress: values.progress,
        color: values.color || undefined,
      };
      await onSubmit(data);
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, errors, touched, handleBlur, setFieldValue, isSubmitting }) => (
          <Form>
            <DialogTitle>
              {mode === 'create' ? 'Create New Activity' : 'Edit Activity'}
            </DialogTitle>
            <DialogContent>
              <Box sx={styles.formBox}>
                <Field
                  as={TextField}
                  name="name"
                  label="Name"
                  required
                  fullWidth
                  variant="outlined"
                  error={touched.name && !!errors.name}
                  helperText={touched.name && errors.name}
                />

                <Field
                  as={TextField}
                  name="description"
                  label="Description"
                  fullWidth
                  multiline
                  rows={3}
                  variant="outlined"
                  error={touched.description && !!errors.description}
                  helperText={touched.description && errors.description}
                />

                <Field
                  as={TextField}
                  name="type"
                  label="Type"
                  select
                  fullWidth
                  variant="outlined"
                  error={touched.type && !!errors.type}
                  helperText={touched.type && errors.type}
                >
                  <MenuItem value={ActivityType.TASK}>Task</MenuItem>
                  <MenuItem value={ActivityType.MILESTONE}>Milestone</MenuItem>
                </Field>

                <Field
                  as={TextField}
                  name="status"
                  label="Status"
                  select
                  fullWidth
                  variant="outlined"
                  error={touched.status && !!errors.status}
                  helperText={touched.status && errors.status}
                >
                  <MenuItem value={ActivityStatus.TODO}>To Do</MenuItem>
                  <MenuItem value={ActivityStatus.IN_PROGRESS}>In Progress</MenuItem>
                  <MenuItem value={ActivityStatus.COMPLETED}>Completed</MenuItem>
                  <MenuItem value={ActivityStatus.BLOCKED}>Blocked</MenuItem>
                </Field>

                <Field
                  as={TextField}
                  name="start"
                  label="Start Date"
                  type="datetime-local"
                  required
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  error={touched.start && !!errors.start}
                  helperText={touched.start && errors.start}
                />

                <Field
                  as={TextField}
                  name="end"
                  label="End Date"
                  type="datetime-local"
                  required
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  error={touched.end && !!errors.end}
                  helperText={touched.end && errors.end}
                />

                <Box >
                  <Typography gutterBottom>Progress: {values.progress}%</Typography>
                  <Slider
                    value={values.progress}
                    onChange={(_, value) => setFieldValue('progress', value)}
                    onBlur={handleBlur}
                    name="progress"
                    min={0}
                    max={100}
                    step={1}
                    marks
                    valueLabelDisplay="auto"
                  />
                  {touched.progress && errors.progress && (
                    <Typography variant="caption" color="error" sx={styles.progressError}>
                      {errors.progress}
                    </Typography>
                  )}
                </Box>

                <Field
                  as={TextField}
                  name="color"
                  label="Color (Hex)"
                  fullWidth
                  placeholder="#60C0E0"
                  variant="outlined"
                  error={touched.color && !!errors.color}
                  helperText={touched.color && errors.color || 'Optional: Enter a hex color code (e.g., #60C0E0)'}
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create' : 'Update'}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

const styles = {
  formBox: { display: 'flex', flexDirection: 'column', gap: 2, pt: 1 },
  progressError: { mt: 0.5, display: 'block' }
};
