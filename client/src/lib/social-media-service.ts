
export interface SocialPlatformConfig {
  platform: string;
  appId?: string;
  appSecret?: string;
  accessToken?: string;
  accessTokenSecret?: string;
  clientId?: string;
  clientSecret?: string;
  pageId?: string;
  businessAccountId?: string;
  organizationId?: string;
  isConfigured: boolean;
}

export interface MultiPlatformPost {
  platforms: {
    id: string;
    content: string;
    hashtags: string;
    enabled: boolean;
  }[];
  scheduleTime: {
    date: string;
    time: string;
  };
}

export interface SocialAnalytics {
  platform: string;
  likes: number;
  shares: number;
  comments: number;
  reach: number;
  impressions: number;
  clickThrough: number;
  engagementRate: number;
}

class SocialMediaService {
  private baseUrl = '/api';

  async getSocialConfigs(): Promise<SocialPlatformConfig[]> {
    const response = await fetch(`${this.baseUrl}/social-configs`);
    if (!response.ok) {
      throw new Error('Failed to fetch social configurations');
    }
    const data = await response.json();
    return data.configs;
  }

  async saveSocialConfig(config: Partial<SocialPlatformConfig>): Promise<SocialPlatformConfig> {
    const response = await fetch(`${this.baseUrl}/social-configs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(config),
    });

    if (!response.ok) {
      throw new Error('Failed to save social configuration');
    }

    return response.json();
  }

  async deleteSocialConfig(platform: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/social-configs/${platform}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete social configuration');
    }
  }

  async scheduleMultiPlatformPost(postData: MultiPlatformPost): Promise<any> {
    const response = await fetch(`${this.baseUrl}/social/schedule-multi-platform`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      throw new Error('Failed to schedule posts');
    }

    return response.json();
  }

  async getSocialAnalytics(): Promise<SocialAnalytics[]> {
    const response = await fetch(`${this.baseUrl}/social/analytics`);
    if (!response.ok) {
      throw new Error('Failed to fetch social analytics');
    }
    const data = await response.json();
    return data.analytics;
  }

  async postToFacebook(content: string, config: SocialPlatformConfig): Promise<any> {
    // Facebook Graph API integration
    const facebookUrl = `https://graph.facebook.com/v18.0/${config.pageId}/feed`;
    
    const response = await fetch(facebookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: content,
        access_token: config.accessToken,
      }),
    });

    return response.json();
  }

  async postToTwitter(content: string, config: SocialPlatformConfig): Promise<any> {
    // Twitter API v2 integration would go here
    // This would require server-side implementation for OAuth 1.0a
    throw new Error('Twitter posting requires server-side implementation');
  }

  async postToInstagram(content: string, config: SocialPlatformConfig): Promise<any> {
    // Instagram Basic Display API integration
    const instagramUrl = `https://graph.instagram.com/v18.0/${config.businessAccountId}/media`;
    
    const response = await fetch(instagramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        caption: content,
        access_token: config.accessToken,
      }),
    });

    return response.json();
  }

  async postToLinkedIn(content: string, config: SocialPlatformConfig): Promise<any> {
    // LinkedIn API integration
    const linkedinUrl = 'https://api.linkedin.com/v2/ugcPosts';
    
    const response = await fetch(linkedinUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.accessToken}`,
      },
      body: JSON.stringify({
        author: `urn:li:organization:${config.organizationId}`,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: {
              text: content,
            },
            shareMediaCategory: 'NONE',
          },
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
        },
      }),
    });

    return response.json();
  }

  async validatePlatformConfig(platform: string, config: SocialPlatformConfig): Promise<boolean> {
    try {
      switch (platform) {
        case 'facebook':
          // Validate Facebook config by making a test API call
          const fbResponse = await fetch(`https://graph.facebook.com/v18.0/me?access_token=${config.accessToken}`);
          return fbResponse.ok;
        
        case 'instagram':
          // Validate Instagram config
          const igResponse = await fetch(`https://graph.instagram.com/v18.0/me?access_token=${config.accessToken}`);
          return igResponse.ok;
        
        case 'linkedin':
          // Validate LinkedIn config
          const liResponse = await fetch('https://api.linkedin.com/v2/people/~', {
            headers: {
              'Authorization': `Bearer ${config.accessToken}`,
            },
          });
          return liResponse.ok;
        
        case 'twitter':
          // Twitter validation would require server-side OAuth
          return true;
        
        default:
          return false;
      }
    } catch (error) {
      console.error(`Error validating ${platform} config:`, error);
      return false;
    }
  }
}

export const socialMediaService = new SocialMediaService();
