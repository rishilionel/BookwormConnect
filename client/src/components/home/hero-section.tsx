import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  return (
    <section className="relative">
      <div className="w-full h-[60vh] md:h-[70vh] overflow-hidden relative">
        <img 
          src="https://images.unsplash.com/photo-1604422744102-3b0c4e44b873?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80" 
          alt="Diwali celebration with diyas and decorations" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <h1 className="font-heading font-bold text-3xl md:text-5xl text-white mb-4">Celebrate Diwali with Joy & Light</h1>
          <p className="text-white text-lg md:text-xl max-w-2xl mb-8">Discover our exclusive collection of traditional diyas, decorations, and gifts for the festival of lights</p>
          <div className="flex flex-col md:flex-row gap-4">
            <Link href="/products">
              <a className="bg-primary hover:bg-primary-dark text-white font-medium py-3 px-6 rounded-full transition duration-300 shadow-lg">
                Shop Collection
              </a>
            </Link>
            <Link href="/products?sale=true">
              <a className="bg-transparent border-2 border-white hover:bg-white hover:text-primary text-white font-medium py-3 px-6 rounded-full transition duration-300">
                Special Offers
              </a>
            </Link>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  );
}
