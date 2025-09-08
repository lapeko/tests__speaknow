import { SQSEvent, SQSBatchItemFailure, SQSBatchResponse } from 'aws-lambda';

import { getTask, incrementRetries, markProcessed } from './utils/dynamodb';

export const handler = async (event: SQSEvent): Promise<SQSBatchResponse> => {
  const failures: SQSBatchItemFailure[] = [];

  for (const record of event.Records) {
    const messageId = record.messageId;

    try {
      const body = JSON.parse(record.body);
      const taskId = body.taskId;

      if (!taskId)
        throw new Error('Missing taskId in message body');

      console.log(`Processing taskId: ${taskId}`);

      const task = await getTask(taskId);

      if (!task)
        throw new Error(`Task not found: ${taskId}`);

      try {
        await incrementRetries(taskId);
      } catch (e) {
        console.error(`Failed to increment retries for ${taskId}`, e);
      }

      if (Math.random() < 0.3) {
        console.warn(`Simulated failure for taskId: ${taskId}`);
        throw new Error('Simulated task failure');
      }

      await markProcessed(taskId);

      console.log(`Task ${taskId} processed successfully`);

    } catch (err) {
      console.error(`Failed to process message ${messageId}`, err);
      failures.push({ itemIdentifier: messageId });
    }
  }

  return { batchItemFailures: failures };
};
