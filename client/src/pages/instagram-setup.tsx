import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "@/components/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Instagram, Shield, Check, ExternalLink, AlertCircle } from "lucide-react";

export default function InstagramSetup() {
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);

  const { data: businessProfile } = useQuery({
    queryKey: ["/api/business-profile"],
  });

  const connectMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/instagram/connect", {
        code: "mock_authorization_code"
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Instagram Connected",
        description: "Your Instagram business account has been connected successfully!",
      });
      window.location.href = "/";
    },
    onError: (error) => {
      toast({
        title: "Connection Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      
      // Get Instagram auth URL
      const response = await apiRequest("GET", "/api/instagram/auth-url");
      const { authUrl } = await response.json();
      
      // Simulate OAuth flow
      toast({
        title: "Redirecting to Instagram",
        description: "You will be redirected to Instagram to authorize the connection.",
      });
      
      // In a real implementation, we would redirect to Instagram
      // For demo purposes, we'll simulate the connection
      setTimeout(() => {
        connectMutation.mutate();
      }, 2000);
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      setIsConnecting(false);
    }
  };

  const isConnected = businessProfile?.instagramConnected;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 ml-64">
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Instagram Setup</h1>
            <p className="text-gray-600">Connect your Instagram business account to start posting</p>
          </div>
        </header>
        
        <main className="p-6">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Connection Status */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Instagram className="h-6 w-6 text-pink-600" />
                    <span>Instagram Connection Status</span>
                  </CardTitle>
                  {isConnected ? (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                      <Check className="h-4 w-4 mr-1" />
                      Connected
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      Not Connected
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {isConnected ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
                      <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center">
                        <Instagram className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">
                          @{businessProfile?.instagramUsername}
                        </h4>
                        <p className="text-sm text-gray-600">Business Account Connected</p>
                      </div>
                    </div>
                    
                    <div class="flex space-x-3">
                      <Button variant="outline" className="flex-1">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View on Instagram
                      </Button>
                      <Button variant="outline" onClick={handleConnect} disabled={isConnecting}>
                        Reconnect Account
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto">
                      <Instagram className="h-8 w-8 text-pink-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Connect Your Instagram Business Account
                      </h3>
                      <p className="text-gray-600">
                        You'll need a business account to use our posting features
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Security Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-6 w-6 text-blue-600" />
                  <span>Security & Privacy</span>
                </CardTitle>
                <CardDescription>
                  Your account security is our top priority
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <Check className="h-5 w-5 text-blue-600 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-800">Secure OAuth2 Connection</p>
                      <p className="text-sm text-gray-600">
                        We use Instagram's official OAuth2 protocol for secure authentication
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <Check className="h-5 w-5 text-blue-600 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-800">No Password Storage</p>
                      <p className="text-sm text-gray-600">
                        We never store your Instagram password or personal data
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <Check className="h-5 w-5 text-blue-600 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-800">Revokable Access</p>
                      <p className="text-sm text-gray-600">
                        You can revoke access anytime from your Instagram settings
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card>
              <CardHeader>
                <CardTitle>Business Account Requirements</CardTitle>
                <CardDescription>
                  Make sure your Instagram account meets these requirements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-gray-700">Instagram Business Account</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-gray-700">Facebook Page connected to Instagram</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-gray-700">Account admin permissions</span>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> Personal Instagram accounts cannot be used for automated posting. 
                    You'll need to convert to a business account first.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Connect Button */}
            {!isConnected && (
              <Card>
                <CardContent className="pt-6">
                  <Button
                    onClick={handleConnect}
                    disabled={isConnecting || connectMutation.isPending}
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
                    size="lg"
                  >
                    {isConnecting || connectMutation.isPending ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Instagram className="h-5 w-5 mr-2" />
                        Connect Instagram Business Account
                      </>
                    )}
                  </Button>
                  
                  <p className="text-center text-sm text-gray-500 mt-3">
                    By connecting, you agree to our Terms of Service and Privacy Policy
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
