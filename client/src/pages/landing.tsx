import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Zap, 
  Instagram, 
  Calendar, 
  BarChart3, 
  Crown, 
  Check,
  ArrowRight,
  Users,
  Camera,
  TrendingUp
} from "lucide-react";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  const features = [
    {
      icon: <Instagram className="h-6 w-6" />,
      title: "Instagram Integration",
      description: "Connect your business account with secure OAuth2"
    },
    {
      icon: <Calendar className="h-6 w-6" />,
      title: "Smart Scheduling",
      description: "Schedule posts at optimal times for maximum engagement"
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Analytics Dashboard",
      description: "Track performance with detailed insights and metrics"
    },
    {
      icon: <Camera className="h-6 w-6" />,
      title: "Content Creation",
      description: "AI-powered post suggestions based on your business"
    }
  ];

  const plans = [
    {
      name: "Starter",
      price: "$9",
      period: "/month",
      description: "Perfect for small businesses",
      features: [
        "15 posts per month",
        "Basic analytics",
        "Post scheduling",
        "Email support"
      ],
      popular: false
    },
    {
      name: "Pro",
      price: "$29",
      period: "/month",
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
      name: "Enterprise",
      price: "$99",
      period: "/month",
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">
              Social<span className="text-blue-500">Boost</span>
            </h1>
          </div>
          
          <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Automate Your Instagram Marketing
          </h2>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Connect your business Instagram account, create engaging content, and schedule posts automatically. 
            Grow your audience with intelligent automation.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button onClick={handleLogin} className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3">
              Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" className="text-lg px-8 py-3">
              Watch Demo
            </Button>
          </div>
          
          <div className="flex items-center justify-center space-x-8 mt-12 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>5 free posts per month</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Everything you need to grow your Instagram presence
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Powerful features designed specifically for business Instagram accounts
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4 text-blue-600">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-blue-600 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-white">
            <div>
              <div className="text-4xl font-bold mb-2">10K+</div>
              <div className="text-blue-100">Business Accounts Connected</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500K+</div>
              <div className="text-blue-100">Posts Scheduled</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">2.5M+</div>
              <div className="text-blue-100">Engagement Generated</div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Choose Your Plan
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Select the perfect plan for your Instagram marketing needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? 'border-2 border-blue-500 shadow-xl' : 'border border-gray-200'}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-500 text-white px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600">{plan.period}</span>
                  </div>
                  <CardDescription className="mt-2">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-3">
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button 
                    onClick={handleLogin}
                    className={`w-full ${plan.popular ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    {plan.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to boost your Instagram marketing?
          </h3>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses already using SocialBoost to grow their Instagram presence
          </p>
          <Button onClick={handleLogin} className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3">
            Start Your Free Trial <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center space-x-3 mb-8">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold">SocialBoost</span>
          </div>
          <div className="text-center text-gray-400">
            <p>© 2024 SocialBoost. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
