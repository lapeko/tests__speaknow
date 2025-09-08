import {
  DynamoDBClient,
} from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  UpdateCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";

import { Task, TaskStatus } from "./types";

const rawClient = new DynamoDBClient({});
const client = DynamoDBDocumentClient.from(rawClient);

const TASKS_TABLE = process.env.TASKS_TABLE!;

export const createTask = async (item: Omit<Task, "status" | "retries" | "createdAt">): Promise<void> => {
  await client.send(new PutCommand({
    TableName: TASKS_TABLE,
    Item: {
      ...item,
      status: TaskStatus.Pending,
      createdAt: new Date().toISOString(),
      retries: -1,
    },
  }));
};

export const getTask = async (id: string): Promise<Task | undefined> => {
  const result = await client.send(new GetCommand({
    TableName: TASKS_TABLE,
    Key: { id },
  }));

  return result.Item as Task | undefined;
};

export const markProcessed = async (id: string) => {
  await client.send(new UpdateCommand({
    TableName: TASKS_TABLE,
    Key: { id },
    UpdateExpression: "SET #status = :s",
    ExpressionAttributeNames: {
      "#status": "status",
    },
    ExpressionAttributeValues: {
      ":s": TaskStatus.Processed,
    },
  }));
};

export const markFailed = async (id: string, message: string) => {
  await client.send(new UpdateCommand({
    TableName: TASKS_TABLE,
    Key: { id },
    UpdateExpression: "SET #status = :s, #errorMessage = :e",
    ExpressionAttributeNames: {
      "#status": "status",
      "#errorMessage": "errorMessage",
    },
    ExpressionAttributeValues: {
      ":s": TaskStatus.Failed,
      ":e": message,
    },
  }));
};

export const incrementRetries = async (id: string) => {
  await client.send(new UpdateCommand({
    TableName: TASKS_TABLE,
    Key: { id },
    UpdateExpression: "ADD #retries :inc",
    ExpressionAttributeNames: {
      "#retries": "retries",
    },
    ExpressionAttributeValues: {
      ":inc": 1,
    },
  }));
};

export const scanTasks = async (): Promise<Task[]> => {
  const result = await client.send(new ScanCommand({
    TableName: TASKS_TABLE,
  }));

  return (result.Items as Task[]) ?? [];
};
