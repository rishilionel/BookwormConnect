import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CheckoutForm } from '@/components/checkout/checkout-form';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

export default function Checkout() {
  const { items } = useCart();

  // Redirect if cart is empty
  if (items.length === 0) {
    return (
      <>
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="font-heading font-semibold text-2xl mb-4">Your cart is empty</h2>
            <p className="text-neutral-gray mb-6">You need to add items to your cart before checkout.</p>
            <Link href="/products">
              <Button className="bg-primary hover:bg-primary-dark text-white py-3 px-6 rounded-lg">
                Browse Products
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="font-heading font-bold text-3xl mb-2">Checkout</h1>
          <p className="text-neutral-gray">Complete your order by providing your shipping and payment details.</p>
        </div>
        
        <CheckoutForm />
      </main>
      <Footer />
    </>
  );
}
