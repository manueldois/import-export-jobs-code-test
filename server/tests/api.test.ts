import 'dotenv/config'
import { beforeEach, describe, vi } from 'vitest';
import { createApp } from '../src/app'
import { promisify } from 'util'

const setTimeoutAsync = promisify(setTimeout)

vi.mock('../src/services/sequelize', async () => {
  const { Sequelize } = await import('sequelize');
  return { sequelize: new Sequelize('sqlite::memory:', { logging: false }) }
})

const app = await createApp()

describe('API tests', () => {
  beforeEach(async () => {
    vi.resetAllMocks()
  })
})