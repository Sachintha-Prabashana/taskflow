export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export type { CreateTaskInput } from '../schemas/create-task.schema';
export type { UpdateTaskInput } from '../schemas/update-task.schema';
export type { TaskQueryFilters } from '../schemas/query-task.schema';

export type TaskFilterStatus = 'ALL' | TaskStatus;
export type TaskSortField = 'dueDate' | 'createdAt' | 'title';
export type TaskSortOrder = 'asc' | 'desc';

export interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
  timestamp: string;
}

export interface ApiErrorDetail {
  field?: string;
  message: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string | number;
    details: ApiErrorDetail[];
  };
  timestamp: string;
}
