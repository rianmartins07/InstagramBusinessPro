import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "@/components/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Clock, Image, Send, Save, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const createPostSchema = z.object({
  caption: z.string().min(1, "Caption is required").max(2200, "Caption must be under 2200 characters"),
  imageUrl: z.string().url("Please enter a valid image URL").optional().or(z.literal("")),
  scheduledFor: z.date().optional(),
  status: z.enum(["draft", "scheduled", "published"]).default("draft"),
});

type CreatePostFormData = z.infer<typeof createPostSchema>;

export default function CreatePost() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState("12:00");

  const form = useForm<CreatePostFormData>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      caption: "",
      imageUrl: "",
      status: "draft",
    },
  });

  const createPostMutation = useMutation({
    mutationFn: async (data: CreatePostFormData) => {
      const response = await apiRequest("POST", "/api/posts", data);
      return response.json();
    },
    onSuccess: (data, variables) => {
      toast({
        title: "Post Created",
        description: variables.status === "scheduled" ? "Your post has been scheduled successfully!" : "Your post has been saved as a draft.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/posts/recent"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics/stats"] });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const publishNowMutation = useMutation({
    mutationFn: async (data: CreatePostFormData) => {
      // First create the post
      const response = await apiRequest("POST", "/api/posts", {
        ...data,
        status: "published",
        scheduledFor: new Date(),
      });
      const post = await response.json();
      
      // Then publish to Instagram
      await apiRequest("POST", "/api/instagram/publish", {
        postId: post.id,
      });
      
      return post;
    },
    onSuccess: () => {
      toast({
        title: "Post Published",
        description: "Your post has been published to Instagram successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/posts/recent"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics/stats"] });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Publish Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const generateAICaption = () => {
    const aiCaptions = [
      "🌟 Starting the week with positive vibes! What's inspiring you today? #mondaymotivation #inspiration",
      "☕ The perfect morning fuel for productivity! Nothing beats a fresh cup to kickstart the day. #coffee #morningvibes",
      "📈 Success is not just about the destination, it's about the journey. Every step counts! #success #motivation",
      "🎯 Focus on progress, not perfection. Small steps lead to big achievements! #mindset #growth",
      "💡 Innovation happens when we dare to think differently. What's your next big idea? #innovation #creativity"
    ];
    
    const randomCaption = aiCaptions[Math.floor(Math.random() * aiCaptions.length)];
    form.setValue("caption", randomCaption);
    
    toast({
      title: "AI Caption Generated",
      description: "We've generated a caption for you! Feel free to customize it.",
    });
  };

  const onSubmit = (data: CreatePostFormData) => {
    let submissionData = { ...data };
    
    // Combine date and time for scheduled posts
    if (data.status === "scheduled" && data.scheduledFor) {
      const [hours, minutes] = selectedTime.split(":").map(Number);
      const scheduledDate = new Date(data.scheduledFor);
      scheduledDate.setHours(hours, minutes, 0, 0);
      submissionData.scheduledFor = scheduledDate;
    }
    
    createPostMutation.mutate(submissionData);
  };

  const handlePublishNow = () => {
    const data = form.getValues();
    if (!data.caption.trim()) {
      toast({
        title: "Caption Required",
        description: "Please add a caption before publishing.",
        variant: "destructive",
      });
      return;
    }
    publishNowMutation.mutate(data);
  };

  const isScheduled = form.watch("status") === "scheduled";
  const selectedDate = form.watch("scheduledFor");

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 ml-64">
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Create Post</h1>
            <p className="text-gray-600">Create and schedule your Instagram posts</p>
          </div>
        </header>
        
        <main className="p-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Form */}
              <Card>
                <CardHeader>
                  <CardTitle>New Post</CardTitle>
                  <CardDescription>
                    Create engaging content for your Instagram audience
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      {/* Caption */}
                      <FormField
                        control={form.control}
                        name="caption"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center justify-between">
                              <FormLabel>Caption</FormLabel>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={generateAICaption}
                                className="text-purple-600 border-purple-200 hover:bg-purple-50"
                              >
                                <Sparkles className="h-4 w-4 mr-1" />
                                AI Generate
                              </Button>
                            </div>
                            <FormControl>
                              <Textarea
                                placeholder="Write your caption here... Use hashtags and mention other accounts to increase engagement!"
                                className="min-h-[120px] resize-none"
                                {...field}
                              />
                            </FormControl>
                            <div className="flex justify-between text-sm text-gray-500">
                              <FormMessage />
                              <span>{field.value?.length || 0}/2200</span>
                            </div>
                          </FormItem>
                        )}
                      />

                      {/* Image URL */}
                      <FormField
                        control={form.control}
                        name="imageUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Image URL (Optional)</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="https://example.com/image.jpg"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Post Type */}
                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Post Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select post type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="draft">
                                  <div className="flex items-center space-x-2">
                                    <Save className="h-4 w-4" />
                                    <span>Save as Draft</span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="scheduled">
                                  <div className="flex items-center space-x-2">
                                    <Calendar className="h-4 w-4" />
                                    <span>Schedule for Later</span>
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Schedule Date & Time */}
                      {isScheduled && (
                        <div className="space-y-4">
                          <FormField
                            control={form.control}
                            name="scheduledFor"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Schedule Date</FormLabel>
                                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                        variant="outline"
                                        className={cn(
                                          "w-full pl-3 text-left font-normal",
                                          !field.value && "text-muted-foreground"
                                        )}
                                      >
                                        {field.value ? (
                                          format(field.value, "PPP")
                                        ) : (
                                          <span>Pick a date</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                      </Button>
                                    </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                      mode="single"
                                      selected={field.value}
                                      onSelect={(date) => {
                                        field.onChange(date);
                                        setIsCalendarOpen(false);
                                      }}
                                      disabled={(date) =>
                                        date < new Date() || date < new Date("1900-01-01")
                                      }
                                      initialFocus
                                    />
                                  </PopoverContent>
                                </Popover>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div>
                            <Label htmlFor="time">Schedule Time</Label>
                            <div className="flex items-center space-x-2 mt-1">
                              <Clock className="h-4 w-4 text-gray-500" />
                              <Input
                                id="time"
                                type="time"
                                value={selectedTime}
                                onChange={(e) => setSelectedTime(e.target.value)}
                                className="w-32"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex flex-col space-y-3">
                        <Button
                          type="submit"
                          disabled={createPostMutation.isPending}
                          className="w-full"
                        >
                          {createPostMutation.isPending ? (
                            <>
                              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                              {isScheduled ? "Scheduling..." : "Saving..."}
                            </>
                          ) : (
                            <>
                              {isScheduled ? (
                                <>
                                  <Calendar className="h-4 w-4 mr-2" />
                                  Schedule Post
                                </>
                              ) : (
                                <>
                                  <Save className="h-4 w-4 mr-2" />
                                  Save Draft
                                </>
                              )}
                            </>
                          )}
                        </Button>
                        
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handlePublishNow}
                          disabled={publishNowMutation.isPending}
                          className="w-full bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                        >
                          {publishNowMutation.isPending ? (
                            <>
                              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                              Publishing...
                            </>
                          ) : (
                            <>
                              <Send className="h-4 w-4 mr-2" />
                              Publish Now
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>

              {/* Preview */}
              <Card>
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                  <CardDescription>
                    See how your post will look on Instagram
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden max-w-sm mx-auto">
                    {/* Instagram Header */}
                    <div className="flex items-center space-x-3 p-3 border-b border-gray-100">
                      <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">B</span>
                      </div>
                      <span className="font-semibold text-sm">your_business_account</span>
                    </div>
                    
                    {/* Image */}
                    <div className="aspect-square bg-gray-100 flex items-center justify-center">
                      {form.watch("imageUrl") ? (
                        <img
                          src={form.watch("imageUrl")}
                          alt="Post preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="text-center text-gray-400">
                          <Image className="h-12 w-12 mx-auto mb-2" />
                          <p className="text-sm">Image Preview</p>
                        </div>
                      )}
                    </div>
                    
                    {/* Caption */}
                    <div className="p-3">
                      <div className="text-sm">
                        <span className="font-semibold">your_business_account</span>
                        {form.watch("caption") && (
                          <span className="ml-2 text-gray-800">
                            {form.watch("caption")}
                          </span>
                        )}
                      </div>
                      
                      {/* Schedule info */}
                      {isScheduled && selectedDate && (
                        <div className="mt-3 p-2 bg-blue-50 rounded-lg">
                          <div className="flex items-center space-x-2 text-blue-700">
                            <Clock className="h-4 w-4" />
                            <span className="text-xs">
                              Scheduled for {format(selectedDate, "MMM d, yyyy")} at {selectedTime}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
