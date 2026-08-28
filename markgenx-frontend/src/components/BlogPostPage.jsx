import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { samplePosts } from '../data/blogPosts'
import { getPublicCaseStudies } from '../lib/api'

export function BlogPostPage() {
  const { id } = useParams()
  const [post, setPost] = useState(null)

  useEffect(() => {
    let mounted = true
    // Prefer local sample posts immediately so direct links work during dev.
    const local = samplePosts.find((p) => p.id === id)
    if (local) {
      setPost(local)
      setLoading(false)
    }

    // Try to fetch matching resource; if found, override local copy.
    getPublicCaseStudies()
      .then((items) => {
        if (!mounted) return
        const mapped = (items || []).map((it) => ({ id: it.id || it._id || it.slug || it.title, title: it.title || it.name, excerpt: it.excerpt || it.description, body: it.body || it.content }))
        const found = mapped.find((p) => p.id === id)
        if (found) setPost(found)
      })
      .catch(() => {})
      .finally(() => mounted && setLoading(false))

    return () => {
      mounted = false
    }
  }, [id])

  if (!post) return <div className="mx-auto max-w-4xl p-6">Post not found.</div>

  return (
    <article className="mx-auto max-w-4xl p-6">
      <h1 className="text-3xl font-extrabold text-ink">{post.title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">Published {post.publishedAt || '—'}</p>
      <div className="mt-6 prose max-w-none text-ink">{post.body || post.excerpt}</div>
    </article>
  )
}
