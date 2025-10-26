'use client';

import { Mic } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth, SignInButton } from '@clerk/nextjs';

export default function MicCardCompact() {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const Tile = ({ children }: { children: React.ReactNode }) => (
    <div
      role="button"
      tabIndex={0}
      onClick={() => (isSignedIn ? router.push('/choose-shark?mode=mic') : undefined)}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && isSignedIn) router.push('/choose-shark?mode=mic');
      }}
      className="group h-full rounded-2xl border border-glass-border bg-surface-bg/90
                 hover:bg-surface-bg transition-colors shadow-2xl p-8 flex flex-col items-center
                 justify-center gap-3 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      style={{ transform: 'translateZ(0)' }}
    >
      {children}
    </div>
  );

  return isSignedIn ? (
    <Tile>
      <Mic className="w-16 h-16 text-accent group-hover:scale-105 transition-transform" aria-hidden="true" />
      <h3 className="text-xl font-semibold text-main-text">Hop on a Call</h3>
      <p className="text-sm text-body-text">Tap the mic to enter the boardroom.</p>
    </Tile>
  ) : (
    <SignInButton mode="modal">
      <Tile>
        <Mic className="w-16 h-16 text-accent" aria-hidden="true" />
        <h3 className="text-xl font-semibold text-main-text">Hop on a Call</h3>
        <p className="text-sm text-body-text">Sign in and tap the mic to join.</p>
      </Tile>
    </SignInButton>
  );
}
