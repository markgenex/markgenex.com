import { useMemo, useState } from 'react'
import { Link, Navigate, NavLink, Route, Routes, useNavigate } from 'react-router-dom'
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  BriefcaseBusiness,
  Building2,
  CalendarCheck,
  Check,
  ChevronRight,
  Download,
  Eye,
  Gauge,
  Inbox,
  LayoutDashboard,
  LineChart,
  LogOut,
  MailCheck,
  Menu,
  MessageSquareText,
  Phone,
  Plus,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UserRound,
  Users,
  X,
} from 'lucide-react'
import heroImage from './assets/hero.png'
import { useAuth } from './context/auth-context'
import { adminModules, navItems, roles, services } from './data/siteData'
import { getLeadQueue, updateLeadQueue } from './lib/api'
import { cn } from './lib/utils'
import { Badge } from './components/ui/badge'
import { Button } from './components/ui/button'
import { buttonVariants } from './components/ui/button-variants'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'
import { Dialog } from './components/ui/dialog'
import { EmptyState } from './components/ui/empty-state'
import { Field, Input, Select, Textarea } from './components/ui/field'
import { SkeletonPanel } from './components/ui/skeleton'
import { LeadForm } from './components/LeadForm'

const phoneNumber = '+919876543210'
const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(
  'Hi MarkGenexes, I want to discuss growth and marketing services.',
)}`

function Layout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/consultation" element={<ConsultationPage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/partner" element={<PartnerPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <FloatingActions />
    </div>
  )
}

function Header() {
  const [open, setOpen] = useState(false)
  const { isAuthenticated } = useAuth()

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-white/88 shadow-sm shadow-slate-950/[0.03] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3" aria-label="MarkGenexes home">
          <span className="grid size-10 place-items-center rounded-md bg-[linear-gradient(135deg,#101828,#146c5f)] text-sm font-black text-white shadow-lg shadow-primary/20">
            MG
          </span>
          <span className="leading-tight">
            <span className="block text-base font-bold text-ink">MarkGenexes</span>
            <span className="block text-xs font-semibold text-muted-foreground">Growth systems studio</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  'relative rounded-md px-3 py-2 text-sm font-semibold text-muted-foreground transition hover:bg-muted hover:text-ink',
                  isActive && 'bg-muted text-ink after:absolute after:inset-x-3 after:-bottom-3.5 after:h-0.5 after:rounded-full after:bg-primary',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
          <NavLink
            to={isAuthenticated ? '/admin' : '/login'}
            className={({ isActive }) =>
              cn(
                'relative rounded-md px-3 py-2 text-sm font-semibold text-muted-foreground transition hover:bg-muted hover:text-ink',
                isActive && 'bg-muted text-ink after:absolute after:inset-x-3 after:-bottom-3.5 after:h-0.5 after:rounded-full after:bg-primary',
              )
            }
          >
            Admin
          </NavLink>
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <a className={buttonVariants({ variant: 'outline', size: 'sm' })} href={whatsappUrl} target="_blank" rel="noreferrer">
            <Users className="size-4" />
            Talk to an Expert
          </a>
          <Link className={buttonVariants({ size: 'sm' })} to="/consultation">
            <CalendarCheck className="size-4" />
            Book a Consultation
          </Link>
        </div>

        <button
          type="button"
          className="grid size-11 place-items-center rounded-md border border-border bg-white text-ink shadow-sm transition hover:border-primary/30 hover:bg-muted lg:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle navigation"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open ? (
        <div className="animate-enter border-t border-border bg-white px-4 py-4 shadow-premium lg:hidden">
          <nav className="grid gap-2" aria-label="Mobile navigation">
            {[...navItems, { label: 'Admin', href: isAuthenticated ? '/admin' : '/login' }].map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn('rounded-md px-3 py-3 text-sm font-semibold text-muted-foreground', isActive && 'bg-muted text-ink')
                }
              >
                {item.label}
              </NavLink>
            ))}
            <Link className={cn(buttonVariants(), 'mt-2')} to="/consultation" onClick={() => setOpen(false)}>
              Start Your Growth Journey
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  )
}

function HomePage() {
  return (
    <>
      <section className="grid-pattern relative overflow-hidden border-b border-border bg-[radial-gradient(circle_at_80%_16%,rgba(59,130,246,0.12),transparent_25rem),radial-gradient(circle_at_15%_18%,rgba(245,158,11,0.13),transparent_22rem),linear-gradient(135deg,#fff_0%,#f7faf9_48%,#edf7f3_100%)]">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-20">
          <div className="animate-enter flex flex-col justify-center">
            <Badge className="w-fit border-emerald-200 bg-emerald-50 text-emerald-800">
              <Sparkles className="size-3.5" />
              Marketing, technology, and growth consulting
            </Badge>
            <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight text-ink sm:text-5xl lg:text-6xl">
              MarkGenexes builds lead generation systems for ambitious businesses.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              Digital marketing, performance marketing, lead generation, branding, development, SEO, social, AI automation,
              and business consulting in one accountable growth partner.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link className={buttonVariants({ size: 'lg' })} to="/consultation">
                Book a Consultation
                <ArrowRight className="size-5" />
              </Link>
              <a className={buttonVariants({ variant: 'outline', size: 'lg' })} href={whatsappUrl} target="_blank" rel="noreferrer">
                Talk to an Expert
              </a>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-3 text-left">
              {[
                ['9+', 'growth services'],
                ['24/7', 'lead capture'],
                ['CRM', 'ready pipeline'],
              ].map(([value, label]) => (
                <div key={label} className="glass-panel rounded-lg p-3">
                  <p className="text-2xl font-black text-ink">{value}</p>
                  <p className="mt-1 text-xs font-semibold uppercase text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative animate-rise">
            <div className="surface-card rounded-lg p-4 shadow-premium">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <p className="text-xs font-bold uppercase text-muted-foreground">Growth cockpit</p>
                  <h2 className="text-xl font-bold text-ink">Campaigns, leads, CRM flow</h2>
                </div>
                <img src={heroImage} className="h-16 w-16 object-contain" alt="Layered platform visual" loading="eager" />
              </div>
              <div className="mt-4 grid gap-3">
                {['Lead source tracking', 'UTM and ad pixel readiness', 'Sales team notifications', 'Role based admin access'].map(
                  (item, index) => (
                    <div key={item} className="group flex items-center gap-3 rounded-md bg-muted p-3 transition hover:bg-secondary">
                      <span className="grid size-8 place-items-center rounded-md bg-white text-sm font-bold text-primary shadow-sm transition group-hover:scale-105">
                        {index + 1}
                      </span>
                      <span className="text-sm font-semibold text-ink">{item}</span>
                      <Check className="ml-auto size-4 text-emerald-600" />
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <TrustStrip />
      <ServiceOverview />
      <ConversionSection />
      <AdminPreview />
    </>
  )
}

function TrustStrip() {
  return (
    <section className="border-b border-border bg-white/80">
      <div className="mx-auto grid max-w-7xl gap-3 px-4 py-4 sm:px-6 md:grid-cols-4 lg:px-8">
        {[
          [Gauge, 'Performance-first', 'Campaigns mapped to measurable outcomes'],
          [MailCheck, 'Lead handoff ready', 'Sales notifications and acknowledgement flows'],
          [LineChart, 'Tracking native', 'UTM, GA, conversion, and pixel hooks'],
          [ShieldCheck, 'Admin controlled', 'Role-aware publishing and operations'],
        ].map(([Icon, title, text]) => (
          <div key={title} className="flex items-start gap-3 rounded-md p-3 transition hover:bg-muted">
            <span className="grid size-9 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
              <Icon className="size-4" />
            </span>
            <div>
              <p className="text-sm font-bold text-ink">{title}</p>
              <p className="mt-0.5 text-xs leading-5 text-muted-foreground">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function ServiceOverview() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="max-w-3xl">
        <Badge>Core services</Badge>
        <h2 className="mt-4 text-3xl font-black tracking-tight text-ink sm:text-4xl">
          Everything MarkGenexes provides, built as a connected system.
        </h2>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => {
          const Icon = service.icon
          return (
            <article key={service.slug} className="group surface-card interactive-card rounded-lg p-5">
              <div className="flex items-start gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-md bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-white">
                  <Icon className="size-5" />
                </span>
                <div>
                  <h3 className="text-lg font-bold text-ink">{service.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{service.description}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-black uppercase text-primary opacity-0 transition group-hover:opacity-100">
                    Explore service
                    <ArrowUpRight className="size-3.5" />
                  </span>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

function ConversionSection() {
  return (
    <section className="border-y border-border bg-[linear-gradient(135deg,#101828_0%,#123b36_55%,#0f172a_100%)] text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-16">
        <div>
          <Badge className="border-white/15 bg-white/10 text-white">Lead generation system</Badge>
          <h2 className="mt-4 text-3xl font-black sm:text-4xl">Every important page is designed to convert.</h2>
          <div className="mt-7 grid gap-3">
            {[
              'Contact, consultation, service enquiry, career, and partner forms',
              'WhatsApp click-to-chat and mobile call action',
              'Lead source, campaign source, UTM data, date, status, and notes',
              'CRM-ready storage with sales assignment and export flow',
            ].map((item) => (
              <div key={item} className="flex gap-3 rounded-md border border-white/10 bg-white/5 p-3 transition hover:border-white/20 hover:bg-white/10">
                <Check className="mt-0.5 size-4 shrink-0 text-accent" />
                <span className="text-sm font-medium text-white/86">{item}</span>
              </div>
            ))}
          </div>
        </div>
        <LeadForm title="Start Your Growth Journey" type="consultation" />
      </div>
    </section>
  )
}

function AdminPreview() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <Badge>Admin panel</Badge>
          <h2 className="mt-4 text-3xl font-black text-ink sm:text-4xl">Content, leads, roles, reports, and operations from one dashboard.</h2>
          <Link className={cn(buttonVariants({ variant: 'dark' }), 'mt-6')} to="/login">
            Open Admin
            <ChevronRight className="size-4" />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {adminModules.map((module) => {
            const Icon = module.icon
            return (
              <Card key={module.title} interactive>
                <CardHeader>
                  <span className="grid size-10 place-items-center rounded-md bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </span>
                  <CardTitle>{module.title}</CardTitle>
                  <CardDescription>Reusable controls for everyday website operations.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {module.items.map((item) => (
                      <Badge key={item}>{item}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function ServicesPage() {
  return (
    <PageShell
      eyebrow="Services"
      title="Premium growth services for acquisition, conversion, and automation."
      description="Choose a focused service or combine multiple disciplines into one campaign operating system."
      cta="Request a Proposal"
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
        <div className="grid gap-4">
          {services.map((service) => {
            const Icon = service.icon
            return (
              <article key={service.slug} className="surface-card interactive-card rounded-lg p-5">
                <div className="flex gap-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <h2 className="text-xl font-bold text-ink">{service.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{service.description}</p>
                    <Link className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary" to="/consultation">
                      Talk to an Expert
                      <ArrowRight className="size-4" />
                    </Link>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
        <div className="lg:sticky lg:top-24 lg:self-start">
          <LeadForm type="service" title="Service Enquiry" compact />
        </div>
      </div>
    </PageShell>
  )
}

function ConsultationPage() {
  return (
    <PageShell
      eyebrow="Consulting"
      title="Book a consultation with a growth strategist."
      description="Bring your business objective, current channels, budget comfort, and timeline. MarkGenexes will map the next best growth path."
      cta="Book a Consultation"
    >
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="grid gap-4">
          {['Growth audit', 'Channel plan', 'Lead routing', 'AI automation map'].map((item, index) => (
            <div key={item} className="surface-card interactive-card rounded-lg p-5">
              <p className="inline-flex rounded-md bg-primary/10 px-2 py-1 text-sm font-black text-primary">0{index + 1}</p>
              <h2 className="mt-2 text-xl font-bold text-ink">{item}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                A practical session focused on acquisition, conversion, sales handoff, and measurable next actions.
              </p>
            </div>
          ))}
        </div>
        <LeadForm type="consultation" title="Book a Consultation" />
      </div>
    </PageShell>
  )
}

function CareersPage() {
  return (
    <PageShell
      eyebrow="Careers"
      title="Join the team building modern growth systems."
      description="MarkGenexes is hiring people who care about measurable work, clean execution, and calm client communication."
      cta="Apply for a Job"
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
        <div className="grid gap-4 sm:grid-cols-2">
          {['Performance Marketer', 'SEO Specialist', 'Creative Strategist', 'Frontend Developer'].map((role) => (
            <article key={role} className="surface-card interactive-card rounded-lg p-5">
              <BriefcaseBusiness className="size-5 text-primary" />
              <h2 className="mt-3 text-xl font-bold text-ink">{role}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">Full-time, hybrid-friendly, growth-focused role.</p>
              <Button variant="outline" size="sm" className="mt-4">
                Apply for a Job
              </Button>
            </article>
          ))}
        </div>
        <LeadForm type="career" title="Career Application" compact />
      </div>
    </PageShell>
  )
}

function PartnerPage() {
  return (
    <PageShell
      eyebrow="Partnerships"
      title="Partner with MarkGenexes for clients, universities, and admissions growth."
      description="Built for agencies, referral partners, university partners, and admission partners that need reliable growth execution."
      cta="Partner With Us"
    >
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="grid gap-4">
          {['University Partner', 'Admission Partner', 'Agency Partner', 'Client Portal Ready'].map((item) => (
            <div key={item} className="surface-card interactive-card rounded-lg p-5">
              <Users className="size-5 text-primary" />
              <h2 className="mt-3 text-xl font-bold text-ink">{item}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Partnership workflows are designed with future portal roles, reporting, document sharing, and project tracking.
              </p>
            </div>
          ))}
        </div>
        <LeadForm type="partner" title="Partner With Us" />
      </div>
    </PageShell>
  )
}

function PageShell({ eyebrow, title, description, cta, children }) {
  return (
    <>
      <section className="grid-pattern border-b border-border bg-[linear-gradient(180deg,#ffffff_0%,#eef2f6_100%)]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <Badge>{eyebrow}</Badge>
          <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight text-ink sm:text-5xl">{title}</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">{description}</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link className={buttonVariants()} to="/consultation">
              {cta}
              <ArrowRight className="size-4" />
            </Link>
            <a className={buttonVariants({ variant: 'outline' })} href={whatsappUrl} target="_blank" rel="noreferrer">
              WhatsApp
            </a>
          </div>
        </div>
      </section>
      <section className="animate-enter mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">{children}</section>
    </>
  )
}

function LoginPage() {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [notice, setNotice] = useState('')
  const { login, register, status, error, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  if (isAuthenticated) return <Navigate to="/admin" replace />

  function updateValue(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  async function submit(event) {
    event.preventDefault()
    setNotice('')
    if (mode === 'login') {
      await login({ email: form.email, password: form.password })
      navigate('/admin')
    } else {
      const data = await register(form)
      setNotice(data.message || 'Account created. Verify email before logging in.')
      setMode('login')
    }
  }

  return (
    <section className="grid-pattern mx-auto grid min-h-[72vh] max-w-7xl place-items-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="surface-card animate-rise grid w-full max-w-5xl overflow-hidden rounded-lg lg:grid-cols-[0.9fr_1.1fr]">
        <div className="bg-[linear-gradient(135deg,#101828,#123b36)] p-6 text-white sm:p-8">
          <div className="grid size-12 place-items-center rounded-md bg-white/10 text-accent">
            <LayoutDashboard className="size-7" />
          </div>
          <h1 className="mt-5 text-3xl font-black">Admin access</h1>
          <p className="mt-3 text-sm leading-6 text-white/75">
            Manage pages, service content, blogs, case studies, leads, sales assignments, roles, reports, and applications.
          </p>
          <div className="mt-6 grid gap-2">
            {roles.slice(0, 6).map((role) => (
              <div key={role} className="flex items-center gap-2 rounded-md border border-white/10 bg-white/5 p-2 text-sm font-medium text-white/85">
                <ShieldCheck className="size-4 text-accent" />
                {role}
              </div>
            ))}
          </div>
        </div>
        <form onSubmit={submit} className="grid gap-4 p-6 sm:p-8">
          <div className="flex rounded-md border border-border bg-muted p-1">
            {['login', 'register'].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setMode(item)}
                className={cn(
                  'min-h-10 flex-1 rounded-md text-sm font-bold capitalize text-muted-foreground transition-all',
                  mode === item && 'bg-white text-ink shadow-sm',
                )}
              >
                {item}
              </button>
            ))}
          </div>
          {mode === 'register' ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="First name">
                <Input name="firstName" value={form.firstName} onChange={updateValue} required />
              </Field>
              <Field label="Last name">
                <Input name="lastName" value={form.lastName} onChange={updateValue} required />
              </Field>
            </div>
          ) : null}
          <Field label="Email">
            <Input type="email" name="email" value={form.email} onChange={updateValue} required />
          </Field>
          <Field label="Password">
            <Input type="password" name="password" value={form.password} onChange={updateValue} required />
          </Field>
          {mode === 'register' ? (
            <Field label="Confirm password">
              <Input type="password" name="confirmPassword" value={form.confirmPassword} onChange={updateValue} required />
            </Field>
          ) : null}
          {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
          {notice ? <p className="text-sm font-medium text-emerald-700">{notice}</p> : null}
          <Button type="submit" disabled={status === 'loading'}>
            <UserRound className="size-4" />
            {mode === 'login' ? 'Login' : 'Create Account'}
          </Button>
        </form>
      </div>
    </section>
  )
}

function ProtectedRoute({ children }) {
  const { status, isAuthenticated } = useAuth()
  if (status === 'loading') {
    return (
      <div className="mx-auto grid max-w-7xl gap-4 px-4 py-16 sm:px-6 lg:grid-cols-3 lg:px-8">
        <SkeletonPanel />
        <SkeletonPanel />
        <SkeletonPanel />
      </div>
    )
  }
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return children
}

function AdminDashboard() {
  const { user, logout } = useAuth()
  const [leads, setLeads] = useState(() => getLeadQueue())
  const [selectedLead, setSelectedLead] = useState(null)
  const [pages, setPages] = useState([
    { id: 'home', title: 'Home', status: 'published', owner: 'Marketing Manager' },
    { id: 'services', title: 'Services', status: 'published', owner: 'Admin' },
    { id: 'case-studies', title: 'Case Studies', status: 'draft', owner: 'Marketing Manager' },
  ])
  const [newPage, setNewPage] = useState('')

  const metrics = useMemo(
    () => [
      { label: 'Queued leads', value: leads.length },
      { label: 'Service enquiries', value: leads.filter((lead) => lead.type === 'service').length },
      { label: 'Career applications', value: leads.filter((lead) => lead.type === 'career').length },
      { label: 'Published pages', value: pages.filter((page) => page.status === 'published').length },
    ],
    [leads, pages],
  )

  function updateLead(id, patch) {
    const next = leads.map((lead) => (lead.id === id ? { ...lead, ...patch } : lead))
    setLeads(next)
    updateLeadQueue(next)
  }

  function addPage(event) {
    event.preventDefault()
    if (!newPage.trim()) return
    setPages((current) => [
      { id: crypto.randomUUID(), title: newPage.trim(), status: 'draft', owner: 'Admin' },
      ...current,
    ])
    setNewPage('')
  }

  function exportLeads() {
    const headers = ['name', 'phone', 'email', 'companyName', 'industry', 'requiredService', 'budgetRange', 'cityOrLocation', 'leadSource', 'campaignSource', 'enquiredAt', 'leadStatus', 'assignedTo']
    const rows = leads.map((lead) => headers.map((key) => JSON.stringify(lead[key] || '')).join(','))
    const blob = new Blob([[headers.join(','), ...rows].join('\n')], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'markgenexes-leads.csv'
    anchor.click()
    URL.revokeObjectURL(url)
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Badge>Secure workspace</Badge>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-ink">Admin dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Signed in as {user?.firstName || user?.email || 'team member'}.
          </p>
        </div>
        <Button variant="outline" onClick={logout}>
          <LogOut className="size-4" />
          Logout
        </Button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => {
          const icons = [Inbox, MessageSquareText, Building2, Activity]
          const Icon = icons[index]
          return (
            <Card key={metric.label} interactive className="p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-muted-foreground">{metric.label}</p>
                <span className="grid size-9 place-items-center rounded-md bg-primary/10 text-primary">
                  <Icon className="size-4" />
                </span>
              </div>
              <p className="mt-3 text-3xl font-black text-ink">{metric.value}</p>
              <p className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
                <TrendingUp className="size-3.5" />
                Ready for reporting
              </p>
            </Card>
          )
        })}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <section className="surface-card rounded-lg p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-ink">Website content</h2>
              <p className="mt-1 text-sm text-muted-foreground">Pages, services, blogs, case studies, and media.</p>
            </div>
            <Eye className="size-5 text-primary" />
          </div>
          <form onSubmit={addPage} className="mt-4 flex gap-2">
            <Input value={newPage} onChange={(event) => setNewPage(event.target.value)} placeholder="New page title" />
            <Button type="submit" size="icon" aria-label="Add page">
              <Plus className="size-4" />
            </Button>
          </form>
          <div className="mt-4 grid gap-3">
            {pages.map((page) => (
              <div key={page.id} className="flex items-center justify-between gap-3 rounded-md border border-border bg-white p-3 transition hover:border-primary/30 hover:shadow-soft">
                <div>
                  <p className="text-sm font-bold text-ink">{page.title}</p>
                  <p className="text-xs text-muted-foreground">{page.owner}</p>
                </div>
                <Select
                  className="w-36"
                  value={page.status}
                  onChange={(event) =>
                    setPages((current) =>
                      current.map((item) => (item.id === page.id ? { ...item, status: event.target.value } : item)),
                    )
                  }
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </Select>
              </div>
            ))}
          </div>
        </section>

        <section className="surface-card rounded-lg p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-ink">Lead inbox</h2>
              <p className="mt-1 text-sm text-muted-foreground">Assignments, statuses, notes, campaign source, and export.</p>
            </div>
            <Button variant="outline" onClick={exportLeads} disabled={!leads.length}>
              <Download className="size-4" />
              Export
            </Button>
          </div>
          <div className="mt-4 overflow-x-auto rounded-lg border border-border">
            {leads.length ? (
              <table className="min-w-[920px] text-left text-sm">
                <thead className="border-b border-border bg-muted/70 text-xs uppercase text-muted-foreground">
                  <tr>
                    {['Lead', 'Service', 'Source', 'Status', 'Assigned', 'Notes', ''].map((heading) => (
                      <th key={heading} className="px-3 py-3 font-bold">
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr key={lead.id} className="border-b border-border bg-white align-top transition hover:bg-muted/45">
                      <td className="px-3 py-3">
                        <p className="font-bold text-ink">{lead.name || 'Unnamed lead'}</p>
                        <p className="text-xs text-muted-foreground">{lead.email || lead.phone}</p>
                      </td>
                      <td className="px-3 py-3">{lead.requiredService || lead.type}</td>
                      <td className="px-3 py-3">
                        <Badge>{lead.leadSource || 'direct'}</Badge>
                      </td>
                      <td className="px-3 py-3">
                        <Select value={lead.leadStatus} onChange={(event) => updateLead(lead.id, { leadStatus: event.target.value })}>
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="qualified">Qualified</option>
                          <option value="won">Won</option>
                          <option value="lost">Lost</option>
                        </Select>
                      </td>
                      <td className="px-3 py-3">
                        <Input
                          value={lead.assignedTo || ''}
                          onChange={(event) => updateLead(lead.id, { assignedTo: event.target.value })}
                          placeholder="Sales owner"
                        />
                      </td>
                      <td className="px-3 py-3">
                        <Textarea
                          className="min-h-20"
                          value={lead.noteText || ''}
                          onChange={(event) => updateLead(lead.id, { noteText: event.target.value })}
                          placeholder="Lead notes"
                        />
                      </td>
                      <td className="px-3 py-3">
                        <Button type="button" variant="ghost" size="sm" onClick={() => setSelectedLead(lead)}>
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <EmptyState
                icon={Inbox}
                title="No local leads yet"
                description="Submitted forms will appear here if the backend lead routes are unavailable."
              />
            )}
          </div>
        </section>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <section className="surface-card rounded-lg p-5">
          <h2 className="text-xl font-bold text-ink">Roles and permissions</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {roles.map((role) => (
              <Badge key={role}>{role}</Badge>
            ))}
          </div>
        </section>
        <section className="surface-card rounded-lg p-5">
          <h2 className="text-xl font-bold text-ink">Tracking integrations</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {['Google Analytics', 'Conversion tracking', 'Meta Pixel', 'UTM campaigns'].map((item) => (
              <div key={item} className="flex items-center gap-2 rounded-md border border-border bg-white p-3 text-sm font-semibold text-ink transition hover:border-primary/30 hover:bg-muted">
                <BarChart3 className="size-4 text-primary" />
                {item}
              </div>
            ))}
          </div>
        </section>
      </div>

      <Dialog
        open={Boolean(selectedLead)}
        onOpenChange={(open) => !open && setSelectedLead(null)}
        title={selectedLead?.name || 'Lead details'}
        description="Captured lead profile, source context, and business requirement."
      >
        {selectedLead ? (
          <div className="grid gap-5">
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ['Email', selectedLead.email],
                ['Phone', selectedLead.phone],
                ['Company', selectedLead.companyName],
                ['Industry', selectedLead.industry],
                ['Service', selectedLead.requiredService],
                ['Budget', selectedLead.budgetRange],
                ['Location', selectedLead.cityOrLocation],
                ['Source', selectedLead.leadSource],
              ].map(([label, value]) => (
                <div key={label} className="rounded-md border border-border bg-muted/40 p-3">
                  <p className="text-xs font-bold uppercase text-muted-foreground">{label}</p>
                  <p className="mt-1 text-sm font-semibold text-ink">{value || 'Not provided'}</p>
                </div>
              ))}
            </div>
            <div className="rounded-md border border-border bg-white p-4">
              <p className="text-xs font-bold uppercase text-muted-foreground">Requirement</p>
              <p className="mt-2 text-sm leading-6 text-ink">{selectedLead.message || 'No message provided.'}</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <a className={buttonVariants({ variant: 'outline' })} href={`mailto:${selectedLead.email || ''}`}>
                Email lead
              </a>
              <a className={buttonVariants()} href={selectedLead.phone ? `tel:${selectedLead.phone}` : `tel:${phoneNumber}`}>
                Call lead
              </a>
            </div>
          </div>
        ) : null}
      </Dialog>
    </section>
  )
}

function FloatingActions() {
  return (
    <div className="fixed inset-x-3 bottom-3 z-50 grid grid-cols-2 gap-2 md:hidden">
      <a className={buttonVariants({ variant: 'dark' })} href={`tel:${phoneNumber}`}>
        <Phone className="size-4" />
        Call
      </a>
      <a className={buttonVariants()} href={whatsappUrl} target="_blank" rel="noreferrer">
        WhatsApp
      </a>
    </div>
  )
}

function Footer() {
  return (
    <footer className="border-t border-border bg-white pb-20 md:pb-0">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <div>
          <p className="text-lg font-black text-ink">MarkGenexes</p>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
            A premium growth partner for digital marketing, performance media, leads, brand, web, apps, SEO, social,
            automation, and business consulting.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Link className="text-sm font-semibold text-muted-foreground hover:text-ink" to="/services">
            Request a Proposal
          </Link>
          <Link className="text-sm font-semibold text-muted-foreground hover:text-ink" to="/consultation">
            Start Your Growth Journey
          </Link>
          <Link className="text-sm font-semibold text-muted-foreground hover:text-ink" to="/careers">
            Apply for a Job
          </Link>
          <Link className="text-sm font-semibold text-muted-foreground hover:text-ink" to="/partner">
            Partner With Us
          </Link>
        </div>
      </div>
    </footer>
  )
}

function NotFound() {
  return (
    <section className="mx-auto grid min-h-[60vh] max-w-3xl place-items-center px-4 py-16 text-center">
      <div>
        <h1 className="text-4xl font-black text-ink">Page not found</h1>
        <p className="mt-3 text-muted-foreground">The page may have moved or is still being prepared.</p>
        <Link className={cn(buttonVariants(), 'mt-6')} to="/">
          Back to home
        </Link>
      </div>
    </section>
  )
}

export default Layout
