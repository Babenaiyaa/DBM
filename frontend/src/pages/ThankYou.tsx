import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, MessageCircle } from 'lucide-react';
import { MOM_PHONE } from '@/lib/mockData';

const ThankYou = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderDetails = location.state?.orderDetails;

  if (!orderDetails) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <Card className="p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
          <p className="text-muted-foreground mb-8">
            Thank you for your order. We'll contact you via WhatsApp shortly.
          </p>

          <div className="bg-secondary rounded-lg p-6 mb-8 text-left">
            <h2 className="font-semibold mb-4">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Name:</span>
                <span>{orderDetails.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">WhatsApp:</span>
                <span>{orderDetails.whatsapp}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Method:</span>
                <span>{orderDetails.paymentMethod}</span>
              </div>
              {orderDetails.paymentRef && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Reference:</span>
                  <span className="font-mono font-semibold">{orderDetails.paymentRef}</span>
                </div>
              )}
              <div className="flex justify-between border-t pt-2 mt-2">
                <span className="font-semibold">Total:</span>
                <span className="font-bold text-primary">LKR {orderDetails.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {orderDetails.paymentMethod === 'Bank Transfer' && (
            <div className="bg-accent/20 border border-accent rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold mb-2">Bank Transfer Instructions</h3>
              <p className="text-sm text-muted-foreground">
                Please use the payment reference <span className="font-mono font-semibold">{orderDetails.paymentRef}</span> when making your transfer.
                Send the receipt via WhatsApp to confirm your order.
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => window.open(`https://wa.me/${MOM_PHONE}`, '_blank')}
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              Contact on WhatsApp
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate('/')}>
              Continue Shopping
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ThankYou;
