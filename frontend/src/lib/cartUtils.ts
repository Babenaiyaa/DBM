// Cart utilities using localStorage
export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  availableQuantity: number;
}

export const getCart = (): CartItem[] => {
  try {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  } catch {
    return [];
  }
};

export const saveCart = (cart: CartItem[]): void => {
  localStorage.setItem('cart', JSON.stringify(cart));
};

export const addToCart = (product: any, quantity: number = 1): void => {
  const cart = getCart();
  const existingIndex = cart.findIndex(item => item.productId === product.id);
  
  if (existingIndex > -1) {
    const newQty = Math.min(
      product.availableQuantity,
      cart[existingIndex].quantity + quantity
    );
    cart[existingIndex].quantity = newQty;
  } else {
    cart.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: Math.min(quantity, product.availableQuantity),
      image: product.images?.[0],
      availableQuantity: product.availableQuantity
    });
  }
  
  saveCart(cart);
};

export const updateQuantity = (productId: string, quantity: number): void => {
  const cart = getCart();
  const item = cart.find(item => item.productId === productId);
  
  if (item) {
    item.quantity = Math.min(Math.max(1, quantity), item.availableQuantity);
    saveCart(cart);
  }
};

export const removeFromCart = (productId: string): void => {
  const cart = getCart().filter(item => item.productId !== productId);
  saveCart(cart);
};

export const clearCart = (): void => {
  localStorage.removeItem('cart');
};

export const getCartTotal = (): number => {
  return getCart().reduce((total, item) => total + (item.price * item.quantity), 0);
};

export const getCartCount = (): number => {
  return getCart().reduce((count, item) => count + item.quantity, 0);
};

// Save order when checkout completes
export const saveOrderFromCart = (customerData: {
  name: string;
  whatsapp: string;
  address: string;
  paymentMethod: string;
  paymentRefId?: string;
}) => {
  const cart = getCart();
  const { saveOrder } = require('./adminUtils');
  const order = saveOrder({
    orderItems: cart.map(item => ({
      productId: item.productId,
      name: item.name,
      price: item.price,
      quantity: item.quantity
    })),
    ...customerData,
  });
  clearCart();
  return order;
};
