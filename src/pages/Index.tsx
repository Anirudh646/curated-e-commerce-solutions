import { PromoBanner } from '@/components/PromoBanner';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { TrustBadges } from '@/components/TrustBadges';
import { FeaturedProducts } from '@/components/FeaturedProducts';
import { CategoryShowcase } from '@/components/CategoryShowcase';
import { Footer } from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <PromoBanner />
      <Header />
      <main>
        <HeroSection />
        <TrustBadges />
        <FeaturedProducts />
        <CategoryShowcase />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
