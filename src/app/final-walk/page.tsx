// File: src/app/final-walk/page.tsx
'use client';

import { Suspense, useEffect, useMemo, useRef, useState } from 'react'; // Import Suspense
import { useRouter, useSearchParams } from 'next/navigation';
import ProcessingTunnel, { ProcessingTunnelHandle } from '@/components/final-walk/ProcessingTunnel';
import { CheckCircle2, Loader2, Mic } from 'lucide-react';

// Ensure MOCK is loaded (harmless here)
import '@/utils/api';

type PermState = 'idle' | 'prompt' | 'granted' | 'denied';

// This component contains the original page logic
function FinalWalk() {
  const router = useRouter();
  const params = useSearchParams();
  const persona = params.get('persona') ?? 'mark';

  const tunnelRef = useRef<ProcessingTunnelHandle | null>(null);

  const [micPerm, setMicPerm] = useState<PermState>('idle');
  const [requestingMic, setRequestingMic] = useState(false);
  const micStreamRef = useRef<MediaStream | null>(null);

  const [statusTitle, setStatusTitle] = useState('Loading…');
  const [statusSub, setStatusSub] = useState<string | undefined>(undefined);
  const [statusIcon, setStatusIcon] = useState<'spinner' | 'check' | 'mic-error'>('spinner');

  const canRoute = useMemo(() => micPerm === 'granted', [micPerm]);
  const navigatedRef = useRef(false);
  const readyRef = useRef(false);
  const afterMicRef = useRef(false);
  const finalRef = useRef(false);

  function stopTracks() {
    micStreamRef.current?.getTracks().forEach((t) => t.stop());
  }

  // Tunnel ready → intro, then mic
  const handleTunnelReady = () => {
    if (readyRef.current) return;
    readyRef.current = true;

    tunnelRef.current?.playIntro();
    setStatusTitle('Calling the sharks…');
    setStatusSub(undefined);
    setStatusIcon('spinner');

    setTimeout(() => {
      setStatusTitle('Enable microphone to continue.');
      setStatusSub('Tap “Enable microphone” if prompted.');
      setStatusIcon('spinner');
      tryRequestMic();
    }, 600);
  };

  // Mic request with fallback
  const tryRequestMic = async () => {
    if (requestingMic || micPerm === 'granted') return;
    setRequestingMic(true);
    try {
      setMicPerm('prompt');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      micStreamRef.current = stream;
      setMicPerm('granted');

      setStatusTitle('Mic granted ✓');
      setStatusSub(undefined);
      setStatusIcon('check');

      if (!afterMicRef.current) {
        afterMicRef.current = true;
        tunnelRef.current?.playAfterMic();
      }

      // Timed “room prep” beats
      setTimeout(() => {
        setStatusTitle('Setting up the boardroom…');
        setStatusSub(undefined);
        setStatusIcon('spinner');

        setTimeout(() => {
          setStatusTitle('Persona synced. Voice & tone loaded.');
          setStatusSub(undefined);
          setStatusIcon('check');

          setTimeout(() => {
            setStatusTitle('You’ve got this.');
            setStatusSub(undefined);
            setStatusIcon('check');

            if (!finalRef.current) {
              finalRef.current = true;
              tunnelRef.current?.showFinal();

              // Anticipation then route
              setTimeout(() => {
                if (!navigatedRef.current && canRoute) {
                  navigatedRef.current = true;
                  stopTracks();
                  router.replace(`/boardroom?persona=${encodeURIComponent(persona)}`);
                }
              }, 1100);
            }
          }, 550);
        }, 550);
      }, 450);
    } catch {
      setMicPerm('denied');
      setStatusTitle('Microphone blocked');
      setStatusSub('Please allow mic access and try again.');
      setStatusIcon('mic-error');
    } finally {
      setRequestingMic(false);
    }
  };

  useEffect(() => {
    return () => stopTracks();
  }, []);

  return (
    <main
      className="min-h-screen w-full bg-primary-bg"
      style={{
        backgroundImage:
          'radial-gradient(circle, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    >
      <ProcessingTunnel
        ref={tunnelRef}
        onReady={handleTunnelReady}
        onComplete={() => {
          if (!navigatedRef.current && canRoute) {
            navigatedRef.current = true;
            stopTracks();
            router.replace(`/boardroom?persona=${encodeURIComponent(persona)}`);
          }
        }}
      />

      {/* Single evolving status line */}
      <div className="absolute inset-x-0 bottom-0 pb-10 pointer-events-none">
        <div className="mx-auto max-w-3xl px-6">
          <StatusRow
            title={statusTitle}
            sub={statusSub}
            icon={
              statusIcon === 'check' ? 'check' :
              statusIcon === 'mic-error' ? 'mic-error' : 'spinner'
            }
            onAction={
              (statusIcon === 'mic-error' || statusTitle.startsWith('Enable microphone'))
                ? () => tryRequestMic()
                : undefined
            }
            actionLabel={
              (statusIcon === 'mic-error' || statusTitle.startsWith('Enable microphone'))
                ? (requestingMic ? 'Requesting…' : 'Enable microphone')
                : undefined
            }
          />
        </div>
      </div>
    </main>
  );
}

function StatusRow({
  title,
  sub,
  icon,
  onAction,
  actionLabel,
}: {
  title: string;
  sub?: string;
  icon: 'spinner' | 'check' | 'mic-error';
  onAction?: () => void;
  actionLabel?: string;
}) {
  return (
    <div
      className="pointer-events-auto rounded-xl border px-4 py-3 backdrop-blur
                 flex items-center gap-3 border-glass-border bg-glass-bg"
    >
      <div className="w-6 h-6 flex items-center justify-center shrink-0">
        {icon === 'check' ? (
          <CheckCircle2 className="h-5 w-5 text-green-400" />
        ) : icon === 'mic-error' ? (
          <Mic className="h-5 w-5 text-red-400" />
        ) : (
          <Loader2 className="h-5 w-5 animate-spin text-accent" />
        )}
      </div>

      <div className="flex-1">
        <div className="text-main-text text-sm font-medium">{title}</div>
        {sub && <div className="text-body-text/80 text-xs mt-0.5">{sub}</div>}
      </div>

      {onAction && (
        <button
          onClick={onAction}
          className="pointer-events-auto px-3 py-1.5 rounded-md bg-surface-bg text-body-text text-xs border border-glass-border hover:bg-primary-bg transition"
        >
          {actionLabel ?? 'Retry'}
        </button>
      )}
    </div>
  );
}

// This is the new, exported page component
export default function FinalWalkPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FinalWalk />
    </Suspense>
  );
}