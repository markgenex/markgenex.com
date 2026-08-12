import { useState } from 'react'
import { CheckCircle2, FileText, Loader2 } from 'lucide-react'
import { submitJobApplication } from '../lib/api'
import { Button } from './ui/button'
import { Dialog } from './ui/dialog'
import { Field, Input, Textarea } from './ui/field'

const initialValues = { fullName: '', email: '', phone: '', experience: '', portfolio: '', resume: null }

export function JobApplicationForm({ job, onClose }) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null)
  if (!job) return null
  const change = (name, value) => { setValues((current) => ({ ...current, [name]: value })); setErrors((current) => ({ ...current, [name]: '' })) }
  const validate = () => {
    const next = {}
    if (values.fullName.trim().length < 2) next.fullName = 'Enter your full name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) next.email = 'Enter a valid email address.'
    if (values.phone.replace(/\D/g, '').length < 7) next.phone = 'Enter a valid phone number.'
    if (!values.experience.trim()) next.experience = 'Tell us about your relevant experience.'
    if (!values.resume) next.resume = 'Upload your resume or CV.'
    else if (values.resume.size > 5 * 1024 * 1024) next.resume = 'Resume must be 5 MB or smaller.'
    if (values.portfolio) { try { const url = new URL(values.portfolio); if (!['http:', 'https:'].includes(url.protocol)) throw new Error() } catch { next.portfolio = 'Enter a full link beginning with http:// or https://.' } }
    setErrors(next); return !Object.keys(next).length
  }
  async function submit(event) { event.preventDefault(); if (!validate()) return; setSubmitting(true); setErrors({}); try { setResult(await submitJobApplication(job.id, values)) } catch (error) { setErrors({ form: error.message }) } finally { setSubmitting(false) } }
  return <Dialog open onOpenChange={(open) => !open && onClose()} title={result ? 'Application received' : `Apply for ${job.title}`} description={result ? 'Thank you for your interest in joining MarkGenExes.' : `Job ID: ${job.id} · ${job.department || 'Open position'}`} className="sm:max-w-3xl">
    {result ? <div className="grid place-items-center py-6 text-center" role="status"><span className="grid size-14 place-items-center rounded-full bg-emerald-100 text-emerald-700"><CheckCircle2 className="size-7" /></span><h3 className="mt-4 text-xl font-bold text-ink">Successfully submitted</h3><p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">{result.message}</p><Button className="mt-6 w-full sm:w-auto" onClick={onClose}>Done</Button></div> : <form onSubmit={submit} noValidate className="grid gap-4">
      <div className="rounded-md border border-primary/20 bg-primary/5 p-3 text-sm"><b>Applied role:</b> {job.title}<span className="mt-1 block text-xs text-muted-foreground">The role and Job ID are attached automatically.</span></div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full Name *"><Input autoComplete="name" value={values.fullName} onChange={(e) => change('fullName', e.target.value)} aria-invalid={Boolean(errors.fullName)} />{errors.fullName ? <span className="text-xs text-red-600">{errors.fullName}</span> : null}</Field>
        <Field label="Email Address *"><Input type="email" autoComplete="email" value={values.email} onChange={(e) => change('email', e.target.value)} aria-invalid={Boolean(errors.email)} />{errors.email ? <span className="text-xs text-red-600">{errors.email}</span> : null}</Field>
        <Field label="Phone Number *"><Input type="tel" autoComplete="tel" value={values.phone} onChange={(e) => change('phone', e.target.value)} aria-invalid={Boolean(errors.phone)} />{errors.phone ? <span className="text-xs text-red-600">{errors.phone}</span> : null}</Field>
        <Field label="Portfolio / LinkedIn / GitHub / Website"><Input type="url" placeholder="https://" value={values.portfolio} onChange={(e) => change('portfolio', e.target.value)} aria-invalid={Boolean(errors.portfolio)} />{errors.portfolio ? <span className="text-xs text-red-600">{errors.portfolio}</span> : null}</Field>
      </div>
      <Field label="Experience *"><Textarea placeholder="Summarize your relevant experience, current role, and years of experience." value={values.experience} onChange={(e) => change('experience', e.target.value)} aria-invalid={Boolean(errors.experience)} />{errors.experience ? <span className="text-xs text-red-600">{errors.experience}</span> : null}</Field>
      <Field label="Resume / CV *"><label className="flex min-h-24 cursor-pointer items-center justify-center gap-3 rounded-md border border-dashed border-border bg-muted/40 p-4 text-center transition hover:border-primary"><FileText className="size-5 shrink-0 text-primary" /><span className="min-w-0 text-sm">{values.resume ? <b className="break-all">{values.resume.name}</b> : 'Choose a PDF, DOC, or DOCX file'}<small className="mt-1 block font-normal text-muted-foreground">Maximum file size: 5 MB</small></span><input className="sr-only" type="file" accept=".pdf,.doc,.docx" onChange={(e) => change('resume', e.target.files?.[0] || null)} /></label>{errors.resume ? <span className="text-xs text-red-600">{errors.resume}</span> : null}</Field>
      {errors.form ? <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">{errors.form}</p> : null}
      <Button type="submit" className="w-full sm:w-auto sm:justify-self-end" disabled={submitting}>{submitting ? <Loader2 className="size-4 animate-spin" /> : null}{submitting ? 'Submitting application…' : 'Submit Application'}</Button>
    </form>}
  </Dialog>
}
