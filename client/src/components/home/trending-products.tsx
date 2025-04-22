import { useQuery } from '@tanstack/react-query';
import { Product } from '@shared/schema';
import { ProductCard } from '@/components/product/product-card';
import { Skeleton } from '@/components/ui/skeleton';

export function TrendingProducts() {
  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: ['/api/trending-products'],
  });

  return (
    <section className="py-12 px-4 bg-background">
      <div className="container mx-auto">
        <div className="text-center mb-10">
          <h2 className="font-heading font-bold text-3xl text-neutral-dark mb-2">Trending Products</h2>
          <p className="text-neutral-gray">Most popular items this festive season</p>
        </div>
        
        {error ? (
          <div className="text-center p-8">
            <p className="text-red-500">Failed to load trending products. Please try again later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              // Loading skeleton
              Array(3).fill(0).map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="md:flex">
                    <div className="md:w-2/5">
                      <Skeleton className="h-48 md:h-full w-full" />
                    </div>
                    <div className="p-4 md:w-3/5">
                      <Skeleton className="h-6 w-5/6 mb-2" />
                      <Skeleton className="h-4 w-1/3 mb-2" />
                      <Skeleton className="h-5 w-1/4 mb-4" />
                      <Skeleton className="h-10 w-full" />
                    </div>
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
                  horizontal={true}
                />
              ))
            )}
          </div>
        )}
      </div>
    </section>
  );
}
