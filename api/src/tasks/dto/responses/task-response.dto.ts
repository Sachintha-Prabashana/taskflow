import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class TaskResponseDto {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  description: string | null;

  @Expose()
  status: string;

  @Expose()
  dueDate: Date | null;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
