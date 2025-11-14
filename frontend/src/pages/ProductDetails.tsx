import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { addToCart } from '@/lib/cartUtils';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  availableQuantity: number;
  category: string;
}

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/products/${id}`);
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error("Error loading product:", error);
        setProduct(null);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Button onClick={() => navigate('/products')}>Back to Products</Button>
        </div>
      </div>
    );
  }

  const images = [product.imageUrl]; // backend provides only a single image

  const handleAddToCart = () => {
    addToCart(
      {
        id: product._id,
        name: product.name,
        price: product.price,
        images: images,
        availableQuantity: product.availableQuantity,
        category: product.category,
        description: product.description,
      },
      quantity
    );

    window.dispatchEvent(new Event('cartUpdated'));

    toast({
      title: 'Added to cart',
      description: `${quantity} ${product.name} added to your cart.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="grid md:grid-cols-2 gap-8">
          {/* MAIN IMAGE */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-secondary">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* PRODUCT DETAILS */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">
                {product.category}
              </p>
              <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
              <p className="text-3xl font-bold text-primary">
                LKR {product.price.toLocaleString()}
              </p>
            </div>

            <div className="border-t border-b border-border py-4">
              <p className="text-muted-foreground">{product.description}</p>
            </div>

            <p
              className={`text-sm ${
                product.availableQuantity > 0 ? 'text-green-600' : 'text-destructive'
              }`}
            >
              {product.availableQuantity > 0
                ? `${product.availableQuantity} in stock`
                : 'Out of stock'}
            </p>

            {product.availableQuantity > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium">Quantity:</label>
                  <Input
                    type="number"
                    min="1"
                    max={product.availableQuantity}
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(
                        Math.min(
                          product.availableQuantity,
                          Math.max(1, parseInt(e.target.value) || 1)
                        )
                      )
                    }
                    className="w-24"
                  />
                </div>

                <Button size="lg" className="w-full" onClick={handleAddToCart}>
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;


/*import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockProducts } from '@/lib/mockData';
import { addToCart } from '@/lib/cartUtils';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  availableQuantity: number;
  category: string;
}

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    // Load products from localStorage, fallback to mockProducts
    const storedProducts = localStorage.getItem('products');
    const products = storedProducts ? JSON.parse(storedProducts) : mockProducts;
    const foundProduct = products.find((p: Product) => p.id === id);
    setProduct(foundProduct || null);
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Button onClick={() => navigate('/products')}>Back to Products</Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    window.dispatchEvent(new Event('cartUpdated'));
    toast({
      title: 'Added to cart',
      description: `${quantity} ${product.name} added to your cart.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Images */  /*   }
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-secondary">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 ${
                      selectedImage === idx ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */   /* }
          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">
                {product.category}
              </p>
              <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
              <p className="text-3xl font-bold text-primary">LKR {product.price.toLocaleString()}</p>
            </div>

            <div className="border-t border-b border-border py-4">
              <p className="text-muted-foreground">{product.description}</p>
            </div>

            <div>
              <p className={`text-sm ${product.availableQuantity > 0 ? 'text-green-600' : 'text-destructive'}`}>
                {product.availableQuantity > 0
                  ? `${product.availableQuantity} in stock`
                  : 'Out of stock'}
              </p>
            </div>

            {product.availableQuantity > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium">Quantity:</label>
                  <Input
                    type="number"
                    min="1"
                    max={product.availableQuantity}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.min(product.availableQuantity, Math.max(1, parseInt(e.target.value) || 1)))}
                    className="w-24"
                  />
                </div>

                <Button size="lg" className="w-full" onClick={handleAddToCart}>
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
*/