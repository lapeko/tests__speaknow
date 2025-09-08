import { APIGatewayProxyHandler } from 'aws-lambda';
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { v4 as uuid } from 'uuid';

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

    const id = uuid();

    await createTask({ id, answer });

    await sqs.send(new SendMessageCommand({
      QueueUrl: TASKS_QUEUE_URL,
      MessageBody: JSON.stringify({ id }),
    }));

    console.log('Task submitted:', { id });

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ id }),
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