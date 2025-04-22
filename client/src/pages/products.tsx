import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation, useRoute } from 'wouter';
import { Product } from '@shared/schema';
import { ProductCard } from '@/components/product/product-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { CartDrawer } from '@/components/cart/cart-drawer';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

type FilterState = {
  minPrice: number;
  maxPrice: number;
  categoryIds: number[];
  sale: boolean;
};

export default function Products() {
  const [_, params] = useRoute('/products/category/:slug');
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split('?')[1]);
  const isSalePage = searchParams.get('sale') === 'true';

  // Initialize with all products query or category-specific products
  const queryEndpoint = params 
    ? `/api/products/category/${params.slug}` 
    : '/api/products';

  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: [queryEndpoint],
  });

  // Filter states
  const [filters, setFilters] = useState<FilterState>({
    minPrice: 0,
    maxPrice: 2000,
    categoryIds: [],
    sale: isSalePage,
  });
  
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);

  // Apply filters whenever products or filter state changes
  useEffect(() => {
    if (!products) return;
    
    let filtered = [...products];
    
    // Filter by price
    filtered = filtered.filter(product => {
      const price = parseFloat(product.price);
      return price >= filters.minPrice && price <= filters.maxPrice;
    });
    
    // Filter by category if not already filtered by route
    if (!params && filters.categoryIds.length > 0) {
      filtered = filtered.filter(product => 
        filters.categoryIds.includes(product.categoryId)
      );
    }
    
    // Filter sale items
    if (filters.sale) {
      filtered = filtered.filter(product => product.compareAtPrice !== null);
    }
    
    setFilteredProducts(filtered);
  }, [products, filters, params]);

  // Get unique categories from products
  const categories = products ? Array.from(
    new Set(products.map(product => product.categoryId))
  ).map(id => {
    return {
      id,
      name: getCategoryName(id) || `Category ${id}`
    };
  }) : [];
  
  // Helper function to get category name
  function getCategoryName(id: number): string | undefined {
    const categoryMap: Record<number, string> = {
      1: 'Diyas & Candles',
      2: 'Rangoli & Colors',
      3: 'Home Decorations',
      4: 'Gift Boxes'
    };
    return categoryMap[id];
  }

  // Handle price range change
  const handlePriceChange = (value: number[]) => {
    setPriceRange(value as [number, number]);
  };
  
  // Apply price filter when user stops dragging
  const handlePriceChangeCommitted = () => {
    setFilters({
      ...filters,
      minPrice: priceRange[0],
      maxPrice: priceRange[1]
    });
  };
  
  // Toggle category filter
  const toggleCategory = (categoryId: number) => {
    setFilters(prev => {
      const categoryIds = prev.categoryIds.includes(categoryId)
        ? prev.categoryIds.filter(id => id !== categoryId)
        : [...prev.categoryIds, categoryId];
      
      return { ...prev, categoryIds };
    });
  };
  
  // Toggle sale filter
  const toggleSale = () => {
    setFilters(prev => ({ ...prev, sale: !prev.sale }));
  };
  
  // Clear all filters
  const clearFilters = () => {
    setFilters({
      minPrice: 0,
      maxPrice: 2000,
      categoryIds: [],
      sale: false
    });
    setPriceRange([0, 2000]);
  };

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-heading font-bold text-3xl mb-2">
            {params 
              ? `${getCategoryName(params.slug)}`
              : isSalePage
                ? 'Special Offers'
                : 'All Products'
            }
          </h1>
          <p className="text-neutral-gray">
            {params 
              ? `Browse our selection of ${getCategoryName(params.slug)}`
              : isSalePage
                ? 'Great deals on our festive collection'
                : 'Shop our complete Diwali collection'
            }
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-heading font-semibold text-lg">Filters</h2>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={clearFilters}
                >
                  Clear All
                </Button>
              </div>
              
              {/* Price Range Filter */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Price Range</h3>
                <Slider
                  value={priceRange}
                  min={0}
                  max={2000}
                  step={50}
                  onValueChange={handlePriceChange}
                  onValueCommit={handlePriceChangeCommitted}
                  className="mb-2"
                />
                <div className="flex justify-between text-sm">
                  <span>₹{priceRange[0]}</span>
                  <span>₹{priceRange[1]}</span>
                </div>
              </div>
              
              {/* Categories Filter (only if not already filtered by route) */}
              {!params && categories.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-medium mb-3">Categories</h3>
                  <div className="space-y-2">
                    {categories.map(category => (
                      <div key={category.id} className="flex items-center">
                        <Checkbox 
                          id={`category-${category.id}`}
                          checked={filters.categoryIds.includes(category.id)}
                          onCheckedChange={() => toggleCategory(category.id)}
                        />
                        <Label 
                          htmlFor={`category-${category.id}`}
                          className="ml-2 text-sm cursor-pointer"
                        >
                          {category.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Sale Items Filter */}
              <div>
                <div className="flex items-center">
                  <Checkbox 
                    id="sale-items"
                    checked={filters.sale}
                    onCheckedChange={toggleSale}
                  />
                  <Label 
                    htmlFor="sale-items"
                    className="ml-2 text-sm cursor-pointer"
                  >
                    Sale Items Only
                  </Label>
                </div>
              </div>
            </div>
          </div>
          
          {/* Products grid */}
          <div className="lg:col-span-3">
            {error ? (
              <div className="text-center p-8 bg-white rounded-lg shadow-md">
                <p className="text-red-500">Failed to load products. Please try again later.</p>
              </div>
            ) : isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array(6).fill(0).map((_, index) => (
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
            ) : filteredProducts.length === 0 ? (
              <div className="text-center p-8 bg-white rounded-lg shadow-md">
                <p>No products match your filters. Try adjusting your selections.</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={clearFilters}
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
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
            )}
          </div>
        </div>
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
