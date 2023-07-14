import { Job, Worker } from "bullmq";
import { sequelize } from "../services/sequelize";
import { ImportJob } from "../models/importJob";
import { setTimeoutAsync } from "../utils";

// ePub export 	10
// PDF export 	25
// import (any) 	60

export const ImportJobWorker = new Worker('importJob', async (job) => {
    await setTimeoutAsync(60)

    return {}
}, {
    connection: {
        port: parseInt(process.env.REDIS_PORT, 10),
        host: process.env.REDIS_HOST
    }
}
)

ImportJobWorker.on('completed', async (job: Job) => {
    try {
        await sequelize.authenticate()

        await ImportJob.update({
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

ImportJobWorker.on('failed', async (job: Job) => {
    try {
        await sequelize.authenticate()

        await ImportJob.update({
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

