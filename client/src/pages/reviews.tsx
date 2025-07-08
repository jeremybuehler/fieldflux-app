import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import TopNavigation from "@/components/layout/top-navigation";
import { ArrowLeft, Star, MessageSquare, TrendingUp, CheckCircle, AlertCircle, Search, MapPin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

// Individual Review Card Component with Response Actions
function ReviewCard({ review, businessName }) {
  const [isGeneratingResponse, setIsGeneratingResponse] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const [generatedResponse, setGeneratedResponse] = useState('');

  const generateResponse = async () => {
    setIsGeneratingResponse(true);
    try {
      const response = await fetch('/api/reviews/generate-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviewText: review.comment,
          rating: review.starRating,
          businessName: businessName
        })
      });

      if (!response.ok) throw new Error('Failed to generate response');

      const data = await response.json();
      setGeneratedResponse(data.response);
      setShowResponse(true);

      toast({
        title: "Response Generated",
        description: "AI-powered response ready for review",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsGeneratingResponse(false);
    }
  };

  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex items-start space-x-3">
        <img 
          src={review.reviewer.profilePhotoUrl || `https://ui-avatars.com/api/?name=${review.reviewer.displayName}&size=40&background=random`}
          alt={review.reviewer.displayName}
          className="w-10 h-10 rounded-full"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-medium">{review.reviewer.displayName}</h4>
            <div className="flex items-center space-x-1">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < review.starRating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
                />
              ))}
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-2">{review.comment}</p>
          <p className="text-xs text-gray-500">
            {new Date(review.createTime).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-2 pt-2 border-t">
        <Button 
          onClick={generateResponse} 
          disabled={isGeneratingResponse}
          size="sm"
          variant="outline"
        >
          {isGeneratingResponse ? 'Generating...' : 'Generate Response'}
        </Button>

        {review.starRating <= 3 && (
          <Button size="sm" variant="outline" className="text-orange-600 border-orange-600">
            Flag for Follow-up
          </Button>
        )}

        <Button size="sm" variant="ghost" className="text-blue-600">
          View Full Review
        </Button>
      </div>

      {/* Generated Response Section */}
      {showResponse && (
        <div className="bg-blue-50 rounded-lg p-3 mt-3">
          <div className="flex items-center justify-between mb-2">
            <h5 className="font-medium text-blue-900">AI-Generated Response</h5>
            <div className="flex space-x-2">
              <Button size="sm" variant="outline" className="text-xs">
                Edit
              </Button>
              <Button size="sm" className="text-xs bg-blue-600 hover:bg-blue-700">
                Post Response
              </Button>
            </div>
          </div>
          <p className="text-sm text-blue-800">{generatedResponse}</p>
        </div>
      )}
    </div>
  );
}

export default function Reviews() {
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  // Get real Google reviews - only when business is selected
  const { data: googleReviews, isLoading: reviewsLoading } = useQuery({
    queryKey: ["/api/reviews/google", selectedBusiness?.name, selectedBusiness?.formatted_address],
    queryFn: async () => {
      if (!selectedBusiness) return null;
      const response = await fetch(`/api/reviews/google?businessName=${encodeURIComponent(selectedBusiness.name)}&businessAddress=${encodeURIComponent(selectedBusiness.formatted_address)}`);
      if (!response.ok) throw new Error('Failed to fetch reviews');
      return response.json();
    },
    enabled: !!selectedBusiness
  });

  // Get real review analytics
  const { data: reviewAnalytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ["/api/reviews/analytics"],
  });

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const response = await fetch(`/api/places/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setSearchResults(data);
      toast({
        title: "Search Complete",
        description: `Found ${data.length} businesses`,
      });
    } catch (error) {
      toast({
        title: "Search Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectBusiness = (business) => {
    setSelectedBusiness(business);
    setShowSearch(false);
    setSearchResults([]);
    toast({
      title: "Business Selected",
      description: `${business.name} - Loading ${business.user_ratings_total} reviews...`,
    });
  };

  // Show business search if no business selected
  if (!selectedBusiness) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TopNavigation title="Reviews Management" />
        <div className="max-w-6xl mx-auto p-6">
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Reviews Management</h1>
                <p className="text-gray-600">Monitor and respond to customer reviews across platforms</p>
              </div>
            </div>

            {/* Status Indicators */}
            <div className="flex items-center space-x-2 mb-6">
              <Badge variant="default" className="bg-green-100 text-green-800">
                <CheckCircle className="w-3 h-3 mr-1" />
                Google Places API (New) Connected
              </Badge>
              <Badge variant="outline" className="text-blue-600 border-blue-600">
                Real Reviews Available
              </Badge>
            </div>
          </div>

          {/* Business Search */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Search className="w-5 h-5" />
                <span>Search for Your Business</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter business name and location (e.g., 'McDonald's New York')"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button onClick={handleSearch} disabled={isSearching}>
                  {isSearching ? 'Searching...' : 'Search'}
                </Button>
              </div>

              {searchResults.length > 0 && (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  <h3 className="font-medium text-gray-900">Select your business:</h3>
                  {searchResults.map((business) => (
                    <div
                      key={business.place_id}
                      className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleSelectBusiness(business)}
                    >
                      <div className="font-medium">{business.name}</div>
                      <div className="text-gray-600 text-sm">{business.formatted_address}</div>
                      <div className="flex items-center space-x-2 mt-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm">{business.rating.toFixed(1)} ({business.user_ratings_total} reviews)</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Demo search suggestion */}
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-lg font-medium mb-2">Try a Demo Search</h3>
                <p className="text-gray-600 mb-4">Search for "McDonald's New York" to see real Google Places reviews</p>
                <Button 
                  onClick={() => {
                    setSearchQuery("McDonald's New York");
                    setTimeout(() => handleSearch(), 100);
                  }}
                  variant="outline"
                >
                  Try Demo Search
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Show reviews for selected business
  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavigation title="Reviews Management" />
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Reviews for {selectedBusiness.name}</h1>
                <p className="text-gray-600">{selectedBusiness.formatted_address}</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => setSelectedBusiness(null)}>
              <Search className="w-4 h-4 mr-2" />
              Change Business
            </Button>
          </div>

          {/* Status Indicators */}
          <div className="flex items-center space-x-2 mb-6">
            <Badge variant="default" className="bg-green-100 text-green-800">
              <CheckCircle className="w-3 h-3 mr-1" />
              Live Google Places Data
            </Badge>
            <Badge variant="outline" className="text-blue-600 border-blue-600">
              {selectedBusiness.user_ratings_total} Real Reviews
            </Badge>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Average Rating</p>
                  <p className="text-2xl font-bold">
                    {googleReviews?.averageRating || selectedBusiness.rating}
                  </p>
                </div>
                <Star className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Reviews</p>
                  <p className="text-2xl font-bold">
                    {googleReviews?.totalReviewCount || selectedBusiness.user_ratings_total}
                  </p>
                </div>
                <MessageSquare className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Reviews Loaded</p>
                  <p className="text-2xl font-bold">
                    {reviewsLoading ? "..." : googleReviews?.reviews?.length || 0}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reviews List with Response Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            {reviewsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading reviews...</p>
              </div>
            ) : googleReviews?.reviews?.length > 0 ? (
              <div className="space-y-6">
                {googleReviews.reviews.map((review, index) => (
                  <ReviewCard key={review.reviewId || index} review={review} businessName={selectedBusiness.name} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p>No reviews available for this business.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}