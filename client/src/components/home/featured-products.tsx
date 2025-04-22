import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Product } from '@shared/schema';
import { ProductCard } from '@/components/product/product-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

export function FeaturedProducts() {
  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: ['/api/featured-products'],
  });

  return (
    <section className="py-12 px-4 diya-pattern">
      <div className="container mx-auto">
        <div className="text-center mb-10">
          <h2 className="font-heading font-bold text-3xl text-neutral-dark mb-2">Featured Products</h2>
          <p className="text-neutral-gray">Our most popular items for this Diwali season</p>
        </div>
        
        {error ? (
          <div className="text-center p-8">
            <p className="text-red-500">Failed to load products. Please try again later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {isLoading ? (
              // Loading skeleton
              Array(4).fill(0).map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <Skeleton className="h-60 w-full" />
                  <div className="p-4">
                    <Skeleton className="h-6 w-5/6 mb-2" />
                    <Skeleton className="h-4 w-1/3 mb-2" />
                    <Skeleton className="h-5 w-1/4 mb-4" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              ))
            ) : (
              products?.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  slug={product.slug}
                  price={product.price}
                  compareAtPrice={product.compareAtPrice}
                  imageUrl={product.imageUrl}
                  badge={product.badge}
                  rating={product.rating}
                  reviewCount={product.reviewCount}
                />
              ))
            )}
          </div>
        )}
        
        <div className="text-center mt-10">
          <Link href="/products">
            <Button variant="outline" className="inline-block border border-primary text-primary hover:bg-primary hover:text-white font-medium py-2 px-6 rounded-full transition duration-300">
              View All Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
