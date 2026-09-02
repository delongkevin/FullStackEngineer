'use client';

import { FormEvent, useState } from 'react';

interface VisitSummaryRow {
  country: string | null;
  region: string | null;
  city: string | null;
  unique_visitors: number;
  total_visits: number;
  last_seen: string;
}

interface VisitRow {
  ip_hash: string;
  country: string | null;
  region: string | null;
  city: string | null;
  path: string;
  referrer: string | null;
  created_at: string;
}

export default function VisitsAdminPage() {
  const [token, setToken] = useState('');
  const [summary, setSummary] = useState<VisitSummaryRow[]>([]);
  const [recent, setRecent] = useState<VisitRow[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  async function loadVisits(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/.netlify/functions/get-visits', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error(response.status === 401 ? 'Invalid admin token.' : 'Failed to load visits.');
      }
      const data = await response.json();
      setSummary(Array.isArray(data.summary) ? data.summary : []);
      setRecent(Array.isArray(data.recent) ? data.recent : []);
      setAuthorized(true);
    } catch (err) {
      setAuthorized(false);
      setError(err instanceof Error ? err.message : 'Failed to load visits.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main id="main-content" className="min-h-screen px-6 py-16 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-2 theme-text-primary">Visitor Traffic</h1>
      <p className="theme-text-secondary mb-8">
        Unique-visitor and location metrics collected via the log-visit Netlify function. IP addresses are
        hashed before storage.
      </p>

      <form onSubmit={loadVisits} className="flex gap-3 mb-8">
        <label htmlFor="admin-token" className="sr-only">
          Admin token
        </label>
        <input
          id="admin-token"
          type="password"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Admin token"
          className="w-full px-4 py-3 theme-input rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          required
        />
        <button type="submit" disabled={loading} className="btn-primary whitespace-nowrap disabled:opacity-50">
          {loading ? 'Loading…' : 'View traffic'}
        </button>
      </form>

      {error ? (
        <p role="alert" className="text-red-600 mb-6">
          {error}
        </p>
      ) : null}

      {authorized ? (
        <>
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-3 theme-text-primary">By Location</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm theme-text-secondary">
                <thead>
                  <tr className="text-left theme-border border-b">
                    <th className="py-2 pr-4">Country</th>
                    <th className="py-2 pr-4">Region</th>
                    <th className="py-2 pr-4">City</th>
                    <th className="py-2 pr-4">Unique visitors</th>
                    <th className="py-2 pr-4">Total visits</th>
                    <th className="py-2 pr-4">Last seen</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.map((row, index) => (
                    <tr key={`${row.country}-${row.region}-${row.city}-${index}`} className="theme-border border-b">
                      <td className="py-2 pr-4">{row.country ?? 'Unknown'}</td>
                      <td className="py-2 pr-4">{row.region ?? '—'}</td>
                      <td className="py-2 pr-4">{row.city ?? '—'}</td>
                      <td className="py-2 pr-4">{row.unique_visitors}</td>
                      <td className="py-2 pr-4">{row.total_visits}</td>
                      <td className="py-2 pr-4">{new Date(row.last_seen).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 theme-text-primary">Recent Visits</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm theme-text-secondary">
                <thead>
                  <tr className="text-left theme-border border-b">
                    <th className="py-2 pr-4">Visitor</th>
                    <th className="py-2 pr-4">Location</th>
                    <th className="py-2 pr-4">Path</th>
                    <th className="py-2 pr-4">Referrer</th>
                    <th className="py-2 pr-4">When</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((row, index) => (
                    <tr key={`${row.ip_hash}-${row.created_at}-${index}`} className="theme-border border-b">
                      <td className="py-2 pr-4 font-mono">{row.ip_hash.slice(0, 10)}…</td>
                      <td className="py-2 pr-4">
                        {[row.city, row.region, row.country].filter(Boolean).join(', ') || 'Unknown'}
                      </td>
                      <td className="py-2 pr-4">{row.path}</td>
                      <td className="py-2 pr-4">{row.referrer ?? '—'}</td>
                      <td className="py-2 pr-4">{new Date(row.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      ) : null}
    </main>
  );
}
