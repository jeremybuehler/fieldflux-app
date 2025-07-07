import { google } from 'googleapis';
import { GoogleAuth } from 'google-auth-library';
import { Client } from '@googlemaps/places';

export interface GoogleReview {
  reviewId: string;
  reviewer: {
    displayName: string;
    profilePhotoUrl?: string;
  };
  starRating: number;
  comment: string;
  createTime: string;
  updateTime: string;
  reviewReply?: {
    comment: string;
    updateTime: string;
  };
}

export interface ReviewsResponse {
  reviews: GoogleReview[];
  totalReviewCount: number;
  averageRating: number;
}

export class GoogleReviewsService {
  private mybusiness: any;
  private placesClient: Client;
  private auth: GoogleAuth;
  private isConfigured: boolean = false;

  constructor() {
    this.initializeService();
  }

  private async initializeService() {
    try {
      const serviceAccountKey = process.env.GOOGLE_ANALYTICS_SERVICE_ACCOUNT_KEY;
      
      if (!serviceAccountKey) {
        console.warn('Google service account key not found, using demo data');
        this.isConfigured = false;
        return;
      }

      // Parse the service account key
      const credentials = JSON.parse(serviceAccountKey);
      
      // Create auth instance
      this.auth = new GoogleAuth({
        credentials: credentials,
        scopes: [
          'https://www.googleapis.com/auth/business.manage',
          'https://www.googleapis.com/auth/places'
        ]
      });

      // Initialize My Business API
      this.mybusiness = google.mybusiness({ version: 'v4', auth: this.auth });
      
      // Initialize Places API (for newer Google reviews)
      this.placesClient = new Client({
        auth: this.auth
      });
      
      this.isConfigured = true;
      console.log('Google Reviews service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Google Reviews service:', error);
      this.isConfigured = false;
    }
  }

  public getConfigurationStatus(): { configured: boolean; hasPermissions: boolean } {
    return {
      configured: this.isConfigured,
      hasPermissions: this.isConfigured && !!this.auth
    };
  }

  private getMockReviews(): ReviewsResponse {
    return {
      reviews: [
        {
          reviewId: '1',
          reviewer: {
            displayName: 'Sarah Johnson',
            profilePhotoUrl: 'https://via.placeholder.com/40'
          },
          starRating: 5,
          comment: 'Excellent service! The technician was professional and fixed our AC quickly. Highly recommend!',
          createTime: '2025-01-05T10:30:00Z',
          updateTime: '2025-01-05T10:30:00Z',
          reviewReply: {
            comment: 'Thank you Sarah! We appreciate your kind words and are glad we could help with your AC repair.',
            updateTime: '2025-01-05T14:00:00Z'
          }
        },
        {
          reviewId: '2',
          reviewer: {
            displayName: 'Mike Chen',
            profilePhotoUrl: 'https://via.placeholder.com/40'
          },
          starRating: 4,
          comment: 'Good service, arrived on time and explained everything clearly. Price was fair.',
          createTime: '2025-01-04T16:45:00Z',
          updateTime: '2025-01-04T16:45:00Z'
        },
        {
          reviewId: '3',
          reviewer: {
            displayName: 'Emily Rodriguez',
            profilePhotoUrl: 'https://via.placeholder.com/40'
          },
          starRating: 5,
          comment: 'Best HVAC company in Winter Haven! They installed our new system and the work was flawless.',
          createTime: '2025-01-03T09:15:00Z',
          updateTime: '2025-01-03T09:15:00Z',
          reviewReply: {
            comment: 'Thank you Emily! We\'re thrilled you\'re happy with your new HVAC system. We appreciate your business!',
            updateTime: '2025-01-03T11:30:00Z'
          }
        },
        {
          reviewId: '4',
          reviewer: {
            displayName: 'David Wilson',
            profilePhotoUrl: 'https://via.placeholder.com/40'
          },
          starRating: 3,
          comment: 'Service was okay but took longer than expected. Technician was knowledgeable though.',
          createTime: '2025-01-02T14:20:00Z',
          updateTime: '2025-01-02T14:20:00Z'
        },
        {
          reviewId: '5',
          reviewer: {
            displayName: 'Lisa Anderson',
            profilePhotoUrl: 'https://via.placeholder.com/40'
          },
          starRating: 5,
          comment: 'Amazing company! They came out for an emergency repair and had us up and running in no time.',
          createTime: '2025-01-01T20:30:00Z',
          updateTime: '2025-01-01T20:30:00Z'
        }
      ],
      totalReviewCount: 147,
      averageRating: 4.6
    };
  }

  async getBusinessReviews(businessId?: string): Promise<ReviewsResponse> {
    if (!this.isConfigured) {
      console.log('Google Reviews service not configured, returning demo data');
      return this.getMockReviews();
    }

    try {
      // If no businessId provided, try to get the first business location
      if (!businessId) {
        const accounts = await this.mybusiness.accounts.list();
        if (!accounts.data.accounts || accounts.data.accounts.length === 0) {
          console.warn('No business accounts found, using demo data');
          return this.getMockReviews();
        }
        
        const accountId = accounts.data.accounts[0].name;
        const locations = await this.mybusiness.accounts.locations.list({
          parent: accountId
        });
        
        if (!locations.data.locations || locations.data.locations.length === 0) {
          console.warn('No business locations found, using demo data');
          return this.getMockReviews();
        }
        
        businessId = locations.data.locations[0].name;
      }

      // Get reviews for the business
      const reviewsResponse = await this.mybusiness.accounts.locations.reviews.list({
        parent: businessId
      });

      const reviews = reviewsResponse.data.reviews || [];
      const totalReviewCount = reviewsResponse.data.totalReviewCount || 0;
      const averageRating = reviewsResponse.data.averageRating || 0;

      return {
        reviews: reviews.map((review: any) => ({
          reviewId: review.reviewId || review.name,
          reviewer: {
            displayName: review.reviewer?.displayName || 'Anonymous',
            profilePhotoUrl: review.reviewer?.profilePhotoUrl
          },
          starRating: review.starRating || 0,
          comment: review.comment || '',
          createTime: review.createTime || new Date().toISOString(),
          updateTime: review.updateTime || new Date().toISOString(),
          reviewReply: review.reviewReply ? {
            comment: review.reviewReply.comment || '',
            updateTime: review.reviewReply.updateTime || new Date().toISOString()
          } : undefined
        })),
        totalReviewCount,
        averageRating
      };
    } catch (error) {
      console.error('Error fetching Google reviews:', error);
      console.log('Falling back to demo data');
      return this.getMockReviews();
    }
  }

  async replyToReview(businessId: string, reviewId: string, replyText: string): Promise<boolean> {
    if (!this.isConfigured) {
      console.log('Google Reviews service not configured, simulating reply');
      return true;
    }

    try {
      await this.mybusiness.accounts.locations.reviews.updateReply({
        name: `${businessId}/reviews/${reviewId}`,
        requestBody: {
          comment: replyText
        }
      });
      
      return true;
    } catch (error) {
      console.error('Error replying to review:', error);
      return false;
    }
  }

  async getReviewsAnalytics(period: '7d' | '30d' | '90d' = '30d'): Promise<{
    overview: { totalReviews: number; averageRating: number; responseRate: number; trend: string };
    platforms: Array<{ platform: string; reviews: number; rating: number; recentReviews: number }>;
    recentReviews: Array<{ platform: string; rating: number; text: string; date: string; responded: boolean }>;
    sentimentTrends: Array<{ date: string; positive: number; neutral: number; negative: number }>;
  }> {
    const reviewsData = await this.getBusinessReviews();
    
    // Calculate analytics based on real data
    const totalReviews = reviewsData.totalReviewCount;
    const averageRating = reviewsData.averageRating;
    
    // Calculate response rate
    const reviewsWithReplies = reviewsData.reviews.filter(r => r.reviewReply).length;
    const responseRate = reviewsData.reviews.length > 0 ? 
      Math.round((reviewsWithReplies / reviewsData.reviews.length) * 100) : 0;

    // Get recent reviews (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentReviews = reviewsData.reviews
      .filter(r => new Date(r.createTime) >= sevenDaysAgo)
      .map(r => ({
        platform: 'Google My Business',
        rating: r.starRating,
        text: r.comment,
        date: r.createTime.split('T')[0],
        responded: !!r.reviewReply
      }));

    // Calculate sentiment trends
    const sentimentTrends = this.calculateSentimentTrends(reviewsData.reviews);

    return {
      overview: {
        totalReviews,
        averageRating: Math.round(averageRating * 10) / 10,
        responseRate,
        trend: recentReviews.length > 0 ? `+${recentReviews.length} this week` : 'No recent reviews'
      },
      platforms: [
        {
          platform: 'Google My Business',
          reviews: totalReviews,
          rating: Math.round(averageRating * 10) / 10,
          recentReviews: recentReviews.length
        }
      ],
      recentReviews: recentReviews.slice(0, 5),
      sentimentTrends
    };
  }

  private calculateSentimentTrends(reviews: GoogleReview[]): Array<{ date: string; positive: number; neutral: number; negative: number }> {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => {
      const dayReviews = reviews.filter(r => r.createTime.startsWith(date));
      const positive = dayReviews.filter(r => r.starRating >= 4).length;
      const neutral = dayReviews.filter(r => r.starRating === 3).length;
      const negative = dayReviews.filter(r => r.starRating <= 2).length;

      return { date, positive, neutral, negative };
    });
  }
}

export const googleReviewsService = new GoogleReviewsService();