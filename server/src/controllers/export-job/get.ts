import { Response, Request } from 'express';
import { ExportJob } from '../../models/exportJob';
import { groupBy } from '../../utils';

const handler = async (req: Request, res: Response) => {
    const exportJobs = await ExportJob.findAll({
        where: {},
    })

    const exportJobsDataGrouped = groupBy(exportJobs.map(doc => doc.toJSON()), job => job.state)

    res.json(exportJobsDataGrouped)
}

export default [handler]