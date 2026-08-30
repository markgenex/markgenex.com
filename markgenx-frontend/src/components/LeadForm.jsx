import { useState } from 'react'
import { CheckCircle2, Loader2, LockKeyhole, Send } from 'lucide-react'
import { budgetRanges, industries, services } from '../data/siteData'
import { submitLead } from '../lib/api'
import { Button } from './ui/button'
import { Field, Input, Select, Textarea } from './ui/field'
import { Badge } from './ui/badge'

const initialValues = {
  name: '',
  phone: '',
  email: '',
  companyName: '',
  industry: '',
  requiredService: '',
  budgetRange: '',
  cityOrLocation: '',
  message: '',
}

export function LeadForm({ type = 'contact', title = 'Talk to an Expert', submitLabel = 'Request a Proposal', compact = false }) {
  const [values, setValues] = useState(initialValues)
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')

  function updateValue(event) {
    setValues((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setStatus('loading')
    setMessage('')

    try {
      const result = await submitLead(type, values)
      setStatus('success')
      setValues(initialValues)
      setMessage(
        result.queued
          ? 'Thanks. Your enquiry is saved and ready for CRM sync.'
          : 'Thanks. Your enquiry has been sent to the MarkGenX team.',
      )
    } catch (error) {
      setStatus('error')
      setMessage(error.message || 'Something went wrong. Please try again.')
    }
  }

  const completion = Object.values(values).filter(Boolean).length

  return (
    <form onSubmit={handleSubmit} className="surface-card animate-enter grid gap-4 rounded-lg p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <Badge className="border-primary/15 bg-primary/5 text-primary">CRM-ready enquiry</Badge>
          <h3 className="mt-3 text-xl font-black tracking-tight text-ink">{title}</h3>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Share your requirements and the right specialist will respond with next steps.
          </p>
        </div>
        <div className="hidden min-w-16 rounded-md border border-border bg-muted px-3 py-2 text-center sm:block">
          <p className="text-lg font-black text-ink">{completion}/9</p>
          <p className="text-[10px] font-bold uppercase text-muted-foreground">fields</p>
        </div>
      </div>

      <div className={compact ? 'grid gap-3' : 'grid gap-3 sm:grid-cols-2'}>
        <Field label="Name">
          <Input name="name" value={values.name} onChange={updateValue} placeholder="Full name" required />
        </Field>
        <Field label="Phone number">
          <Input name="phone" value={values.phone} onChange={updateValue} placeholder="+91 98765 43210" required />
        </Field>
        <Field label="Email address">
          <Input type="email" name="email" value={values.email} onChange={updateValue} placeholder="you@company.com" required />
        </Field>
        <Field label="Company name">
          <Input name="companyName" value={values.companyName} onChange={updateValue} placeholder="Company or brand" />
        </Field>
        <Field label="Industry">
          <Select name="industry" value={values.industry} onChange={updateValue}>
            <option value="">Select industry</option>
            {industries.map((industry) => (
              <option key={industry} value={industry}>
                {industry}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Required service">
          <Select name="requiredService" value={values.requiredService} onChange={updateValue} required>
            <option value="">Select service</option>
            {services.map((service) => (
              <option key={service.slug} value={service.title}>
                {service.title}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Budget range">
          <Select name="budgetRange" value={values.budgetRange} onChange={updateValue}>
            <option value="">Select budget</option>
            {budgetRanges.map((range) => (
              <option key={range} value={range}>
                {range}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="City or location">
          <Input name="cityOrLocation" value={values.cityOrLocation} onChange={updateValue} placeholder="City, state" />
        </Field>
      </div>

      <Field label="Message or business requirement">
        <Textarea
          name="message"
          value={values.message}
          onChange={updateValue}
          placeholder="Tell us what you want to grow, automate, launch, or improve."
          required
        />
      </Field>

      {message ? (
        <p
          className={
            status === 'error'
              ? 'rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700'
              : 'rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800'
          }
        >
          {message}
        </p>
      ) : null}

      <Button type="submit" disabled={status === 'loading'} className="w-full">
        {status === 'loading' ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
        {submitLabel}
      </Button>
      <div className="flex flex-col gap-2 border-t border-border pt-3 text-xs font-semibold text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <span className="inline-flex items-center gap-1.5">
          <LockKeyhole className="size-3.5" />
          Secure lead capture
        </span>
        <span className="inline-flex items-center gap-1.5">
          <CheckCircle2 className="size-3.5 text-emerald-600" />
          Source and UTM tracked
        </span>
      </div>
    </form>
  )
}
