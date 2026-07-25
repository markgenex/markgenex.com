import { cn } from '../../lib/utils'

export function Badge({ className, children }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border border-border bg-white px-2.5 py-1 text-xs font-bold text-muted-foreground shadow-sm',
        className,
      )}
    >
      {children}
    </span>
  )
}
