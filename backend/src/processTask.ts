import { SQSEvent, SQSBatchItemFailure, SQSBatchResponse } from 'aws-lambda';

import { getTask, incrementRetries, markProcessed } from './utils/dynamodb';

export const handler = async (event: SQSEvent): Promise<SQSBatchResponse> => {
  const failures: SQSBatchItemFailure[] = [];

  for (const record of event.Records) {
    const messageId = record.messageId;

    try {
      const body = JSON.parse(record.body);
      const id = body.id;

      if (!id)
        throw new Error('Missing id in message body');

      console.log(`Processing id: ${id}`);

      const task = await getTask(id);

      if (!task)
        throw new Error(`Task not found: ${id}`);

      try {
        await incrementRetries(id);
      } catch (e) {
        console.error(`Failed to increment retries for ${id}`, e);
      }

      if (Math.random() < 0.3) {
        console.warn(`Simulated failure for id: ${id}`);
        throw new Error('Simulated task failure');
      }

      await markProcessed(id);

      console.log(`Task ${id} processed successfully`);

    } catch (err) {
      console.error(`Failed to process message ${messageId}`, err);
      failures.push({ itemIdentifier: messageId });
    }
  }

  return { batchItemFailures: failures };
};
