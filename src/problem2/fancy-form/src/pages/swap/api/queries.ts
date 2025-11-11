import { useMutation } from '@tanstack/react-query'
import { submitSwap, type SwapRequest } from './swapApi'

export const useSwapMutation = () => {
  return useMutation({
    mutationFn: (request: SwapRequest) => submitSwap(request),
  })
}
