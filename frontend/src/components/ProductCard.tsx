import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { addToCart } from '@/lib/cartUtils';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    images: string[];
    availableQuantity: number;
    category: string;
    description?: string;

  };
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.availableQuantity > 0) {
      addToCart(product, 1);
      window.dispatchEvent(new Event('cartUpdated'));
      toast({
        title: 'Added to cart',
        description: `${product.name} has been added to your cart.`,
      });
    }
  };

  return (
    <Card 
      className="group cursor-pointer overflow-hidden transition-all hover:shadow-elegant"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <div className="aspect-square overflow-hidden bg-secondary">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform group-hover:scale-110"
        />
      </div>
      <div className="p-4 space-y-2">
        <p className="text-xs text-muted-foreground uppercase tracking-wide">{product.category}</p>
        <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
        <div className="flex items-center justify-between">
          <p className="text-xl font-bold text-primary">LKR {product.price.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">
            {product.availableQuantity > 0 ? `${product.availableQuantity} left` : 'Out of stock'}
          </p>
        </div>
        <Button
          className="w-full"
          onClick={handleAddToCart}
          disabled={product.availableQuantity === 0}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </div>
    </Card>
  );
};
