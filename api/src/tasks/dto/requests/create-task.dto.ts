import { Type } from 'class-transformer';
import {
  IsDate,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { TASK_STATUSES } from '../../../common/constants/task-status.constant';
import type { TaskStatus } from '../../../common/constants/task-status.constant';

export class CreateTaskDto {
  @IsString({ message: 'title must be a string' })
  @IsNotEmpty({ message: 'title is required and cannot be empty' })
  title: string;

  @IsString({ message: 'description must be a string' })
  @IsOptional()
  description?: string;

  @IsIn(TASK_STATUSES, {
    message: `status must be one of: ${TASK_STATUSES.join(', ')}`,
  })
  @IsOptional()
  status?: TaskStatus;

  @Type(() => Date)
  @IsDate({ message: 'dueDate must be a valid ISO Date' })
  @IsOptional()
  dueDate?: Date;
}
