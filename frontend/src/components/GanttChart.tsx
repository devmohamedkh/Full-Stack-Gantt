import { useMemo } from 'react';
import { Gantt, type Task, ViewMode } from 'gantt-task-react';
import 'gantt-task-react/dist/index.css';

import type { Activity } from '../types';
import { GanttChartTooltipContent } from './GanttChartTooltipContent';

interface GanttChartProps {
  activities: Activity[];
  onTaskChange: (task: Task) => void;
  onTaskClick: (task: Task) => void;
  onTaskDelete: (taskId: string) => void;
  onTaskSelect: (task: Task | null) => void;
  handleDblClick: (task: Task | null) => void;
  onExpanderClick: (task: Task | null) => void;
  selectedTask: Task | null;
  viewMode: ViewMode
}

export const GanttChart = ({
  activities,
  onTaskChange,
  onTaskDelete,
  onTaskSelect,
  handleDblClick,
  onExpanderClick,
  onTaskClick,
  viewMode,
  selectedTask
}: GanttChartProps) => {

  const tasks: Task[] = useMemo(() => {
    const ax: Task[] = activities.map((activity) => ({
      id: activity.id.toString(),
      name: activity.name,
      start: new Date(activity.start),
      end: new Date(activity.end),
      progress: activity.progress,
      type: activity.type === 'milestone' ? 'milestone' : 'task',
      dependencies: activity.dependencies.map((dep) => dep.toString()),
      project: activity.type === 'milestone' ? undefined : activity.name,
    }));

    // Add a fake (placeholder) task but set it with hidden flag so it does not show
    ax.push({
      id: '',
      name: '',
      start: new Date(new Date().setFullYear(new Date().getFullYear() + 15)),
      end: new Date(new Date().setFullYear(new Date().getFullYear() + 15)),
      progress: 0,
      type: 'task',
      dependencies: [],
      project: undefined,
      isDisabled: true,
      displayOrder: -10,
      styles: {
        backgroundSelectedColor: 'none',
        backgroundColor: 'none',
        progressColor: 'none'

      }
    });
    return ax
  }, [activities]);


  const handleDateChange = async (task: Task) => {
    onTaskChange(task);
  };

  const handleProgressChange = async (task: Task) => {
    onTaskChange(task);
  };

  const handleDelete = (task: Task) => {
    onTaskDelete(task.id);
  };


  const handleSelect = (task: Task) => {
    onTaskSelect(task);
  };

  return (


    <Gantt
      tasks={tasks}
      viewMode={viewMode}
      locale="en-US"
      onClick={onTaskClick}
      onExpanderClick={onExpanderClick}
      onDoubleClick={handleDblClick}
      onDateChange={handleDateChange}
      onProgressChange={handleProgressChange}
      onDelete={handleDelete}
      onSelect={handleSelect}
      columnWidth={100}
      listCellWidth=''
      rowHeight={50}
      preStepsCount={1}
      barBackgroundSelectedColor={selectedTask ? '#60C0E0' : undefined}
      TooltipContent={({ task }: { task: Task }) => (
        <GanttChartTooltipContent task={task} />
      )}
    />
  );
};

