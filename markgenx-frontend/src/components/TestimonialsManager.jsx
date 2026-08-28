import { useEffect, useState } from 'react'
import { Plus, Trash2, Edit, Loader2 } from 'lucide-react'
import { Button } from './ui/button'
import { Field, Input, Textarea } from './ui/field'
import { getAdminTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from '../lib/api'

export function TestimonialsManager() {
  const [items, setItems] = useState([])
  const [editing, setEditing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    getAdminTestimonials()
      .then((data) => {
        if (!mounted) return
        if (Array.isArray(data) && data.length) setItems(data)
        else setItems([])
      })
      .catch(() => {
        if (!mounted) setItems([])
      })
      .finally(() => mounted && setLoading(false))

    return () => {
      mounted = false
    }
  }, [])

  function startNew() {
    setEditing({ name: '', title: '', quote: '', published: true })
  }

  async function save(e) {
    e.preventDefault()
    setSaving(true)
    try {
      if (editing.id) {
        const saved = await updateTestimonial(editing.id, { content: editing.quote, author: { name: editing.name, jobTitle: editing.title } })
        setItems((cur) => cur.map((i) => (i.id === saved.id ? saved : i)))
      } else {
        const created = await createTestimonial({ content: editing.quote, author: { name: editing.name, jobTitle: editing.title }, status: 'approved' })
        setItems((cur) => [created, ...cur])
      }
      setEditing(null)
    } catch (e) {
      // fallback: keep local changes in memory
      console.error('Save testimonial failed', e)
      alert('Failed to save testimonial. Check server or try again later.')
    } finally {
      setSaving(false)
    }
  }

  async function remove(item) {
    if (!window.confirm(`Delete testimonial by ${item.author?.name || 'unknown'}?`)) return
    try {
      if (item.id) {
        await deleteTestimonial(item.id)
        setItems((cur) => cur.filter((i) => i.id !== item.id))
      }
    } catch (e) {
      console.error('Delete failed', e)
      alert('Failed to delete testimonial. Try again later.')
    }
  }

  if (loading) return <div className="p-4 grid place-items-center"><Loader2 className="animate-spin" /></div>

  return (
    <section className="surface-card mt-6 rounded-lg p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-ink">Testimonials</h2>
          <p className="mt-1 text-sm text-muted-foreground">Create and manage testimonials shown on the public site.</p>
        </div>
        <Button onClick={startNew} variant="outline">
          <Plus className="size-4" /> New
        </Button>
      </div>

      <div className="mt-4 grid gap-3">
        {items.length === 0 ? (
          <div className="text-sm text-muted-foreground">No testimonials yet. Click New to add one.</div>
        ) : (
          items.map((t) => (
            <div key={t.id} className="flex items-start justify-between gap-3 rounded-md border border-border p-3">
              <div>
                <div className="font-bold text-ink">{t.author?.name}</div>
                <div className="text-sm text-muted-foreground">{t.author?.jobTitle}</div>
                <div className="mt-2 text-sm">“{t.content}”</div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={() => setEditing({ id: t.id, name: t.author?.name, title: t.author?.jobTitle, quote: t.content })}>
                  <Edit className="size-4" />
                </Button>
                <Button variant="destructive" onClick={() => remove(t)}>
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {editing ? (
        <form onSubmit={save} className="mt-4 grid gap-3">
          <Field label="Name">
            <Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} required />
          </Field>
          <Field label="Title / Role">
            <Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
          </Field>
          <Field label="Quote">
            <Textarea value={editing.quote} onChange={(e) => setEditing({ ...editing, quote: e.target.value })} required />
          </Field>
          <div className="flex gap-2">
            <Button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save'}</Button>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
          </div>
        </form>
      ) : null}
    </section>
  )
}
