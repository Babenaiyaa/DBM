import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface Product {
  _id?: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  availableQuantity: number;
  category: string;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const API_URL = 'http://localhost:5000/api/products';

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
      toast({ title: 'Failed to load products', variant: 'destructive' });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const product: Product = {
      name: formData.get('name') as string,
      price: Number(formData.get('price')),
      description: formData.get('description') as string,
      imageUrl: formData.get('imageUrl') as string,
      availableQuantity: Number(formData.get('quantity')),
      category: formData.get('category') as string,
    };

    try {
      if (editingProduct?._id) {
        await fetch(`${API_URL}/${editingProduct._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(product),
        });
        toast({ title: 'Product updated successfully!' });
      } else {
        await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(product),
        });
        toast({ title: 'Product added successfully!' });
      }

      setIsDialogOpen(false);
      setEditingProduct(null);
      loadProducts();

    } catch (err) {
      console.error(err);
      toast({ title: 'Failed to save product', variant: 'destructive' });
    }
  };

  const handleDelete = async (_id?: string) => {
    if (!_id || !confirm('Are you sure you want to delete this product?')) return;
    try {
      await fetch(`${API_URL}/${_id}`, { method: 'DELETE' });
      toast({ title: 'Product deleted successfully!' });
      loadProducts();
    } catch (err) {
      console.error(err);
      toast({ title: 'Failed to delete product', variant: 'destructive' });
    }
  };

  const openDialog = (product?: Product) => {
    setEditingProduct(product || null);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Products</h1>

        {/* Add / Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProduct ? 'Edit Product' : 'Add Product'}</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">

              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" defaultValue={editingProduct?.name} required />
              </div>

              <div>
                <Label htmlFor="price">Price (LKR)</Label>
                <Input id="price" name="price" type="number" defaultValue={editingProduct?.price} required />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Input id="category" name="category" defaultValue={editingProduct?.category} required />
              </div>

              <div>
                <Label htmlFor="quantity">Available Quantity</Label>
                <Input id="quantity" name="quantity" type="number" defaultValue={editingProduct?.availableQuantity} required />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" defaultValue={editingProduct?.description} required />
              </div>

              <div>
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  defaultValue={editingProduct?.imageUrl || ""}
                  placeholder="https://example.com/product.jpg"
                  required
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button type="submit">Save</Button>
              </div>

            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <Card key={product._id}>
            <CardHeader>
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-48 object-cover rounded-md mb-2"
              />
              <CardTitle className="text-lg">{product.name}</CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
              <p className="font-semibold">LKR {product.price.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Stock: {product.availableQuantity}</p>

              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="outline" onClick={() => openDialog(product)}>
                  <Edit className="w-4 h-4" />
                </Button>

                <Button size="sm" variant="destructive" onClick={() => handleDelete(product._id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}



/*import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  availableQuantity: number;
  category: string;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    } else {
      // Initialize with mock data
      const { mockProducts } = require('@/lib/mockData');
      localStorage.setItem('products', JSON.stringify(mockProducts));
      setProducts(mockProducts);
    }
  };

  const saveProducts = (updatedProducts: Product[]) => {
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    setProducts(updatedProducts);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const product: Product = {
      id: editingProduct?.id || Date.now().toString(),
      name: formData.get('name') as string,
      price: Number(formData.get('price')),
      description: formData.get('description') as string,
      images: (formData.get('images') as string).split(',').map(s => s.trim()),
      availableQuantity: Number(formData.get('quantity')),
      category: formData.get('category') as string,
    };

    if (editingProduct) {
      const updated = products.map(p => p.id === editingProduct.id ? product : p);
      saveProducts(updated);
      toast({ title: 'Product updated successfully!' });
    } else {
      saveProducts([...products, product]);
      toast({ title: 'Product added successfully!' });
    }

    setIsDialogOpen(false);
    setEditingProduct(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      saveProducts(products.filter(p => p.id !== id));
      toast({ title: 'Product deleted successfully!' });
    }
  };

  const openDialog = (product?: Product) => {
    setEditingProduct(product || null);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Products</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProduct ? 'Edit Product' : 'Add Product'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" defaultValue={editingProduct?.name} required />
              </div>
              <div>
                <Label htmlFor="price">Price (LKR)</Label>
                <Input id="price" name="price" type="number" defaultValue={editingProduct?.price} required />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Input id="category" name="category" defaultValue={editingProduct?.category} required />
              </div>
              <div>
                <Label htmlFor="quantity">Available Quantity</Label>
                <Input id="quantity" name="quantity" type="number" defaultValue={editingProduct?.availableQuantity} required />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" defaultValue={editingProduct?.description} required />
              </div>
              <div>
                <Label htmlFor="images">Image URLs (comma-separated)</Label>
                <Textarea id="images" name="images" defaultValue={editingProduct?.images.join(', ')} placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg" required />
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button type="submit">Save</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <Card key={product.id}>
            <CardHeader>
              <img src={product.images[0]} alt={product.name} className="w-full h-48 object-cover rounded-md mb-2" />
              <CardTitle className="text-lg">{product.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
              <p className="font-semibold">LKR {product.price.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Stock: {product.availableQuantity}</p>
              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="outline" onClick={() => openDialog(product)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(product.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
*/