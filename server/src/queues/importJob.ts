import { Queue } from "bullmq";

export const ImportJobQueue = new Queue('importJob', {
    connection: {
        port: parseInt(process.env.REDIS_PORT),
        host: process.env.REDIS_HOST
    },
    defaultJobOptions: {
        attempts: parseInt(process.env.JOB_MAX_ATTEMPTS, 10),
        backoff: {
            type: 'exponential',
            delay: parseInt(process.env.JOB_BACKOFF_DELAY, 10),
        },
    },
});
