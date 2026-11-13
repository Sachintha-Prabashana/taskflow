import { env } from '../config/env';
import { sanitizeQueryFilters } from '../schemas/query-task.schema';
import {
  ApiErrorResponse,
  ApiSuccessResponse,
  CreateTaskInput,
  Task,
  TaskQueryFilters,
  UpdateTaskInput,
} from '../types/task.types';

const API_BASE_URL = env.NEXT_PUBLIC_API_URL;

async function handleResponse<T>(response: Response): Promise<T> {
  const isJson = response.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    if (data && 'error' in data) {
      const errorResponse = data as ApiErrorResponse;
      const details = errorResponse.error?.details;
      if (Array.isArray(details) && details.length > 0) {
        const message = details.map((d) => d.message).join(', ');
        throw new Error(message);
      }
    }
    throw new Error(`Request failed with status ${response.status}`);
  }

  const successResponse = data as ApiSuccessResponse<T>;
  return successResponse.data;
}

export const taskApi = {
  async getTasks(filters?: TaskQueryFilters): Promise<Task[]> {
    const queryParams = sanitizeQueryFilters(filters);
    const queryString = new URLSearchParams(queryParams).toString();
    const url = `${API_BASE_URL}/api/v1/tasks${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      cache: 'no-store',
    });

    return handleResponse<Task[]>(response);
  },

  async getTaskById(id: number): Promise<Task> {
    const response = await fetch(`${API_BASE_URL}/api/v1/tasks/${id}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      cache: 'no-store',
    });

    return handleResponse<Task>(response);
  },

  async createTask(input: CreateTaskInput): Promise<Task> {
    const response = await fetch(`${API_BASE_URL}/api/v1/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(input),
    });

    return handleResponse<Task>(response);
  },

  async updateTask(id: number, input: UpdateTaskInput): Promise<Task> {
    const response = await fetch(`${API_BASE_URL}/api/v1/tasks/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(input),
    });

    return handleResponse<Task>(response);
  },

  async deleteTask(id: number): Promise<{ id: number }> {
    const response = await fetch(`${API_BASE_URL}/api/v1/tasks/${id}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
      },
    });

    return handleResponse<{ id: number }>(response);
  },
};

