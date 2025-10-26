// File: frontend/src/app/page.tsx
import HeroSection from "@/components/landing/HeroSection";
import UploadVisionSection from "@/components/landing/UploadVisionSection";
import ProcessingSection from "@/components/landing/ProcessingSection";
import ChooseInvestorSection from "@/components/landing/ChooseInvestorSection";
import CrossExaminationSection from "@/components/landing/CrossExaminationSection";

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
