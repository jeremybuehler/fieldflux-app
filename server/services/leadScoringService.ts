import OpenAI from "openai";
import type { Lead } from "@shared/schema";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface LeadScoringResult {
  leadScore: number;
  urgencyScore: number;
  conversionProbability: number;
  predictedValue: number;
  engagementLevel: "low" | "medium" | "high";
  aiRecommendations: string[];
  nextFollowUpAt: Date;
}

export interface LeadScoringFactors {
  service: string;
  location: string;
  contactMethod: "phone" | "email" | "form" | "chat";
  timeOfInquiry: Date;
  responseTime?: number; // minutes
  previousInteractions?: number;
  referralSource?: string;
}

export class LeadScoringService {
  // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
  private model = "gpt-4o";

  async scoreLeadWithAI(lead: Partial<Lead>, factors: LeadScoringFactors): Promise<LeadScoringResult> {
    try {
      const prompt = this.buildScoringPrompt(lead, factors);
      
      const response = await openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: "system",
            content: "You are an expert field service business analyst specializing in lead qualification and conversion optimization. Analyze leads for HVAC, plumbing, electrical, and other field service businesses."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3
      });

      const result = JSON.parse(response.choices[0].message.content!);
      
      return {
        leadScore: Math.max(0, Math.min(100, result.leadScore)),
        urgencyScore: Math.max(0, Math.min(100, result.urgencyScore)),
        conversionProbability: Math.max(0, Math.min(100, result.conversionProbability)),
        predictedValue: Math.max(0, result.predictedValue),
        engagementLevel: result.engagementLevel,
        aiRecommendations: result.recommendations || [],
        nextFollowUpAt: new Date(Date.now() + (result.followUpHours * 60 * 60 * 1000))
      };
    } catch (error) {
      console.error("Lead scoring AI error:", error);
      return this.getFallbackScoring(lead, factors);
    }
  }

  private buildScoringPrompt(lead: Partial<Lead>, factors: LeadScoringFactors): string {
    return `Analyze this field service lead and provide comprehensive scoring:

LEAD INFORMATION:
- Name: ${lead.name || "Unknown"}
- Service: ${factors.service}
- Location: ${factors.location}
- Email: ${lead.email ? "Provided" : "Not provided"}
- Phone: ${lead.phone ? "Provided" : "Not provided"}
- Contact Method: ${factors.contactMethod}
- Inquiry Time: ${factors.timeOfInquiry.toISOString()}
- Response Time: ${factors.responseTime ? `${factors.responseTime} minutes` : "Not yet responded"}
- Previous Interactions: ${factors.previousInteractions || 0}
- Referral Source: ${factors.referralSource || "Unknown"}

SCORING CRITERIA:
1. Lead Score (0-100): Overall quality based on completeness, urgency indicators, service type
2. Urgency Score (0-100): How quickly this lead needs attention
3. Conversion Probability (0-100): Likelihood to become a paying customer
4. Predicted Value ($): Estimated job value based on service type and location
5. Engagement Level: low/medium/high based on contact completeness and urgency
6. Recommendations: 3-5 specific actionable next steps
7. Follow-up Hours: Hours until next contact (1-168)

FIELD SERVICE CONTEXT:
- Emergency services (AC repair, plumbing leaks) = higher urgency
- Maintenance requests = medium urgency
- Installation quotes = lower urgency but higher value
- Complete contact info = higher conversion probability
- Quick response time = higher customer satisfaction

Return JSON format:
{
  "leadScore": number,
  "urgencyScore": number, 
  "conversionProbability": number,
  "predictedValue": number,
  "engagementLevel": "low"|"medium"|"high",
  "recommendations": ["action1", "action2", "action3"],
  "followUpHours": number
}`;
  }

  private getFallbackScoring(lead: Partial<Lead>, factors: LeadScoringFactors): LeadScoringResult {
    // Basic rule-based scoring as fallback
    let leadScore = 50;
    let urgencyScore = 50;
    let conversionProbability = 50;
    let predictedValue = 300;

    // Service type scoring
    const emergencyServices = ["emergency repair", "urgent", "leak", "no heat", "no cooling"];
    const highValueServices = ["installation", "replacement", "new system"];
    
    if (emergencyServices.some(keyword => factors.service.toLowerCase().includes(keyword))) {
      urgencyScore += 30;
      leadScore += 15;
      predictedValue = 200;
    }
    
    if (highValueServices.some(keyword => factors.service.toLowerCase().includes(keyword))) {
      predictedValue = 2000;
      leadScore += 20;
    }

    // Contact completeness
    if (lead.email && lead.phone) {
      leadScore += 20;
      conversionProbability += 15;
    } else if (lead.email || lead.phone) {
      leadScore += 10;
      conversionProbability += 8;
    }

    // Timing factors
    const hour = factors.timeOfInquiry.getHours();
    if (hour >= 9 && hour <= 17) {
      leadScore += 10;
    }

    const engagementLevel = leadScore >= 70 ? "high" : leadScore >= 50 ? "medium" : "low";
    
    return {
      leadScore: Math.max(0, Math.min(100, leadScore)),
      urgencyScore: Math.max(0, Math.min(100, urgencyScore)),
      conversionProbability: Math.max(0, Math.min(100, conversionProbability)),
      predictedValue,
      engagementLevel,
      aiRecommendations: [
        "Call within 1 hour for emergency services",
        "Send follow-up email with service details",
        "Schedule on-site estimate if needed"
      ],
      nextFollowUpAt: new Date(Date.now() + (urgencyScore > 70 ? 1 : 24) * 60 * 60 * 1000)
    };
  }

  async generateRecommendations(lead: Lead): Promise<string[]> {
    try {
      const prompt = `Generate 3-5 specific actionable recommendations for following up with this field service lead:

Lead: ${lead.name}
Service: ${lead.service}
Status: ${lead.status}
Priority: ${lead.priority}
Lead Score: ${lead.leadScore}/100
Last Contact: ${lead.lastContactedAt || "Never"}

Consider:
- Current lead status and score
- Service type urgency
- Best practices for field service follow-up
- Customer relationship building

Return only a JSON array of recommendation strings:
["recommendation1", "recommendation2", "recommendation3"]`;

      const response = await openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: "system", 
            content: "You are a field service sales expert. Provide specific, actionable follow-up recommendations."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.4
      });

      const result = JSON.parse(response.choices[0].message.content!);
      return result.recommendations || [];
    } catch (error) {
      console.error("AI recommendations error:", error);
      return [
        "Call lead within 24 hours to discuss service needs",
        "Send follow-up email with company credentials and testimonials", 
        "Schedule convenient time for on-site estimate"
      ];
    }
  }

  calculateLeadPriority(leadScore: number, urgencyScore: number): "low" | "medium" | "high" {
    const combinedScore = (leadScore + urgencyScore) / 2;
    if (combinedScore >= 70) return "high";
    if (combinedScore >= 50) return "medium";
    return "low";
  }
}

export const leadScoringService = new LeadScoringService();