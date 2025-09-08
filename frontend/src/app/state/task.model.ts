import { TaskStatus } from "../utils/types";

export type Task = {
	id: string;
	answer: string;
	status: TaskStatus;
	retries: number;
	createdAt: string;
	errorMessage?: string;
}

export interface TaskStateModel {
	tasks: Task[];
	loading: boolean;
}