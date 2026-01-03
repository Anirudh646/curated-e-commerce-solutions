import { ArrowRight } from 'lucide-react';
import { useStore } from '@/lib/store';

const showcaseCategories = [
  {
    name: 'Electronics',
    image: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=600&h=400&fit=crop',
    description: 'Premium tech for modern living',
  },
  {
    name: 'Fashion',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&h=400&fit=crop',
    description: 'Curated style essentials',
  },
  {
    name: 'Accessories',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=400&fit=crop',
    description: 'Finishing touches that matter',
  },
];

export function CategoryShowcase() {
  const { setSelectedCategory } = useStore();

  return (
    <section className="py-16 md:py-24 bg-secondary/30">
      <div className="container">
        <div className="text-center mb-12">
          <span className="text-sm font-medium text-accent uppercase tracking-wider">
            Browse by Category
          </span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
            Shop by Category
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {showcaseCategories.map((category, index) => (
            <button
              key={category.name}
              onClick={() => setSelectedCategory(category.name)}
              className="group relative overflow-hidden aspect-[3/2] animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <img
                src={category.image}
                alt={category.name}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-left">
                <h3 className="text-xl font-bold text-foreground mb-1">{category.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{category.description}</p>
                <span className="inline-flex items-center text-sm font-medium text-accent group-hover:gap-2 transition-all">
                  Explore
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
