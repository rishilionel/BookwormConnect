import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import { RiEyeLine, RiHeartLine, RiShoppingCartLine, RiStarFill, RiStarHalfFill, RiStarLine } from 'react-icons/ri';

export interface ProductCardProps {
  id: number;
  name: string;
  slug: string;
  price: string;
  compareAtPrice?: string | null;
  imageUrl: string;
  badge?: string | null;
  rating?: string | null;
  reviewCount?: number;
  isFeatured?: boolean;
  horizontal?: boolean;
}

export function ProductCard({ 
  id, 
  name, 
  slug, 
  price, 
  compareAtPrice, 
  imageUrl, 
  badge, 
  rating = "0", 
  reviewCount = 0,
  horizontal = false
}: ProductCardProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAdding(true);
    try {
      await addItem(id);
      toast({
        title: "Added to cart",
        description: `${name} has been added to your cart`,
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
  const renderStars = () => {
    const ratingNum = parseFloat(rating);
    const fullStars = Math.floor(ratingNum);
    const hasHalfStar = ratingNum - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <div className="flex text-secondary mt-1">
        {[...Array(fullStars)].map((_, i) => (
          <RiStarFill key={`full-${i}`} />
        ))}
        {hasHalfStar && <RiStarHalfFill />}
        {[...Array(emptyStars)].map((_, i) => (
          <RiStarLine key={`empty-${i}`} />
        ))}
        <span className="text-neutral-gray text-sm ml-1">({reviewCount})</span>
      </div>
    );
  };

  if (horizontal) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden rangoli-card transition-all duration-300">
        <div className="md:flex">
          <div className="md:w-2/5">
            <Link href={`/product/${slug}`}>
              <a className="block h-48 md:h-full overflow-hidden">
                <img 
                  src={imageUrl}
                  alt={name} 
                  className="w-full h-full object-cover"
                />
              </a>
            </Link>
          </div>
          <div className="p-4 md:w-3/5">
            <Link href={`/product/${slug}`}>
              <a>
                <h3 className="font-heading font-medium text-lg text-neutral-dark">{name}</h3>
              </a>
            </Link>
            {renderStars()}
            <div className="mt-2 flex items-baseline">
              <span className="text-primary font-heading font-semibold text-xl">₹{price}</span>
              {compareAtPrice && (
                <span className="text-neutral-gray line-through ml-2 text-sm">₹{compareAtPrice}</span>
              )}
            </div>
            <Button 
              className="mt-3 w-full bg-primary hover:bg-primary-dark text-white font-medium py-2 rounded transition duration-300"
              onClick={handleAddToCart}
              disabled={isAdding}
            >
              {isAdding ? 'Adding...' : 'Add to Cart'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden rangoli-card transition-all duration-300"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="relative h-60">
        <Link href={`/product/${slug}`}>
          <a>
            <img 
              src={imageUrl}
              alt={name} 
              className="w-full h-full object-cover"
            />
            {badge && (
              <span className="sale-badge">{badge}</span>
            )}
            {isHovering && (
              <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-20 flex items-center justify-center transition-opacity duration-300">
                <div className="flex space-x-2">
                  <Link href={`/product/${slug}`}>
                    <a className="bg-white p-2 rounded-full hover:bg-primary hover:text-white transition duration-300">
                      <RiEyeLine />
                    </a>
                  </Link>
                  <button className="bg-white p-2 rounded-full hover:bg-primary hover:text-white transition duration-300">
                    <RiHeartLine />
                  </button>
                  <button 
                    className="bg-white p-2 rounded-full hover:bg-primary hover:text-white transition duration-300"
                    onClick={handleAddToCart}
                    disabled={isAdding}
                  >
                    <RiShoppingCartLine />
                  </button>
                </div>
              </div>
            )}
          </a>
        </Link>
      </div>
      <div className="p-4">
        <Link href={`/product/${slug}`}>
          <a>
            <h3 className="font-heading font-medium text-lg text-neutral-dark">{name}</h3>
          </a>
        </Link>
        {renderStars()}
        <div className="mt-2 flex items-baseline">
          <span className="text-primary font-heading font-semibold text-xl">₹{price}</span>
          {compareAtPrice && (
            <span className="text-neutral-gray line-through ml-2 text-sm">₹{compareAtPrice}</span>
          )}
        </div>
        <Button 
          className="mt-3 w-full bg-primary hover:bg-primary-dark text-white font-medium py-2 rounded transition duration-300"
          onClick={handleAddToCart}
          disabled={isAdding}
        >
          {isAdding ? 'Adding...' : 'Add to Cart'}
        </Button>
      </div>
    </div>
  );
}
