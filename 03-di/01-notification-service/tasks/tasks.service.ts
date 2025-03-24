import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateTaskDto, Task, TaskStatus, UpdateTaskDto } from "./task.model";
import { NotificationsService } from "../notifications/notifications.service";
import { UsersService } from "../users/users.service";

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly usersService: UsersService,
  ) {}

  async createTask({ title, description, assignedTo }: CreateTaskDto) {
    const task: Task = {
      id: (this.tasks.length + 1).toString(),
      title,
      description,
      status: TaskStatus.Pending,
      assignedTo,
    };
    this.tasks.push(task);
    const user = this.usersService.getUserById(assignedTo);
    this.notificationsService.sendEmail(
      user.email,
      'Новая задача',
      `Вы назначены ответственным за задачу: "${title}"`
    );

    return task;
  }

  async updateTask(id: string, updateTaskDto: UpdateTaskDto) {
    const task = this.tasks.find((t) => t.id === id);
    if (!task) {
      throw new NotFoundException(`Задача с ID ${id} не найдена`);
    }
    if (task.status !== updateTaskDto.status) {
      const user = this.usersService.getUserById(task.assignedTo);
      this.notificationsService.sendSMS(
        user.phone,
        `Статус задачи "${task.title}" обновлён на "${updateTaskDto.status}"`
      );
    }
    Object.assign(task, updateTaskDto);

    return task;
  }
}
