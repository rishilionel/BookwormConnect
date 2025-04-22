import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRoute } from 'wouter';
import { Product } from '@shared/schema';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CartDrawer } from '@/components/cart/cart-drawer';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import { RiShoppingCartLine, RiHeartLine, RiShareLine, RiStarFill, RiStarHalfFill, RiStarLine, RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';
import { Link } from 'wouter';
import { useQueryParams } from '@/hooks/use-query';

export default function ProductDetail() {
  const [_, params] = useRoute('/product/:slug');
  const { toast } = useToast();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const queryParams = useQueryParams();
  const categorySlug = queryParams.get('category');

  // Fetch product details
  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: [`/api/products/${params?.slug}`],
    enabled: !!params?.slug,
  });

  const handleQuantityChange = (newQty: number) => {
    if (newQty > 0 && newQty <= (product?.stock || 10)) {
      setQuantity(newQty);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    setIsAdding(true);
    try {
      await addItem(product.id, quantity);
      toast({
        title: "Added to cart",
        description: `${quantity} x ${product.name} added to your cart`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not add item to cart",
        variant: "destructive",
      });
    } finally {
      setIsAdding(false);
    }
  };

  // Render stars based on rating
  const renderStars = (rating: string) => {
    const ratingNum = parseFloat(rating);
    const fullStars = Math.floor(ratingNum);
    const hasHalfStar = ratingNum - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <div className="flex text-secondary">
        {[...Array(fullStars)].map((_, i) => (
          <RiStarFill key={`full-${i}`} />
        ))}
        {hasHalfStar && <RiStarHalfFill />}
        {[...Array(emptyStars)].map((_, i) => (
          <RiStarLine key={`empty-${i}`} />
        ))}
      </div>
    );
  };

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-4">
          <div className="flex items-center text-sm mb-2">
            <Link href="/">
              <a className="text-neutral-gray hover:text-primary">Home</a>
            </Link>
            <span className="mx-2 text-neutral-gray">•</span>
            {categorySlug ? (
              <>
                <Link href={`/products/category/${categorySlug}`}>
                  <a className="text-neutral-gray hover:text-primary capitalize">
                    {categorySlug.replace(/-/g, ' ')}
                  </a>
                </Link>
                <span className="mx-2 text-neutral-gray">•</span>
              </>
            ) : (
              <>
                <Link href="/products">
                  <a className="text-neutral-gray hover:text-primary">Products</a>
                </Link>
                <span className="mx-2 text-neutral-gray">•</span>
              </>
            )}
            <span className="text-neutral-dark font-medium truncate">
              {isLoading ? <Skeleton className="h-4 w-20" /> : product?.name}
            </span>
          </div>
        </div>

        {error ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-lg text-red-500 mb-4">Sorry, we couldn't find this product.</p>
            <Link href="/products">
              <Button>View All Products</Button>
            </Link>
          </div>
        ) : isLoading ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="grid md:grid-cols-2 gap-8">
              <Skeleton className="aspect-square rounded-lg" />
              <div className="space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-4 w-2/3" />
                <div className="space-y-2 py-4">
                  <Skeleton className="h-24 w-full" />
                </div>
                <div className="pt-4 space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="grid md:grid-cols-2 gap-8 p-6">
              <div className="relative">
                {product.badge && (
                  <span className="sale-badge">{product.badge}</span>
                )}
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="w-full h-auto object-cover rounded-lg"
                />
                <div className="absolute bottom-4 right-4 flex space-x-2">
                  <button className="bg-white p-2 rounded-full shadow-md hover:bg-primary hover:text-white transition duration-300">
                    <RiArrowLeftSLine />
                  </button>
                  <button className="bg-white p-2 rounded-full shadow-md hover:bg-primary hover:text-white transition duration-300">
                    <RiArrowRightSLine />
                  </button>
                </div>
              </div>
              
              <div>
                <h1 className="font-heading font-bold text-2xl md:text-3xl text-neutral-dark mb-2">
                  {product.name}
                </h1>
                
                <div className="flex items-center mb-4">
                  {renderStars(product.rating || '0')}
                  <span className="text-neutral-gray text-sm ml-2">({product.reviewCount} Reviews)</span>
                </div>
                
                <div className="flex items-baseline mb-6">
                  <span className="text-primary font-heading font-semibold text-3xl">₹{product.price}</span>
                  {product.compareAtPrice && (
                    <span className="text-neutral-gray line-through ml-3 text-lg">₹{product.compareAtPrice}</span>
                  )}
                  {product.compareAtPrice && (
                    <span className="ml-3 bg-primary/10 text-primary px-2 py-0.5 rounded text-sm font-medium">
                      {Math.round((1 - parseFloat(product.price) / parseFloat(product.compareAtPrice)) * 100)}% OFF
                    </span>
                  )}
                </div>
                
                <div className="border-t border-b py-4 my-6">
                  <p className="text-neutral-gray">
                    {product.description}
                  </p>
                </div>
                
                <div className="mb-6">
                  <p className="text-sm mb-2">
                    <span className="font-medium">Availability:</span>{' '}
                    {product.stock > 0 ? (
                      <span className="text-success">In Stock ({product.stock} items)</span>
                    ) : (
                      <span className="text-destructive">Out of Stock</span>
                    )}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Category:</span>{' '}
                    <Link href={`/products/category/${categorySlug || 'home-decorations'}`}>
                      <a className="text-primary hover:underline capitalize">
                        {categorySlug ? categorySlug.replace(/-/g, ' ') : 'Home Decorations'}
                      </a>
                    </Link>
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <span className="mr-4 font-medium">Quantity:</span>
                    <div className="flex items-center border rounded">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="px-3 py-1 text-neutral-gray hover:text-primary"
                        onClick={() => handleQuantityChange(quantity - 1)}
                        disabled={quantity <= 1}
                      >
                        -
                      </Button>
                      <span className="px-4">{quantity}</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="px-3 py-1 text-neutral-gray hover:text-primary"
                        onClick={() => handleQuantityChange(quantity + 1)}
                        disabled={quantity >= (product.stock || 10)}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button 
                      className="flex-1 bg-primary hover:bg-primary-dark text-white py-3 px-6 rounded-lg flex items-center justify-center gap-2"
                      onClick={handleAddToCart}
                      disabled={isAdding || product.stock <= 0}
                    >
                      <RiShoppingCartLine />
                      {isAdding ? 'Adding...' : 'Add to Cart'}
                    </Button>
                    
                    <Button variant="outline" className="flex-none py-3 px-6 rounded-lg">
                      <RiHeartLine className="mr-2" />
                      Wishlist
                    </Button>
                    
                    <Button variant="outline" className="flex-none py-3 px-6 rounded-lg">
                      <RiShareLine className="mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Related Products would go here */}
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
