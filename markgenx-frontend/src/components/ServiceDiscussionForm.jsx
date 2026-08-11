import { useState } from 'react'
import { CheckCircle2, Loader2, LockKeyhole, MessageSquareText, Send } from 'lucide-react'
import { budgetRanges, services } from '../data/siteData'
import { submitLead } from '../lib/api'
import { Button } from './ui/button'
import { Field, Input, Select, Textarea } from './ui/field'

function initialValues(serviceTitle) {
  return {
    name: '',
    email: '',
    companyName: '',
    requiredService: serviceTitle || '',
    budgetRange: '',
    message: '',
  }
}

export function ServiceDiscussionForm({ serviceTitle, serviceSlug, onSuccess }) {
  const [values, setValues] = useState(() => initialValues(serviceTitle))
  const [status, setStatus] = useState('idle')
  const [feedback, setFeedback] = useState('')

  function updateValue(event) {
    setValues((current) => ({ ...current, [event.target.name]: event.target.value }))
    if (status === 'error') {
      setStatus('idle')
      setFeedback('')
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!event.currentTarget.checkValidity()) {
      event.currentTarget.reportValidity()
      return
    }

    setStatus('loading')
    setFeedback('')

    try {
      const result = await submitLead('service', {
        ...values,
        serviceSlug,
        businessRequirement: values.message,
        consent: {
          privacyPolicy: true,
          text: 'Submitted through the service discussion form.',
        },
      })

      setStatus('success')
      setFeedback(
        result.queued
          ? 'Thanks — your enquiry is saved and ready to send when the connection is restored.'
          : 'Thanks — your service enquiry has been sent. Our team will contact you with the next steps.',
      )
      setValues(initialValues(serviceTitle))
      onSuccess?.(result)
    } catch (error) {
      setStatus('error')
      setFeedback(error.message || 'We could not send your enquiry. Please check your details and try again.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5" noValidate={false}>
      <div className="flex items-start gap-3 rounded-md border border-primary/15 bg-primary/5 p-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-md bg-primary text-white shadow-sm">
          <MessageSquareText className="size-4" />
        </span>
        <div>
          <p className="text-sm font-bold text-ink">Discussing {serviceTitle}</p>
          <p className="mt-0.5 text-xs leading-5 text-muted-foreground">Tell us about your goals and we’ll connect you with the right specialist.</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name *">
          <Input
            name="name"
            value={values.name}
            onChange={updateValue}
            placeholder="Jane Doe"
            autoComplete="name"
            autoFocus
            required
          />
        </Field>
        <Field label="Work email *">
          <Input
            type="email"
            name="email"
            value={values.email}
            onChange={updateValue}
            placeholder="jane@company.com"
            autoComplete="email"
            required
          />
        </Field>
        <Field label="Company">
          <Input
            name="companyName"
            value={values.companyName}
            onChange={updateValue}
            placeholder="Acme Inc."
            autoComplete="organization"
          />
        </Field>
        <Field label="Service of interest *">
          <Select name="requiredService" value={values.requiredService} onChange={updateValue} required>
            <option value="">Select a service</option>
            {services.map((service) => (
              <option key={service.slug} value={service.title}>
                {service.title}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Monthly budget range" className="sm:col-span-2">
          <Select name="budgetRange" value={values.budgetRange} onChange={updateValue}>
            <option value="">Select a range</option>
            {budgetRanges.map((range) => (
              <option key={range} value={range}>
                {range}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <Field label="Tell us about your goals *">
        <Textarea
          name="message"
          value={values.message}
          onChange={updateValue}
          placeholder="What are you trying to achieve? What has worked or not worked so far?"
          minLength={10}
          required
        />
      </Field>

      {feedback ? (
        <div
          role="status"
          aria-live="polite"
          className={
            status === 'error'
              ? 'rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700'
              : 'flex items-start gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800'
          }
        >
          {status === 'success' ? <CheckCircle2 className="mt-0.5 size-4 shrink-0" /> : null}
          <span>{feedback}</span>
        </div>
      ) : null}

      <Button type="submit" size="lg" className="w-full" disabled={status === 'loading'}>
        {status === 'loading' ? <Loader2 className="size-5 animate-spin" /> : <Send className="size-5" />}
        {status === 'loading' ? 'Sending enquiry…' : status === 'success' ? 'Send another enquiry' : 'Send enquiry'}
      </Button>

      <div className="flex items-center justify-center gap-1.5 text-center text-xs font-medium text-muted-foreground">
        <LockKeyhole className="size-3.5 shrink-0 text-primary" />
        <span>Your information is securely captured and never shared.</span>
      </div>
    </form>
  )
}
