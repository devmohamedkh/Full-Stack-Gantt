import { Formik, Form, FastField } from 'formik';
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
  Autocomplete,
  CircularProgress,
} from '@mui/material';
import {
  type Activity,
  ActivityStatus,
  ActivityType,
  type PickedActivityNameId,
} from '../../types';
import { type CreateActivityDto, type UpdateActivityDto } from '../../types';
import { useEffect, useState } from 'react';

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required').max(255, 'Must be under 255 characters'),
  description: Yup.string().max(5000, 'Must be under 5000 characters'),
  type: Yup.string()
    .oneOf([ActivityType.TASK, ActivityType.MILESTONE])
    .required('Type is required'),
  status: Yup.string()
    .oneOf([
      ActivityStatus.TODO,
      ActivityStatus.IN_PROGRESS,
      ActivityStatus.COMPLETED,
      ActivityStatus.BLOCKED,
    ])
    .required('Status is required'),
  start: Yup.date().required('Start date is required'),
  end: Yup.date()
    .required('End date is required')
    .test('is-after-start', 'End must be after start', function (value) {
      const { start } = this.parent;
      return !start || !value || new Date(value) > new Date(start);
    }),
  progress: Yup.number().min(0).max(100).required('Progress is required'),
  color: Yup.string()
    .matches(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color (e.g., #60C0E0)')
    .nullable(),
  dependencies: Yup.array()
    .of(
      Yup.object({
        id: Yup.number().required(),
        name: Yup.string().required(),
      })
    )
    .nullable(),
});

interface ActivityFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateActivityDto | UpdateActivityDto) => Promise<void>;
  activity?: Activity | null;
  mode: 'create' | 'edit';
  getActivityLockups: (excludedIds?: number[]) => Promise<PickedActivityNameId[]>;
}

export const ActivityForm = ({
  open,
  onClose,
  onSubmit,
  activity,
  mode,
  getActivityLockups,
}: ActivityFormProps) => {
  const [lockups, setLockups] = useState<PickedActivityNameId[]>([]);
  const [loadingLockups, setLoadingLockups] = useState(false);

  const formatDateForInput = (date: Date | string) =>
    new Date(date).toISOString().slice(0, 16);

  useEffect(() => {
    if (open) {
      setLoadingLockups(true);
      const excludedIds = mode === 'edit' && activity?.id ? [activity?.id] : [];
      getActivityLockups(excludedIds)
        .then(setLockups)
        .finally(() => setLoadingLockups(false));
    }
  }, [open, getActivityLockups, mode, activity?.id]);

  const initialValues = {
    name: activity?.name || '',
    description: activity?.description || '',
    type: activity?.type || ActivityType.TASK,
    status: activity?.status || ActivityStatus.TODO,
    start: activity ? formatDateForInput(activity.start) : formatDateForInput(new Date()),
    end: activity
      ? formatDateForInput(activity.end)
      : formatDateForInput(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)),
    progress: activity?.progress ?? 0,
    color: activity?.color || '',
    dependencies: activity
      ? lockups.filter(lockup =>
        activity.dependencies?.some((dep: number) => dep === lockup.id)
      )
      : [],
  };

  const handleSubmit = async (
    values: typeof initialValues,
    helpers: { setSubmitting: (submitting: boolean) => void }
  ) => {
    try {
      const data = {
        ...values,
        start: new Date(values.start).toISOString(),
        end: new Date(values.end).toISOString(),
        dependencies: values.dependencies.map((dep: PickedActivityNameId) => dep.id),
      };
      await onSubmit(data);
      onClose();
    } catch (err) {
      console.error('Submission error:', err);
    } finally {
      helpers.setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
        validateOnChange={false}
      >
        {({ values, errors, touched, setFieldValue, isSubmitting }) => (
          <Form>
            <DialogTitle>
              {mode === 'create' ? 'Create New Activity' : 'Edit Activity'}
            </DialogTitle>

            <DialogContent>
              <Box sx={styles.formBox}>
                {/* Name */}
                <FastField
                  as={TextField}
                  name="name"
                  label="Name"
                  fullWidth
                  required
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                />

                {/* Description */}
                <FastField
                  as={TextField}
                  name="description"
                  label="Description"
                  fullWidth
                  multiline
                  rows={3}
                  error={touched.description && Boolean(errors.description)}
                  helperText={touched.description && errors.description}
                />

                {/* Type */}
                <FastField
                  as={TextField}
                  name="type"
                  label="Type"
                  select
                  fullWidth
                  error={touched.type && Boolean(errors.type)}
                  helperText={touched.type && errors.type}
                >
                  <MenuItem value={ActivityType.TASK}>Task</MenuItem>
                  <MenuItem value={ActivityType.MILESTONE}>Milestone</MenuItem>
                </FastField>

                {/* Status */}
                <FastField
                  as={TextField}
                  name="status"
                  label="Status"
                  select
                  fullWidth
                  error={touched.status && Boolean(errors.status)}
                  helperText={touched.status && errors.status}
                >
                  {Object.values(ActivityStatus).map((status) => (
                    <MenuItem key={status} value={status}>
                      {status.replace('_', ' ')}
                    </MenuItem>
                  ))}
                </FastField>

                {/* Dates */}
                <FastField
                  as={TextField}
                  name="start"
                  label="Start Date"
                  type="datetime-local"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  error={touched.start && Boolean(errors.start)}
                  helperText={touched.start && errors.start}
                />

                <FastField
                  as={TextField}
                  name="end"
                  label="End Date"
                  type="datetime-local"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  error={touched.end && Boolean(errors.end)}
                  helperText={touched.end && errors.end}
                />

                <Autocomplete
                  multiple
                  disableCloseOnSelect
                  options={lockups}
                  loading={loadingLockups}
                  value={values.dependencies || []}
                  onChange={(_, val) => setFieldValue('dependencies', val)}
                  getOptionLabel={(opt) => opt?.name || ''}
                  isOptionEqualToValue={(opt, val) => opt.id === val.id}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Dependencies"
                      placeholder="Select dependencies"
                      error={touched.dependencies && Boolean(errors.dependencies)}
                      helperText={touched.dependencies && (errors.dependencies as string)}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {loadingLockups ? (
                              <CircularProgress color="inherit" size={20} />
                            ) : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                />

                {/* Progress */}
                <Box>
                  <Typography gutterBottom>Progress: {values.progress}%</Typography>
                  <Slider
                    value={values.progress}
                    onChange={(_, val) => setFieldValue('progress', val)}
                    min={0}
                    max={100}
                    step={1}
                    marks
                    valueLabelDisplay="auto"
                  />
                  {touched.progress && errors.progress && (
                    <Typography color="error" variant="caption">
                      {errors.progress}
                    </Typography>
                  )}
                </Box>

                {/* Color */}
                <FastField
                  as={TextField}
                  name="color"
                  label="Color"
                  type="color"
                  fullWidth
                  error={touched.color && Boolean(errors.color)}
                  helperText={
                    (touched.color && errors.color) ||
                    'Optional: Choose a color'
                  }
                  InputLabelProps={{ shrink: true }}
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
};
