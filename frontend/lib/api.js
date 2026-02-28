const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// ─── Generic fetcher ───────────────────────────────────────────────────────
async function apiFetch(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) {
    throw { status: res.status, message: data.message, errors: data.errors };
  }
  return data;
}

// ─── Jobs ──────────────────────────────────────────────────────────────────
export async function getJobs(params = {}) {
  const query = new URLSearchParams(
    Object.fromEntries(Object.entries(params).filter(([, v]) => v !== '' && v !== undefined))
  ).toString();
  return apiFetch(`/api/jobs${query ? `?${query}` : ''}`);
}

export async function getJob(id) {
  return apiFetch(`/api/jobs/${id}`);
}

export async function getJobFilters() {
  return apiFetch('/api/jobs/filters');
}

export async function createJob(jobData) {
  return apiFetch('/api/jobs', {
    method: 'POST',
    body: JSON.stringify(jobData),
  });
}

export async function updateJob(id, jobData) {
  return apiFetch(`/api/jobs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(jobData),
  });
}

export async function deleteJob(id) {
  return apiFetch(`/api/jobs/${id}`, { method: 'DELETE' });
}

// ─── Applications ──────────────────────────────────────────────────────────
export async function submitApplication(applicationData) {
  return apiFetch('/api/applications', {
    method: 'POST',
    body: JSON.stringify(applicationData),
  });
}

export async function getApplications(params = {}) {
  const query = new URLSearchParams(
    Object.fromEntries(Object.entries(params).filter(([, v]) => v !== '' && v !== undefined))
  ).toString();
  return apiFetch(`/api/applications${query ? `?${query}` : ''}`);
}

export async function getApplicationsByJob(jobId) {
  return apiFetch(`/api/applications/job/${jobId}`);
}

export async function deleteApplication(id) {
  return apiFetch(`/api/applications/${id}`, { method: 'DELETE' });
}
