import { PromoBanner } from '@/components/PromoBanner';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { TrustBadges } from '@/components/TrustBadges';
import { FeaturedCarousel } from '@/components/FeaturedCarousel';
import { LocalProducts } from '@/components/LocalProducts';
import { CategoryShowcase } from '@/components/CategoryShowcase';
import { Footer } from '@/components/Footer';
import { ProductComparison } from '@/components/ProductComparison';
import { CompareFloatingBar } from '@/components/CompareFloatingBar';

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
      <CompareFloatingBar />
      <ProductComparison />
    </div>
  );
};

export default Index;
