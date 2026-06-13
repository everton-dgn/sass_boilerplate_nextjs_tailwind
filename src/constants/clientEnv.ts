import 'client-only'

import { z } from 'zod'

const schema = z.object({
  NEXT_PUBLIC_CLARITY_TRACKING: z.string().default('')
})

export const clientEnv = schema.parse({
  NEXT_PUBLIC_CLARITY_TRACKING: process.env.NEXT_PUBLIC_CLARITY_TRACKING
})
