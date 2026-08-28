import { useEffect, useState } from 'react'
import { Badge } from './ui/badge'
import { getPublicPartners } from '../lib/api'

export function TestimonialsPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    getPublicPartners()
      .then((partners) => {
        if (!mounted) return
        if (Array.isArray(partners) && partners.length) {
          const testimonials = partners
            .filter((p) => p.testimonial || p.quote)
            .map((p, i) => ({ id: p.id || p._id || `partner-${i}`, name: p.name || p.company || 'Partner', title: p.title || p.role || p.industry || '', quote: p.testimonial || p.quote }))
          setItems(testimonials.length ? testimonials : sampleFallback())
        } else {
          setItems(sampleFallback())
        }
      })
      .catch(() => setItems(sampleFallback()))
      .finally(() => mounted && setLoading(false))

    return () => {
      mounted = false
    }
  }, [])

  function sampleFallback() {
    return [
      { id: 1, name: 'Rina Sharma', title: 'Head of Admissions, UniX', quote: 'MarkGenexes transformed our outreach — higher quality applicants and faster admissions.' },
      { id: 2, name: 'Arjun Patel', title: 'Founder, EduStart', quote: 'Practical, data-driven, and reliable. The team delivered measurable growth.' },
      { id: 3, name: 'Lina Gomez', title: 'Marketing Lead, HealthCorp', quote: 'Clear reporting and accountable results. Highly recommended.' },
    ]
  }

  return (
    <>
      <section className="grid-pattern border-b border-border bg-white/80">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <Badge>Testimonials</Badge>
          <h1 className="mt-4 text-3xl font-black text-ink sm:text-4xl">What partners say</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">Short endorsements from clients and partners we've worked with.</p>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((t) => (
            <figure key={t.id} className="surface-card interactive-card rounded-lg p-5">
              <blockquote className="text-sm text-ink">“{t.quote}”</blockquote>
              <figcaption className="mt-4 flex items-center gap-3">
                <div className="grid size-11 place-items-center rounded-full bg-primary/10 text-primary font-bold">{t.name.charAt(0)}</div>
                <div>
                  <div className="font-extrabold text-ink">{t.name}</div>
                  <div className="text-sm text-muted-foreground">{t.title}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </main>
    </>
  )
}
