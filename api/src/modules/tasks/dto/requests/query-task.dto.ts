import { IsIn, IsOptional } from 'class-validator';
import { TASK_STATUSES } from '../../../../common/constants/task-status.constant';
import type { TaskStatus } from '../../../../common/constants/task-status.constant';

export const SORT_FIELDS = ['dueDate', 'createdAt', 'title', 'id'] as const;
export type SortField = (typeof SORT_FIELDS)[number];

export const SORT_ORDERS = ['asc', 'desc'] as const;
export type SortOrder = (typeof SORT_ORDERS)[number];

export class QueryTaskDto {
  @IsIn(TASK_STATUSES, {
    message: `status filter must be one of: ${TASK_STATUSES.join(', ')}`,
  })
  @IsOptional()
  status?: TaskStatus;

  @IsIn(SORT_FIELDS, {
    message: `sortBy must be one of: ${SORT_FIELDS.join(', ')}`,
  })
  @IsOptional()
  sortBy?: SortField = 'createdAt';

  @IsIn(SORT_ORDERS, {
    message: `order must be either 'asc' or 'desc'`,
  })
  @IsOptional()
  order?: SortOrder = 'desc';
}
