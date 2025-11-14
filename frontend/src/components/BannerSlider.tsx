import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface Banner {
  _id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  ctaText?: string;
  ctaUrl?: string;
  active: boolean;
  order?: number;
}

export const BannerSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [banners, setBanners] = useState<Banner[]>([]);
  const navigate = useNavigate();

  // Fetch banners directly from backend
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/banners"); 
        const data = await res.json();
        setBanners(data);
      } catch (error) {
        console.error("Error fetching banners:", error);
      }
    };

    fetchBanners();
  }, []);

  const activeBanners = banners
    .filter(b => b.active)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  useEffect(() => {
    if (activeBanners.length === 0) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeBanners.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [activeBanners.length]);

  if (activeBanners.length === 0) return null;

  return (
    <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden group">
      {activeBanners.map((banner, index) => (
        <div
          key={banner._id}
          className={`absolute inset-0 transition-all duration-500 ${
            index === currentSlide ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
          }`}
          style={{
            backgroundImage: `url(${banner.imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 to-foreground/30" />

          <div className="relative h-full container mx-auto px-4 flex items-center">
            <div className="max-w-2xl text-background space-y-4 md:space-y-6">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight">
                {banner.title}
              </h1>

              {banner.subtitle && (
                <p className="text-lg md:text-xl lg:text-2xl opacity-90">
                  {banner.subtitle}
                </p>
              )}

              {banner.ctaText && (
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary-glow text-primary-foreground shadow-elegant"
                  onClick={() => navigate(banner.ctaUrl || '/')}
                >
                  {banner.ctaText}
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Previous Button */}
      <button
        onClick={() =>
          setCurrentSlide((prev) => (prev - 1 + activeBanners.length) % activeBanners.length)
        }
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/20 hover:bg-background/40 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronLeft className="h-6 w-6 text-background" />
      </button>

      {/* Next Button */}
      <button
        onClick={() =>
          setCurrentSlide((prev) => (prev + 1) % activeBanners.length)
        }
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/20 hover:bg-background/40 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronRight className="h-6 w-6 text-background" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {activeBanners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentSlide ? 'bg-background w-8' : 'bg-background/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};



/*import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockBanners } from '@/lib/mockData';
import { useNavigate } from 'react-router-dom';

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

export const BannerSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [banners, setBanners] = useState<Banner[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Load banners from localStorage, fallback to mockBanners
    const storedBanners = localStorage.getItem('banners');
    const loadedBanners = storedBanners ? JSON.parse(storedBanners) : mockBanners;
    if (!storedBanners) {
      localStorage.setItem('banners', JSON.stringify(mockBanners));
    }
    setBanners(loadedBanners);
  }, []);

  const activeBanners = banners.filter(b => b.active).sort((a, b) => a.order - b.order);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeBanners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [activeBanners.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % activeBanners.length);
  };

  if (activeBanners.length === 0) return null;

  return (
    <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden group">
      {activeBanners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-all duration-500 ${
            index === currentSlide ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
          }`}
          style={{
            backgroundImage: `url(${banner.imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 to-foreground/30" />
          
          <div className="relative h-full container mx-auto px-4 flex items-center">
            <div className="max-w-2xl text-background space-y-4 md:space-y-6">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight animate-fade-in">
                {banner.title}
              </h1>
              <p className="text-lg md:text-xl lg:text-2xl opacity-90 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                {banner.subtitle}
              </p>
              <Button
                size="lg"
                className="bg-primary hover:bg-primary-glow text-primary-foreground shadow-elegant animate-fade-in"
                style={{ animationDelay: '0.2s' }}
                onClick={() => navigate(banner.ctaUrl)}
              >
                {banner.ctaText}
              </Button>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */  /*  }  
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/20 hover:bg-background/40 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronLeft className="h-6 w-6 text-background" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/20 hover:bg-background/40 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronRight className="h-6 w-6 text-background" />
      </button>

      {/* Indicators */   /*  }
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {activeBanners.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentSlide ? 'bg-background w-8' : 'bg-background/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
*/