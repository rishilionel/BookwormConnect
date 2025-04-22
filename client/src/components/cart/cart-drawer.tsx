import { useEffect } from 'react';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { Separator } from '@/components/ui/separator';
import { RiCloseLine, RiDeleteBinLine } from 'react-icons/ri';

export function CartDrawer() {
  const { 
    items, 
    isOpen, 
    isLoading, 
    closeCart, 
    updateQuantity, 
    removeItem, 
    subtotal,
    shipping,
    total
  } = useCart();

  // Prevent body scroll when cart is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={closeCart} />
      
      <div className="fixed top-0 right-0 h-full w-full md:w-96 bg-white shadow-2xl z-50 flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-heading font-semibold text-xl">
            Your Cart ({items.length > 0 ? items.reduce((total, item) => total + item.quantity, 0) : 0})
          </h3>
          <Button variant="ghost" size="icon" onClick={closeCart} className="text-neutral-gray hover:text-primary">
            <RiCloseLine className="text-2xl" />
          </Button>
        </div>
        
        <div className="flex-grow overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-center">
              <p className="text-lg mb-4">Your cart is empty</p>
              <Button variant="outline" onClick={closeCart}>
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex border-b border-gray-200 pb-4">
                  <div className="w-20 h-20 rounded overflow-hidden">
                    {item.product?.imageUrl && (
                      <img 
                        src={item.product.imageUrl} 
                        alt={item.product.name} 
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="ml-4 flex-grow">
                    <div className="flex justify-between">
                      <h4 className="font-medium">{item.product?.name}</h4>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-neutral-gray hover:text-destructive"
                        onClick={() => removeItem(item.id)}
                      >
                        <RiDeleteBinLine />
                      </Button>
                    </div>
                    <p className="text-sm text-neutral-gray">
                      {/* Product variant or details would go here */}
                    </p>
                    <div className="flex justify-between items-center mt-2">
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
                      <span className="font-medium text-primary">
                        ₹{(parseFloat(item.product?.price || "0") * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {items.length > 0 && (
          <div className="p-4 border-t">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-neutral-gray">Subtotal</span>
                <span className="font-medium">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-gray">Shipping</span>
                <span className="font-medium">
                  {shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}
                </span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-primary">₹{total.toFixed(2)}</span>
              </div>
            </div>
            
            <Link href="/checkout">
              <a className="block bg-primary hover:bg-primary-dark text-white font-medium text-center py-3 rounded transition duration-300 mb-2">
                Checkout
              </a>
            </Link>
            <Button variant="link" className="w-full text-primary" onClick={closeCart}>
              Continue Shopping
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
