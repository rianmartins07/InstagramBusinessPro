import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Crown, X } from "lucide-react";

interface SubscriptionPlansModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const plans = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    description: "Get started with basic features",
    features: [
      "5 posts per month",
      "Basic analytics",
      "Post scheduling",
      "Community support"
    ],
    popular: false,
    note: "Credit card required for verification"
  },
  {
    id: "starter",
    name: "Starter",
    price: "$9",
    description: "Perfect for small businesses",
    features: [
      "50 posts per month",
      "Basic analytics",
      "Post scheduling",
      "Email support"
    ],
    popular: false
  },
  {
    id: "pro",
    name: "Pro",
    price: "$29",
    description: "Best for growing businesses",
    features: [
      "50 posts per month",
      "Advanced analytics",
      "AI content suggestions",
      "Priority support",
      "Bulk scheduling"
    ],
    popular: true
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "$99",
    description: "For large businesses",
    features: [
      "Unlimited posts",
      "Custom analytics",
      "Multiple accounts",
      "Dedicated support",
      "API access"
    ],
    popular: false
  }
];

export default function SubscriptionPlansModal({ isOpen, onClose }: SubscriptionPlansModalProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const stripe = useStripe();
  const elements = useElements();
  
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const createSubscriptionMutation = useMutation({
    mutationFn: async (planId: string) => {
      const response = await apiRequest("POST", "/api/create-subscription", {
        tier: planId
      });
      return response.json();
    },
    onSuccess: (data) => {
      setClientSecret(data.clientSecret);
      toast({
        title: "Subscription Created",
        description: "Please complete your payment to activate your subscription.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handlePlanSelect = (planId: string) => {
    if (planId === "enterprise") {
      toast({
        title: "Contact Sales",
        description: "Please contact our sales team for Enterprise plans.",
      });
      return;
    }
    
    setSelectedPlan(planId);
    createSubscriptionMutation.mutate(planId);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setIsProcessing(true);

    // Check if this is a free tier setup intent or paid subscription
    if (selectedPlan === 'free') {
      const { error } = await stripe.confirmSetup({
        elements,
        confirmParams: {
          return_url: window.location.origin,
        },
        redirect: "if_required",
      });

      if (error) {
        toast({
          title: "Payment Method Setup Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Payment Method Added",
          description: "Your free account has been activated!",
        });
        queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
        onClose();
      }
    } else {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin,
        },
        redirect: "if_required",
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Payment Successful",
          description: "Your subscription has been activated!",
        });
        queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
        onClose();
      }
    }

    setIsProcessing(false);
  };

  const handleClose = () => {
    setSelectedPlan(null);
    setClientSecret(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl">Choose Your Plan</DialogTitle>
              <DialogDescription className="mt-2">
                Select the perfect plan for your Instagram marketing needs
              </DialogDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        {!clientSecret ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {plans.map((plan) => (
              <Card 
                key={plan.id} 
                className={`relative ${plan.popular ? 'border-2 border-blue-500 shadow-xl' : 'border border-gray-200'} hover:shadow-lg transition-shadow cursor-pointer`}
                onClick={() => handlePlanSelect(plan.id)}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-500 text-white px-4 py-1">
                      <Crown className="h-3 w-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="mt-2">
                    <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600">/month</span>
                  </div>
                  <p className="text-gray-600 mt-2">{plan.description}</p>
                  {plan.note && (
                    <p className="text-xs text-amber-600 mt-2 bg-amber-50 px-2 py-1 rounded">
                      {plan.note}
                    </p>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button 
                    className={`w-full ${plan.popular ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    disabled={createSubscriptionMutation.isPending}
                  >
                    {createSubscriptionMutation.isPending && selectedPlan === plan.id ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                        Setting up...
                      </>
                    ) : plan.id === "enterprise" ? (
                      "Contact Sales"
                    ) : (user as any)?.subscriptionTier === plan.id ? (
                      "Current Plan"
                    ) : (
                      "Select Plan"
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="mt-6">
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">
                Complete Your {plans.find(p => p.id === selectedPlan)?.name} Subscription
              </h3>
              <p className="text-blue-700 text-sm">
                Enter your payment details below to activate your subscription.
              </p>
            </div>
            
            <form onSubmit={handlePaymentSubmit} className="space-y-6">
              <PaymentElement />
              
              <div className="flex space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setSelectedPlan(null);
                    setClientSecret(null);
                  }}
                  className="flex-1"
                >
                  Back to Plans
                </Button>
                <Button
                  type="submit"
                  disabled={!stripe || !elements || isProcessing}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                      Processing...
                    </>
                  ) : (
                    "Complete Subscription"
                  )}
                </Button>
              </div>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
