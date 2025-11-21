import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card } from '@/components/ui/card';
import { getCart, getCartTotal, clearCart } from '@/lib/cartUtils';
import { MOM_PHONE } from '@/lib/mockData';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const Checkout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const cart = getCart();
  const total = getCartTotal();

  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    email: '',
    address: '',
    paymentMethod: 'COD'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.whatsapp || !formData.address) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all required fields.',
        variant: 'destructive'
      });
      return;
    }

    const paymentRef = formData.paymentMethod === 'Bank Transfer'
      ? 'REF-' + Math.random().toString(36).slice(2, 8).toUpperCase()
      : null;

    try {
      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: formData.name,
          whatsapp: formData.whatsapp,
          email: formData.email || undefined,
          address: formData.address,
          paymentMethod: formData.paymentMethod,
          paymentRefId: paymentRef || null,
          items: cart.map(item => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity
          })),
          totalPrice: total
        })
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Error saving order");

      // Clear cart
      clearCart();
      window.dispatchEvent(new Event('cartUpdated'));

      // WhatsApp message
      const orderSummary = cart.map(item => `${item.name} x${item.quantity}`).join(', ');
      const message = `Hi! I'd like to place an order:\n\nOrder ID: ${result.order._id}\nName: ${formData.name}\nOrder: ${orderSummary}\nTotal: LKR ${total.toLocaleString()}\nDelivery: ${formData.address}\nPayment: ${formData.paymentMethod}${paymentRef ? `\nPayment Ref: ${paymentRef}` : ''}`;

      // Navigate to thank-you page
      navigate('/thank-you', {
        state: {
          orderDetails: {
            ...formData,
            orderId: result.order._id,
            paymentRef,
            total,
            items: cart
          }
        }
      });

      setTimeout(() => {
        window.open(`https://wa.me/${MOM_PHONE}?text=${encodeURIComponent(message)}`, '_blank');
      }, 500);

    } catch (error) {
      console.error("Order submit failed:", error);
      toast({
        title: "Order Failed",
        description: "There was an issue placing your order. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Checkout</h1>

        <div className="grid md:grid-cols-3 gap-8">
          <form onSubmit={handleSubmit} className="md:col-span-2 space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input id="name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                </div>
                <div>
                  <Label htmlFor="whatsapp">WhatsApp Number *</Label>
                  <Input id="whatsapp" type="tel" placeholder="+94771234567" value={formData.whatsapp} onChange={e => setFormData({ ...formData, whatsapp: e.target.value })} required />
                </div>
                <div>
                  <Label htmlFor="email">Email (for order updates)</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="address">Delivery Address *</Label>
                  <Textarea id="address" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} required />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              <RadioGroup value={formData.paymentMethod} onValueChange={value => setFormData({ ...formData, paymentMethod: value })}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="COD" id="cod" />
                  <Label htmlFor="cod">Cash on Delivery</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Bank Transfer" id="bank" />
                  <Label htmlFor="bank">Bank Transfer</Label>
                </div>
              </RadioGroup>
              {formData.paymentMethod === 'Bank Transfer' && (
                <div className="mt-4 p-4 bg-secondary rounded-lg text-sm text-muted-foreground">
                  A payment reference will be generated after you place the order. Please use it when making the bank transfer and send the receipt via WhatsApp.
                </div>
              )}
            </Card>

            <Button type="submit" size="lg" className="w-full">Place Order</Button>
          </form>

          <div>
            <Card className="p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4">
                {cart.map(item => (
                  <div key={item.productId} className="flex justify-between text-sm">
                    <span>{item.name} x{item.quantity}</span>
                    <span>LKR {(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">LKR {total.toLocaleString()}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;



/*import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card } from '@/components/ui/card';
import { getCart, getCartTotal, clearCart } from '@/lib/cartUtils';
import { MOM_PHONE } from '@/lib/mockData';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const Checkout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const cart = getCart();
  const total = getCartTotal();

  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    address: '',
    paymentMethod: 'COD'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.whatsapp || !formData.address) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all required fields.',
        variant: 'destructive'
      });
      return;
    }

    const paymentRef = formData.paymentMethod === 'Bank Transfer'
      ? 'REF-' + Math.random().toString(36).slice(2, 8).toUpperCase()
      : null;

    // Save order to localStorage
    const { saveOrderFromCart } = require('@/lib/cartUtils');
    const order = saveOrderFromCart({
      name: formData.name,
      whatsapp: formData.whatsapp,
      address: formData.address,
      paymentMethod: formData.paymentMethod,
      paymentRefId: paymentRef || undefined,
    });

    window.dispatchEvent(new Event('cartUpdated'));

    const orderSummary = cart.map(item => `${item.name} x${item.quantity}`).join(', ');
    const message = `Hi! I'd like to place an order:\n\nOrder ID: ${order.id}\nName: ${formData.name}\nOrder: ${orderSummary}\nTotal: LKR ${total.toLocaleString()}\nDelivery: ${formData.address}\nPayment: ${formData.paymentMethod}${paymentRef ? `\nPayment Ref: ${paymentRef}` : ''}`;

    navigate('/thank-you', {
      state: {
        orderDetails: {
          ...formData,
          orderId: order.id,
          paymentRef,
          total,
          items: cart
        }
      }
    });

    setTimeout(() => {
      window.open(`https://wa.me/${MOM_PHONE}?text=${encodeURIComponent(message)}`, '_blank');
    }, 500);
  };

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Checkout</h1>

        <div className="grid md:grid-cols-3 gap-8">
          <form onSubmit={handleSubmit} className="md:col-span-2 space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="whatsapp">WhatsApp Number *</Label>
                  <Input
                    id="whatsapp"
                    type="tel"
                    placeholder="+94771234567"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="address">Delivery Address *</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              <RadioGroup
                value={formData.paymentMethod}
                onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="COD" id="cod" />
                  <Label htmlFor="cod">Cash on Delivery</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Bank Transfer" id="bank" />
                  <Label htmlFor="bank">Bank Transfer</Label>
                </div>
              </RadioGroup>
              {formData.paymentMethod === 'Bank Transfer' && (
                <div className="mt-4 p-4 bg-secondary rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    A payment reference will be generated after you place the order. 
                    Please use it when making the bank transfer and send the receipt via WhatsApp.
                  </p>
                </div>
              )}
            </Card>

            <Button type="submit" size="lg" className="w-full">
              Place Order
            </Button>
          </form>

          <div>
            <Card className="p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4">
                {cart.map(item => (
                  <div key={item.productId} className="flex justify-between text-sm">
                    <span>{item.name} x{item.quantity}</span>
                    <span>LKR {(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">LKR {total.toLocaleString()}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
*/