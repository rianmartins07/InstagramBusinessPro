import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, CreditCard, ArrowUpRight } from "lucide-react";

export default function SubscriptionStatus() {
  const { user } = useAuth();

  const getSubscriptionInfo = () => {
    const tier = user?.subscriptionTier || 'free';
    const status = user?.subscriptionStatus || 'inactive';
    
    const plans = {
      free: { name: 'Free', price: '$0', limit: 5, color: 'gray' },
      starter: { name: 'Starter', price: '$9', limit: 15, color: 'blue' },
      pro: { name: 'Pro', price: '$29', limit: 50, color: 'purple' },
      enterprise: { name: 'Enterprise', price: '$99', limit: -1, color: 'orange' }
    };

    return {
      ...plans[tier as keyof typeof plans],
      tier,
      status,
      isActive: status === 'active'
    };
  };

  const subscription = getSubscriptionInfo();
  const postsUsed = user?.monthlyPostsUsed || 0;
  const usagePercentage = subscription.limit === -1 ? 0 : Math.min((postsUsed / subscription.limit) * 100, 100);

  const getNextBillingDate = () => {
    const today = new Date();
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 15);
    return nextMonth.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Crown className="h-5 w-5 text-yellow-600" />
          <span>Subscription Status</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center space-y-4">
          {/* Plan Icon */}
          <div className={`w-16 h-16 bg-gradient-to-r ${
            subscription.color === 'purple' ? 'from-blue-500 to-purple-500' :
            subscription.color === 'blue' ? 'from-blue-400 to-blue-600' :
            subscription.color === 'orange' ? 'from-orange-400 to-orange-600' :
            'from-gray-400 to-gray-600'
          } rounded-full flex items-center justify-center mx-auto`}>
            <Crown className="h-8 w-8 text-white" />
          </div>

          {/* Plan Details */}
          <div>
            <h4 className="font-bold text-xl text-gray-800">{subscription.name} Plan</h4>
            <p className="text-2xl font-bold text-blue-600 mt-1">
              {subscription.price}
              <span className="text-lg text-gray-600 font-normal">/month</span>
            </p>
          </div>

          {/* Usage Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Posts Used</span>
              <span className="text-sm font-medium">
                {postsUsed}/{subscription.limit === -1 ? '∞' : subscription.limit}
              </span>
            </div>
            {subscription.limit !== -1 && (
              <div className="bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${usagePercentage}%` }}
                />
              </div>
            )}
          </div>

          {/* Renewal Info */}
          {subscription.tier !== 'free' && subscription.isActive && (
            <p className="text-sm text-gray-500">
              Renews on <span className="font-medium">{getNextBillingDate()}</span>
            </p>
          )}

          {/* Action Buttons */}
          <div className="space-y-2">
            <Link href="/subscription">
              <Button variant="outline" className="w-full">
                <CreditCard className="h-4 w-4 mr-2" />
                Manage Subscription
              </Button>
            </Link>
            
            {subscription.tier === 'free' || !subscription.isActive ? (
              <Link href="/subscription">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <ArrowUpRight className="h-4 w-4 mr-2" />
                  Upgrade Plan
                </Button>
              </Link>
            ) : subscription.tier !== 'enterprise' && (
              <Link href="/subscription">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <ArrowUpRight className="h-4 w-4 mr-2" />
                  Upgrade Plan
                </Button>
              </Link>
            )}
          </div>

          {/* Plan Features Preview */}
          <div className="pt-4 border-t border-gray-200">
            <div className="space-y-2 text-left">
              <p className="text-xs text-gray-500 font-medium">CURRENT PLAN INCLUDES:</p>
              {subscription.tier === 'free' && (
                <div className="space-y-1">
                  <p className="text-xs text-gray-600">• 5 posts per month</p>
                  <p className="text-xs text-gray-600">• Basic analytics</p>
                  <p className="text-xs text-gray-600">• Email support</p>
                </div>
              )}
              {subscription.tier === 'starter' && (
                <div className="space-y-1">
                  <p className="text-xs text-gray-600">• 15 posts per month</p>
                  <p className="text-xs text-gray-600">• Basic analytics</p>
                  <p className="text-xs text-gray-600">• Post scheduling</p>
                  <p className="text-xs text-gray-600">• Email support</p>
                </div>
              )}
              {subscription.tier === 'pro' && (
                <div className="space-y-1">
                  <p className="text-xs text-gray-600">• 50 posts per month</p>
                  <p className="text-xs text-gray-600">• Advanced analytics</p>
                  <p className="text-xs text-gray-600">• AI content suggestions</p>
                  <p className="text-xs text-gray-600">• Priority support</p>
                </div>
              )}
              {subscription.tier === 'enterprise' && (
                <div className="space-y-1">
                  <p className="text-xs text-gray-600">• Unlimited posts</p>
                  <p className="text-xs text-gray-600">• Custom analytics</p>
                  <p className="text-xs text-gray-600">• Multiple accounts</p>
                  <p className="text-xs text-gray-600">• Dedicated support</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
