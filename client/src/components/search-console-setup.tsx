import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MapPin, Search, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

interface BusinessSearchResult {
  place_id: string;
  name: string;
  rating: number;
  user_ratings_total: number;
  formatted_address: string;
}

export default function SearchConsoleSetup() {
  const [businessName, setBusinessName] = useState('');
  const [businessLocation, setBusinessLocation] = useState('');
  const [searchResults, setSearchResults] = useState<BusinessSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  // Check Places API status
  const { data: placesStatus } = useQuery({
    queryKey: ['/api/places/status'],
    queryFn: () => fetch('/api/places/status').then(res => res.json()),
  });

  const handleSearch = async () => {
    if (!businessName.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter a business name to search",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    try {
      const query = businessLocation ? `${businessName} ${businessLocation}` : businessName;
      const response = await fetch(`/api/places/search?q=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        throw new Error('Search failed');
      }
      
      const results = await response.json();
      setSearchResults(results);
      
      if (results.length === 0) {
        toast({
          title: "No Results",
          description: "No businesses found. Try adjusting your search terms.",
        });
      } else {
        toast({
          title: "Search Complete",
          description: `Found ${results.length} businesses`,
        });
      }
    } catch (error) {
      toast({
        title: "Search Error",
        description: "Unable to search businesses. Check your Google Places API configuration.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectBusiness = async (business: BusinessSearchResult) => {
    try {
      const response = await fetch(`/api/places/details/${business.place_id}`);
      const details = await response.json();
      
      toast({
        title: "Business Selected",
        description: `Selected ${business.name} - ${details.reviews?.length || 0} reviews available`,
      });
      
      // You could emit an event or call a callback here to update the parent component
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get business details",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <MapPin className="w-6 h-6 text-red-600" />
            <div>
              <CardTitle>Google Places API Business Search</CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Search for businesses to connect their Google reviews
              </p>
            </div>
            {placesStatus?.configured && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <CheckCircle className="w-3 h-3 mr-1" />
                API Connected
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {!placesStatus?.configured ? (
            <Alert>
              <AlertDescription>
                Google Places API is not configured. Set GOOGLE_PLACES_API_KEY in your environment variables (e.g., Vercel Project Settings) to enable business search and real review data.
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="business-name">Business Name</Label>
                  <Input
                    id="business-name"
                    placeholder="e.g., Winter Haven Air Conditioning"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="business-location">Location (Optional)</Label>
                  <Input
                    id="business-location"
                    placeholder="e.g., Winter Haven, FL"
                    value={businessLocation}
                    onChange={(e) => setBusinessLocation(e.target.value)}
                  />
                </div>
              </div>
              
              <Button 
                onClick={handleSearch}
                disabled={isSearching}
                className="w-full md:w-auto"
              >
                <Search className="w-4 h-4 mr-2" />
                {isSearching ? 'Searching...' : 'Search Businesses'}
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {searchResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Search Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {searchResults.map((business) => (
                <div
                  key={business.place_id}
                  className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleSelectBusiness(business)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold">{business.name}</h4>
                      <p className="text-sm text-gray-600">{business.formatted_address}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-sm font-medium">
                          ⭐ {business.rating.toFixed(1)}
                        </span>
                        <span className="text-sm text-gray-500">
                          ({business.user_ratings_total} reviews)
                        </span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Select
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
