import { apiRequest } from "./queryClient";

export interface WordPressPost {
  id?: number;
  title: string;
  content: string;
  status: "draft" | "published" | "scheduled";
  publishedAt?: string;
  categories?: string[];
  tags?: string[];
  meta_description?: string;
  featured_image?: string;
}

export interface WordPressPage {
  id?: number;
  title: string;
  content: string;
  slug: string;
  status: "draft" | "published";
  meta_description?: string;
}

export class WordPressService {
  async getPosts(): Promise<WordPressPost[]> {
    const response = await apiRequest("GET", "/api/wordpress/posts");
    return response.json();
  }

  async getPost(id: number): Promise<WordPressPost> {
    const response = await apiRequest("GET", `/api/wordpress/posts/${id}`);
    return response.json();
  }

  async createPost(post: Omit<WordPressPost, "id">): Promise<WordPressPost> {
    const response = await apiRequest("POST", "/api/wordpress/posts", post);
    return response.json();
  }

  async updatePost(id: number, updates: Partial<WordPressPost>): Promise<WordPressPost> {
    const response = await apiRequest("PATCH", `/api/wordpress/posts/${id}`, updates);
    return response.json();
  }

  async publishPost(id: number, publishAt?: string): Promise<WordPressPost> {
    const response = await apiRequest("PATCH", `/api/wordpress/posts/${id}`, {
      status: publishAt ? "scheduled" : "published",
      publishedAt: publishAt
    });
    return response.json();
  }

  async optimizeSEO(postId: number): Promise<{
    title_suggestions: string[];
    meta_description: string;
    keyword_recommendations: string[];
  }> {
    const response = await apiRequest("POST", `/api/wordpress/posts/${postId}/optimize-seo`);
    return response.json();
  }

  async generatePost(topic: string, type: "blog" | "service_page" = "blog"): Promise<WordPressPost> {
    const response = await apiRequest("POST", "/api/wordpress/generate-post", {
      topic,
      type
    });
    return response.json();
  }

  async analyzePerformance(postId: number): Promise<{
    views: number;
    engagement_rate: number;
    conversion_rate: number;
    top_keywords: string[];
  }> {
    const response = await apiRequest("GET", `/api/wordpress/posts/${postId}/analytics`);
    return response.json();
  }
}

export const wordpressService = new WordPressService();
