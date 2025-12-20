import HeroSection from '@/components/HeroSection';
import CourseSection from '@/components/CourseSection';
import FeatureSection from '@/components/FeatureSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-purple-500 selection:text-white">
      <HeroSection />
      <CourseSection />
      <HowItWorksSection />
      <FeatureSection />
      <TestimonialsSection />
      <Footer />
    </main>
  );
}
