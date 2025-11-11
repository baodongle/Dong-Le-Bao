import { useQuery } from '@tanstack/react-query'
import { apiClient, TOKEN_PRICES_URL } from '@/shared/api'
import { mapTokenPriceToToken } from '../lib/utils'
import type { TokenPrice } from '../model/token'

export const useTokenPrices = () => {
  return useQuery({
    queryKey: ['token-prices'],
    queryFn: async () =>
      await apiClient.get<TokenPrice[]>(TOKEN_PRICES_URL).json(),
    select: (data) => {
      const validTokens = data.filter((token) => token.price > 0)
      const tokenMap = new Map<string, TokenPrice>()

      validTokens.forEach((token) => {
        const existing = tokenMap.get(token.currency)

        if (!existing || new Date(token.date) > new Date(existing.date)) {
          tokenMap.set(token.currency, token)
        }
      })

      return [...tokenMap.values()]
        .sort((a, b) => a.currency.localeCompare(b.currency))
        .map(mapTokenPriceToToken)
    },
  })
}
