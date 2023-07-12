import 'dotenv/config'
import './workers/transcriptTopics'
import express from 'express'
import { sequelize } from './services/sequelize';

export async function createApp() {
    try {
        await sequelize.authenticate()
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1)
    }

    console.log('Connection to DB has been established successfully.');

    const app: express.Application = express();

    app.use(express.json())



    return app
}