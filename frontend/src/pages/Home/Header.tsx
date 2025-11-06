import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { ActivityStatus } from '../../types';

type HeaderProps = {
    handleDeleteActivity: (id: string) => void;
    handleOpenCreateForm: () => void;
    handleOpenEditForm: () => void;
    statusFilter: ActivityStatus | 'all';
    setStatusFilter: (val: ActivityStatus | 'all') => void;
    selectedActivity: { id: number } | null;
};

function Header({
    handleDeleteActivity,
    handleOpenCreateForm,
    handleOpenEditForm,
    statusFilter,
    setStatusFilter,
    selectedActivity,
}: HeaderProps) {
    const muiTheme = useTheme();
    const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));

    return (
        <AppBar position="static" elevation={0}>
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
                    PROJECT MANAGEMENT
                </Typography>
                <FormControl
                    size="small"
                    sx={{ minWidth: 150, mr: 2, backgroundColor: 'background.paper' }}
                >
                    <InputLabel id="status-filter-label" sx={{ color: 'text.primary' }}>
                        Status
                    </InputLabel>
                    <Select
                        labelId="status-filter-label"
                        value={statusFilter}
                        label="Status"
                        onChange={(e) => setStatusFilter(e.target.value as ActivityStatus | 'all')}
                        sx={{ color: 'text.primary' }}
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
                    sx={{ mr: 1 }}
                >
                    {isMobile ? '' : 'New Activity'}
                </Button>
                {selectedActivity && (
                    <>
                        <Button variant="outlined" onClick={handleOpenEditForm} sx={{ mr: 1 }}>
                            Edit
                        </Button>
                        <Button variant="outlined" onClick={() => handleDeleteActivity(String(selectedActivity.id))} sx={{ mr: 1 }}>
                            delete
                        </Button>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
}

export default Header;
