import { cva } from 'class-variance-authority'

export const buttonVariants = cva(
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow-sm hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20',
        secondary: 'bg-secondary text-secondary-foreground hover:-translate-y-0.5 hover:bg-secondary/80',
        outline: 'border border-border bg-white hover:-translate-y-0.5 hover:border-primary/30 hover:bg-muted',
        ghost: 'hover:bg-muted',
        dark: 'bg-ink text-white hover:-translate-y-0.5 hover:bg-ink/90 hover:shadow-lg hover:shadow-ink/15',
      },
      size: {
        default: 'px-5 py-2.5',
        sm: 'min-h-9 px-3 py-2 text-xs',
        lg: 'min-h-12 px-6 py-3 text-base',
        icon: 'size-11 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)
