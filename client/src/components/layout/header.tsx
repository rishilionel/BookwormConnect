import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/use-cart';
import { RiFireFill, RiMenuLine, RiSearchLine, RiUserLine, RiHeartLine, RiShoppingCartLine } from 'react-icons/ri';
import { Separator } from '@/components/ui/separator';

export function Header() {
  const { cartCount, toggleCart } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className={`bg-white sticky top-0 z-50 transition-shadow duration-300 ${scrolled ? 'shadow-md' : ''}`}>
      <div className="container mx-auto px-4">
        <div className="py-3 flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center justify-between">
            <Link href="/">
              <a className="flex items-center">
                <RiFireFill className="text-primary text-3xl mr-2" />
                <h1 className="font-heading font-bold text-2xl text-primary">Diwali<span className="text-accent">Delights</span></h1>
              </a>
            </Link>
            <button 
              className="md:hidden text-neutral-dark"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              <RiMenuLine className="text-2xl" />
            </button>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6 font-heading">
            <Link href="/">
              <a className="text-neutral-dark hover:text-primary font-medium">Home</a>
            </Link>
            <Link href="/products">
              <a className="text-neutral-dark hover:text-primary font-medium">Shop</a>
            </Link>
            <Link href="/products?sale=true">
              <a className="text-neutral-dark hover:text-primary font-medium">Offers</a>
            </Link>
            <Link href="/">
              <a className="text-neutral-dark hover:text-primary font-medium">About</a>
            </Link>
            <Link href="/">
              <a className="text-neutral-dark hover:text-primary font-medium">Contact</a>
            </Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder="Search products..."
                className="py-2 px-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50 w-full md:w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button 
                type="submit"
                variant="ghost" 
                className="absolute right-3 top-2.5 text-gray-500 hover:text-primary"
                size="icon"
              >
                <RiSearchLine />
              </Button>
            </form>
            
            <Button variant="ghost" className="relative text-neutral-dark hover:text-primary">
              <RiUserLine className="text-xl" />
            </Button>
            
            <Button variant="ghost" className="relative text-neutral-dark hover:text-primary">
              <RiHeartLine className="text-xl" />
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">2</span>
            </Button>
            
            <Button 
              variant="ghost" 
              className="relative text-neutral-dark hover:text-primary"
              onClick={toggleCart}
            >
              <RiShoppingCartLine className="text-xl" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <nav className="py-4 border-t border-gray-200 font-heading">
              <Link href="/">
                <a className="block py-2 text-neutral-dark hover:text-primary">Home</a>
              </Link>
              <Link href="/products">
                <a className="block py-2 text-neutral-dark hover:text-primary">Shop</a>
              </Link>
              <Link href="/products?sale=true">
                <a className="block py-2 text-neutral-dark hover:text-primary">Offers</a>
              </Link>
              <Link href="/">
                <a className="block py-2 text-neutral-dark hover:text-primary">About</a>
              </Link>
              <Link href="/">
                <a className="block py-2 text-neutral-dark hover:text-primary">Contact</a>
              </Link>
            </nav>
            
            <div className="py-4 border-t border-gray-200">
              <form onSubmit={handleSearch} className="relative mb-4">
                <Input
                  type="text"
                  placeholder="Search products..."
                  className="py-2 px-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button 
                  type="submit"
                  variant="ghost" 
                  className="absolute right-3 top-2.5 text-gray-500 hover:text-primary"
                  size="icon"
                >
                  <RiSearchLine />
                </Button>
              </form>
              
              <div className="flex justify-around">
                <Button variant="ghost" className="text-neutral-dark hover:text-primary flex flex-col items-center">
                  <RiUserLine className="text-xl" />
                  <span className="text-xs mt-1">Account</span>
                </Button>
                
                <Button variant="ghost" className="text-neutral-dark hover:text-primary flex flex-col items-center">
                  <div className="relative">
                    <RiHeartLine className="text-xl" />
                    <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">2</span>
                  </div>
                  <span className="text-xs mt-1">Wishlist</span>
                </Button>
                
                <Button 
                  variant="ghost" 
                  className="text-neutral-dark hover:text-primary flex flex-col items-center"
                  onClick={toggleCart}
                >
                  <div className="relative">
                    <RiShoppingCartLine className="text-xl" />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </div>
                  <span className="text-xs mt-1">Cart</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      {mobileMenuOpen && <Separator />}
    </header>
  );
}
