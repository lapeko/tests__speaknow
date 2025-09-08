import { SQSEvent } from 'aws-lambda';

import { TaskStatus } from './utils/types';
import { markFailed } from './utils/dynamodb';

export const handler = async (event: SQSEvent) => {
  for (const record of event.Records) {
    try {
      const body = JSON.parse(record.body);
      const id = body.id;

      if (!id) {
        console.warn('Missing id in DLQ message');
        continue;
      }

      console.warn(`Handling DLQ for id: ${id}`);

      await markFailed(id, 'Too many retry attempts');

      console.log(`Task ${id} marked as ${TaskStatus.Failed}`);

    } catch (err) {
      console.error('DLQ handler failed for record:', record, err);
    }
  }
};
