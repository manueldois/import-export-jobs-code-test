import { ExportJob } from "../../models/exportJob";
import { z } from "zod";
import { TypedRequestBody, validateRequestBody } from "zod-express-middleware";
import { Response } from 'express';

const bodySchema = z.object({
    bookId: z.string(),
    type: z.enum(["epub", "pdf"])
})

const handler = async (req: TypedRequestBody<typeof bodySchema>, res: Response) => {
    const { bookId, type } = req.body

    const newExportJob = await ExportJob.create({
        bookId,
        type
    })

    res.json(newExportJob.toJSON())
}

export default [validateRequestBody(bodySchema), handler]
