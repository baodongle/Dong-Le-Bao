import type { Token, TokenPrice } from '@/entities/token/model'
import { TOKEN_ICON_BASE_URL } from '@/shared/api'

export const mapTokenPriceToToken = (raw: TokenPrice): Token => {
  return {
    currency: raw.currency,
    price: raw.price,
    iconUrl: `${TOKEN_ICON_BASE_URL}${raw.currency}.svg`,
  }
}
