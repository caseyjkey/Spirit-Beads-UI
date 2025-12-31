import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';

const Cancel = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <XCircle className="h-16 w-16 text-orange-500" />
        </div>
        
        <div className="space-y-2">
          <h1 className="font-display text-3xl font-bold text-foreground">
            Payment Cancelled
          </h1>
          <p className="font-body text-muted-foreground text-lg">
            Your payment was cancelled and no charges were made.
          </p>
        </div>

        <div className="space-y-4">
          <p className="font-body text-sm text-muted-foreground">
            Your cart is still available if you'd like to complete your purchase later.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              onClick={() => navigate('/')}
              className="w-full sm:w-auto"
            >
              Return to Shop
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cancel;
