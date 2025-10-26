// // File: frontend/src/utils/api.ts
// 'use client';

// export async function uploadPitch({
//   apiBase,
//   file,
//   persona,
//   token,
// }: {
//   apiBase: string;
//   file: File;
//   persona: string;
//   token: string; // REQUIRED
// }) {
//   const url = `${apiBase}/api/pitches`;

//   const fd = new FormData();
//   fd.append('file', file);
//   fd.append('persona', persona);

//   const res = await fetch(url, {
//     method: 'POST',
//     body: fd,
//     headers: { Authorization: `Bearer ${token}` },
//   });

//   if (!res.ok) {
//     const text = await res.text().catch(() => '');
//     throw new Error(text || `Upload failed with status ${res.status}`);
//   }
//   return (await res.json()) as { pitchId: string; status: string };
// }





// ====================Mock Backend API=======================
// File: frontend/src/utils/api.ts
'use client';

let mockInstalled = false;
const pollCounts = new Map<string, number>();

function installMockIfEnabled() {
  if (mockInstalled) return;
  if (process.env.NEXT_PUBLIC_USE_MOCK !== '1') return;

  const originalFetch = window.fetch;

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    try {
      const url =
        typeof input === 'string'
          ? input
          : input instanceof URL
          ? input.toString()
          : input.url;

      const method =
        (init?.method ||
          (typeof input !== 'string' && !(input instanceof URL)
            ? input.method
            : 'GET') ||
          'GET').toUpperCase();

      // Try to parse URL; if it fails, fall back to real fetch
      let path = '';
      try {
        const u = new URL(url, typeof window !== 'undefined' ? window.location.origin : undefined);
        path = u.pathname;
      } catch {
        return originalFetch(input, init);
      }

      // ---- MOCK: GET /api/pitches/:id/status
      const statusMatch = path.match(/^\/api\/pitches\/([^/]+)\/status\/?$/);
      if (method === 'GET' && statusMatch) {
        const id = statusMatch[1];
        const n = pollCounts.get(id) ?? 0;

        // First 3 polls -> "processing", then "ready"
        const state = n < 3 ? 'processing' : 'ready';
        pollCounts.set(id, n + 1);

        // small latency for realism
        await new Promise((r) => setTimeout(r, 250));

        return new Response(
          JSON.stringify({ pitchId: id, status: state, error: null }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Fall through to the original network call for everything else
      return originalFetch(input, init);
    } catch {
      // If anything goes wrong in the interceptor, do the real fetch
      return originalFetch(input, init);
    }
  };

  mockInstalled = true;

  console.info('[FG MOCK] fetch interceptor installed from utils/api.ts');
}

// ✅ Ensure the mock is installed on any page that imports this file (client-side only)
if (typeof window !== 'undefined') {
  installMockIfEnabled();
}

export async function uploadPitch({
  apiBase,
  file,
  persona,
  token,
}: {
  apiBase: string;
  file: File;
  persona: string;
  token: string; // REQUIRED
}) {
  // In mock mode: short-circuit with a fake response (still seeds pollCounts)
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_USE_MOCK === '1') {
    // simulate small network latency
    await new Promise((r) => setTimeout(r, 300));
    const fakeId =
    (globalThis.crypto &&
      typeof globalThis.crypto.randomUUID === 'function' &&
      globalThis.crypto.randomUUID()) ||
    `mock-${Math.random().toString(36).slice(2, 10)}`;
    // seed counter for status polling (optional — logic works even if omitted)
    pollCounts.set(fakeId, 0);
    return { pitchId: fakeId, status: 'uploaded' } as { pitchId: string; status: string };
  }

  // ---- Real request path (unchanged)
  const url = `${apiBase}/api/pitches`;
  const fd = new FormData();
  fd.append('file', file);
  fd.append('persona', persona);

  const res = await fetch(url, {
    method: 'POST',
    body: fd,
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    let text = '';
    try {
      text = await res.text();
      // surface FastAPI {"detail":"..."} if present
      try {
        const maybe = JSON.parse(text);
        if (maybe?.detail) text = String(maybe.detail);
      } catch { /* noop */ }
    } catch { /* noop */ }
    throw new Error(text || `Upload failed with status ${res.status}`);
  }

  return (await res.json()) as { pitchId: string; status: string };
}
