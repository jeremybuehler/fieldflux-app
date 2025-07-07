import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MapPin, Search, CheckCircle, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BusinessSearchResult {
  place_id: string;
  name: string;
  rating: number;
  user_ratings_total: number;
  formatted_address: string;
}

export default function BusinessSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<BusinessSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(`/api/places/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Search failed');
      }

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

  const handleSelectBusiness = async (business: BusinessSearchResult) => {
    try {
      const response = await fetch(`/api/places/details/${business.place_id}`);
      const details = await response.json();
      
      toast({
        title: "Business Selected",
        description: `${business.name} - ${details.reviews?.length || 0} reviews found`,
      });
      
      // Refresh the reviews page with new data
      window.location.reload();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get business details",
        variant: "destructive",
      });
    }
  };

  if (!isOpen) {
    return (
      <Button 
        onClick={() => setIsOpen(true)}
        variant="outline"
        className="flex items-center space-x-2"
      >
        <Search className="w-4 h-4" />
        <span>Search Business</span>
      </Button>
    );
  }

  return (
    <Card className="fixed top-4 right-4 w-96 z-50 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Search for Business</CardTitle>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setIsOpen(false)}
          >
            ×
          </Button>
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
                  <div className="flex items-center">
                    <Star className="w-3 h-3 text-yellow-500 mr-1" />
                    <span className="text-xs">{business.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    ({business.user_ratings_total} reviews)
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}