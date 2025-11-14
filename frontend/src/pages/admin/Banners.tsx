import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface Banner {
  _id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaText: string;
  ctaUrl: string;
  active: boolean;
  order: number;
}

export default function AdminBanners() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

  const API_URL = 'http://localhost:5000/api/banners';

  // Load banners from backend
  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setBanners(data);
    } catch (err) {
      console.error(err);
      toast({ title: 'Failed to load banners', variant: 'destructive' });
    }
  };

  const openDialog = (banner?: Banner) => {
    setEditingBanner(banner || null);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const bannerData = {
      title: formData.get('title') as string,
      subtitle: formData.get('subtitle') as string,
      imageUrl: formData.get('imageUrl') as string,
      ctaText: formData.get('ctaText') as string,
      ctaUrl: formData.get('ctaUrl') as string,
      active: formData.get('active') === 'on',
      order: Number(formData.get('order')),
    };

    try {
      const url = editingBanner ? `${API_URL}/${editingBanner._id}` : API_URL;
      const method = editingBanner ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bannerData),
      });

      const savedBanner = await res.json();

      toast({ title: editingBanner ? 'Banner updated!' : 'Banner added!' });
      setIsDialogOpen(false);
      setEditingBanner(null);
      loadBanners();
    } catch (err) {
      console.error(err);
      toast({ title: 'Failed to save banner', variant: 'destructive' });
    }
  };

  const handleDelete = async (_id: string) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;

    try {
      await fetch(`${API_URL}/${_id}`, { method: 'DELETE' });
      toast({ title: 'Banner deleted!' });
      loadBanners();
    } catch (err) {
      console.error(err);
      toast({ title: 'Failed to delete banner', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Banners</h1>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              Add Banner
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingBanner ? 'Edit Banner' : 'Add Banner'}</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" defaultValue={editingBanner?.title} required />
              </div>

              <div>
                <Label htmlFor="subtitle">Subtitle</Label>
                <Input id="subtitle" name="subtitle" defaultValue={editingBanner?.subtitle} required />
              </div>

              <div>
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input id="imageUrl" name="imageUrl" defaultValue={editingBanner?.imageUrl} required />
              </div>

              <div>
                <Label htmlFor="ctaText">CTA Button Text</Label>
                <Input id="ctaText" name="ctaText" defaultValue={editingBanner?.ctaText} required />
              </div>

              <div>
                <Label htmlFor="ctaUrl">CTA URL</Label>
                <Input id="ctaUrl" name="ctaUrl" defaultValue={editingBanner?.ctaUrl} required />
              </div>

              <div>
                <Label htmlFor="order">Display Order</Label>
                <Input id="order" name="order" type="number" defaultValue={editingBanner?.order || 1} required />
              </div>

              <div className="flex items-center gap-2">
                <Switch id="active" name="active" defaultChecked={editingBanner?.active !== false} />
                <Label htmlFor="active">Active</Label>
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button type="submit">Save</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {banners.sort((a, b) => a.order - b.order).map((banner) => (
          <Card key={banner._id} className={!banner.active ? 'opacity-50' : ''}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{banner.title}</CardTitle>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => openDialog(banner)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(banner._id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="flex gap-4">
                <img src={banner.imageUrl} alt={banner.title} className="w-48 h-32 object-cover rounded-md" />
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{banner.subtitle}</p>
                  <p className="text-sm"><strong>CTA:</strong> {banner.ctaText} → {banner.ctaUrl}</p>
                  <p className="text-sm"><strong>Order:</strong> {banner.order}</p>
                  <p className="text-sm"><strong>Status:</strong> {banner.active ? 'Active' : 'Inactive'}</p>
                </div>
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
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface Banner {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaText: string;
  ctaUrl: string;
  active: boolean;
  order: number;
}

export default function AdminBanners() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = () => {
    const storedBanners = localStorage.getItem('banners');
    if (storedBanners) {
      setBanners(JSON.parse(storedBanners));
    } else {
      const { mockBanners } = require('@/lib/mockData');
      localStorage.setItem('banners', JSON.stringify(mockBanners));
      setBanners(mockBanners);
    }
  };

  const saveBanners = (updatedBanners: Banner[]) => {
    localStorage.setItem('banners', JSON.stringify(updatedBanners));
    setBanners(updatedBanners);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const banner: Banner = {
      id: editingBanner?.id || Date.now().toString(),
      title: formData.get('title') as string,
      subtitle: formData.get('subtitle') as string,
      imageUrl: formData.get('imageUrl') as string,
      ctaText: formData.get('ctaText') as string,
      ctaUrl: formData.get('ctaUrl') as string,
      active: formData.get('active') === 'on',
      order: Number(formData.get('order')),
    };

    if (editingBanner) {
      const updated = banners.map(b => b.id === editingBanner.id ? banner : b);
      saveBanners(updated);
      toast({ title: 'Banner updated successfully!' });
    } else {
      saveBanners([...banners, banner]);
      toast({ title: 'Banner added successfully!' });
    }

    setIsDialogOpen(false);
    setEditingBanner(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this banner?')) {
      saveBanners(banners.filter(b => b.id !== id));
      toast({ title: 'Banner deleted successfully!' });
    }
  };

  const openDialog = (banner?: Banner) => {
    setEditingBanner(banner || null);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Banners</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              Add Banner
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingBanner ? 'Edit Banner' : 'Add Banner'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" defaultValue={editingBanner?.title} required />
              </div>
              <div>
                <Label htmlFor="subtitle">Subtitle</Label>
                <Input id="subtitle" name="subtitle" defaultValue={editingBanner?.subtitle} required />
              </div>
              <div>
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input id="imageUrl" name="imageUrl" defaultValue={editingBanner?.imageUrl} required />
              </div>
              <div>
                <Label htmlFor="ctaText">CTA Button Text</Label>
                <Input id="ctaText" name="ctaText" defaultValue={editingBanner?.ctaText} required />
              </div>
              <div>
                <Label htmlFor="ctaUrl">CTA URL</Label>
                <Input id="ctaUrl" name="ctaUrl" defaultValue={editingBanner?.ctaUrl} required />
              </div>
              <div>
                <Label htmlFor="order">Display Order</Label>
                <Input id="order" name="order" type="number" defaultValue={editingBanner?.order || 1} required />
              </div>
              <div className="flex items-center gap-2">
                <Switch id="active" name="active" defaultChecked={editingBanner?.active !== false} />
                <Label htmlFor="active">Active</Label>
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button type="submit">Save</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {banners.sort((a, b) => a.order - b.order).map((banner) => (
          <Card key={banner.id} className={!banner.active ? 'opacity-50' : ''}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{banner.title}</CardTitle>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => openDialog(banner)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(banner.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <img src={banner.imageUrl} alt={banner.title} className="w-48 h-32 object-cover rounded-md" />
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{banner.subtitle}</p>
                  <p className="text-sm"><strong>CTA:</strong> {banner.ctaText} → {banner.ctaUrl}</p>
                  <p className="text-sm"><strong>Order:</strong> {banner.order}</p>
                  <p className="text-sm"><strong>Status:</strong> {banner.active ? 'Active' : 'Inactive'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
*/