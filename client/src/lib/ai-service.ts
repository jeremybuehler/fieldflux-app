import { apiRequest } from "./queryClient";

export interface ContentGenerationRequest {
  topic: string;
  type: "blog" | "social" | "email" | "ad";
  platform?: string;
  tone?: "professional" | "casual" | "friendly" | "urgent";
  length?: "short" | "medium" | "long";
}

export interface SEOAnalysisRequest {
  url: string;
  keywords?: string;
  location?: string;
}

export interface ContentGenerationResponse {
  title?: string;
  content: string;
  hashtags?: string[];
  keywords?: string[];
  meta_description?: string;
}

export interface SEOAnalysisResponse {
  score: number;
  recommendations: string[];
  keywords: Array<{
    keyword: string;
    difficulty: number;
    volume: number;
  }>;
  technical_issues: string[];
}

export class AIService {
  async generateContent(request: ContentGenerationRequest): Promise<ContentGenerationResponse> {
    const endpoint = request.type === "blog" 
      ? "/api/wordpress/generate-post"
      : "/api/social/generate-post";

    const response = await apiRequest("POST", endpoint, request);
    return response.json();
  }

  async analyzeSEO(request: SEOAnalysisRequest): Promise<SEOAnalysisResponse> {
    const response = await apiRequest("POST", "/api/seo/analyze", request);
    return response.json();
  }

  async generateReviewResponse(review: string, rating: number): Promise<{ response: string }> {
    const response = await apiRequest("POST", "/api/reviews/generate-response", {
      review,
      rating
    });
    return response.json();
  }

  async optimizeAdCopy(currentAd: string, goal: string): Promise<{ optimized_ad: string; improvements: string[] }> {
    const response = await apiRequest("POST", "/api/ads/optimize", {
      current_ad: currentAd,
      goal
    });
    return response.json();
  }
}

export const aiService = new AIService();
