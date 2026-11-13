import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CreateTaskDto } from './dto/requests/create-task.dto';
import { QueryTaskDto } from './dto/requests/query-task.dto';
import { UpdateTaskDto } from './dto/requests/update-task.dto';
import { TaskResponseDto } from './dto/responses/task-response.dto';
import { TasksRepository } from './tasks.repository';

@Injectable()
export class TasksService {
  constructor(private readonly tasksRepository: TasksRepository) {}

  async createTask(createTaskDto: CreateTaskDto): Promise<TaskResponseDto> {
    const task = await this.tasksRepository.insert(createTaskDto);
    return plainToInstance(TaskResponseDto, task);
  }

  async getTasks(query: QueryTaskDto): Promise<TaskResponseDto[]> {
    const tasks = await this.tasksRepository.findMany(query);
    return plainToInstance(TaskResponseDto, tasks);
  }

  async getTaskById(id: number): Promise<TaskResponseDto> {
    const task = await this.tasksRepository.findById(id);

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return plainToInstance(TaskResponseDto, task);
  }

  async updateTask(
    id: number,
    updateTaskDto: UpdateTaskDto,
  ): Promise<TaskResponseDto> {
    await this.getTaskById(id);

    const updatedTask = await this.tasksRepository.updateById(
      id,
      updateTaskDto,
    );
    return plainToInstance(TaskResponseDto, updatedTask);
  }

  async deleteTask(id: number): Promise<{ id: number }> {
    await this.getTaskById(id);

    await this.tasksRepository.deleteById(id);
    return { id };
  }
}
