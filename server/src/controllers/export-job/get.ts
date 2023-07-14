import { Response } from 'express';
import { ExportJob } from '../../models/exportJob';

const handler = async (req: Request, res: Response) => {
    const exportJobs = await ExportJob.findAll({
        group: 'status'
    })

    res.json(exportJobs)
}

export default [handler]