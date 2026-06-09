// Shared types for the Dashboard page

export type ActivityType =
  | 'study'
  | 'work'
  | 'exercise'
  | 'cook'
  | 'sleep'
  | 'rest'
  | 'leisure'
  | 'social';

export interface TimelineSlot {
  /** 0-23 */
  hour: number;
  /** Optional activity assigned to this hour */
  activity?: {
    type: ActivityType;
    label: string;
  };
}

export type TaskScope = 'today' | 'week' | 'month';

export interface Task {
  id: string;
  title: string;
  scope: TaskScope;
  done: boolean;
  /** ISO date (yyyy-mm-dd) — defaults to today/week-start/month-start */
  date: string;
  exp: number;
  /** Activity type this task belongs to (for timeline filtering) */
  activityType?: ActivityType;
}

export interface DashboardState {
  /** Current user ID — changes on login/logout/switch account */
  userId: string;
  level: number;
  exp: number;
  /** YYYY-MM-DD of the last "end of day" celebration */
  lastCelebrationDate: string | null;
  /** YYYY-MM-DD of the last reset that locked tomorrow's plan */
  tomorrowPlanLockedDate: string | null;
  timeline: TimelineSlot[];
  /** Active activity filter — null means "show all" */
  activityFilter: ActivityType | null;
  tasks: Task[];
}

/** Maps each ActivityType to a default TaskScope for task categorization */
export const ACTIVITY_TO_SCOPE: Record<ActivityType, TaskScope> = {
  study:    'today',
  work:     'today',
  exercise: 'today',
  cook:     'today',
  sleep:    'today',
  rest:     'today',
  leisure:  'week',
  social:   'week',
};

/** Maps ActivityType → readable Vietnamese label */
export const ACTIVITY_LABELS: Record<ActivityType, string> = {
  study:    'Học tập',
  work:     'Làm việc',
  exercise: 'Thể dục',
  cook:     'Nấu ăn',
  sleep:    'Đi ngủ',
  rest:     'Nghỉ ngơi',
  leisure:  'Giải trí',
  social:   'Bạn bè',
};
