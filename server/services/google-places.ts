import { Client } from '@googlemaps/google-maps-services-js';

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
      const response = await this.client.textSearch({
        params: {
          query: query,
          location: location,
          key: this.apiKey,
        },
      });

      return response.data.results.map(place => ({
        place_id: place.place_id,
        name: place.name,
        rating: place.rating || 0,
        user_ratings_total: place.user_ratings_total || 0,
        formatted_address: place.formatted_address || ''
      }));
    } catch (error) {
      console.error('Error searching businesses:', error);
      throw new Error('Failed to search businesses');
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
        place_id: place.place_id,
        name: place.name || '',
        rating: place.rating || 0,
        user_ratings_total: place.user_ratings_total || 0,
        reviews: place.reviews || [],
        formatted_address: place.formatted_address || '',
        business_status: place.business_status || 'OPERATIONAL'
      };
    } catch (error) {
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
    } catch (error) {
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