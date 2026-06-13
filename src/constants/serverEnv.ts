import 'server-only'

import { z } from 'zod'

const schema = z.object({})

export const serverEnv = schema.parse({})
