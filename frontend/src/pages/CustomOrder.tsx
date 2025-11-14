import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Upload, X } from 'lucide-react';

const CustomOrder = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    address: '',
    deliveryDate: '',
    material: '',
    size: '',
  });

  const [images, setImages] = useState<File[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (images.length + files.length > 3) {
      toast({
        title: 'Too many images',
        description: 'Maximum 3 images allowed',
        variant: 'destructive',
      });
      return;
    }

    setImages([...images, ...files.slice(0, 3 - images.length)]);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  // ---------------------------
  //      SUBMIT FORM
  // ---------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.whatsapp || !formData.material) {
      toast({
        title: 'Missing information',
        description: 'Please fill all required fields.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('whatsapp', formData.whatsapp);
      data.append('address', formData.address);
      data.append('expectedDelivery', formData.deliveryDate);
      data.append('material', formData.material);
      data.append('sizeDetails', formData.size);

      // Attach images
      images.forEach((file) => {
        data.append('referenceImages', file);
      });

      const res = await fetch('http://localhost:5000/api/custom-orders', {
        method: 'POST',
        body: data,
      });

      if (!res.ok) {
        throw new Error('Failed to submit order');
      }

      toast({
        title: 'Custom order submitted!',
        description: 'We will contact you shortly via WhatsApp.',
      });

      navigate('/');
    } catch (error) {
      toast({
        title: 'Error submitting order',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Custom Order</h1>
          <p className="text-muted-foreground">
            Tell us about your dream outfit and we'll make it a reality.
          </p>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="whatsapp">WhatsApp Number *</Label>
                <Input
                  id="whatsapp"
                  type="tel"
                  placeholder="+94771234567"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address">Delivery Address</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="deliveryDate">Expected Delivery Date</Label>
              <Input
                id="deliveryDate"
                type="date"
                value={formData.deliveryDate}
                onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="material">Material / Type of Garment *</Label>
              <Input
                id="material"
                placeholder="e.g., Silk dress, Cotton blouse"
                value={formData.material}
                onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="size">Size Details *</Label>
              <Textarea
                id="size"
                placeholder="Provide measurements or size information"
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                required
              />
            </div>

            {/* IMAGE UPLOAD */}
            <div>
              <Label>Reference Images (Optional, max 3)</Label>

              <div className="mt-2 space-y-4">
                {images.length < 3 && (
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />

                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      multiple
                      className="hidden"
                      id="image-upload"
                    />

                    <Label htmlFor="image-upload" className="cursor-pointer">
                      <span className="text-primary hover:underline">Click to upload</span>
                      <span className="text-muted-foreground"> or drag and drop</span>
                    </Label>
                  </div>
                )}

                {images.length > 0 && (
                  <div className="grid grid-cols-3 gap-4">
                    {images.map((file, index) => (
                      <div
                        key={index}
                        className="relative aspect-square rounded-lg overflow-hidden bg-secondary"
                      >
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Reference ${index + 1}`}
                          className="w-full h-full object-cover"
                        />

                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full">
              Submit Custom Order
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default CustomOrder;



/*import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { MOM_PHONE } from '@/lib/mockData';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Upload, X } from 'lucide-react';

const CustomOrder = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    address: '',
    deliveryDate: '',
    material: '',
    size: ''
  });

  const [images, setImages] = useState<File[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 3) {
      toast({
        title: 'Too many images',
        description: 'Maximum 3 images allowed',
        variant: 'destructive'
      });
      return;
    }
    setImages([...images, ...files.slice(0, 3 - images.length)]);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.whatsapp || !formData.material) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all required fields.',
        variant: 'destructive'
      });
      return;
    }

    const message = `Hi! I'd like to place a custom order:\n\nName: ${formData.name}\nMaterial/Type: ${formData.material}\nSize Details: ${formData.size}\nDelivery Date: ${formData.deliveryDate || 'Not specified'}\nDelivery Address: ${formData.address}\n\nI'll send reference images separately.`;

    toast({
      title: 'Custom order submitted!',
      description: 'We\'ll contact you via WhatsApp shortly.',
    });

    setTimeout(() => {
      window.open(`https://wa.me/${MOM_PHONE}?text=${encodeURIComponent(message)}`, '_blank');
    }, 500);

    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Custom Order</h1>
          <p className="text-muted-foreground">
            Tell us about your dream outfit and we'll make it a reality
          </p>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="whatsapp">WhatsApp Number *</Label>
                <Input
                  id="whatsapp"
                  type="tel"
                  placeholder="+94771234567"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address">Delivery Address</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="deliveryDate">Expected Delivery Date</Label>
              <Input
                id="deliveryDate"
                type="date"
                value={formData.deliveryDate}
                onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="material">Material/Type of Garment *</Label>
              <Input
                id="material"
                placeholder="e.g., Silk dress, Cotton blouse"
                value={formData.material}
                onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="size">Size Details *</Label>
              <Textarea
                id="size"
                placeholder="Provide measurements or size information"
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                required
              />
            </div>

            <div>
              <Label>Reference Images (Optional, max 3)</Label>
              <div className="mt-2 space-y-4">
                {images.length < 3 && (
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      multiple
                      className="hidden"
                      id="image-upload"
                    />
                    <Label htmlFor="image-upload" className="cursor-pointer">
                      <span className="text-primary hover:underline">Click to upload</span>
                      <span className="text-muted-foreground"> or drag and drop</span>
                    </Label>
                  </div>
                )}

                {images.length > 0 && (
                  <div className="grid grid-cols-3 gap-4">
                    {images.map((file, index) => (
                      <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-secondary">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Reference ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full">
              Submit Custom Order
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default CustomOrder;
*/