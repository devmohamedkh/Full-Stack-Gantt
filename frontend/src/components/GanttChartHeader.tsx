import {
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Box,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { ActivityStatus } from '../types';
import type { ViewMode } from 'gantt-task-react';
import { GanttChartView } from './GanttChartView';

type GanttChartHeaderProps = {
    handleDeleteActivity: (id: string) => void;
    handleOpenCreateForm: () => void;
    handleOpenEditForm: () => void;
    statusFilter: ActivityStatus | 'all';
    setStatusFilter: (val: ActivityStatus | 'all') => void;
    selectedActivity: { id: number } | null;
    onViewModeChange: (viewMode: ViewMode) => void;
    viewMode?: ViewMode;
};

function GanttChartHeader({
    handleDeleteActivity,
    handleOpenCreateForm,
    handleOpenEditForm,
    statusFilter,
    setStatusFilter,
    selectedActivity,
    onViewModeChange,
    viewMode
}: GanttChartHeaderProps) {

    return (
        <Box sx={styles.toolbar}>
            <Box sx={styles.controlsBox}>
                <FormControl
                    size="small"
                    sx={styles.formControl}
                >
                    <InputLabel id="status-filter-label" sx={styles.inputLabel}>
                        Status
                    </InputLabel>
                    <Select
                        labelId="status-filter-label"
                        value={statusFilter}
                        label="Status"
                        onChange={(e) => setStatusFilter(e.target.value as ActivityStatus | 'all')}
                        sx={styles.select}
                    >
                        <MenuItem value="all">All</MenuItem>
                        <MenuItem value={ActivityStatus.TODO}>To Do</MenuItem>
                        <MenuItem value={ActivityStatus.IN_PROGRESS}>In Progress</MenuItem>
                        <MenuItem value={ActivityStatus.COMPLETED}>Completed</MenuItem>
                        <MenuItem value={ActivityStatus.BLOCKED}>Blocked</MenuItem>
                    </Select>
                </FormControl>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleOpenCreateForm}
                    sx={styles.newActivityBtn}
                >
                    {'New Activity'}
                </Button>
                {selectedActivity && (
                    <Box sx={styles.editDeleteBox}>
                        <Button
                            variant="outlined"
                            onClick={handleOpenEditForm}
                            sx={styles.editBtn}
                        >
                            Edit
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={() => handleDeleteActivity(String(selectedActivity.id))}
                            sx={styles.deleteBtn}
                        >
                            Delete
                        </Button>
                    </Box>
                )}
            </Box>
            <GanttChartView
                onViewModeChange={onViewModeChange}
                viewMode={viewMode}
            />

        </Box>
    );
}

const styles = {
    toolbar: {
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { xs: 'flex-end', md: 'center' },
        justifyContent: 'space-between',
        gap: { xs: 2, md: 0 },
    },
    title: {
        fontWeight: 700,
        mb: { xs: 1, md: 0 },
        textAlign: { xs: 'center', md: 'right' },
        width: { xs: '100%', md: 'auto' },
        mr: { xs: 0, md: 'auto' },
    },
    controlsBox: {
        display: "flex",
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'stretch', sm: 'center' },
        width: { xs: '100%', md: 'auto' },
        gap: { xs: 1, sm: 0 },
        justifyContent: { xs: "flex-end", md: "flex-end" }
    },
    formControl: {
        minWidth: { xs: "100%", sm: 150 },
        mr: { xs: 0, sm: 2 },
        mb: { xs: 1, sm: 0 },
        backgroundColor: 'background.paper'
    },
    inputLabel: {
        color: 'text.primary'
    },
    select: {
        color: 'text.primary'
    },
    newActivityBtn: {
        mr: { xs: 0, sm: 1 },
        mb: { xs: 1, sm: 0 },
        width: { xs: '100%', sm: 'auto' },
        minWidth: { xs: 0, sm: 120 }
    },
    editDeleteBox: {
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        gap: { xs: 1, sm: 0 },
        width: { xs: "100%", sm: "auto" }
    },
    editBtn: {
        mr: { xs: 0, sm: 1 },
        mb: { xs: 1, sm: 0 },
        width: { xs: "100%", sm: "auto" }
    },
    deleteBtn: {
        mr: 0,
        width: { xs: "100%", sm: "auto" }
    }
};

export default GanttChartHeader;
