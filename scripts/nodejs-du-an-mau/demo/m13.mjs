import { Queue, Worker } from 'bullmq';
const connection = { host: 'localhost', port: 6391 };

const queue = new Queue('reminders', { connection });
await queue.obliterate({ force: true });

let attempts = 0;
const sent = new Set();                                   // stands in for a "sent_reminders" table with a UNIQUE key
const worker = new Worker('reminders', async (job) => {
  attempts++;
  if (attempts < 3) throw new Error('mail server timeout (attempt ' + attempts + ')');
  if (sent.has(job.id)) return 'already sent';            // idempotent: a retry never mails twice
  sent.add(job.id);
  return 'mailed ' + job.data.email + ' about plant ' + job.data.plantId;
}, { connection });

worker.on('failed', (job, err) => console.log('failed   ', job.id, '-', err.message, '| next retry in', job.opts.backoff.delay * 2 ** (job.attemptsMade - 1), 'ms'));
worker.on('completed', async (job, result) => {
  console.log('completed', job.id, '-', result, '| attempts:', job.attemptsMade);
  console.log('jobs in queue:', JSON.stringify(await queue.getJobCounts('waiting', 'delayed', 'completed', 'failed')));
  await worker.close(); await queue.close();
});

const opts = { jobId: 'remind-10-2026-11-22', attempts: 5, backoff: { type: 'exponential', delay: 200 }, removeOnComplete: 100 };
await queue.add('remind', { plantId: 10, email: 'an@example.com' }, opts);
await queue.add('remind', { plantId: 10, email: 'an@example.com' }, opts); // same jobId: ignored, no duplicate
