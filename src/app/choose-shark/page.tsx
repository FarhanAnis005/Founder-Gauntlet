// File: src/app/choose-shark/page.tsx
'use client';

import { Suspense, useState } from 'react'; // Import Suspense
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';

type Investor = {
  key: 'mark' | 'lori' | 'kevin' | 'barbara' | 'daymond' | 'robert';
  name: string;
  title: string;
  focus: string;
  image: string;
};

const INVESTORS: Investor[] = [
  { key: 'mark',    name: 'Mark Cuban',       title: 'The Visionary',        focus: 'Disruptive tech, massive scale, knows the numbers.', image: '/images/investor-mark.jpg' },
  { key: 'lori',    name: 'Lori Greiner',     title: 'The Retail Queen',     focus: 'Mass-market appeal, QVC/big-box distribution.',       image: '/images/investor-lori.jpg' },
  { key: 'kevin',   name: "Kevin O'Leary",    title: 'Mr. Wonderful',        focus: 'Profitability, capital return, royalties.',          image: '/images/investor-kevin.jpg' },
  { key: 'barbara', name: 'Barbara Corcoran', title: 'The Gut Investor',     focus: 'Founder grit; story & hustle first.',                image: '/images/investor-barbara.jpg' },
  { key: 'daymond', name: 'Daymond John',     title: 'The Brand Builder',    focus: 'Brand, lifestyle, go-to-market muscle.',             image: '/images/investor-daymond.jpg' },
  { key: 'robert',  name: 'Robert Herjavec',  title: 'The Cyber Pro',        focus: 'Security, enterprise sales, pragmatic scaling.',      image: '/images/investor-robert.jpg' },
];

// This is your original component, just renamed.
// It contains the client-side hooks that need the Suspense boundary.
function ChooseShark() {
  const [selected, setSelected] = useState<Investor['key'] | null>(null);
  const router = useRouter();
  const params = useSearchParams();
  const mode = (params.get('mode') || 'mic') as 'mic' | 'upload';
  const pitchId = params.get('pitchId') || null;

  function goNext(choice: Investor['key']) {
    setSelected(choice); // quick visual feedback
    // Navigate immediately based on mode
    if (mode === 'upload' && pitchId) {
      router.push(`/final-walk/${encodeURIComponent(pitchId)}?persona=${encodeURIComponent(choice)}`);
      return;
    }
    if (mode === 'mic') {
      router.push(`/final-walk?persona=${encodeURIComponent(choice)}`);
      return;
    }
    router.push('/onboarding');
  }

  return (
    <main
      className="min-h-screen w-full bg-primary-bg"
      style={{
        backgroundImage: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    >
      <div className="mx-auto max-w-6xl px-6 py-16">
        <header className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-main-text">Choose the shark you want to pitch</h1>
          <p className="text-body-text mt-2">Pick a persona. We’ll tailor questions and tone to match.</p>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
          {INVESTORS.map((inv) => {
            const active = selected === inv.key;
            return (
              <button
                key={inv.key}
                type="button"
                onClick={() => goNext(inv.key)}
                aria-label={`Choose ${inv.name}`}
                className={`group relative rounded-2xl border p-4 text-left bg-surface-bg/80 hover:bg-surface-bg transition
                                focus-visible:outline-none focus-visible:ring-2 
                                ${active ? 'ring-2 ring-accent border-accent' : 'border-glass-border'}`}
              >
                <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden mb-4">
                  <Image
                    src={inv.image}
                    alt={inv.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 50vw, 16vw"
                    priority={false}
                  />
                </div>
                <div className="space-y-1">
                  <div className="text-main-text font-semibold">{inv.name}</div>
                  <div className="text-accent text-sm">{inv.title}</div>
                  <div className="text-body-text text-sm opacity-80 line-clamp-3">{inv.focus}</div>
                </div>
                {active && (
                  <span className="pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-accent/60" />
                )}
              </button>
            );
          })}
        </section>
      </div>
    </main>
  );
}

// This is the new page component that Next.js will render.
// It wraps your client component in a Suspense boundary.
export default function ChooseSharkPage() {
  return (
    // You can customize this fallback with a loading spinner or skeleton UI
    <Suspense fallback={<div>Loading...</div>}>
      <ChooseShark />
    </Suspense>
  );
}