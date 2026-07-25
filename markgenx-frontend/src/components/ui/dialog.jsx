import { X } from 'lucide-react'
import { Button } from './button'
import { cn } from '../../lib/utils'

export function Dialog({ open, onOpenChange, title, description, children, className }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[70] grid place-items-end bg-ink/55 p-3 backdrop-blur-sm sm:place-items-center" role="dialog" aria-modal="true">
      <div className={cn('animate-rise max-h-[92vh] w-full overflow-auto rounded-lg bg-white shadow-premium sm:max-w-2xl', className)}>
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-border bg-white/95 p-5 backdrop-blur">
          <div>
            <h2 className="text-xl font-black text-ink">{title}</h2>
            {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
          </div>
          <Button type="button" variant="ghost" size="icon" onClick={() => onOpenChange(false)} aria-label="Close dialog">
            <X className="size-5" />
          </Button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}
