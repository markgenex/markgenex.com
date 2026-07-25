import { cn } from '../../lib/utils'

export function Skeleton({ className }) {
  return <div className={cn('animate-pulse-soft rounded-md bg-slate-200/80', className)} />
}

export function SkeletonPanel() {
  return (
    <div className="surface-card rounded-lg p-5">
      <Skeleton className="h-4 w-28" />
      <Skeleton className="mt-4 h-8 w-48" />
      <div className="mt-6 grid gap-3">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-3/4" />
      </div>
    </div>
  )
}
