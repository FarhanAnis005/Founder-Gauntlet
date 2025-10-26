import MicCardCompact from '@/components/onboarding/MicChoice';
import UploadCardCompact from '@/components/onboarding/UploadChoice';

export default function OnboardingPage() {
  return (
    <main
      className="min-h-screen w-full bg-primary-bg"
      style={{
        backgroundImage:
          'radial-gradient(circle, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    >
      <div className="mx-auto max-w-6xl px-6 py-16">

        {/* Side-by-side from md up; equal heights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          <MicCardCompact />
          <UploadCardCompact />
        </div>
      </div>
    </main>
  );
}
