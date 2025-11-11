export interface SwapRequest {
  fromCurrency: string
  toCurrency: string
  fromAmount: number
  toAmount: number
  rate: number
}

export interface SwapResponse {
  success: boolean
  transactionId: string
  timestamp: string
  data: SwapRequest
  message: string
}

/**
 * Fake API to simulate a swap transaction
 * Delays 2 seconds to simulate a network request.
 */
export const submitSwap = async (
  request: SwapRequest,
): Promise<SwapResponse> => {
  // Simulate network delay
  await new Promise((resolve) => {setTimeout(resolve, 2000)})

  // Simulate random success/failure (90% success rate)
  const isSuccess = Math.random() > 0.1

  if (!isSuccess) {
    throw new Error('Transaction failed. Please try again.')
  }

  // Return fake success response
  return {
    success: true,
    transactionId: `TXN-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
    timestamp: new Date().toISOString(),
    data: request,
    message: 'Swap successful!',
  }
}
