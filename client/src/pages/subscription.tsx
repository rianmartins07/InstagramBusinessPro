import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import Sidebar from "@/components/sidebar";
import SubscriptionPlansModal from "@/components/subscription-plans-modal";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Check, AlertCircle, CreditCard } from "lucide-react";

if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export default function Subscription() {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showPlansModal, setShowPlansModal] = useState(false);

  const cancelMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/cancel-subscription");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Subscription Canceled",
        description: "Your subscription has been canceled successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getSubscriptionStatus = () => {
    const tier = user?.subscriptionTier || 'free';
    const status = user?.subscriptionStatus || 'inactive';
    
    return {
      tier: tier.charAt(0).toUpperCase() + tier.slice(1),
      status: status.charAt(0).toUpperCase() + status.slice(1),
      isActive: status === 'active',
      isPaid: tier !== 'free'
    };
  };

  const getSubscriptionLimits = () => {
    const tier = user?.subscriptionTier || 'free';
    const limits = {
      free: { posts: 5, price: '$0' },
      starter: { posts: 15, price: '$9' },
      pro: { posts: 50, price: '$29' },
      enterprise: { posts: -1, price: '$99' }
    };
    return limits[tier as keyof typeof limits] || limits.free;
  };

  const subscription = getSubscriptionStatus();
  const limits = getSubscriptionLimits();
  const postsUsed = user?.monthlyPostsUsed || 0;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 ml-64">
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Subscription Management</h1>
            <p className="text-gray-600">Manage your SocialBoost subscription and billing</p>
          </div>
        </header>
        
        <main className="p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Current Subscription */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Crown className="h-6 w-6 text-yellow-600" />
                    <span>Current Plan</span>
                  </CardTitle>
                  <Badge 
                    className={subscription.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                  >
                    {subscription.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">{subscription.tier} Plan</h3>
                    <p className="text-3xl font-bold text-blue-600 mt-1">
                      {limits.price}
                      <span className="text-lg text-gray-600 font-normal">/month</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Monthly Usage</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {postsUsed}
                      <span className="text-lg text-gray-600 font-normal">
                        /{limits.posts === -1 ? '∞' : limits.posts}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Usage Progress */}
                {limits.posts !== -1 && (
                  <div className="mb-6">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Posts Used This Month</span>
                      <span>{postsUsed}/{limits.posts}</span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${Math.min((postsUsed / limits.posts) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={() => setShowPlansModal(true)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    {subscription.tier === 'Free' ? 'Upgrade Plan' : 'Change Plan'}
                  </Button>
                  
                  {subscription.isPaid && subscription.isActive && (
                    <Button
                      variant="outline"
                      onClick={() => cancelMutation.mutate()}
                      disabled={cancelMutation.isPending}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      {cancelMutation.isPending ? 'Canceling...' : 'Cancel Subscription'}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Plan Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="text-center">
                  <CardTitle>Starter</CardTitle>
                  <div className="text-3xl font-bold text-gray-800">$9<span className="text-lg text-gray-600 font-normal">/month</span></div>
                  <CardDescription>Perfect for small businesses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">15 posts per month</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Basic analytics</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Post scheduling</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Email support</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-blue-500 relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-500 text-white">Most Popular</Badge>
                </div>
                <CardHeader className="text-center">
                  <CardTitle>Pro</CardTitle>
                  <div className="text-3xl font-bold text-gray-800">$29<span className="text-lg text-gray-600 font-normal">/month</span></div>
                  <CardDescription>Best for growing businesses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">50 posts per month</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Advanced analytics</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">AI content suggestions</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Priority support</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Bulk scheduling</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <CardTitle>Enterprise</CardTitle>
                  <div className="text-3xl font-bold text-gray-800">$99<span className="text-lg text-gray-600 font-normal">/month</span></div>
                  <CardDescription>For large businesses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Unlimited posts</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Custom analytics</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Multiple accounts</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Dedicated support</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">API access</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Billing Info */}
            {subscription.isPaid && (
              <Card>
                <CardHeader>
                  <CardTitle>Billing Information</CardTitle>
                  <CardDescription>
                    Manage your billing details and payment method
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CreditCard className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-800">Payment Method</p>
                        <p className="text-sm text-gray-600">•••• •••• •••• 4242</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Update
                    </Button>
                  </div>
                  
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-sm text-blue-800 font-medium">Next billing date</p>
                        <p className="text-sm text-blue-700">Your next payment of {limits.price} will be charged on March 15, 2024</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>

      <Elements stripe={stripePromise}>
        <SubscriptionPlansModal
          isOpen={showPlansModal}
          onClose={() => setShowPlansModal(false)}
        />
      </Elements>
    </div>
  );
}
