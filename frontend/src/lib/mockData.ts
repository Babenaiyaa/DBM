// Mock data for products and banners
export const mockBanners = [
  {
    id: '1',
    title: 'Festival Special Collection',
    subtitle: 'Up to 30% off on all dresses',
    imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&h=600&fit=crop',
    ctaText: 'Shop Now',
    ctaUrl: '/products',
    active: true,
    order: 1
  },
  {
    id: '2',
    title: 'Custom Tailoring Services',
    subtitle: 'Get your dream outfit made just for you',
    imageUrl: 'https://images.unsplash.com/photo-1558769132-cb1aea3c8565?w=1600&h=600&fit=crop',
    ctaText: 'Order Custom',
    ctaUrl: '/custom-order',
    active: true,
    order: 2
  },
  {
    id: '3',
    title: 'New Arrivals',
    subtitle: 'Fresh designs added weekly',
    imageUrl: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1600&h=600&fit=crop',
    ctaText: 'Explore',
    ctaUrl: '/products',
    active: true,
    order: 3
  }
];

export const mockProducts = [
  {
    id: '1',
    name: 'Elegant Evening Dress',
    price: 8500,
    description: 'Beautiful flowing evening dress perfect for special occasions. Made with premium fabric and attention to detail.',
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&h=800&fit=crop'
    ],
    availableQuantity: 5,
    category: 'Dresses'
  },
  {
    id: '2',
    name: 'Floral Summer Blouse',
    price: 3200,
    description: 'Light and breezy blouse with beautiful floral pattern. Perfect for casual outings.',
    images: [
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=800&fit=crop'
    ],
    availableQuantity: 12,
    category: 'Blouses'
  },
  {
    id: '3',
    name: 'Traditional Saree Blouse',
    price: 4500,
    description: 'Intricately designed saree blouse with traditional embroidery.',
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&h=800&fit=crop'
    ],
    availableQuantity: 8,
    category: 'Blouses'
  },
  {
    id: '4',
    name: 'Party Wear Dress',
    price: 12000,
    description: 'Stunning party wear dress with sequin details and modern cut.',
    images: [
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&h=800&fit=crop'
    ],
    availableQuantity: 3,
    category: 'Dresses'
  },
  {
    id: '5',
    name: 'Casual Cotton Top',
    price: 2800,
    description: 'Comfortable cotton top for everyday wear. Available in multiple colors.',
    images: [
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&h=800&fit=crop'
    ],
    availableQuantity: 20,
    category: 'Tops'
  },
  {
    id: '6',
    name: 'Designer Kurta',
    price: 6500,
    description: 'Elegant designer kurta with intricate patterns and comfortable fit.',
    images: [
      'https://images.unsplash.com/photo-1612836022829-a318d16a2c77?w=800&h=800&fit=crop'
    ],
    availableQuantity: 7,
    category: 'Ethnic Wear'
  }
];

export const MOM_PHONE = '+94771234567'; // Replace with actual WhatsApp number
