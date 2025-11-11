import { NumericFormat, type NumericFormatProps } from 'react-number-format'
import { cn } from '../lib/utils'

function NumericInput({ className, type, ...props }: NumericFormatProps) {
  return (
    <NumericFormat
      type={type}
      data-slot="input"
      className={cn(
        'selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        className,
      )}
      {...props}
    />
  )
}

export { NumericInput }
