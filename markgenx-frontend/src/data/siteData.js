import {
  BarChart3,
  Bot,
  BriefcaseBusiness,
  Code2,
  FileText,
  Megaphone,
  Palette,
  Search,
  Share2,
  Target,
  Users,
  Workflow,
} from 'lucide-react'

export const navItems = [
  { label: 'Services', href: '/services' },
  { label: 'Consulting', href: '/consultation' },
  { label: 'Careers', href: '/careers' },
  { label: 'Partner', href: '/partner' },
]

export const services = [
  {
    title: 'Digital Marketing',
    slug: 'digital-marketing',
    icon: Megaphone,
    description: 'Campaign strategy, funnels, content systems, landing pages, and analytics for predictable acquisition.',
  },
  {
    title: 'Performance Marketing',
    slug: 'performance-marketing',
    icon: Target,
    description: 'Paid search, paid social, retargeting, conversion optimization, media planning, and ROAS reporting.',
  },
  {
    title: 'Lead Generation',
    slug: 'lead-generation',
    icon: Users,
    description: 'Qualified enquiry engines with tracked forms, CRM-ready data, lead routing, and follow-up workflows.',
  },
  {
    title: 'Branding and Creative Services',
    slug: 'branding-creative',
    icon: Palette,
    description: 'Identity systems, brand messaging, ad creatives, pitch decks, campaign concepts, and design assets.',
  },
  {
    title: 'Website and Application Development',
    slug: 'website-application-development',
    icon: Code2,
    description: 'Fast, responsive websites, portals, admin panels, client dashboards, and application interfaces.',
  },
  {
    title: 'SEO',
    slug: 'seo',
    icon: Search,
    description: 'Technical SEO, content architecture, local visibility, search intent mapping, and ranking growth plans.',
  },
  {
    title: 'Social Media Management',
    slug: 'social-media-management',
    icon: Share2,
    description: 'Content calendars, community management, creator direction, reporting, and platform-specific publishing.',
  },
  {
    title: 'AI Automation',
    slug: 'ai-automation',
    icon: Bot,
    description: 'AI-assisted lead qualification, reporting, internal workflows, customer support, and marketing operations.',
  },
  {
    title: 'Business and Growth Consulting',
    slug: 'business-growth-consulting',
    icon: BriefcaseBusiness,
    description: 'Growth audits, GTM strategy, sales process design, market expansion, and operating rhythm consulting.',
  },
]

export const adminModules = [
  { title: 'Content Studio', icon: FileText, items: ['Pages', 'Services', 'Blogs', 'Case studies', 'Media library'] },
  { title: 'Lead Command', icon: Target, items: ['Lead inbox', 'Assignments', 'Statuses', 'Notes', 'CSV export'] },
  { title: 'Growth Tracking', icon: BarChart3, items: ['GA conversions', 'Meta Pixel', 'UTM reports', 'Campaign sources'] },
  { title: 'Operations', icon: Workflow, items: ['Roles', 'Permissions', 'Careers', 'Contacts', 'Partner requests'] },
]

export const roles = [
  'Super Admin',
  'Admin',
  'Sales Manager',
  'Sales Executive',
  'Marketing Manager',
  'HR/Admin',
  'Client',
  'Employee',
  'University Partner',
  'Admission Partner',
]

export const budgetRanges = ['Under $1k', '$1k - $5k', '$5k - $15k', '$15k - $50k', '$50k+']

export const industries = [
  'Education',
  'Healthcare',
  'Real Estate',
  'Retail',
  'Technology',
  'Financial Services',
  'Hospitality',
  'Manufacturing',
  'Other',
]
