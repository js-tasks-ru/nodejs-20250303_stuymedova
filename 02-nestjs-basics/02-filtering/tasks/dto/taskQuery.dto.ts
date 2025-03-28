import { TaskStatus } from "../task.model";
import { IsEnum, IsIn, IsInt, IsOptional, Min } from 'class-validator';

export class TaskQueryDto {
	@IsOptional()
	@IsEnum(TaskStatus)
	status?: TaskStatus;

	@IsOptional()
	@IsInt()
	@Min(1)
	page?: number;

	@IsOptional()
	@IsInt()
	@Min(1)
	limit?: number;

	@IsOptional()
	@IsIn(['status', 'title'])
	sortBy?: 'status' | 'title';
}
