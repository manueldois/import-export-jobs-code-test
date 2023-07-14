import 'dotenv/config'
import { beforeEach, describe, vi, it, expect, afterEach, Mock } from 'vitest';
import { createApp } from '../src/app'
import { ExportJob } from '../src/models/exportJob'
import request from 'supertest'
import { ImportJob } from '../src/models/importJob';
import { setTimeoutAsync } from '../src/utils';

vi.mock('../src/services/sequelize', async () => {
  const { Sequelize } = await import('sequelize');
  return { sequelize: new Sequelize('sqlite::memory:', { logging: false }) }
})

vi.mock('../src/utils', async () => {
  const util = await import('../src/utils')

  return {
    ...util,
    setTimeoutAsync: vi.fn()
  }
})

const app = await createApp()

describe('API tests', () => {
  beforeEach(async () => {
    await ExportJob.destroy({ where: {} })
    await ImportJob.destroy({ where: {} })
  })

  afterEach(async () => {
    vi.resetAllMocks()
  })

  it('Creates export jobs, then waits, then gets them with status finished', async () => {
    (setTimeoutAsync as Mock).mockImplementation(() => new Promise<void>((resolve) => {
      setTimeout(resolve, 500)
    }))

    const resPostEpub = await request(app)
      .post('/export-job')
      .send({ bookId: "1", type: "epub" })

    const exportJobEPub = await ExportJob.findByPk(resPostEpub.body.id)

    expect(exportJobEPub?.dataValues)
      .toMatchObject({ bookId: "1", type: "epub", state: 'pending' })

    await new Promise<void>((resolve) => {
      setTimeout(resolve, 500)
    })

    await exportJobEPub?.reload()

    expect(exportJobEPub?.dataValues)
      .toMatchObject({ state: 'finished' })
  })

  it('Creates import jobs, then waits, then gets them with status finished', async () => {
    (setTimeoutAsync as Mock).mockImplementation(() => new Promise<void>((resolve) => {
      setTimeout(resolve, 500)
    }))

    const resPostEpub = await request(app)
      .post('/import-job')
      .send({ bookId: "1", type: "word", url: "http://test.com" })

    const importJobEPub = await ImportJob.findByPk(resPostEpub.body.id)

    expect(importJobEPub?.dataValues)
      .toMatchObject({ bookId: "1", type: "word", url: "http://test.com", state: 'pending' })

    await new Promise<void>((resolve) => {
      setTimeout(resolve, 500)
    })

    await importJobEPub?.reload()

    expect(importJobEPub?.dataValues)
      .toMatchObject({ state: 'finished' })
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

  it('Gets import jobs grouped by state', async () => {
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