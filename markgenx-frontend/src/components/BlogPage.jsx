import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Loader2, FileText } from 'lucide-react'
import { getPublicCaseStudies } from '../lib/api'
import { Badge } from './ui/badge'
import { EmptyState } from './ui/empty-state'
import { samplePosts } from '../data/blogPosts'

export function BlogPage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    // Try fetching from public case-studies endpoint (placeholder). If unavailable,
    // fall back to local sample posts so the blog page always shows content during dev.
    getPublicCaseStudies()
      .then((items) => {
        if (!mounted) return
        if (Array.isArray(items) && items.length) setPosts(items.map((it) => ({ id: it.id || it._id || it.slug || it.title, title: it.title || it.name, excerpt: it.excerpt || it.description })))
        else setPosts(samplePosts)
      })
      .catch(() => {
        if (!mounted) return
        setPosts(samplePosts)
      })
      .finally(() => mounted && setLoading(false))
    return () => {
      mounted = false
    }
  }, [])

  return (
    <>
      <section className="grid-pattern border-b border-border bg-white/80">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <Badge>Insights</Badge>
          <h1 className="mt-4 text-3xl font-black text-ink sm:text-4xl">Latest from our team</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">Thoughts on growth, product marketing, and measurement.</p>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {loading ? (
          <div className="grid place-items-center py-12">
            <Loader2 className="size-7 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-red-700">{error}</div>
        ) : !posts.length ? (
          <EmptyState icon={FileText} title="No posts yet" description="Our insights will appear here soon." />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <article key={p.id} className="surface-card interactive-card rounded-lg p-4">
                <h3 className="text-lg font-extrabold text-ink">
                  <Link to={`/blog/${p.id}`} className="hover:underline">{p.title}</Link>
                </h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{p.excerpt || p.description || ''}</p>
                <div className="mt-4 flex items-center gap-3">
                  <Badge>{p.industry || 'General'}</Badge>
                  <Link to={`/blog/${p.id}`} className="ml-auto text-sm font-bold text-primary">Read</Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </>
  )
}
