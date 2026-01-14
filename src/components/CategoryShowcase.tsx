import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

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
  {
    name: 'Home',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop',
    description: 'Beautiful home essentials',
  },
  {
    name: 'Sports',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop',
    description: 'Gear for active lifestyles',
  },
];

export function CategoryShowcase() {
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

        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
          {showcaseCategories.map((category, index) => (
            <Link
              key={category.name}
              to={`/category/${encodeURIComponent(category.name)}`}
              className="group relative overflow-hidden aspect-[3/4] md:aspect-[3/4] animate-fade-in rounded-lg"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <img
                src={category.image}
                alt={category.name}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-left">
                <h3 className="text-lg font-bold text-foreground mb-1">{category.name}</h3>
                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{category.description}</p>
                <span className="inline-flex items-center text-sm font-medium text-accent group-hover:gap-2 transition-all">
                  Explore
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
