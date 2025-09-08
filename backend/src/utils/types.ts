export enum TaskStatus {
  Processed = "PROCESSED",
  Failed = "FAILED",
  Pending = "PENDING",
}

export type Task = {
  taskId: string;
  answer: string;
  status: TaskStatus;
  retries: number;
  createdAt: string;
  errorMessage?: string;
}