import { SQSEvent } from 'aws-lambda';

import { TaskStatus } from './utils/types';
import { markFailed } from './utils/dynamodb';

export const handler = async (event: SQSEvent) => {
  for (const record of event.Records) {
    try {
      const body = JSON.parse(record.body);
      const taskId = body.taskId;

      if (!taskId) {
        console.warn('Missing taskId in DLQ message');
        continue;
      }

      console.warn(`Handling DLQ for taskId: ${taskId}`);

      await markFailed(taskId, 'Too many retry attempts');

      console.log(`Task ${taskId} marked as ${TaskStatus.Failed}`);

    } catch (err) {
      console.error('DLQ handler failed for record:', record, err);
    }
  }
};
