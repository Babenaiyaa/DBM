import { ShoppingCart, Menu, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NavLink } from '@/components/NavLink';
import { getCartCount } from '@/lib/cartUtils';
import { useState, useEffect } from 'react';

export const Navbar = () => {
  const [cartCount, setCartCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const updateCart = () => setCartCount(getCartCount());
    updateCart();
    window.addEventListener('cartUpdated', updateCart);
    return () => window.removeEventListener('cartUpdated', updateCart);
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <NavLink to="/" className="text-2xl font-bold text-primary hover:opacity-80 transition-opacity">
            Seniour cuts
          </NavLink>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <NavLink to="/" className="text-foreground hover:text-primary transition-colors">
              Home
            </NavLink>
            <NavLink to="/products" className="text-foreground hover:text-primary transition-colors">
              Products
            </NavLink>
            <NavLink to="/custom-order" className="text-foreground hover:text-primary transition-colors">
              Custom Order
            </NavLink>
            <NavLink to="/admin/login" className="text-foreground hover:text-primary transition-colors">
              <Lock className="h-4 w-4 inline mr-1" />
              Admin
            </NavLink>
            <NavLink to="/cart" className="relative">
              <Button variant="outline" size="icon">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center font-semibold">
                    {cartCount}
                  </span>
                )}
              </Button>
            </NavLink>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <NavLink to="/cart" className="relative">
              <Button variant="outline" size="icon">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center font-semibold">
                    {cartCount}
                  </span>
                )}
              </Button>
            </NavLink>
            <Button variant="outline" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-2">
              <NavLink to="/" className="py-2 text-foreground hover:text-primary transition-colors">
                Home
              </NavLink>
              <NavLink to="/products" className="py-2 text-foreground hover:text-primary transition-colors">
                Products
              </NavLink>
              <NavLink to="/custom-order" className="py-2 text-foreground hover:text-primary transition-colors">
                Custom Order
              </NavLink>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
