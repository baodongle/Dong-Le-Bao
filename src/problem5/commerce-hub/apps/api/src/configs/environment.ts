import { z } from 'zod'
import { createEnv } from '@t3-oss/env-core'

export const env = createEnv({
  server: {
    DATABASE_URL: z.url(),
    HOST: z.string().min(1),
    PORT: z.coerce.number(),
  },
  runtimeEnv: process.env,
})
