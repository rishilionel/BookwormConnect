import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CartDrawer } from '@/components/cart/cart-drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/hooks/use-cart';
import { Link } from 'wouter';
import { RiDeleteBinLine, RiArrowLeftLine } from 'react-icons/ri';

export default function Cart() {
  const { 
    items, 
    updateQuantity, 
    removeItem, 
    subtotal,
    shipping,
    total,
    isLoading
  } = useCart();

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <h1 className="font-heading font-bold text-3xl mb-2">Shopping Cart</h1>
          </div>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
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
          <h1 className="font-heading font-bold text-3xl mb-2">Shopping Cart</h1>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="font-heading font-semibold text-2xl mb-4">Your cart is empty</h2>
            <p className="text-neutral-gray mb-6">Looks like you haven't added any items to your cart yet.</p>
            <Link href="/products">
              <Button className="bg-primary hover:bg-primary-dark text-white py-3 px-6 rounded-lg">
                Continue Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left pb-4">Product</th>
                          <th className="text-center pb-4">Price</th>
                          <th className="text-center pb-4">Quantity</th>
                          <th className="text-right pb-4">Total</th>
                          <th className="text-right pb-4 w-10"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item) => (
                          <tr key={item.id} className="border-b">
                            <td className="py-4">
                              <div className="flex items-center">
                                <div className="w-16 h-16 rounded overflow-hidden">
                                  {item.product?.imageUrl && (
                                    <img 
                                      src={item.product.imageUrl} 
                                      alt={item.product.name} 
                                      className="w-full h-full object-cover"
                                    />
                                  )}
                                </div>
                                <div className="ml-4">
                                  <Link href={`/product/${item.product?.slug}`}>
                                    <a className="font-medium hover:text-primary">
                                      {item.product?.name}
                                    </a>
                                  </Link>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 text-center">
                              ₹{parseFloat(item.product?.price || "0").toFixed(2)}
                            </td>
                            <td className="py-4 text-center">
                              <div className="flex items-center justify-center">
                                <div className="flex items-center border rounded">
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="px-2 py-1 text-neutral-gray hover:text-primary"
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  >
                                    -
                                  </Button>
                                  <span className="px-2">{item.quantity}</span>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="px-2 py-1 text-neutral-gray hover:text-primary"
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  >
                                    +
                                  </Button>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 text-right font-medium">
                              ₹{(parseFloat(item.product?.price || "0") * item.quantity).toFixed(2)}
                            </td>
                            <td className="py-4 text-right">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-neutral-gray hover:text-destructive"
                                onClick={() => removeItem(item.id)}
                              >
                                <RiDeleteBinLine />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-between">
                <Link href="/products">
                  <Button variant="outline" className="flex items-center gap-2">
                    <RiArrowLeftLine /> Continue Shopping
                  </Button>
                </Link>
                
                <div className="bg-white rounded-lg shadow-md p-4">
                  <div className="flex items-center gap-2">
                    <Input placeholder="Coupon code" className="min-w-[200px]" />
                    <Button variant="outline">Apply</Button>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="font-heading font-semibold text-xl mb-6">Order Summary</h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-neutral-gray">Subtotal ({items.reduce((total, item) => total + item.quantity, 0)} items)</span>
                    <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-gray">Shipping</span>
                    <span className="font-medium">
                      {shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  
                  <Separator className="my-3" />
                  
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-primary">₹{total.toFixed(2)}</span>
                  </div>
                  
                  <div className="text-xs text-neutral-gray mb-6">
                    * Taxes are calculated at checkout
                  </div>
                </div>
                
                <Link href="/checkout">
                  <Button className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded transition duration-300">
                    Proceed to Checkout
                  </Button>
                </Link>
                
                <div className="mt-6">
                  <h3 className="font-medium mb-2">We Accept</h3>
                  <div className="flex space-x-2 text-neutral-gray">
                    <span className="text-xl">Visa</span>
                    <span className="text-xl">MC</span>
                    <span className="text-xl">PayPal</span>
                    <span className="text-xl">Amazon</span>
                    <span className="text-xl">GPay</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
