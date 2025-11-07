import { useEffect, useState } from "react";
import type { Activity, ActivityStatus, CreateActivityDto, PickedActivityNameId, UpdateActivityDto } from "../types";
import { ViewMode, type Task } from "gantt-task-react";
import { activitiesApi } from "../services/activitiesApi";
import { toast } from "react-toastify";

export function useActivities() {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);
    const [activityFormModalStatus, setActivityFormModalStatus] = useState<{ status: boolean; mode: 'create' | 'edit' }>({ status: false, mode: 'create' });
    const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState<ActivityStatus | 'all'>('all');
    const [view, setView] = useState<ViewMode>(ViewMode.Year);

    useEffect(() => {

        loadActivities();
    }, [statusFilter]);

    const loadActivities = async () => {
        try {
            setLoading(true);
            const params = statusFilter !== 'all' ? { status: statusFilter } : {};
            const data = await activitiesApi.getAll(params);
            setActivities(data);
        } catch (error) {
            console.error('Failed to load activities:', error);
            toast.error('Failed to load activities');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateActivity = async (data: CreateActivityDto) => {
        try {
            setLoading(true)
            await activitiesApi.create(data);
            toast.success('Activity created successfully');
            loadActivities();
        } catch (error) {
            console.error('Failed to create activity:', error);
            toast.error('Failed to create activity');
            throw error;
        } finally {
            setLoading(false)

        }
    };

    const handleUpdateActivity = async (data: UpdateActivityDto) => {
        if (!selectedActivity) return;

        try {
            await activitiesApi.update(selectedActivity.id, data);
            toast.success('Activity updated successfully');
            loadActivities();
            setSelectedActivity(null);
        } catch (error) {
            console.error('Failed to update activity:', error);
            toast.error('Failed to update activity');
            throw error;
        }
    };

    const handleDeleteActivity = async (taskId: string) => {
        try {
            await activitiesApi.delete(parseInt(taskId));
            toast.success('Activity deleted successfully');
            loadActivities();
            setSelectedActivity(null)
            setSelectedTask(null);
            setDetailsOpen(false);
        } catch (error) {
            console.error('Failed to delete activity:', error);
            toast.error('Failed to delete activity');
        }
    };

    const handleTaskChange = async (task: Task) => {
        const activity = activities.find((a) => a.id.toString() === task.id);
        if (!activity) return;

        try {
            await activitiesApi.update(activity.id, {
                start: task.start.toISOString(),
                end: task.end.toISOString(),
                progress: task.progress,
            });
            toast.success('Activity updated successfully');
            loadActivities();
        } catch (error) {
            console.error('Failed to update activity:', error);
            toast.error('Failed to update activity');
        }
    };

    const handleTaskDC = (task: Task | null) => {
        if (task) {
            const activity = activities.find((a) => a.id.toString() == task.id);
            setSelectedActivity(activity || null);
            setSelectedTask(task)
            setDetailsOpen(true);
        } else {
            setDetailsOpen(false);
        }
    };

    const handleTaskClick = (task: Task) => {
        if (task.id === selectedTask?.id) {
            setSelectedActivity(null);
            setSelectedTask(null)
        } else {
            const activity = activities.find((a) => a.id.toString() == task.id);
            setSelectedActivity(activity || null);
            setSelectedTask(task)
        }
    };

    const handleOpenCreateForm = () => {
        setSelectedActivity(null);
        setActivityFormModalStatus({ status: true, mode: 'create' })
    };

    const handleOpenEditForm = () => {
        if (selectedActivity) {
            setActivityFormModalStatus({ status: true, mode: 'edit' })
        }
    };

    const handleFormSubmit = async (data: CreateActivityDto | UpdateActivityDto) => {
        if (activityFormModalStatus.mode === 'create') {
            await handleCreateActivity(data as CreateActivityDto);
        } else {
            await handleUpdateActivity(data as UpdateActivityDto);
        }
    };


    const getActivityLockups = async (excludedIds?: number[]): Promise<PickedActivityNameId[]> => {

        const lockups = await activitiesApi.lockups(excludedIds)

        return lockups
    };

    return {
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
        handleCreateActivity,
        handleUpdateActivity,
        handleDeleteActivity,
        handleTaskChange,
        handleTaskDC,
        handleTaskClick,
        handleOpenCreateForm,
        handleOpenEditForm,
        handleFormSubmit,
        getActivityLockups
    };
}