import { mockUser } from '../../../users/test/stubs/user.stub';
import {
  Activity,
  ActivityStatus,
  ActivityType,
} from '../../entities/activity.entity';

let idCounter = 1;

export const mockActivity = (overrides: Partial<Activity> = {}): Activity => {
  const activity: Activity = {
    id: idCounter++,
    name: 'Test Activity',
    description: 'Description',
    start: new Date('2025-01-01'),
    end: new Date('2025-01-10'),
    progress: 50,
    status: ActivityStatus.IN_PROGRESS,
    type: ActivityType.TASK,
    color: '#3B82F6',
    order: 0,
    dependencies: [],
    dependents: [],
    createdBy: mockUser({ id: 1 }),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
  // If overrides specify dependents, assign it (always array, never undefined)
  if ('dependents' in overrides && Array.isArray(overrides.dependents)) {
    activity.dependents = overrides.dependents;
  }
  return activity;
};

export const mockTask = (overrides: Partial<Activity> = {}) =>
  mockActivity({ type: ActivityType.TASK, ...overrides });

export const mockMilestone = (overrides: Partial<Activity> = {}) =>
  mockActivity({ type: ActivityType.MILESTONE, ...overrides });

export const createDependencyChain = (...names: string[]): Activity[] => {
  const activities: Activity[] = [];
  names.forEach((name, i) => {
    activities.push(
      mockActivity({
        id: 100 + i,
        name,
        dependencies: i > 0 ? [activities[i - 1]] : [],
      }),
    );
  });
  return activities;
};
