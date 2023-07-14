import 'dotenv/config'
import { beforeEach, describe, vi, it, expect } from 'vitest';
import { createApp } from '../src/app'
import { promisify } from 'util'
import { ExportJob } from '../src/models/exportJob'
import request from 'supertest'
import { ImportJob } from '../src/models/importJob';


const setTimeoutAsync = promisify(setTimeout)

vi.mock('../src/services/sequelize', async () => {
  const { Sequelize } = await import('sequelize');
  return { sequelize: new Sequelize('sqlite::memory:', { logging: false }) }
})

const app = await createApp()

describe('API tests', () => {
  beforeEach(async () => {
    await ExportJob.destroy({ where: {} })
    await ImportJob.destroy({ where: {} })
    vi.resetAllMocks()
  })

  it('Creates export jobs', async () => {
    const resPost = await request(app)
      .post('/export-job')
      .send({ bookId: "1", type: "epub" })

    const exportJob = await ExportJob.findByPk(resPost.body.id)

    expect(exportJob?.dataValues).toMatchObject({ bookId: "1", type: "epub" })
  })

  it('Gets export jobs grouped by state', async () => {
    const exportJob1 = await ExportJob.create({
      bookId: "1",
      type: "epub",
      state: "pending"
    })

    const exportJob2 = await ExportJob.create({
      bookId: "1",
      type: "epub",
      state: "pending"
    })

    const exportJob3 = await ExportJob.create({
      bookId: "1",
      type: "epub",
      state: "finished"
    })

    const resGet = await request(app)
      .get('/export-job')

    expect(resGet.body).toMatchObject(
      {
        pending: [
          JSON.parse(JSON.stringify(exportJob1.dataValues)),
          JSON.parse(JSON.stringify(exportJob2.dataValues))
        ],
        finished: [
          JSON.parse(JSON.stringify(exportJob3.dataValues))
        ]
      }
    )
  })

  it('Creates import jobs', async () => {
    const resPost = await request(app)
      .post('/import-job')
      .send({ bookId: "1", type: "word", url: "http://test.com" })

    const importJob = await ImportJob.findByPk(resPost.body.id)

    expect(importJob?.dataValues).toMatchObject({ bookId: "1", type: "word", url: "http://test.com" })
  })

  it('Gets export jobs grouped by state', async () => {
    const importJob1 = await ImportJob.create({
      bookId: "1",
      type: "word",
      state: "pending",
      url: 'http://test.com'
    })

    const importJob2 = await ImportJob.create({
      bookId: "1",
      type: "word",
      state: "pending",
      url: 'http://test.com'
    })

    const importJob3 = await ImportJob.create({
      bookId: "1",
      type: "word",
      state: "finished",
      url: 'http://test.com'
    })

    const resGet = await request(app)
      .get('/import-job')

    expect(resGet.body).toMatchObject(
      {
        pending: [
          JSON.parse(JSON.stringify(importJob1.dataValues)),
          JSON.parse(JSON.stringify(importJob2.dataValues))
        ],
        finished: [
          JSON.parse(JSON.stringify(importJob3.dataValues))
        ]
      }
    )
  })


})