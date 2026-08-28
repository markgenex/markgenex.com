import { useEffect, useState } from 'react'
import { Plus, Trash2, Edit, Loader2 } from 'lucide-react'
import { Button } from './ui/button'
import { Field, Input, Textarea } from './ui/field'

const STORAGE_KEY = 'markgenx:testimonials'

function read() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function write(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function TestimonialsManager() {
  const [items, setItems] = useState([])
  const [editing, setEditing] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const data = read()
    setItems(data)
    setLoading(false)
  }, [])

  function startNew() {
    setEditing({ id: crypto.randomUUID(), name: '', title: '', quote: '', published: true })
  }

  function save(e) {
    e.preventDefault()
    const next = items.filter((i) => i.id !== editing.id).concat(editing)
    setItems(next)
    write(next)
    setEditing(null)
  }

  function remove(item) {
    if (!window.confirm(`Delete testimonial by ${item.name}?`)) return
    const next = items.filter((i) => i.id !== item.id)
    setItems(next)
    write(next)
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
                <div className="font-bold text-ink">{t.name}</div>
                <div className="text-sm text-muted-foreground">{t.title}</div>
                <div className="mt-2 text-sm">“{t.quote}”</div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={() => setEditing(t)}>
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
            <Button type="submit">Save</Button>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
          </div>
        </form>
      ) : null}
    </section>
  )
}
