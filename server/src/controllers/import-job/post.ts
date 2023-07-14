import { z } from "zod";
import { TypedRequestBody, validateRequestBody } from "zod-express-middleware";
import { Response } from 'express';
import { ImportJob } from "../../models/importJob";
import { Attributes } from "sequelize";

const bodySchema = z.object({
    bookId: z.string(),
    url: z.string(),
    type: z.enum(["word", "pdf", "wattpad", "evernote"])
})

const handler = async (req: TypedRequestBody<typeof bodySchema>, res: Response) => {
    const { bookId, type, url } = req.body

    const newImportJob = await ImportJob.create({
        bookId,
        type,
        url
    })

    res.json(newImportJob.dataValues)
}

export default [validateRequestBody(bodySchema), handler]