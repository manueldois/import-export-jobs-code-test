import 'dotenv/config'
import express from 'express'
import { sequelize } from './services/sequelize';
import { ExportJob } from './models/exportJob';
import { ImportJob } from './models/importJob';

export async function createApp() {
    try {
        await sequelize.authenticate()
        await ExportJob.sync()
        await ImportJob.sync()
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1)
    }

    console.log('Connection to DB has been established successfully.');

    const app: express.Application = express();

    app.use(express.json())



    return app
}