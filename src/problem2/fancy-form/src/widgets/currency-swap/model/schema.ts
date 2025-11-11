import { z } from 'zod'

const tokenShape = z.object({
  currency: z.string(),
  price: z.number(),
  iconUrl: z.string(),
}).shape

export const swapFormSchema = z
  .object({
    fromToken: z.object(tokenShape, {
      error: 'From token is required',
    }),
    toToken: z.object(tokenShape, {
      error: 'To token is required',
    }),
    fromAmount: z.string().min(1, 'Amount is required'),
  })
  .refine((data) => data.fromToken.currency !== data.toToken.currency, {
    message: 'Cannot swap the same token',
    path: ['toToken'],
  })

export type SwapFormValues = z.infer<typeof swapFormSchema>
