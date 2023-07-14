import { Job, Worker } from "bullmq";
import { sequelize } from "../services/sequelize";
import { ExportJob } from "../models/exportJob";
import { setTimeoutAsync } from "../utils";

// ePub export 	10
// PDF export 	25
// import (any) 	60

export const ExportJobWorker = new Worker('exportJob', async (job) => {
    const { type } = job.data

    const jobDurations = {
        'epub': 1 * 1000,
        'pdf': 2 * 1000
    }

    await setTimeoutAsync(jobDurations[type] || 0)

    return {}
}, {
    connection: {
        port: parseInt(process.env.REDIS_PORT, 10),
        host: process.env.REDIS_HOST
    }
}
)

ExportJobWorker.on('completed', async (job: Job) => {
    try {
        await sequelize.authenticate()

        await ExportJob.update({
            state: "finished"
        }, {
            where: {
                id: job.data.id
            }
        })
    } catch (error) {
        console.error(error)
    }
});

ExportJobWorker.on('failed', async (job: Job) => {
    try {
        await sequelize.authenticate()

        await ExportJob.update({
            state: 'error'
        }, {
            where: {
                id: job.data.id
            }
        })
    } catch (error) {
        console.error(error)
    }
});

