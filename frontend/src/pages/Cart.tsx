import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { getCart, updateQuantity, removeFromCart, getCartTotal } from '@/lib/cartUtils';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag } from 'lucide-react';

const Cart = () => {
  const [cart, setCart] = useState(getCart());
  const navigate = useNavigate();

  const refreshCart = () => {
    setCart(getCart());
  };

  useEffect(() => {
    window.addEventListener('cartUpdated', refreshCart);
    return () => window.removeEventListener('cartUpdated', refreshCart);
  }, []);

  const handleQuantityChange = (productId: string, newQty: number) => {
    updateQuantity(productId, newQty);
    refreshCart();
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const handleRemove = (productId: string) => {
    removeFromCart(productId);
    refreshCart();
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const total = getCartTotal();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <ShoppingBag className="h-24 w-24 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-6">Start shopping to add items to your cart</p>
          <Button onClick={() => navigate('/products')}>Browse Products</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cart.map(item => (
              <Card key={item.productId} className="p-4">
                <div className="flex gap-4">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                    <p className="text-primary font-bold mb-2">LKR {item.price.toLocaleString()}</p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <label className="text-sm">Qty:</label>
                        <Input
                          type="number"
                          min="1"
                          max={item.availableQuantity}
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.productId, parseInt(e.target.value) || 1)}
                          className="w-20"
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Max: {item.availableQuantity}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemove(item.productId)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <p className="font-bold text-lg">
                      LKR {(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div>
            <Card className="p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>LKR {total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total</span>
                  <span className="text-primary">LKR {total.toLocaleString()}</span>
                </div>
              </div>
              <Button className="w-full" size="lg" onClick={() => navigate('/checkout')}>
                Proceed to Checkout
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
