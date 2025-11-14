// Simple admin authentication using localStorage
const ADMIN_PASSWORD = 'admin123'; // Change this in production
const ADMIN_KEY = 'admin_authenticated';

export const adminLogin = (password: string): boolean => {
  if (password === ADMIN_PASSWORD) {
    localStorage.setItem(ADMIN_KEY, 'true');
    return true;
  }
  return false;
};

export const adminLogout = () => {
  localStorage.removeItem(ADMIN_KEY);
};

export const isAdminAuthenticated = (): boolean => {
  return localStorage.getItem(ADMIN_KEY) === 'true';
};

// Orders management
export interface Order {
  id: string;
  orderItems: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  name: string;
  whatsapp: string;
  address: string;
  paymentMethod: string;
  paymentRefId?: string;
  status: 'pending' | 'processing' | 'completed';
  createdAt: string;
}

export const saveOrder = (order: Omit<Order, 'id' | 'status' | 'createdAt'>): Order => {
  const orders = getOrders();
  const newOrder: Order = {
    ...order,
    id: 'ORD-' + Date.now(),
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  orders.push(newOrder);
  localStorage.setItem('orders', JSON.stringify(orders));
  return newOrder;
};

export const getOrders = (): Order[] => {
  const ordersJson = localStorage.getItem('orders');
  return ordersJson ? JSON.parse(ordersJson) : [];
};

export const updateOrderStatus = (orderId: string, status: Order['status']) => {
  const orders = getOrders();
  const index = orders.findIndex(o => o.id === orderId);
  if (index !== -1) {
    orders[index].status = status;
    localStorage.setItem('orders', JSON.stringify(orders));
  }
};
