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
        'min-h-11 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-white)] px-3 py-2 text-sm text-[var(--color-ink)] shadow-sm outline-none transition-all placeholder:text-[var(--color-text-secondary)] hover:border-[var(--color-primary-dark)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-ring)]',
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
        'min-h-28 w-full resize-y rounded-md border border-[var(--color-border)] bg-[var(--color-white)] px-3 py-2 text-sm text-[var(--color-ink)] shadow-sm outline-none transition-all placeholder:text-[var(--color-text-secondary)] hover:border-[var(--color-primary-dark)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-ring)]',
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
        'min-h-11 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-white)] px-3 py-2 text-sm text-[var(--color-ink)] shadow-sm outline-none transition-all hover:border-[var(--color-primary-dark)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-ring)]',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  )
}
