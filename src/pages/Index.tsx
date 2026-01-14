import { PromoBanner } from '@/components/PromoBanner';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { TrustBadges } from '@/components/TrustBadges';
import { FeaturedCarousel } from '@/components/FeaturedCarousel';
import { LocalProducts } from '@/components/LocalProducts';
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
        <FeaturedCarousel />
        <LocalProducts />
        <CategoryShowcase />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
