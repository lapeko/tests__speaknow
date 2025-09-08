import { APIGatewayProxyHandler } from 'aws-lambda';

import { scanTasks } from './utils/dynamodb';

export const handler: APIGatewayProxyHandler = async () => {
  try {
    const tasks = await scanTasks();

    const normalized = tasks.map((task) => ({ ...task, retries: Math.max(0, task.retries) }));

    console.log(`Returning ${normalized.length} tasks`);

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(normalized),
    };
  } catch (err) {
    console.error('Failed to get tasks:', err);

    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
