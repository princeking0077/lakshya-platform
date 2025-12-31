import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import FeatureSection from '@/components/FeatureSection';
import CourseSection from '@/components/CourseSection';
import FAQSection from '@/components/FAQSection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-purple-500 selection:text-white">
      <HeroSection />
      <FeatureSection />
      <CourseSection />
      <FAQSection />
      <Footer />
    </main>
  );
}
