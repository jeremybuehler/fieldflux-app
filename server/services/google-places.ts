import { Client, PlaceInputType } from '@googlemaps/google-maps-services-js';

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
  reviews: any[];
  formatted_address: string;
  business_status: string;
}

export interface PlacesSearchResult {
  place_id: string;
  name: string;
  rating: number;
  user_ratings_total: number;
  formatted_address: string;
}

export class GooglePlacesService {
  private client: Client;
  private apiKey: string;
  private isConfigured: boolean = false;

  constructor() {
    this.client = new Client({});
    this.apiKey = process.env.GOOGLE_PLACES_API_KEY || '';
    this.isConfigured = !!this.apiKey;
    
    if (!this.isConfigured) {
      console.warn('Google Places API key not found. Add GOOGLE_PLACES_API_KEY to your environment variables.');
    } else {
      console.log('Google Places service initialized successfully');
    }
  }

  public getConfigurationStatus(): { configured: boolean; hasApiKey: boolean } {
    return {
      configured: this.isConfigured,
      hasApiKey: !!this.apiKey
    };
  }

  async searchBusinesses(query: string, location?: string): Promise<PlacesSearchResult[]> {
    if (!this.isConfigured) {
      throw new Error('Google Places API not configured. Please add GOOGLE_PLACES_API_KEY to environment variables.');
    }

    try {
      // Try text search first (requires Places API enabled)
      const searchParams: any = {
        query: location ? `${query} ${location}` : query,
        key: this.apiKey,
      };

      console.log('Attempting Google Places text search with params:', searchParams);

      const response = await this.client.textSearch({
        params: searchParams,
      });

      console.log('Search response status:', response.status);
      console.log('Search results count:', response.data.results?.length || 0);
      
      if (response.data.error_message) {
        console.error('Google Places API error:', response.data.error_message);
      }

      if (response.data.status === 'REQUEST_DENIED') {
        throw new Error(`Google Places API access denied. Please ensure:
1. Places API (New) is enabled in Google Cloud Console
2. API key has Places API permissions
3. Billing is enabled for your Google Cloud project
Error: ${response.data.error_message}`);
      }

      if (response.data.status === 'INVALID_REQUEST') {
        throw new Error(`Invalid request: ${response.data.error_message}`);
      }

      if (response.data.status !== 'OK' && response.data.status !== 'ZERO_RESULTS') {
        throw new Error(`API returned status: ${response.data.status} - ${response.data.error_message || 'Unknown error'}`);
      }

      const results = response.data.results || [];
      console.log(`Successfully found ${results.length} businesses`);
      
      return results.map(place => ({
        place_id: place.place_id || '',
        name: place.name || '',
        rating: place.rating || 0,
        user_ratings_total: place.user_ratings_total || 0,
        formatted_address: place.formatted_address || ''
      }));
    } catch (error: any) {
      console.error('Error searching businesses:', error);
      if (error?.response?.data) {
        console.error('API Error Response:', error.response.data);
        if (error.response.status === 400) {
          throw new Error('Google Places API configuration error. Please check that Places API (New) is enabled and billing is configured.');
        }
      }
      throw new Error(`Failed to search businesses: ${error?.message || 'Unknown error'}`);
    }
  }

  async getPlaceDetails(placeId: string): Promise<PlaceDetails | null> {
    if (!this.isConfigured) {
      throw new Error('Google Places API not configured. Please add GOOGLE_PLACES_API_KEY to environment variables.');
    }

    try {
      const response = await this.client.placeDetails({
        params: {
          place_id: placeId,
          fields: [
            'place_id',
            'name',
            'rating',
            'user_ratings_total',
            'reviews',
            'formatted_address',
            'business_status'
          ],
          key: this.apiKey,
        },
      });

      const place = response.data.result;
      
      if (!place) {
        return null;
      }

      return {
        place_id: place.place_id || '',
        name: place.name || '',
        rating: place.rating || 0,
        user_ratings_total: place.user_ratings_total || 0,
        reviews: this.convertToInternalFormat((place.reviews || []) as any),
        formatted_address: place.formatted_address || '',
        business_status: place.business_status || 'OPERATIONAL'
      };
    } catch (error: any) {
      console.error('Error fetching place details:', error);
      throw new Error('Failed to fetch place details');
    }
  }

  async getReviewsForBusiness(businessName: string, address?: string): Promise<{
    reviews: PlaceReview[];
    totalReviews: number;
    averageRating: number;
    businessInfo: {
      name: string;
      address: string;
      placeId: string;
    };
  }> {
    if (!this.isConfigured) {
      throw new Error('Google Places API not configured. Please add GOOGLE_PLACES_API_KEY to environment variables.');
    }

    try {
      // First, search for the business
      const searchQuery = address ? `${businessName} ${address}` : businessName;
      const businesses = await this.searchBusinesses(searchQuery);
      
      if (businesses.length === 0) {
        throw new Error(`No businesses found for "${businessName}"`);
      }

      // Get the first result (most relevant)
      const business = businesses[0];
      
      // Get detailed information including reviews
      const placeDetails = await this.getPlaceDetails(business.place_id);
      
      if (!placeDetails) {
        throw new Error('Failed to get business details');
      }

      return {
        reviews: placeDetails.reviews,
        totalReviews: placeDetails.user_ratings_total,
        averageRating: placeDetails.rating,
        businessInfo: {
          name: placeDetails.name,
          address: placeDetails.formatted_address,
          placeId: placeDetails.place_id
        }
      };
    } catch (error: any) {
      console.error('Error getting reviews for business:', error);
      throw error;
    }
  }

  // Convert Google Places reviews to our internal format
  convertToInternalFormat(placesReviews: PlaceReview[]): Array<{
    reviewId: string;
    reviewer: {
      displayName: string;
      profilePhotoUrl?: string;
    };
    starRating: number;
    comment: string;
    createTime: string;
    updateTime: string;
  }> {
    return placesReviews.map((review, index) => ({
      reviewId: `places_${index}_${review.time}`,
      reviewer: {
        displayName: review.author_name,
        profilePhotoUrl: review.profile_photo_url
      },
      starRating: review.rating,
      comment: review.text,
      createTime: new Date(review.time * 1000).toISOString(),
      updateTime: new Date(review.time * 1000).toISOString()
    }));
  }
}

export const googlePlacesService = new GooglePlacesService();
