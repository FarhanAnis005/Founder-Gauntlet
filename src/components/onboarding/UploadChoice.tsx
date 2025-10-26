'use client';

import { useRef, useState } from 'react';
import { FileText } from 'lucide-react';
import { useAuth, SignInButton } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { uploadPitch } from '@/utils/api';

export default function UploadCardCompact() {
  const { isSignedIn, getToken } = useAuth();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);
  const [filename, setFilename] = useState<string | null>(null);

  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';
  const template = process.env.NEXT_PUBLIC_CLERK_JWT_TEMPLATE ?? 'test';

  async function startUpload(file: File) {
    if (file.type !== 'application/pdf') return setErr('Please upload a PDF.');
    if (file.size > 20 * 1024 * 1024) return setErr('File must be 20MB or less.');
    if (!isSignedIn) return setErr('Please sign in to upload.');

    setErr(null);
    setFilename(file.name);
    setBusy(true);
    try {
      const token = await getToken({ template });
      if (!token) throw new Error('Auth token unavailable.');
      // TEMP persona until selection page
      const { pitchId } = await uploadPitch({ apiBase, file, persona: 'mark', token });
      router.push(`/choose-shark?mode=upload&pitchId=${encodeURIComponent(pitchId)}`)
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Upload failed. Try again.';
      setErr(msg);
      setBusy(false);
    }
  }

  const DropTile = ({ children }: { children: React.ReactNode }) => (
    <div
      className={`group h-full rounded-2xl border border-glass-border shadow-2xl p-8
                  flex flex-col items-center justify-center gap-3 text-center
                  ${drag ? 'bg-accent/10' : 'bg-surface-bg/90 hover:bg-surface-bg'}
                  transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent`}
      role="button"
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click();
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDrag(false);
        const f = e.dataTransfer.files?.[0];
        if (f) void startUpload(f);
      }}
      aria-label="Click or drop a PDF to upload"
      style={{ transform: 'translateZ(0)' }}
    >
      {children}
    </div>
  );

  const Content = (
    <>
      <FileText
        className={`w-16 h-16 ${busy ? 'text-accent/60' : 'text-accent'} group-hover:scale-105 transition-transform`}
        aria-hidden="true"
      />
      <h3 className="text-xl font-semibold text-main-text">Upload your Deck</h3>
      <p className="text-sm text-body-text">Click the icon or drop a PDF (≤20MB).</p>

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="sr-only"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void startUpload(f);
        }}
      />

      {filename && !busy && (
        <p className="text-xs text-body-text/80 mt-1 max-w-[90%] truncate">{filename}</p>
      )}
      {busy && <p className="text-sm text-body-text mt-1">Uploading…</p>}
      {err && <p role="alert" className="text-sm text-red-400 mt-1">{err}</p>}
    </>
  );

  return isSignedIn ? (
    <DropTile>{Content}</DropTile>
  ) : (
    <SignInButton mode="modal">
      <DropTile>{Content}</DropTile>
    </SignInButton>
  );
}
