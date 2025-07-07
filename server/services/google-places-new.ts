export interface PlacesSearchResult {
  place_id: string;
  name: string;
  rating: number;
  user_ratings_total: number;
  formatted_address: string;
}

export interface PlaceReview {
  author_name: string;
  author_url?: string;
  language: string;
  profile_photo_url?: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
}

export interface PlaceDetails {
  place_id: string;
  name: string;
  rating: number;
  user_ratings_total: number;
  reviews: PlaceReview[];
  formatted_address: string;
}

export class GooglePlacesNewService {
  private apiKey: string;
  private isConfigured: boolean = false;

  constructor() {
    this.apiKey = process.env.GOOGLE_PLACES_API_KEY || '';
    this.isConfigured = !!this.apiKey;
    
    if (!this.isConfigured) {
      console.warn('Google Places API key not found. Add GOOGLE_PLACES_API_KEY to your environment variables.');
    } else {
      console.log('Google Places (New) service initialized successfully');
    }
  }

  public getConfigurationStatus(): { configured: boolean; hasApiKey: boolean } {
    return {
      configured: this.isConfigured,
      hasApiKey: !!this.apiKey,
    };
  }

  async searchBusinesses(query: string): Promise<PlacesSearchResult[]> {
    if (!this.isConfigured) {
      throw new Error('Google Places API not configured');
    }

    try {
      console.log('Using Google Places (New) API for search:', query);

      const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': this.apiKey,
          'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount'
        },
        body: JSON.stringify({
          textQuery: query,
          maxResultCount: 20
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Places API (New) error:', errorData);
        
        if (response.status === 403) {
          throw new Error('Places API access denied. Please ensure billing is enabled and API key has proper permissions.');
        }
        
        throw new Error(`Places API error: ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      console.log('Places API (New) successful, found:', data.places?.length || 0, 'results');
      
      if (!data.places) {
        return [];
      }

      return data.places.map((place: any) => ({
        place_id: place.id,
        name: place.displayName?.text || 'Unknown',
        rating: place.rating || 0,
        user_ratings_total: place.userRatingCount || 0,
        formatted_address: place.formattedAddress || ''
      }));

    } catch (error) {
      console.error('Error in Places API (New):', error);
      throw error;
    }
  }

  async getPlaceDetails(placeId: string): Promise<PlaceDetails | null> {
    if (!this.isConfigured) {
      throw new Error('Google Places API not configured');
    }

    try {
      console.log('Getting place details for:', placeId);

      const response = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
        method: 'GET',
        headers: {
          'X-Goog-Api-Key': this.apiKey,
          'X-Goog-FieldMask': 'id,displayName,formattedAddress,rating,userRatingCount,reviews'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Place details error:', errorData);
        throw new Error(`Failed to get place details: ${errorData.error?.message || 'Unknown error'}`);
      }

      const place = await response.json();
      console.log('Place details retrieved successfully');

      return {
        place_id: place.id,
        name: place.displayName?.text || 'Unknown',
        rating: place.rating || 0,
        user_ratings_total: place.userRatingCount || 0,
        formatted_address: place.formattedAddress || '',
        reviews: place.reviews?.map((review: any) => ({
          author_name: review.authorAttribution?.displayName || 'Anonymous',
          author_url: review.authorAttribution?.uri || '',
          language: 'en',
          profile_photo_url: review.authorAttribution?.photoUri || '',
          rating: review.rating || 0,
          relative_time_description: review.relativePublishTimeDescription || '',
          text: review.text?.text || '',
          time: new Date(review.publishTime).getTime() / 1000
        })) || []
      };

    } catch (error) {
      console.error('Error getting place details:', error);
      return null;
    }
  }

  async getReviewsForBusiness(businessName: string, businessAddress?: string): Promise<{ reviews: any[]; totalReviewCount: number; averageRating: number }> {
    try {
      const searchQuery = businessAddress ? `${businessName} ${businessAddress}` : businessName;
      const businesses = await this.searchBusinesses(searchQuery);
      
      if (businesses.length === 0) {
        throw new Error(`No businesses found for: ${businessName}`);
      }

      // Get the first matching business
      const business = businesses[0];
      const placeDetails = await this.getPlaceDetails(business.place_id);
      
      if (!placeDetails) {
        throw new Error(`Could not get details for: ${business.name}`);
      }

      const reviews = placeDetails.reviews.map((review, index) => ({
        reviewId: `places_${index}_${Math.floor(review.time)}`,
        reviewer: {
          displayName: review.author_name,
          profilePhotoUrl: review.profile_photo_url || `https://lh3.googleusercontent.com/a/default-user=s128-c0x00000000-cc-rp-mo`
        },
        starRating: review.rating,
        comment: review.text,
        createTime: new Date(review.time * 1000).toISOString(),
        updateTime: new Date(review.time * 1000).toISOString()
      }));

      console.log(`Successfully fetched ${reviews.length} real reviews for ${business.name}`);

      return {
        reviews,
        totalReviewCount: placeDetails.user_ratings_total,
        averageRating: placeDetails.rating
      };

    } catch (error) {
      console.error('Error getting reviews for business:', error);
      throw error;
    }
  }
}

export const googlePlacesNewService = new GooglePlacesNewService();