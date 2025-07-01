import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "@/components/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Building2, Save, User, Target, Briefcase } from "lucide-react";

const businessProfileSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  industry: z.string().min(1, "Industry is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  targetAudience: z.string().min(10, "Target audience must be at least 10 characters"),
});

type BusinessProfileFormData = z.infer<typeof businessProfileSchema>;

const industries = [
  "Food & Beverage",
  "Retail & Fashion",
  "Health & Fitness",
  "Beauty & Cosmetics",
  "Technology",
  "Travel & Tourism",
  "Real Estate",
  "Education",
  "Professional Services",
  "Entertainment",
  "Non-Profit",
  "Other"
];

export default function BusinessProfile() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["/api/business-profile"],
  });

  const form = useForm<BusinessProfileFormData>({
    resolver: zodResolver(businessProfileSchema),
    defaultValues: {
      businessName: "",
      industry: "",
      description: "",
      targetAudience: "",
    },
  });

  // Populate form when profile data is loaded
  useEffect(() => {
    if (profile) {
      form.reset({
        businessName: profile.businessName || "",
        industry: profile.industry || "",
        description: profile.description || "",
        targetAudience: profile.targetAudience || "",
      });
    }
  }, [profile, form]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: BusinessProfileFormData) => {
      const response = await apiRequest("POST", "/api/business-profile", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Profile Updated",
        description: "Your business profile has been updated successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/business-profile"] });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: BusinessProfileFormData) => {
    updateProfileMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 ml-64 flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 ml-64">
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Business Profile</h1>
            <p className="text-gray-600">Manage your business information to create better content</p>
          </div>
        </header>
        
        <main className="p-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Form */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Building2 className="h-6 w-6 text-blue-600" />
                      <span>Business Information</span>
                    </CardTitle>
                    <CardDescription>
                      Tell us about your business to help us create better content suggestions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                          control={form.control}
                          name="businessName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Business Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Your business name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="industry"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Industry</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select your industry" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {industries.map((industry) => (
                                    <SelectItem key={industry} value={industry}>
                                      {industry}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Business Description</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Describe what your business does, your unique value proposition, and what makes you special..."
                                  className="min-h-[100px] resize-none"
                                  {...field}
                                />
                              </FormControl>
                              <div className="flex justify-between text-sm text-gray-500">
                                <FormMessage />
                                <span>{field.value?.length || 0}/500</span>
                              </div>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="targetAudience"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Target Audience</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Describe your ideal customers: demographics, interests, behaviors, pain points..."
                                  className="min-h-[100px] resize-none"
                                  {...field}
                                />
                              </FormControl>
                              <div className="flex justify-between text-sm text-gray-500">
                                <FormMessage />
                                <span>{field.value?.length || 0}/500</span>
                              </div>
                            </FormItem>
                          )}
                        />

                        <Button
                          type="submit"
                          disabled={updateProfileMutation.isPending}
                          className="w-full"
                        >
                          {updateProfileMutation.isPending ? (
                            <>
                              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4 mr-2" />
                              Save Profile
                            </>
                          )}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </div>

              {/* Profile Summary & Tips */}
              <div className="space-y-6">
                {/* Current Profile Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <User className="h-5 w-5 text-green-600" />
                      <span>Profile Summary</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {profile?.businessName ? (
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Business</p>
                          <p className="text-gray-800">{profile.businessName}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Industry</p>
                          <Badge variant="secondary">{profile.industry}</Badge>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Description</p>
                          <p className="text-sm text-gray-700 line-clamp-3">{profile.description}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">Complete your profile to get started</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Profile Tips */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Target className="h-5 w-5 text-purple-600" />
                      <span>Profile Tips</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <div>
                          <p className="font-medium text-gray-800">Be Specific</p>
                          <p className="text-sm text-gray-600">The more specific you are about your business, the better our AI can create relevant content.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <div>
                          <p className="font-medium text-gray-800">Know Your Audience</p>
                          <p className="text-sm text-gray-600">Understanding your target audience helps create content that resonates and drives engagement.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                        <div>
                          <p className="font-medium text-gray-800">Update Regularly</p>
                          <p className="text-sm text-gray-600">Keep your profile updated as your business evolves to maintain content relevance.</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* How This Helps */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Briefcase className="h-5 w-5 text-orange-600" />
                      <span>How This Helps</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">AI-generated content suggestions</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">Targeted hashtag recommendations</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">Optimal posting time suggestions</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">Industry-specific content ideas</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
