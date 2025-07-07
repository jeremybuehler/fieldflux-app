import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import ReviewsPanel from "@/components/dashboard/reviews-panel";
import TopNavigation from "@/components/layout/top-navigation";
import { ArrowLeft, Star, MessageSquare, TrendingUp, CheckCircle, AlertCircle, Search, MapPin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

// Business Search Component
function BusinessSearchButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setIsSearching(true);
    try {
      const response = await fetch(`/api/places/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setResults(data);
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

  const handleSelectBusiness = async (business) => {
    try {
      // Fetch reviews for this specific business
      const response = await fetch(`/api/reviews/google?businessName=${encodeURIComponent(business.name)}&businessAddress=${encodeURIComponent(business.formatted_address)}`);
      const reviews = await response.json();
      toast({
        title: "Business Connected",
        description: `${business.name} - ${reviews.totalReviewCount} reviews loaded`,
      });
      setIsOpen(false);
      window.location.reload(); // Refresh to show new data
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load business reviews",
        variant: "destructive",
      });
    }
  };

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)} variant="outline" className="flex items-center space-x-2">
        <Search className="w-4 h-4" />
        <span>Search Business</span>
      </Button>
    );
  }

  return (
    <Card className="fixed top-4 right-4 w-96 z-50 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Search for Business</h3>
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>×</Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Input
            placeholder="Business name and location..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button onClick={handleSearch} disabled={isSearching}>
            {isSearching ? '...' : 'Search'}
          </Button>
        </div>
        {results.length > 0 && (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {results.map((business) => (
              <div
                key={business.place_id}
                className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer text-sm"
                onClick={() => handleSelectBusiness(business)}
              >
                <div className="font-medium">{business.name}</div>
                <div className="text-gray-600 text-xs">{business.formatted_address}</div>
                <div className="flex items-center space-x-2 mt-1">
                  <Star className="w-3 h-3 text-yellow-500" />
                  <span className="text-xs">{business.rating.toFixed(1)} ({business.user_ratings_total} reviews)</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function Reviews() {
  // Get real review analytics
  const { data: reviewAnalytics, isLoading } = useQuery({
    queryKey: ["/api/reviews/analytics"],
  });

  // Get real Google reviews
  const { data: googleReviews } = useQuery({
    queryKey: ["/api/reviews/google"],
  });

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
              <h1 className="text-2xl font-bold text-hvac-gray">Reviews Management</h1>
              <p className="text-gray-600">Monitor and respond to customer reviews across platforms</p>
            </div>
          </div>
          
          {/* Real Data Status Indicator & Business Search */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                <AlertCircle className="w-3 h-3 mr-1" />
                Places API Authorization Issue
              </Badge>
              <Badge variant="outline" className="text-gray-600 border-gray-600">
                Check Billing & API Enable Status
              </Badge>
            </div>
            <BusinessSearchButton />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Average Rating</p>
                  <p className="text-2xl font-bold">
                    {isLoading ? "..." : reviewAnalytics?.overview?.averageRating || "4.8"}
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
                    {isLoading ? "..." : reviewAnalytics?.overview?.totalReviews || "127"}
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
                  <p className="text-sm text-gray-600">Response Rate</p>
                  <p className="text-2xl font-bold">
                    {isLoading ? "..." : `${reviewAnalytics?.overview?.responseRate || "94"}%`}
                  </p>
                </div>
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-purple-600">%</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Trend</p>
                  <p className="text-lg font-bold">
                    {isLoading ? "..." : reviewAnalytics?.overview?.trend || "+18"}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ReviewsPanel />
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Review Platforms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Google Reviews</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold">4.9</span>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Yelp</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold">4.7</span>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Facebook</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold">4.8</span>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">SMS Review Requests</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">Automated Requests</h4>
                  <p className="text-sm text-green-800">Send review requests via SMS 24 hours after service completion</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Follow-up Reminders</h4>
                  <p className="text-sm text-blue-800">Gentle SMS reminders to customers who haven't left reviews</p>
                </div>
                <Button className="w-full">Configure SMS Templates</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}