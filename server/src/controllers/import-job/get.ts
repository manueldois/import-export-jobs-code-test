import { Response } from 'express';
import { ImportJob } from "../../models/importJob";

const handler = async (req: Request, res: Response) => {
    const importJobs = await ImportJob.findAll({
        group: 'status'
    })

    res.json(importJobs)
}

export default [handler]