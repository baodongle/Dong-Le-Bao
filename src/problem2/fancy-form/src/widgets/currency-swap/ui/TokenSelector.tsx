import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react';
import {
  type ComponentProps,
  createContext,
  type PropsWithChildren,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { Token } from '@/entities/token/model';
import { TokenIcon } from '@/entities/token/ui';
import { cn } from '@/shared/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';

interface TokenContextValue<T extends Token> {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedToken: T | undefined;
  tokens: T[];
  onTokenSelect: (token: T) => void;
  getTokenName: (token: T) => string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TokenContext = createContext<TokenContextValue<any> | null>(null);

function useTokenContext<T extends Token>() {
  const context = useContext(TokenContext) as TokenContextValue<T> | null;

  if (!context) {
    throw new Error('Token components must be used within TokenProvider');
  }

  return context;
}

interface TokenProviderProps<T extends Token> {
  tokens: T[];
  selectedTokenName?: string;
  onTokenChange?: (token: T) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  getTokenName?: (token: T) => string;
}

function TokenProvider<T extends Token>({
  children,
  tokens,
  selectedTokenName,
  onTokenChange,
  open: controlledOpen,
  onOpenChange,
  getTokenName = (token) => token.currency,
}: PropsWithChildren<TokenProviderProps<T>>) {
  const [internalOpen, setInternalOpen] = useState(false);

  const open = controlledOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;

  const selectedToken = useMemo(
    () => tokens.find((t) => getTokenName(t) === selectedTokenName),
    [tokens, selectedTokenName, getTokenName],
  );

  const handleTokenSelect = useCallback(
    (token: T) => {
      onTokenChange?.(token);
      setOpen(false);
    },
    [onTokenChange, setOpen],
  );

  const value: TokenContextValue<T> = {
    open,
    setOpen,
    selectedToken,
    tokens,
    onTokenSelect: handleTokenSelect,
    getTokenName,
  };

  return (
    <TokenContext.Provider value={value}>
      <Popover open={open} onOpenChange={setOpen}>
        {children}
      </Popover>
    </TokenContext.Provider>
  );
}

// Trigger component
interface TokenTriggerProps extends ComponentProps<'button'> {
  renderTrigger?: (token: Token, isOpen: boolean) => ReactNode;
}

function TokenTrigger({
  className,
  renderTrigger,
  ...props
}: TokenTriggerProps) {
  const { open, selectedToken, getTokenName } = useTokenContext();

  if (renderTrigger && selectedToken) {
    return (
      <PopoverTrigger asChild>
        <button className={className} {...props}>
          {renderTrigger(selectedToken, open)}
        </button>
      </PopoverTrigger>
    );
  }

  return (
    <PopoverTrigger asChild>
      <button
        data-state={open ? 'open' : 'closed'}
        className={cn(
          'border-input bg-background ring-offset-background flex h-12 w-full max-w-72 items-center justify-between rounded-md border px-3 py-2 text-sm',
          'placeholder:text-muted-foreground focus:ring-ring focus:ring-2 focus:ring-offset-2 focus:outline-none',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'hover:bg-accent hover:text-accent-foreground',
          className,
        )}
        {...props}
      >
        <div className="flex min-w-0 flex-1 items-center gap-2">
          {selectedToken && (
            <>
              <TokenIcon token={selectedToken} />
              <span className="truncate">{getTokenName(selectedToken)}</span>
            </>
          )}
        </div>
        <ChevronsUpDownIcon className="h-4 w-4 shrink-0 opacity-50" />
      </button>
    </PopoverTrigger>
  );
}

interface TokenContentProps extends ComponentProps<typeof PopoverContent> {
  renderToken?: (token: Token, isSelected: boolean) => ReactNode;
  title?: string;
  searchable?: boolean;
  onSearch?: (query: string) => void;
}

function TokenContent({
  className,
  children,
  renderToken,
  title = 'Tokens',
  searchable = false,
  onSearch,
  ...props
}: TokenContentProps) {
  const { tokens, selectedToken, onTokenSelect, getTokenName } =
    useTokenContext();

  const [searchQuery, setSearchQuery] = useState('');

  const filteredTokens = useMemo(() => {
    if (!searchQuery) {
      return tokens;
    }

    return tokens.filter((t) =>
      getTokenName(t).toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [tokens, searchQuery, getTokenName]);

  useEffect(() => {
    onSearch?.(searchQuery);
  }, [searchQuery, onSearch]);

  const defaultRenderToken = (token: Token, isSelected: boolean) => {
    return (
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <TokenIcon token={token} />
        <div className="flex min-w-0 flex-1 flex-col items-start">
          <span className="truncate text-sm">{getTokenName(token)}</span>
        </div>
        {isSelected && <CheckIcon className="ml-auto h-4 w-4" />}
      </div>
    );
  };

  return (
    <PopoverContent
      className={cn('p-0', className)}
      align={props.align || 'start'}
      {...props}
    >
      <div className="border-b px-3 py-2">
        <p className="text-muted-foreground text-sm font-medium">{title}</p>
      </div>

      {searchable && (
        <div className="border-b px-3 py-2">
          <input
            type="text"
            placeholder="Search tokens..."
            value={searchQuery}
            className="placeholder:text-muted-foreground w-full border-none bg-transparent text-sm outline-none"
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
          />
        </div>
      )}

      <div className="max-h-[300px] overflow-y-auto">
        {filteredTokens.length === 0 ? (
          <div className="text-muted-foreground px-3 py-2 text-center text-sm">
            No tokens found
          </div>
        ) : (
          <div className="p-1">
            {filteredTokens.map((token) => {
              const isSelected =
                selectedToken &&
                getTokenName(selectedToken) === getTokenName(token);

              return (
                <button
                  key={getTokenName(token)}
                  className={cn(
                    'flex w-full items-center gap-2 rounded-sm px-2 py-2 text-left text-sm',
                    'hover:bg-accent hover:text-accent-foreground',
                    'focus:outline-none',
                    isSelected && 'bg-accent text-accent-foreground',
                  )}
                  onClick={() => {
                    onTokenSelect(token);
                  }}
                >
                  {renderToken
                    ? renderToken(token, Boolean(isSelected))
                    : defaultRenderToken(token, Boolean(isSelected))}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {children && (
        <>
          <div className="border-t" />
          <div className="p-1">{children}</div>
        </>
      )}
    </PopoverContent>
  );
}

export { TokenContent, TokenProvider as TokenSelector, TokenTrigger };
