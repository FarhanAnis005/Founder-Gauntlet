// File: frontend/src/app/page.tsx
import HeroSection from './components/landing/HeroSection';
import UploadVisionSection from './components/landing/UploadVisionSection';
import ProcessingSection from './components/landing/ProcessingSection';
import ChooseInvestorSection from './components/landing/ChooseInvestorSection'; // <-- 1. Import it
import CrossExaminationSection from './components/landing/CrossExaminationSection'; // <-- 1. Import it

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <UploadVisionSection />
      <ProcessingSection />
      <ChooseInvestorSection />
      <CrossExaminationSection /> 
    </main>
  );
}
