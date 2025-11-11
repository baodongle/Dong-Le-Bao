import type { Token } from '@/entities/token/model'

export interface ExchangeRate {
  fromCurrency: string
  toCurrency: string
  rate: number
}

export const calculateExchangeRate = (
  fromToken?: Token,
  toToken?: Token,
): ExchangeRate | null => {
  if (!fromToken || !toToken) {
    return null
  }

  const rate = fromToken.price / toToken.price

  return {
    fromCurrency: fromToken.currency,
    toCurrency: toToken.currency,
    rate,
  }
}

export const calculateExchangeAmount = (
  amount: number,
  exchangeRate: ExchangeRate | null,
) => {
  if (!exchangeRate || amount <= 0) {
    return null
  }

  return amount * exchangeRate.rate
}
