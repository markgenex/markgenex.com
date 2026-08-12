import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'
const TOKEN_KEY = 'markgenx:tokens'
const LEAD_QUEUE_KEY = 'markgenx:lead_queue'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

const endpointMap = {
  contact: ['/forms/contact-enquiries', '/leads'],
  consultation: ['/forms/consultation-bookings', '/leads'],
  service: ['/v1/public/service-enquiries', '/forms/service-enquiries', '/leads'],
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

function getApiError(error, fallback = 'Request failed') {
  return error.response?.data?.error || error.response?.data?.message || error.message || fallback
}

async function refreshAccessToken() {
  const tokens = getTokens()
  if (!tokens?.refreshToken) {
    throw new Error('Session expired')
  }

  try {
    const { data } = await axios.post(
      `${API_BASE_URL}/auth/refresh-token`,
      { refreshToken: tokens.refreshToken },
      {
        timeout: 15000,
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
      },
    )
    setTokens({ ...tokens, accessToken: data.accessToken })
    return data.accessToken
  } catch (error) {
    clearTokens()
    throw new Error(getApiError(error, 'Session expired'), { cause: error })
  }
}

apiClient.interceptors.request.use((config) => {
  const tokens = getTokens()
  if (tokens?.accessToken) {
    config.headers.Authorization = `Bearer ${tokens.accessToken}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true
      const accessToken = await refreshAccessToken()
      originalRequest.headers.Authorization = `Bearer ${accessToken}`
      return apiClient(originalRequest)
    }

    throw new Error(getApiError(error), { cause: error })
  },
)

export function getLeadQueue() {
  return readJson(LEAD_QUEUE_KEY, [])
}

export function updateLeadQueue(leads) {
  writeJson(LEAD_QUEUE_KEY, leads)
}

export async function getLeads() {
  const data = await request('/leads')
  return data.leads || []
}

export async function getServiceEnquiries() {
  const data = await request('/v1/admin/service-enquiries')
  return data.enquiries || []
}

export async function getPublicIndustries() {
  const data = await request('/v1/public/industries')
  return data.managed ? data.industries || [] : null
}

export async function getAdminIndustries() {
  const data = await request('/v1/admin/industries')
  return data.industries || []
}

export async function createIndustry(payload) {
  const data = await request('/v1/admin/industries', { method: 'POST', body: payload })
  return data.industry
}

export async function updateIndustry(id, payload) {
  const data = await request(`/v1/admin/industries/${id}`, { method: 'PATCH', body: payload })
  return data.industry
}

export async function deleteIndustry(id) {
  return request(`/v1/admin/industries/${id}`, { method: 'DELETE' })
}

export async function getPublicJobs() { const data = await request('/v1/public/jobs'); return data.jobs || [] }
export async function submitJobApplication(jobId, payload) { const form = new FormData(); ['fullName', 'email', 'phone', 'experience', 'portfolio'].forEach((key) => form.append(key, payload[key] || '')); form.append('resume', payload.resume); return request(`/v1/public/jobs/${jobId}/applications`, { method: 'POST', body: form, headers: { 'Content-Type': undefined } }) }
export async function getAdminJobs() { const data = await request('/v1/admin/jobs'); return data.jobs || [] }
export async function createJob(payload) { const data = await request('/v1/admin/jobs', { method: 'POST', body: payload }); return data.job }
export async function updateJob(id, payload) { const data = await request(`/v1/admin/jobs/${id}`, { method: 'PATCH', body: payload }); return data.job }
export async function deleteJob(id) { return request(`/v1/admin/jobs/${id}`, { method: 'DELETE' }) }
export async function getJobApplications(params = {}) { const query = new URLSearchParams(Object.entries(params).filter(([, value]) => value)); const data = await request(`/v1/admin/job-applications${query.size ? `?${query}` : ''}`); return data.applications || [] }
export async function updateJobApplication(id, status) { const data = await request(`/v1/admin/job-applications/${id}`, { method: 'PATCH', body: { status } }); return data.application }
export async function syncCareerMailbox() { return request('/v1/admin/job-applications/sync', { method: 'POST' }) }
export async function getApplicationResume(id, download = false) { const { data } = await apiClient.get(`/v1/admin/job-applications/${id}/resume${download ? '?download=1' : ''}`, { responseType: 'blob' }); return data }

export async function updateLead(id, patch) {
  const data = await request(`/leads/${id}`, { method: 'PATCH', body: patch })
  return data.lead
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
  const { data } = await apiClient.request({
    url: path,
    method: options.method || 'GET',
    data: options.body,
    headers: options.headers,
  })
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
      const savedLead = result.lead || lead
      trackLeadConversion(savedLead)
      return { queued: false, lead: savedLead, result }
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
