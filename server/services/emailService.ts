import { MailService } from '@sendgrid/mail';
import { db } from '../db';
import { emailLogs, users } from '../../shared/schema';
import { eq } from 'drizzle-orm';

if (!process.env.SENDGRID_API_KEY) {
  console.warn("SENDGRID_API_KEY not found. Email functionality will be disabled.");
}

const mailService = new MailService();
if (process.env.SENDGRID_API_KEY) {
  mailService.setApiKey(process.env.SENDGRID_API_KEY);
}

interface OnboardingPlanEmailData {
  businessName: string;
  recommendations: Array<{
    title: string;
    description: string;
    category: string;
    priority: string;
    estimatedImpact: string;
    setupTime: string;
  }>;
  userProfile: {
    businessType: string;
    teamSize: string;
    primaryGoals: string[];
    currentChallenges: string[];
  };
}

export class EmailService {
  private async logEmail(
    userId: string | null,
    emailType: string,
    recipientEmail: string,
    subject: string,
    status: 'pending' | 'sent' | 'failed',
    errorMessage?: string
  ) {
    try {
      await db.insert(emailLogs).values({
        userId,
        emailType,
        recipientEmail,
        subject,
        status,
        errorMessage,
        sentAt: status === 'sent' ? new Date() : null,
      });
    } catch (error) {
      console.error('Failed to log email:', error);
    }
  }

  async sendOnboardingPlan(
    userId: string,
    recipientEmail: string,
    data: OnboardingPlanEmailData
  ): Promise<boolean> {
    if (!process.env.SENDGRID_API_KEY) {
      console.warn("SENDGRID_API_KEY not configured. Skipping email send.");
      await this.logEmail(
        userId,
        'onboarding_plan',
        recipientEmail,
        `Your Personalized Marketing Plan - ${data.businessName}`,
        'failed',
        'SendGrid API key not configured'
      );
      return false;
    }

    const subject = `Your Personalized Marketing Plan - ${data.businessName}`;
    
    try {
      const htmlContent = this.generateOnboardingPlanHTML(data);
      const textContent = this.generateOnboardingPlanText(data);

      await this.logEmail(userId, 'onboarding_plan', recipientEmail, subject, 'pending');

      await mailService.send({
        to: recipientEmail,
        from: {
          email: 'noreply@fieldflux.com',
          name: 'FieldFlux Team'
        },
        subject,
        text: textContent,
        html: htmlContent,
        trackingSettings: {
          clickTracking: { enable: true },
          openTracking: { enable: true },
        },
      });

      await this.logEmail(userId, 'onboarding_plan', recipientEmail, subject, 'sent');
      return true;
    } catch (error) {
      console.error('Failed to send onboarding plan email:', error);
      await this.logEmail(
        userId,
        'onboarding_plan',
        recipientEmail,
        subject,
        'failed',
        error instanceof Error ? error.message : 'Unknown error'
      );
      return false;
    }
  }

  private generateOnboardingPlanHTML(data: OnboardingPlanEmailData): string {
    const priorityColors = {
      high: '#ef4444',
      medium: '#f59e0b',
      low: '#3b82f6'
    };

    const categoryIcons = {
      'content': '📝',
      'lead generation': '🎯',
      'reviews': '⭐',
      'social media': '📱',
      'analytics': '📊',
      'automation': '⚡'
    };

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Personalized Marketing Plan</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #374151; margin: 0; padding: 0; background-color: #f9fafb; }
        .container { max-width: 600px; margin: 0 auto; background: white; }
        .header { background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: white; padding: 30px 20px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; font-weight: bold; }
        .header p { margin: 10px 0 0 0; opacity: 0.9; }
        .content { padding: 30px 20px; }
        .business-info { background: #f3f4f6; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
        .business-info h2 { margin: 0 0 15px 0; color: #1f2937; font-size: 20px; }
        .business-info p { margin: 5px 0; }
        .recommendations { margin-bottom: 30px; }
        .recommendations h2 { color: #1f2937; font-size: 24px; margin-bottom: 20px; }
        .recommendation { border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 20px; background: white; }
        .recommendation h3 { margin: 0 0 10px 0; font-size: 18px; color: #1f2937; }
        .recommendation p { margin: 0 0 15px 0; color: #6b7280; }
        .recommendation-meta { display: flex; flex-wrap: wrap; gap: 10px; }
        .meta-item { background: #f3f4f6; padding: 5px 10px; border-radius: 20px; font-size: 12px; font-weight: 500; }
        .priority-high { background: #fef2f2; color: #dc2626; }
        .priority-medium { background: #fffbeb; color: #d97706; }
        .priority-low { background: #eff6ff; color: #2563eb; }
        .footer { background: #f9fafb; padding: 30px 20px; text-align: center; border-top: 1px solid #e5e7eb; }
        .footer p { margin: 5px 0; color: #6b7280; font-size: 14px; }
        .cta-button { display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; margin: 20px 0; }
        .goals-list { list-style: none; padding: 0; }
        .goals-list li { background: #f0f9ff; padding: 8px 12px; margin: 5px 0; border-radius: 4px; border-left: 3px solid #3b82f6; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>⚡ Your Personalized Marketing Plan</h1>
            <p>Custom strategy for ${data.businessName}</p>
        </div>
        
        <div class="content">
            <div class="business-info">
                <h2>📋 Business Profile</h2>
                <p><strong>Business Type:</strong> ${data.userProfile.businessType}</p>
                <p><strong>Team Size:</strong> ${data.userProfile.teamSize}</p>
                
                ${data.userProfile.primaryGoals.length > 0 ? `
                <p><strong>Primary Goals:</strong></p>
                <ul class="goals-list">
                    ${data.userProfile.primaryGoals.map(goal => `<li>${goal}</li>`).join('')}
                </ul>
                ` : ''}
                
                ${data.userProfile.currentChallenges.length > 0 ? `
                <p><strong>Current Challenges:</strong></p>
                <ul class="goals-list">
                    ${data.userProfile.currentChallenges.map(challenge => `<li>${challenge}</li>`).join('')}
                </ul>
                ` : ''}
            </div>
            
            <div class="recommendations">
                <h2>🎯 Your Custom Recommendations</h2>
                <p>Based on your business profile, here are personalized strategies to help ${data.businessName} grow:</p>
                
                ${data.recommendations.map(rec => `
                <div class="recommendation">
                    <h3>${categoryIcons[rec.category.toLowerCase() as keyof typeof categoryIcons] || '🔧'} ${rec.title}</h3>
                    <p>${rec.description}</p>
                    <div class="recommendation-meta">
                        <span class="meta-item priority-${rec.priority.toLowerCase()}">${rec.priority.toUpperCase()} PRIORITY</span>
                        <span class="meta-item">📈 Impact: ${rec.estimatedImpact}</span>
                        <span class="meta-item">⏱️ Setup: ${rec.setupTime}</span>
                        <span class="meta-item">📁 ${rec.category}</span>
                    </div>
                </div>
                `).join('')}
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="https://fieldflux.com/dashboard" class="cta-button">
                    🚀 Start Implementation in FieldFlux
                </a>
                <p style="font-size: 14px; color: #6b7280; margin-top: 10px;">
                    Ready to put your plan into action? Access your dashboard to begin implementing these strategies.
                </p>
            </div>
            
            <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6;">
                <h3 style="margin: 0 0 10px 0; color: #1e40af;">💡 Next Steps</h3>
                <ul style="margin: 0; padding-left: 20px; color: #1e40af;">
                    <li>Log into your FieldFlux dashboard to start implementing</li>
                    <li>Focus on high-priority recommendations first</li>
                    <li>Track your progress and results over time</li>
                    <li>Schedule a strategy call with our team if needed</li>
                </ul>
            </div>
        </div>
        
        <div class="footer">
            <p><strong>FieldFlux</strong> - Intelligent Field Service Marketing</p>
            <p>This plan was generated specifically for ${data.businessName} based on your unique business profile.</p>
            <p style="font-size: 12px; margin-top: 20px;">
                Questions? Reply to this email or contact us at support@fieldflux.com
            </p>
        </div>
    </div>
</body>
</html>`;
  }

  private generateOnboardingPlanText(data: OnboardingPlanEmailData): string {
    return `
Your Personalized Marketing Plan for ${data.businessName}

BUSINESS PROFILE
================
Business Type: ${data.userProfile.businessType}
Team Size: ${data.userProfile.teamSize}

Primary Goals:
${data.userProfile.primaryGoals.map(goal => `• ${goal}`).join('\n')}

Current Challenges:
${data.userProfile.currentChallenges.map(challenge => `• ${challenge}`).join('\n')}

YOUR CUSTOM RECOMMENDATIONS
===========================

${data.recommendations.map((rec, index) => `
${index + 1}. ${rec.title}
   Category: ${rec.category}
   Priority: ${rec.priority.toUpperCase()}
   
   ${rec.description}
   
   Expected Impact: ${rec.estimatedImpact}
   Setup Time: ${rec.setupTime}
   
`).join('\n')}

NEXT STEPS
==========
• Log into your FieldFlux dashboard to start implementing these strategies
• Focus on high-priority recommendations first for maximum impact
• Track your progress and results over time
• Contact our team if you need implementation guidance

Ready to get started? Visit: https://fieldflux.com/dashboard

---
FieldFlux - Intelligent Field Service Marketing
This plan was generated specifically for ${data.businessName} based on your unique business profile.

Questions? Reply to this email or contact us at support@fieldflux.com
`;
  }

  async sendAchievementUnlock(
    userId: string,
    recipientEmail: string,
    achievementTitle: string,
    achievementDescription: string,
    points: number
  ): Promise<boolean> {
    if (!process.env.SENDGRID_API_KEY) {
      return false;
    }

    const subject = `🏆 Achievement Unlocked: ${achievementTitle}`;
    
    try {
      await this.logEmail(userId, 'achievement_unlock', recipientEmail, subject, 'pending');

      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: white; padding: 30px; text-align: center;">
            <h1>🏆 Achievement Unlocked!</h1>
            <h2>${achievementTitle}</h2>
          </div>
          <div style="padding: 30px;">
            <p style="font-size: 18px;">${achievementDescription}</p>
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center;">
              <h3>You earned ${points} points! 🌟</h3>
            </div>
            <div style="text-align: center; margin-top: 30px;">
              <a href="https://fieldflux.com/dashboard" style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
                View Your Progress
              </a>
            </div>
          </div>
        </div>
      `;

      await mailService.send({
        to: recipientEmail,
        from: {
          email: 'noreply@fieldflux.com',
          name: 'FieldFlux Team'
        },
        subject,
        html: htmlContent,
      });

      await this.logEmail(userId, 'achievement_unlock', recipientEmail, subject, 'sent');
      return true;
    } catch (error) {
      console.error('Failed to send achievement email:', error);
      await this.logEmail(
        userId,
        'achievement_unlock',
        recipientEmail,
        subject,
        'failed',
        error instanceof Error ? error.message : 'Unknown error'
      );
      return false;
    }
  }
}

export const emailService = new EmailService();