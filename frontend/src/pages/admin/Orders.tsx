import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  name: string;
  whatsapp: string;
  address: string;
  paymentMethod: string;
  paymentRefId?: string;
  orderItems: OrderItem[];
  status: 'pending' | 'processing' | 'completed';
  createdAt: string;
}

// Custom order interface
interface CustomOrder {
  _id: string;
  name: string;
  whatsapp: string;
  address?: string;
  expectedDelivery?: string;
  material: string;
  sizeDetails: string;
  referenceImages: string[];
  createdAt: string;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [customOrders, setCustomOrders] = useState<CustomOrder[]>([]);

  const API_URL = 'http://localhost:5000/api/orders';
  const CUSTOM_API_URL = 'http://localhost:5000/api/custom-orders';

  useEffect(() => {
    loadOrders();
    loadCustomOrders();
  }, []);

  // Load normal orders
  const loadOrders = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error(err);
      toast({ title: 'Failed to load orders', variant: 'destructive' });
    }
  };

  // Load custom orders
  const loadCustomOrders = async () => {
    try {
      const res = await fetch(CUSTOM_API_URL);
      const data = await res.json();
      setCustomOrders(data);
    } catch (err) {
      console.error(err);
      toast({ title: 'Failed to load custom orders', variant: 'destructive' });
    }
  };

  const handleStatusChange = async (orderId: string, status: Order['status']) => {
    try {
      await fetch(`${API_URL}/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      toast({ title: `Order status updated to ${status}` });
      loadOrders();
    } catch (err) {
      console.error(err);
      toast({ title: 'Failed to update status', variant: 'destructive' });
    }
  };

  const handleDelete = async (orderId: string) => {
    if (!confirm('Are you sure you want to delete this order?')) return;
    try {
      await fetch(`${API_URL}/${orderId}`, { method: 'DELETE' });
      toast({ title: 'Order deleted successfully' });
      loadOrders();
    } catch (err) {
      console.error(err);
      toast({ title: 'Failed to delete order', variant: 'destructive' });
    }
  };

  const handleDeleteCustom = async (id: string) => {
    if (!confirm('Are you sure you want to delete this custom order?')) return;
    try {
      await fetch(`${CUSTOM_API_URL}/${id}`, { method: 'DELETE' });
      toast({ title: 'Custom order deleted' });
      loadCustomOrders();
    } catch (err) {
      console.error(err);
      toast({ title: 'Failed to delete custom order', variant: 'destructive' });
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'processing': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Normal Orders</h1>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No orders yet
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order._id}>
              <CardHeader>
  <div className="flex justify-between items-start">
    <div>
      {/* Show order ID  */}
      <p className="text-sm text-muted-foreground">
        Order ID: {order._id}
      </p>

      {/* Show customer name  */}
      <CardTitle className="text-lg">{order.name}</CardTitle>

      <p className="text-sm text-muted-foreground">
        {format(new Date(order.createdAt), 'MMM dd, yyyy HH:mm')}
      </p>
    </div>
    <Badge className={getStatusColor(order.status)}>
      {order.status}
    </Badge>
  </div>
</CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-semibold">Customer</p>
                    <p>{order.name}</p>
                    <p className="text-muted-foreground">{order.whatsapp}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Payment</p>
                    <p>{order.paymentMethod}</p>
                    {order.paymentRefId && <p className="text-muted-foreground">{order.paymentRefId}</p>}
                  </div>
                </div>

                <div>
                  <p className="font-semibold text-sm mb-2">Delivery Address</p>
                  <p className="text-sm text-muted-foreground">{order.address}</p>
                </div>

                <div>
                  <p className="font-semibold text-sm mb-2">Items</p>
                  <div className="space-y-1">
                    {order.orderItems.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span>{item.name} x {item.quantity}</span>
                        <span>LKR {(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="flex justify-between font-semibold pt-2 border-t">
                      <span>Total</span>
                      <span>
                        LKR {order.orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={order.status === 'pending' ? 'default' : 'outline'}
                    onClick={() => handleStatusChange(order._id, 'pending')}
                  >
                    Pending
                  </Button>
                  <Button
                    size="sm"
                    variant={order.status === 'processing' ? 'default' : 'outline'}
                    onClick={() => handleStatusChange(order._id, 'processing')}
                  >
                    Processing
                  </Button>
                  <Button
                    size="sm"
                    variant={order.status === 'completed' ? 'default' : 'outline'}
                    onClick={() => handleStatusChange(order._id, 'completed')}
                  >
                    Completed
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(order._id)}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* ================= Custom Orders ================= */}
      <h1 className="text-3xl font-bold mt-10">Custom Orders</h1>

      {customOrders.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No custom orders yet
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4 mt-4">
          {customOrders.map((order) => (
            <Card key={order._id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">Custom Order</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(order.createdAt), 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-semibold">Customer</p>
                    <p>{order.name}</p>
                    <p className="text-muted-foreground">{order.whatsapp}</p>
                  </div>

                  <div>
                    <p className="font-semibold">Delivery</p>
                    <p>{order.expectedDelivery || 'Not specified'}</p>
                  </div>
                </div>

                <div>
                  <p className="font-semibold text-sm mb-2">Material</p>
                  <p className="text-muted-foreground">{order.material}</p>
                </div>

                <div>
                  <p className="font-semibold text-sm mb-2">Size Details</p>
                  <p className="text-muted-foreground">{order.sizeDetails}</p>
                </div>

                {order.referenceImages.length > 0 && (
                  <div>
                    <p className="font-semibold text-sm mb-2">Reference Images</p>
                    <div className="flex gap-3">
                      {order.referenceImages.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt="ref"
                          className="w-24 h-24 object-cover rounded-md border"
                        />
                      ))}
                    </div>
                  </div>
                )}

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDeleteCustom(order._id)}
                >
                  Delete
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}



/*import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getOrders, updateOrderStatus, Order } from '@/lib/adminUtils';
import { format } from 'date-fns';

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    setOrders(getOrders());
  };

  const handleStatusChange = (orderId: string, status: Order['status']) => {
    updateOrderStatus(orderId, status);
    loadOrders();
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'processing': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Orders</h1>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No orders yet
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{order.id}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(order.createdAt), 'MMM dd, yyyy HH:mm')}
                    </p>
                  </div>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-semibold">Customer</p>
                    <p>{order.name}</p>
                    <p className="text-muted-foreground">{order.whatsapp}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Payment</p>
                    <p>{order.paymentMethod}</p>
                    {order.paymentRefId && (
                      <p className="text-muted-foreground">{order.paymentRefId}</p>
                    )}
                  </div>
                </div>

                <div>
                  <p className="font-semibold text-sm mb-2">Delivery Address</p>
                  <p className="text-sm text-muted-foreground">{order.address}</p>
                </div>

                <div>
                  <p className="font-semibold text-sm mb-2">Items</p>
                  <div className="space-y-1">
                    {order.orderItems.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span>{item.name} x {item.quantity}</span>
                        <span>LKR {(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="flex justify-between font-semibold pt-2 border-t">
                      <span>Total</span>
                      <span>
                        LKR {order.orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={order.status === 'pending' ? 'default' : 'outline'}
                    onClick={() => handleStatusChange(order.id, 'pending')}
                  >
                    Pending
                  </Button>
                  <Button
                    size="sm"
                    variant={order.status === 'processing' ? 'default' : 'outline'}
                    onClick={() => handleStatusChange(order.id, 'processing')}
                  >
                    Processing
                  </Button>
                  <Button
                    size="sm"
                    variant={order.status === 'completed' ? 'default' : 'outline'}
                    onClick={() => handleStatusChange(order.id, 'completed')}
                  >
                    Completed
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
*/