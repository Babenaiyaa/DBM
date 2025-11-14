import { Navbar } from '@/components/Navbar';
import { BannerSlider } from '@/components/BannerSlider';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Scissors } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  availableQuantity: number;
  category: string;
}

const Home = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/products");
        const data = await res.json();

        // Optional: filter active products only if backend supports `isActive`
        const activeProducts = data.filter((p: any) => p.isActive !== false);

        setProducts(activeProducts);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Only show 6 featured items
  const featuredProducts = products.slice(0, 6);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <BannerSlider />

      <div className="container mx-auto px-4 py-12">
        {/* Featured Products */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Products</h2>
              <p className="text-muted-foreground">Handpicked selections just for you</p>
            </div>
            <Button variant="outline" onClick={() => navigate('/products')}>
              View All
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product._id} product={{
                id: product._id,
                name: product.name,
                price: product.price,
                images: [product.imageUrl],       // mapping backend format → frontend format
                availableQuantity: product.availableQuantity,
                category: product.category
              }} />
            ))}
          </div>
        </div>

        {/* Custom Order CTA */}
        <div className="bg-gradient-to-r from-primary to-accent rounded-2xl p-8 md:p-12 text-center text-primary-foreground shadow-elegant">
          <Scissors className="h-16 w-16 mx-auto mb-4 opacity-90" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Get Custom Tailored Outfits</h2>
          <p className="text-lg mb-6 opacity-90 max-w-2xl mx-auto">
            Have a special design in mind? Our expert tailors can bring your vision to life with perfect measurements and premium fabrics.
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => navigate('/custom-order')}
            className="shadow-lg"
          >
            Make a Custom Order
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;




/*import { Navbar } from '@/components/Navbar';
import { BannerSlider } from '@/components/BannerSlider';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { mockProducts } from '@/lib/mockData';
import { useNavigate } from 'react-router-dom';
import { Scissors } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  availableQuantity: number;
  category: string;
}

const Home = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Load products from localStorage, fallback to mockProducts
    const storedProducts = localStorage.getItem('products');
    const loadedProducts = storedProducts ? JSON.parse(storedProducts) : mockProducts;
    if (!storedProducts) {
      localStorage.setItem('products', JSON.stringify(mockProducts));
    }
    setProducts(loadedProducts);
  }, []);

  const featuredProducts = products.slice(0, 6);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <BannerSlider />
      
      <div className="container mx-auto px-4 py-12">
        {/* Featured Products */ /*}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Products</h2>
              <p className="text-muted-foreground">Handpicked selections just for you</p>
            </div>
            <Button variant="outline" onClick={() => navigate('/products')}>
              View All
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        {/* Custom Order CTA */  /*}
        <div className="bg-gradient-to-r from-primary to-accent rounded-2xl p-8 md:p-12 text-center text-primary-foreground shadow-elegant">
          <Scissors className="h-16 w-16 mx-auto mb-4 opacity-90" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Get Custom Tailored Outfits</h2>
          <p className="text-lg mb-6 opacity-90 max-w-2xl mx-auto">
            Have a special design in mind? Our expert tailors can bring your vision to life with perfect measurements and premium fabrics.
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => navigate('/custom-order')}
            className="shadow-lg"
          >
            Make a Custom Order
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
*/