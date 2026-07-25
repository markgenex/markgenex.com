import { Inbox } from 'lucide-react'
import { cn } from '../../lib/utils'

export function EmptyState({ icon: Icon = Inbox, title, description, action, className }) {
  return (
    <div className={cn('grid place-items-center rounded-lg border border-dashed border-border bg-muted/40 p-8 text-center', className)}>
      <div className="grid size-12 place-items-center rounded-md bg-white text-primary shadow-soft">
        <Icon className="size-5" />
      </div>
      <p className="mt-4 font-bold text-ink">{title}</p>
      <p className="mt-1 max-w-sm text-sm leading-6 text-muted-foreground">{description}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  )
}
