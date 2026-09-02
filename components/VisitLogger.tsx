'use client';

import { useEffect } from 'react';

// Best-effort ping to the Netlify function so a visit is logged with hashed IP + geo, not raw PII.
export default function VisitLogger() {
  useEffect(() => {
    fetch('/.netlify/functions/log-visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path: window.location.pathname,
        referrer: document.referrer || undefined,
      }),
      keepalive: true,
    }).catch(() => {
      // Logging failures should never affect the visitor's experience.
    });
  }, []);

  return null;
}
