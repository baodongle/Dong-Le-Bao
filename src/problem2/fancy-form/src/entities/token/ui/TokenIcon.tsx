import { memo } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui'
import type { Token } from '../model'

interface TokenIconProps {
  token: Token
}

function TokenIconComponent({ token }: TokenIconProps) {
  return (
    <Avatar>
      <AvatarImage src={token.iconUrl} alt={`${token.currency} icon`} />
      <AvatarFallback>{token.currency.charAt(0)}</AvatarFallback>
    </Avatar>
  )
}

TokenIconComponent.displayName = 'TokenIcon'

export const TokenIcon = memo(TokenIconComponent)
