import { cn } from '../../lib/utils'

export function Field({ label, children, className }) {
  return (
    <label className={cn('grid gap-2 text-sm font-semibold text-ink', className)}>
      <span>{label}</span>
      {children}
    </label>
  )
}

export function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        'min-h-11 w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-ink shadow-sm outline-none transition-all placeholder:text-muted-foreground hover:border-primary/30 focus:border-primary focus:ring-2 focus:ring-ring',
        className,
      )}
      {...props}
    />
  )
}

export function Textarea({ className, ...props }) {
  return (
    <textarea
      className={cn(
        'min-h-28 w-full resize-y rounded-md border border-border bg-white px-3 py-2 text-sm text-ink shadow-sm outline-none transition-all placeholder:text-muted-foreground hover:border-primary/30 focus:border-primary focus:ring-2 focus:ring-ring',
        className,
      )}
      {...props}
    />
  )
}

export function Select({ className, children, ...props }) {
  return (
    <select
      className={cn(
        'min-h-11 w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-ink shadow-sm outline-none transition-all hover:border-primary/30 focus:border-primary focus:ring-2 focus:ring-ring',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  )
}
