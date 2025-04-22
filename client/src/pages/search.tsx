import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Product } from '@shared/schema';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CartDrawer } from '@/components/cart/cart-drawer';
import { ProductCard } from '@/components/product/product-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { RiSearchLine } from 'react-icons/ri';
import { useQueryParams } from '@/hooks/use-query';

export default function Search() {
  const [location, setLocation] = useLocation();
  const queryParams = useQueryParams();
  const searchQuery = queryParams.get('q') || '';
  const [searchInput, setSearchInput] = useState(searchQuery);

  // Fetch search results
  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: [`/api/products/search/${encodeURIComponent(searchQuery)}`],
    enabled: searchQuery.length > 0,
  });

  // Reset search input when query param changes
  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setLocation(`/search?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-heading font-bold text-3xl mb-4">
            {searchQuery ? `Search Results: "${searchQuery}"` : 'Search Products'}
          </h1>
          
          <form onSubmit={handleSearch} className="flex max-w-2xl gap-2 mb-8">
            <Input
              type="text"
              placeholder="Search for diyas, decorations, gifts..."
              className="flex-grow"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <Button type="submit" className="bg-primary hover:bg-primary-dark text-white">
              <RiSearchLine className="mr-2" /> Search
            </Button>
          </form>
        </div>

        {!searchQuery ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="font-heading font-semibold text-xl mb-4">Looking for something specific?</h2>
            <p className="text-neutral-gray mb-4">Search for Diwali decorations, lights, gifts and more.</p>
            <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto mt-8">
              <Button 
                variant="outline" 
                className="p-6 h-auto text-lg hover:bg-background"
                onClick={() => setLocation('/products/category/diyas-candles')}
              >
                Browse Diyas & Candles
              </Button>
              <Button 
                variant="outline" 
                className="p-6 h-auto text-lg hover:bg-background"
                onClick={() => setLocation('/products/category/rangoli-colors')}
              >
                Browse Rangoli & Colors
              </Button>
              <Button 
                variant="outline" 
                className="p-6 h-auto text-lg hover:bg-background"
                onClick={() => setLocation('/products/category/home-decorations')}
              >
                Browse Home Decorations
              </Button>
              <Button 
                variant="outline" 
                className="p-6 h-auto text-lg hover:bg-background"
                onClick={() => setLocation('/products/category/gift-boxes')}
              >
                Browse Gift Boxes
              </Button>
            </div>
          </div>
        ) : error ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-red-500 mb-4">Failed to fetch search results. Please try again.</p>
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array(4).fill(0).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                <Skeleton className="h-60 w-full" />
                <div className="p-4">
                  <Skeleton className="h-6 w-5/6 mb-2" />
                  <Skeleton className="h-4 w-1/3 mb-2" />
                  <Skeleton className="h-5 w-1/4 mb-4" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : products && products.length > 0 ? (
          <>
            <p className="mb-6 text-neutral-gray">Found {products.length} results for "{searchQuery}"</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
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
              ))}
            </div>
          </>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="font-heading font-semibold text-xl mb-4">No results found</h2>
            <p className="text-neutral-gray mb-6">
              We couldn't find any products matching "{searchQuery}". Try using different keywords or browse our categories.
            </p>
            <Button 
              className="bg-primary hover:bg-primary-dark text-white"
              onClick={() => setLocation('/products')}
            >
              Browse All Products
            </Button>
          </div>
        )}
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
