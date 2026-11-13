import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ResponseMessage } from '../common/decorators/response-message.decorator';
import { CreateTaskDto } from './dto/requests/create-task.dto';
import { QueryTaskDto } from './dto/requests/query-task.dto';
import { UpdateTaskDto } from './dto/requests/update-task.dto';
import { TaskResponseDto } from './dto/responses/task-response.dto';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage('Task created successfully')
  async createTask(
    @Body() createTaskDto: CreateTaskDto,
  ): Promise<TaskResponseDto> {
    return this.tasksService.createTask(createTaskDto);
  }

  @Get()
  @ResponseMessage('Tasks retrieved successfully')
  async getTasks(@Query() query: QueryTaskDto): Promise<TaskResponseDto[]> {
    return this.tasksService.getTasks(query);
  }

  @Get(':id')
  @ResponseMessage('Task retrieved successfully')
  async getTaskById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<TaskResponseDto> {
    return this.tasksService.getTaskById(id);
  }

  @Patch(':id')
  @ResponseMessage('Task updated successfully')
  async updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<TaskResponseDto> {
    return this.tasksService.updateTask(id, updateTaskDto);
  }

  @Delete(':id')
  @ResponseMessage('Task deleted successfully')
  async deleteTask(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ id: number }> {
    return this.tasksService.deleteTask(id);
  }
}
