import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Task } from '../../prisma/generated/client';
import { CreateTaskDto } from './dto/requests/create-task.dto';
import { QueryTaskDto } from './dto/requests/query-task.dto';
import { UpdateTaskDto } from './dto/requests/update-task.dto';

@Injectable()
export class TasksRepository {
  constructor(private readonly prisma: PrismaService) {}

  async insert(data: CreateTaskDto): Promise<Task> {
    return this.prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        status: data.status ?? 'TODO',
        dueDate: data.dueDate,
      },
    });
  }

  async findMany(query: QueryTaskDto): Promise<Task[]> {
    const { status, sortBy = 'createdAt', order = 'desc' } = query;

    return this.prisma.task.findMany({
      where: {
        ...(status ? { status } : {}),
      },
      orderBy: {
        [sortBy]: order,
      },
    });
  }

  async findById(id: number): Promise<Task | null> {
    return this.prisma.task.findUnique({
      where: { id },
    });
  }

  async updateById(id: number, data: UpdateTaskDto): Promise<Task> {
    return this.prisma.task.update({
      where: { id },
      data: {
        ...(data.title !== undefined ? { title: data.title } : {}),
        ...(data.description !== undefined
          ? { description: data.description }
          : {}),
        ...(data.status !== undefined ? { status: data.status } : {}),
        ...(data.dueDate !== undefined ? { dueDate: data.dueDate } : {}),
      },
    });
  }

  async deleteById(id: number): Promise<Task> {
    return this.prisma.task.delete({
      where: { id },
    });
  }
}
