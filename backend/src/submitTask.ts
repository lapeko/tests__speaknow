import { APIGatewayProxyHandler } from 'aws-lambda';
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { nanoid } from 'nanoid';

import { createTask } from './utils/dynamodb';

const sqs = new SQSClient();
const TASKS_QUEUE_URL = process.env.TASKS_QUEUE_URL!;

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const body = JSON.parse(event.body || '{}');
    const answer = body.answer?.trim();

    if (!answer) {
      console.warn('Missing or empty "answer"');
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing or empty "answer"' }),
      };
    }

    const taskId = nanoid();

    await createTask({ taskId, answer });

    await sqs.send(new SendMessageCommand({
      QueueUrl: TASKS_QUEUE_URL,
      MessageBody: JSON.stringify({ taskId }),
    }));

    console.log('Task submitted:', { taskId });

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ taskId }),
    };
  } catch (err: any) {
    console.error('submitTask failed', err);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};