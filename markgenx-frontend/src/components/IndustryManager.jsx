import { useEffect, useState } from 'react'
import { ArrowDown, ArrowUp, Check, ChevronDown, Eye, ImagePlus, Loader2, Pencil, Plus, Trash2 } from 'lucide-react'
import { createIndustry, deleteIndustry, getAdminIndustries, updateIndustry } from '../lib/api'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Dialog } from './ui/dialog'
import { Field, Input, Select, Textarea } from './ui/field'

const emptyIndustry = {
  name: '',
  industryNumber: '',
  mainImage: '',
  imageAlt: '',
  description: '',
  challenges: [{ text: '', order: 0 }],
  outcomes: [{ text: '', highlighted: true, order: 0 }],
  ctaText: 'Talk to an Industry Specialist',
  ctaLink: '/consultation',
  displayOrder: 0,
  featured: false,
  status: 'inactive',
  slug: '',
  seoTitle: '',
  metaDescription: '',
  keywords: [],
}

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function normalizeForForm(industry) {
  return {
    ...emptyIndustry,
    ...industry,
    challenges: industry.challenges?.length ? industry.challenges : emptyIndustry.challenges,
    outcomes: industry.outcomes?.length ? industry.outcomes : emptyIndustry.outcomes,
    keywords: Array.isArray(industry.keywords) ? industry.keywords : [],
  }
}

function RepeatableItems({ label, items, outcomes = false, onChange }) {
  function update(index, patch) {
    onChange(items.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)))
  }

  function move(index, direction) {
    const target = index + direction
    if (target < 0 || target >= items.length) return
    const next = [...items]
    ;[next[index], next[target]] = [next[target], next[index]]
    onChange(next.map((item, itemIndex) => ({ ...item, order: itemIndex })))
  }

  return (
    <div className="grid gap-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-bold text-ink">{label}</p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onChange([...items, { text: '', order: items.length, ...(outcomes ? { highlighted: true } : {}) }])}
        >
          <Plus className="size-3.5" />
          Add point
        </Button>
      </div>
      {items.map((item, index) => (
        <div key={`${label}-${index}`} className="grid gap-2 rounded-md border border-border bg-muted/35 p-3 sm:grid-cols-[1fr_auto]">
          <Input
            value={item.text}
            onChange={(event) => update(index, { text: event.target.value })}
            placeholder={outcomes ? 'e.g. 45% shorter sales cycle' : 'Enter a challenge'}
            required
          />
          <div className="flex flex-wrap items-center gap-1">
            {outcomes ? (
              <label className="mr-2 inline-flex min-h-9 items-center gap-2 text-xs font-semibold text-ink">
                <input
                  type="checkbox"
                  checked={item.highlighted !== false}
                  onChange={(event) => update(index, { highlighted: event.target.checked })}
                  className="size-4 accent-primary"
                />
                Highlight
              </label>
            ) : null}
            <Button type="button" variant="ghost" size="icon" onClick={() => move(index, -1)} disabled={index === 0} aria-label="Move point up">
              <ArrowUp className="size-4" />
            </Button>
            <Button type="button" variant="ghost" size="icon" onClick={() => move(index, 1)} disabled={index === items.length - 1} aria-label="Move point down">
              <ArrowDown className="size-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))}
              disabled={items.length === 1}
              aria-label="Remove point"
            >
              <Trash2 className="size-4 text-red-600" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}

export function IndustryManager() {
  const [industries, setIndustries] = useState([])
  const [editing, setEditing] = useState(null)
  const [previewing, setPreviewing] = useState(null)
  const [expandedIds, setExpandedIds] = useState(() => new Set())
  const [uploadingId, setUploadingId] = useState(null)
  const [status, setStatus] = useState('loading')
  const [feedback, setFeedback] = useState('')

  useEffect(() => {
    getAdminIndustries()
      .then((items) => {
        setIndustries(items)
        setStatus('idle')
      })
      .catch((error) => {
        setFeedback(error.message)
        setStatus('error')
      })
  }, [])

  function updateField(name, value) {
    setEditing((current) => ({
      ...current,
      [name]: value,
      ...(name === 'name' && !current.id ? { slug: slugify(value), seoTitle: value } : {}),
    }))
  }

  function handleImage(event) {
    const file = event.target.files?.[0]
    if (!file) return
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setFeedback('Please choose a JPG, PNG, or WebP image.')
      return
    }
    if (file.size > 3 * 1024 * 1024) {
      setFeedback('The image must be 3 MB or smaller.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => updateField('mainImage', reader.result)
    reader.readAsDataURL(file)
  }

  function uploadExistingImage(industry, event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setStatus('error')
      setFeedback('Please choose a JPG, PNG, or WebP image.')
      return
    }
    if (file.size > 3 * 1024 * 1024) {
      setStatus('error')
      setFeedback('The image must be 3 MB or smaller.')
      return
    }

    setUploadingId(industry.id)
    setFeedback('')
    const reader = new FileReader()
    reader.onerror = () => {
      setUploadingId(null)
      setStatus('error')
      setFeedback('The selected image could not be read. Please try another file.')
    }
    reader.onload = async () => {
      try {
        const saved = await updateIndustry(industry.id, { ...industry, mainImage: reader.result })
        setIndustries((current) => current.map((item) => (item.id === saved.id ? saved : item)))
        setStatus('idle')
        setFeedback(`The image for “${saved.name}” was updated successfully.`)
      } catch (error) {
        setStatus('error')
        setFeedback(error.message)
      } finally {
        setUploadingId(null)
      }
    }
    reader.readAsDataURL(file)
  }

  async function save(event) {
    event.preventDefault()
    setStatus('saving')
    setFeedback('')
    try {
      const payload = {
        ...editing,
        displayOrder: Number(editing.displayOrder),
        challenges: editing.challenges.map((item, index) => ({ ...item, order: index })),
        outcomes: editing.outcomes.map((item, index) => ({ ...item, order: index })),
      }
      const saved = editing.id ? await updateIndustry(editing.id, payload) : await createIndustry(payload)
      setIndustries((current) =>
        [...current.filter((item) => item.id !== saved.id), saved].sort((a, b) => a.displayOrder - b.displayOrder),
      )
      setEditing(null)
      setStatus('idle')
      setFeedback(`“${saved.name}” was saved successfully.`)
    } catch (error) {
      setStatus('error')
      setFeedback(error.message)
    }
  }

  async function togglePublished(industry) {
    try {
      const saved = await updateIndustry(industry.id, {
        ...industry,
        status: industry.status === 'active' ? 'inactive' : 'active',
      })
      setIndustries((current) => current.map((item) => (item.id === saved.id ? saved : item)))
    } catch (error) {
      setFeedback(error.message)
    }
  }

  async function moveIndustry(index, direction) {
    const target = index + direction
    if (target < 0 || target >= industries.length) return
    const next = [...industries]
    ;[next[index], next[target]] = [next[target], next[index]]
    const ordered = next.map((item, itemIndex) => ({ ...item, displayOrder: itemIndex }))
    setIndustries(ordered)
    try {
      await Promise.all([
        updateIndustry(ordered[index].id, ordered[index]),
        updateIndustry(ordered[target].id, ordered[target]),
      ])
    } catch (error) {
      setFeedback(error.message)
      getAdminIndustries().then(setIndustries).catch(() => {})
    }
  }

  async function removeIndustry(industry) {
    if (!window.confirm(`Delete “${industry.name}”? This cannot be undone.`)) return
    try {
      await deleteIndustry(industry.id)
      setIndustries((current) => current.filter((item) => item.id !== industry.id))
      setFeedback(`“${industry.name}” was deleted.`)
    } catch (error) {
      setFeedback(error.message)
    }
  }

  function toggleExpanded(id) {
    setExpandedIds((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <section className="surface-card min-w-0 rounded-lg p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-ink">Industries Management</h2>
          <p className="mt-1 text-sm text-muted-foreground">Create and publish the industry cards shown on the website.</p>
        </div>
        <Button className="w-full sm:w-auto" type="button" onClick={() => setEditing({ ...emptyIndustry, displayOrder: industries.length })}>
          <Plus className="size-4" />
          Add Industry
        </Button>
      </div>

      {feedback ? (
        <p className={`mt-4 rounded-md border px-3 py-2 text-sm font-semibold ${status === 'error' ? 'border-red-200 bg-red-50 text-red-700' : 'border-emerald-200 bg-emerald-50 text-emerald-800'}`}>
          {feedback}
        </p>
      ) : null}

      {status === 'loading' ? (
        <div className="grid place-items-center py-10 text-primary"><Loader2 className="size-6 animate-spin" /></div>
      ) : industries.length ? (
        <div className="mt-4 grid gap-2">
          {industries.map((industry, index) => {
            const expanded = expandedIds.has(industry.id)
            return (
              <article key={industry.id} className="min-w-0 overflow-hidden rounded-lg border border-border bg-white transition hover:border-primary/30">
                <button
                  type="button"
                  className="flex min-h-14 w-full items-center justify-between gap-3 px-4 py-3 text-left transition hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                  onClick={() => toggleExpanded(industry.id)}
                  aria-expanded={expanded}
                  aria-controls={`industry-details-${industry.id}`}
                >
                  <span className="min-w-0 break-words font-bold text-ink">{industry.name}</span>
                  <ChevronDown className={`size-5 shrink-0 text-primary transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
                </button>

                {expanded ? (
                  <div id={`industry-details-${industry.id}`} className="animate-enter border-t border-border p-4">
                    <div className="grid min-w-0 gap-5 lg:grid-cols-[14rem_1fr]">
                      <div>
                        <div className="aspect-video overflow-hidden rounded-lg border border-border bg-muted lg:aspect-[4/3]">
                          {industry.mainImage ? <img src={industry.mainImage} alt={industry.imageAlt || industry.name} className="size-full object-cover" /> : <div className="grid size-full place-items-center text-muted-foreground"><ImagePlus className="size-7" /></div>}
                        </div>
                        <label className="mt-3 inline-flex min-h-9 w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-border bg-white px-3 py-2 text-xs font-semibold text-ink transition hover:-translate-y-0.5 hover:border-primary/30 hover:bg-muted focus-within:ring-2 focus-within:ring-ring">
                          {uploadingId === industry.id ? <Loader2 className="size-4 animate-spin" /> : <ImagePlus className="size-4 text-primary" />}
                          {uploadingId === industry.id ? 'Uploading…' : industry.mainImage ? 'Change Image' : 'Upload Image'}
                          <input
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            className="sr-only"
                            disabled={uploadingId === industry.id}
                            onChange={(event) => uploadExistingImage(industry, event)}
                          />
                        </label>
                        <p className="mt-1.5 text-center text-[11px] text-muted-foreground">JPG, PNG, or WebP · Max 3 MB</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <Badge className={industry.status === 'active' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : ''}>{industry.status === 'active' ? 'Published' : 'Unpublished'}</Badge>
                          {industry.featured ? <Badge>Featured</Badge> : null}
                        </div>
                      </div>

                      <div className="min-w-0">
                        <div className="grid gap-3 sm:grid-cols-3">
                          <div className="rounded-md bg-muted/60 px-3 py-2 text-xs text-muted-foreground"><span className="block font-bold text-ink">Industry number</span>{industry.industryNumber || String(index + 1).padStart(2, '0')}</div>
                          <div className="rounded-md bg-muted/60 px-3 py-2 text-xs text-muted-foreground"><span className="block font-bold text-ink">Display order</span>{industry.displayOrder}</div>
                          <div className="rounded-md bg-muted/60 px-3 py-2 text-xs text-muted-foreground"><span className="block font-bold text-ink">Slug</span><span className="break-all">/{industry.slug}</span></div>
                        </div>
                        <div className="mt-4">
                          <p className="text-xs font-black uppercase text-muted-foreground">Description</p>
                          <p className="mt-2 text-sm leading-6 text-ink">{industry.description || 'No description yet.'}</p>
                        </div>
                        <div className="mt-4 grid gap-4 md:grid-cols-2">
                          <div>
                            <p className="text-xs font-black uppercase text-muted-foreground">Challenges We Solve</p>
                            <ul className="mt-2 grid gap-1.5">
                              {industry.challenges.map((item, itemIndex) => <li key={item._id || itemIndex} className="flex gap-1.5 text-sm leading-5 text-ink"><span className="text-accent">—</span><span>{item.text}</span></li>)}
                            </ul>
                          </div>
                          <div>
                            <p className="text-xs font-black uppercase text-muted-foreground">Outcomes We Deliver</p>
                            <ul className="mt-2 grid gap-1.5">
                              {industry.outcomes.map((item, itemIndex) => <li key={item._id || itemIndex} className={item.highlighted !== false ? 'flex gap-1.5 text-sm font-bold leading-5 text-primary' : 'flex gap-1.5 text-sm leading-5 text-ink'}>{item.highlighted !== false ? <Check className="mt-0.5 size-4 shrink-0" /> : <span>—</span>}<span>{item.text}</span></li>)}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-3 border-t border-border pt-4 sm:grid-cols-2 lg:grid-cols-3">
                      <div className="rounded-md bg-muted/60 p-3 text-xs text-muted-foreground"><span className="block font-bold text-ink">CTA text and link</span><span className="mt-1 block break-words">{industry.ctaText}</span><span className="mt-1 block break-all text-primary">{industry.ctaLink}</span></div>
                      <div className="rounded-md bg-muted/60 p-3 text-xs text-muted-foreground"><span className="block font-bold text-ink">SEO title</span><span className="mt-1 block break-words">{industry.seoTitle || 'Not provided'}</span></div>
                      <div className="rounded-md bg-muted/60 p-3 text-xs text-muted-foreground"><span className="block font-bold text-ink">Keywords</span><span className="mt-1 block break-words">{industry.keywords?.join(', ') || 'Not provided'}</span></div>
                      <div className="rounded-md bg-muted/60 p-3 text-xs text-muted-foreground sm:col-span-2 lg:col-span-3"><span className="block font-bold text-ink">Meta description</span><span className="mt-1 block break-words leading-5">{industry.metaDescription || 'Not provided'}</span></div>
                    </div>

                    <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4 sm:flex-row sm:flex-wrap">
                      <Button type="button" variant="outline" size="sm" onClick={() => setPreviewing(industry)}><Eye className="size-3.5" /> View</Button>
                      <Button type="button" size="sm" onClick={() => setEditing(normalizeForForm(industry))}><Pencil className="size-3.5" /> Edit</Button>
                      <Button type="button" variant="outline" size="sm" onClick={() => togglePublished(industry)}>{industry.status === 'active' ? 'Unpublish' : 'Publish'}</Button>
                      <Button type="button" variant="ghost" size="sm" onClick={() => moveIndustry(index, -1)} disabled={index === 0}><ArrowUp className="size-4" /> Move up</Button>
                      <Button type="button" variant="ghost" size="sm" onClick={() => moveIndustry(index, 1)} disabled={index === industries.length - 1}><ArrowDown className="size-4" /> Move down</Button>
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeIndustry(industry)} className="text-red-600 hover:bg-red-50"><Trash2 className="size-4" /> Delete</Button>
                    </div>
                  </div>
                ) : null}
              </article>
            )
          })}
        </div>
      ) : (
        <div className="mt-4 rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">No managed industries yet. Add the first industry to begin publishing dynamic content.</div>
      )}

      <Dialog open={Boolean(editing)} onOpenChange={(open) => !open && setEditing(null)} title={editing?.id ? 'Edit Industry' : 'Add Industry'} description="Manage public card content, publishing, ordering, and search metadata." className="sm:max-w-4xl">
        {editing ? (
          <form onSubmit={save} className="grid gap-5">
            {status === 'error' && feedback ? (
              <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">{feedback}</p>
            ) : null}
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Industry Name *"><Input value={editing.name} onChange={(event) => updateField('name', event.target.value)} required /></Field>
              <Field label="Industry Number / Order"><Input value={editing.industryNumber} onChange={(event) => updateField('industryNumber', event.target.value)} placeholder="01" /></Field>
              <Field label="Slug *"><Input value={editing.slug} onChange={(event) => updateField('slug', slugify(event.target.value))} required /></Field>
              <Field label="Display Order"><Input type="number" min="0" value={editing.displayOrder} onChange={(event) => updateField('displayOrder', event.target.value)} /></Field>
            </div>

            <Field label="Short Description *"><Textarea value={editing.description} onChange={(event) => updateField('description', event.target.value)} required /></Field>

            <div className="grid gap-4 rounded-lg border border-border p-4 sm:grid-cols-[10rem_1fr]">
              <div className="aspect-video overflow-hidden rounded-md bg-muted sm:aspect-square">
                {editing.mainImage ? <img src={editing.mainImage} alt="Industry preview" className="size-full object-cover" /> : <div className="grid size-full place-items-center text-muted-foreground"><ImagePlus className="size-7" /></div>}
              </div>
              <div className="grid content-start gap-3">
                <Field label="Main Image"><Input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleImage} /></Field>
                <Field label="Image Alt Text"><Input value={editing.imageAlt} onChange={(event) => updateField('imageAlt', event.target.value)} /></Field>
                {editing.mainImage ? <Button className="w-fit" type="button" variant="ghost" size="sm" onClick={() => updateField('mainImage', '')}>Remove image</Button> : null}
              </div>
            </div>

            <RepeatableItems label="Challenges We Solve" items={editing.challenges} onChange={(items) => updateField('challenges', items)} />
            <RepeatableItems label="Outcomes We Deliver" outcomes items={editing.outcomes} onChange={(items) => updateField('outcomes', items)} />

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="CTA Button Text"><Input value={editing.ctaText} onChange={(event) => updateField('ctaText', event.target.value)} /></Field>
              <Field label="CTA Link"><Input value={editing.ctaLink} onChange={(event) => updateField('ctaLink', event.target.value)} placeholder="/consultation" /></Field>
              <Field label="Publish Status"><Select value={editing.status} onChange={(event) => updateField('status', event.target.value)}><option value="active">Published</option><option value="inactive">Unpublished</option></Select></Field>
              <label className="flex min-h-11 items-center gap-2 self-end rounded-md border border-border px-3 text-sm font-semibold text-ink"><input type="checkbox" checked={editing.featured} onChange={(event) => updateField('featured', event.target.checked)} className="size-4 accent-primary" /> Featured Industry</label>
            </div>

            <div className="grid gap-4 rounded-lg border border-border bg-muted/30 p-4 sm:grid-cols-2">
              <Field label="SEO Title"><Input value={editing.seoTitle} onChange={(event) => updateField('seoTitle', event.target.value)} /></Field>
              <Field label="Keywords"><Input value={editing.keywords.join(', ')} onChange={(event) => updateField('keywords', event.target.value.split(',').map((item) => item.trim()).filter(Boolean))} placeholder="saas, technology, growth" /></Field>
              <Field label="Meta Description" className="sm:col-span-2"><Textarea value={editing.metaDescription} onChange={(event) => updateField('metaDescription', event.target.value)} /></Field>
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-border pt-4 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" onClick={() => setPreviewing(editing)}><Eye className="size-4" /> Preview</Button>
              <Button type="submit" disabled={status === 'saving'}>{status === 'saving' ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}{status === 'saving' ? 'Saving…' : 'Save Industry'}</Button>
            </div>
          </form>
        ) : null}
      </Dialog>

      <Dialog open={Boolean(previewing)} onOpenChange={(open) => !open && setPreviewing(null)} title={previewing?.name || 'Industry Preview'} description="Preview of the public industry content." className="sm:max-w-3xl">
        {previewing ? (
          <div className="grid overflow-hidden rounded-lg border border-border lg:grid-cols-[0.8fr_1.2fr]">
            <div className="relative min-h-52 bg-ink p-4 text-white">
              {previewing.mainImage ? <img src={previewing.mainImage} alt={previewing.imageAlt || previewing.name} className="absolute inset-0 size-full object-cover opacity-80" /> : null}
              <Badge className="relative border-white/20 bg-ink/70 text-white">{previewing.industryNumber || '01'}</Badge>
            </div>
            <div className="p-5">
              <h3 className="text-2xl font-black text-ink">{previewing.name}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{previewing.description}</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div><p className="text-xs font-black uppercase text-muted-foreground">Challenges We Solve</p>{previewing.challenges.map((item, index) => <p key={index} className="mt-2 text-sm text-ink">— {item.text}</p>)}</div>
                <div><p className="text-xs font-black uppercase text-muted-foreground">Outcomes We Deliver</p>{previewing.outcomes.map((item, index) => <p key={index} className={item.highlighted !== false ? 'mt-2 flex gap-1 text-sm font-bold text-primary' : 'mt-2 text-sm text-ink'}>{item.highlighted !== false ? <Check className="size-4 shrink-0" /> : null}{item.text}</p>)}</div>
              </div>
            </div>
          </div>
        ) : null}
      </Dialog>
    </section>
  )
}
