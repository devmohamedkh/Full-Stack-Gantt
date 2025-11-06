import {
    Box,
    Typography,
    Container,
} from '@mui/material';
import 'react-toastify/dist/ReactToastify.css';
import { GanttChart } from '../../components/GanttChart';
import { ActivityForm } from '../../components/ActivityForm';
import { ActivityDetails } from '../../components/ActivityDetails';
import Header from '../../components/Header';
import { useActivities } from '../../Hooks/useActivities';
import { LoaderWithErrorHandling } from '../../components/LoaderWithErrorHandling';
import GanttChartHeader from '../../components/GanttChartHeader';



function Home() {
    const {
        activities,
        loading,
        activityFormModalStatus,
        setActivityFormModalStatus,
        selectedActivity,
        setSelectedActivity,
        selectedTask,
        setSelectedTask,
        detailsOpen,
        setDetailsOpen,
        statusFilter,
        setStatusFilter,
        view,
        setView,
        handleDeleteActivity,
        handleTaskChange,
        handleTaskDC,
        handleTaskClick,
        handleOpenCreateForm,
        handleOpenEditForm,
        handleFormSubmit,
    } = useActivities();


    return (
        <Box sx={styles.container}>
            <Header />

            <Container maxWidth={false} sx={{ flexGrow: 1, py: 3 }}>
                <GanttChartHeader
                    onViewModeChange={setView}
                    viewMode={view}
                    handleDeleteActivity={handleDeleteActivity}
                    handleOpenCreateForm={handleOpenCreateForm}
                    handleOpenEditForm={handleOpenEditForm}
                    selectedActivity={selectedActivity}
                    setStatusFilter={setStatusFilter}
                    statusFilter={statusFilter}
                    showGanttChartView={activities.length !== 0}
                />
                {!loading && activities.length === 0 ? (
                    <Box sx={styles.noDataFound}>
                        <Typography>No data found you can add new activities.</Typography>
                    </Box>
                ) : (
                    <>

                        <GanttChart
                            activities={activities}
                            onTaskChange={handleTaskChange}
                            onTaskDelete={handleDeleteActivity}
                            handleDblClick={handleTaskDC}
                            onTaskClick={handleTaskClick}
                            selectedTask={selectedTask}
                            onTaskSelect={() => { }}
                            onExpanderClick={() => { }}
                            viewMode={view}
                        />
                    </>
                )}
            </Container>

            <ActivityForm
                open={activityFormModalStatus.status}
                onClose={() => {
                    setActivityFormModalStatus({ status: false, mode: 'create' })
                    setSelectedActivity(null);
                }}
                onSubmit={handleFormSubmit}
                activity={selectedActivity}
                mode={activityFormModalStatus.mode}
            />

            <ActivityDetails
                open={detailsOpen}
                onClose={() => {
                    setDetailsOpen(false);
                    setSelectedTask(null);
                    setSelectedActivity(null);
                }}
                task={selectedTask}
                activity={selectedActivity}
                onDelete={handleDeleteActivity}
            />

            <LoaderWithErrorHandling loading={loading} />

        </Box>
    );
}



const styles = {
    container: { display: 'flex', flexDirection: 'column', minHeight: '100vh' },
    loading: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' },
    noDataFound: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }
}
export default Home;
