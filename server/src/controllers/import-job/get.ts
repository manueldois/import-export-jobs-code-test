import { Response, Request } from 'express';
import { ImportJob } from "../../models/importJob";
import { groupBy } from '../../utils';

const handler = async (req: Request, res: Response) => {
    const importJobs = await ImportJob.findAll({
        where: {},
    })

    const importJobsDataGrouped = groupBy(importJobs.map(doc => doc.toJSON()), job => job.state)

    res.json(importJobsDataGrouped)
}

export default [handler]