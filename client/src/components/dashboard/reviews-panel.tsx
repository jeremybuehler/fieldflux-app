import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, MessageSquare, Plus, Send } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { trackEvent } from "@/lib/analytics";
import type { Review } from "@shared/schema";

const getRatingColor = (rating: number) => {
  if (rating >= 4) return "text-green-600";
  if (rating >= 3) return "text-yellow-600";
  return "text-red-600";
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "responded":
      return "default";
    case "pending":
      return "secondary";
    case "flagged":
      return "destructive";
    default:
      return "outline";
  }
};

export default function ReviewsPanel() {
  const [newReview, setNewReview] = useState({
    customerName: "",
    rating: 5,
    content: "",
    platform: "",
  });
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: reviews, isLoading } = useQuery<Review[]>({
    queryKey: ["/api/reviews"],
  });

  const createReviewMutation = useMutation({
    mutationFn: async (review: typeof newReview) => {
      const response = await apiRequest("POST", "/api/reviews", review);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reviews"] });
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
      setNewReview({ customerName: "", rating: 5, content: "", platform: "" });
      toast({
        title: "Review Added",
        description: "New customer review has been added successfully.",
      });
      trackEvent('review_added', 'reviews', 'manual_entry');
    },
  });

  const generateResponseMutation = useMutation({
    mutationFn: async (reviewId: number) => {
      const response = await apiRequest("POST", `/api/reviews/${reviewId}/generate-response`, {});
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reviews"] });
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
      toast({
        title: "Response Generated",
        description: "Intelligent system has generated a professional response for this review.",
      });
      trackEvent('review_response_generated', 'reviews', 'ai_generation');
    },
  });

  const handleAddReview = () => {
    if (!newReview.customerName || !newReview.content || !newReview.platform) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    createReviewMutation.mutate(newReview);
  };

  const handleGenerateResponse = (reviewId: number) => {
    generateResponseMutation.mutate(reviewId);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  // Default reviews if none exist
  const defaultReviews = [
    {
      id: 1,
      customerName: "Jennifer Martinez",
      rating: 5,
      content: "Excellent service! The technician was professional and fixed our AC quickly. Highly recommend!",
      platform: "Google",
      status: "pending",
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    },
    {
      id: 2,
      customerName: "Bob Thompson",
      rating: 4,
      content: "Good work on our commercial HVAC system. Arrived on time and got everything working properly.",
      platform: "Yelp",
      status: "responded",
      aiResponse: "Thank you Bob! We're glad we could get your commercial system running smoothly. We appreciate your business!",
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    },
    {
      id: 3,
      customerName: "Lisa Chen",
      rating: 3,
      content: "Service was okay but took longer than expected. The repair was done correctly though.",
      platform: "Facebook",
      status: "pending",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    },
  ];

  const displayReviews = reviews && reviews.length > 0 ? reviews : defaultReviews;

  return (
    <Card className="bg-white shadow-sm border border-gray-200">
      <CardHeader className="border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Star className="w-4 h-4 text-yellow-600" />
            </div>
            <CardTitle className="text-lg font-semibold text-hvac-gray">
              Customer Reviews
            </CardTitle>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-1" />
                Add Review
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Customer Review</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Customer Name
                  </label>
                  <Input
                    value={newReview.customerName}
                    onChange={(e) => setNewReview({ ...newReview, customerName: e.target.value })}
                    placeholder="Customer name"
                    className="mt-1"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Rating
                    </label>
                    <Select 
                      value={newReview.rating.toString()} 
                      onValueChange={(value) => setNewReview({ ...newReview, rating: parseInt(value) })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 Stars</SelectItem>
                        <SelectItem value="4">4 Stars</SelectItem>
                        <SelectItem value="3">3 Stars</SelectItem>
                        <SelectItem value="2">2 Stars</SelectItem>
                        <SelectItem value="1">1 Star</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Platform
                    </label>
                    <Select 
                      value={newReview.platform} 
                      onValueChange={(value) => setNewReview({ ...newReview, platform: value })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Google">Google</SelectItem>
                        <SelectItem value="Yelp">Yelp</SelectItem>
                        <SelectItem value="Facebook">Facebook</SelectItem>
                        <SelectItem value="Angi">Angi</SelectItem>
                        <SelectItem value="Nextdoor">Nextdoor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Review Content
                  </label>
                  <Textarea
                    value={newReview.content}
                    onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
                    placeholder="Review content..."
                    className="mt-1"
                    rows={3}
                  />
                </div>
                <Button
                  onClick={handleAddReview}
                  disabled={createReviewMutation.isPending}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  {createReviewMutation.isPending ? "Adding..." : "Add Review"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse border border-gray-200 rounded-lg p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
                <div className="h-8 bg-gray-200 rounded w-20" />
              </div>
            ))}
          </div>
        ) : displayReviews.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-gray-500">No reviews yet</p>
            <p className="text-xs text-gray-400 mt-1">
              Customer reviews will appear here as they come in
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayReviews.slice(0, 5).map((review) => (
              <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="text-sm font-semibold text-hvac-gray">
                        {review.customerName}
                      </h4>
                      <div className="flex items-center space-x-1">
                        {renderStars(review.rating)}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {review.platform}
                      </Badge>
                      <Badge variant={getStatusColor(review.status)} className="text-xs">
                        {review.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {review.content}
                    </p>
                    {review.aiResponse && (
                      <div className="bg-blue-50 rounded-lg p-3 mt-2">
                        <p className="text-xs text-gray-500 mb-1">Intelligent Response:</p>
                        <p className="text-sm text-gray-700">{review.aiResponse}</p>
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    {!review.aiResponse && review.status !== "responded" && (
                      <Button
                        size="sm"
                        onClick={() => handleGenerateResponse(review.id)}
                        disabled={generateResponseMutation.isPending}
                        className="bg-primary hover:bg-primary/90 text-white"
                      >
                        <MessageSquare className="w-3 h-3 mr-1" />
                        Generate Response
                      </Button>
                    )}
                    {review.aiResponse && review.responseStatus === "ready" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-green-600 border-green-200"
                      >
                        <Send className="w-3 h-3 mr-1" />
                        Post Response
                      </Button>
                    )}
                  </div>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(review.createdAt!).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}