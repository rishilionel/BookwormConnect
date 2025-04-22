import { HeroSection } from '@/components/home/hero-section';
import { CategoriesSection } from '@/components/home/categories-section';
import { FeaturedProducts } from '@/components/home/featured-products';
import { SpecialOffer } from '@/components/home/special-offer';
import { TrendingProducts } from '@/components/home/trending-products';
import { Testimonials } from '@/components/home/testimonials';
import { NewsletterSignup } from '@/components/home/newsletter-signup';
import { CartDrawer } from '@/components/cart/cart-drawer';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <CategoriesSection />
        <FeaturedProducts />
        <SpecialOffer />
        <TrendingProducts />
        <Testimonials />
        <NewsletterSignup />
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
