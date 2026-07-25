const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'
const TOKEN_KEY = 'markgenx:tokens'
const LEAD_QUEUE_KEY = 'markgenx:lead_queue'

const endpointMap = {
  contact: ['/forms/contact-enquiries', '/leads'],
  consultation: ['/forms/consultation-bookings', '/leads'],
  service: ['/forms/service-enquiries', '/leads'],
  career: ['/careers/applications'],
  partner: ['/partnerships/applications'],
}

function readJson(key, fallback) {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function getTokens() {
  return readJson(TOKEN_KEY, null)
}

export function setTokens(tokens) {
  writeJson(TOKEN_KEY, tokens)
}

export function clearTokens() {
  localStorage.removeItem(TOKEN_KEY)
}

export function getLeadQueue() {
  return readJson(LEAD_QUEUE_KEY, [])
}

export function updateLeadQueue(leads) {
  writeJson(LEAD_QUEUE_KEY, leads)
}

export function getTrackingData() {
  const params = new URLSearchParams(window.location.search)
  const utm = Object.fromEntries(
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']
      .map((key) => [key, params.get(key)])
      .filter(([, value]) => value),
  )

  return {
    leadSource: params.get('source') || utm.utm_source || document.referrer || 'direct',
    campaignSource: utm.utm_campaign || params.get('campaign') || '',
    utm,
    pagePath: window.location.pathname,
    referrer: document.referrer,
    enquiredAt: new Date().toISOString(),
  }
}

function trackLeadConversion(lead) {
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({
    event: 'lead_submission',
    leadType: lead.type,
    requiredService: lead.requiredService,
    leadSource: lead.leadSource,
    campaignSource: lead.campaignSource,
    utm: lead.utm,
  })

  if (typeof window.fbq === 'function') {
    window.fbq('track', 'Lead', {
      content_name: lead.requiredService || lead.type,
      content_category: lead.type,
    })
  }
}

async function request(path, options = {}) {
  const tokens = getTokens()
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(tokens?.accessToken ? { Authorization: `Bearer ${tokens.accessToken}` } : {}),
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(data.error || data.message || 'Request failed')
  }
  return data
}

export async function login(credentials) {
  const data = await request('/auth/login', { method: 'POST', body: credentials })
  setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken })
  return data
}

export async function register(payload) {
  return request('/auth/register', { method: 'POST', body: payload })
}

export async function getCurrentUser() {
  return request('/auth/me')
}

export async function logout() {
  const tokens = getTokens()
  try {
    await request('/auth/logout', { method: 'POST', body: { refreshToken: tokens?.refreshToken } })
  } finally {
    clearTokens()
  }
}

export async function submitLead(type, payload) {
  const lead = {
    id: crypto.randomUUID(),
    type,
    leadStatus: 'new',
    assignedTo: '',
    notes: [],
    ...payload,
    ...getTrackingData(),
  }

  const endpoints = endpointMap[type] || ['/leads']
  for (const endpoint of endpoints) {
    try {
      const result = await request(endpoint, { method: 'POST', body: lead })
      trackLeadConversion(lead)
      return { queued: false, lead, result }
    } catch (error) {
      if (!/failed|not found|cannot|request/i.test(error.message)) {
        throw error
      }
    }
  }

  const queue = getLeadQueue()
  updateLeadQueue([lead, ...queue])
  trackLeadConversion(lead)
  return { queued: true, lead }
}
