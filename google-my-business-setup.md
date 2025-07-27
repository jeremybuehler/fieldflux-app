
# Google My Business Setup Guide for FieldPulse

## Overview

This guide helps you connect your Google My Business (GMB) profile to FieldPulse for automated review management, local SEO tracking, and customer engagement features.

## Prerequisites

Before starting, ensure you have:
- A verified Google My Business profile
- Administrative access to your business listing
- A Google Cloud Platform account (free tier available)
- FieldPulse account with appropriate permissions

## Step 1: Google Cloud Platform Setup

### 1.1 Create or Access Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing project
3. Note your project ID for later use

### 1.2 Enable Required APIs
Enable these APIs in your Google Cloud Console:
- **Google My Business API** (for business profile data)
- **Places API** (for reviews and location data)
- **Maps API** (for location services)

```bash
# Using gcloud CLI (optional)
gcloud services enable mybusiness.googleapis.com
gcloud services enable places-backend.googleapis.com
gcloud services enable maps-backend.googleapis.com
```

### 1.3 Create API Credentials
1. Navigate to **APIs & Services > Credentials**
2. Click **Create Credentials > API Key**
3. Restrict the API key to specific APIs:
   - Google My Business API
   - Places API
   - Maps JavaScript API
4. Add HTTP referrer restrictions for security
5. Copy the API key for FieldPulse configuration

## Step 2: Google My Business Account Verification

### 2.1 Business Profile Requirements
Ensure your GMB profile has:
- ✅ Verified business address
- ✅ Complete business information (hours, phone, website)
- ✅ Business category properly set
- ✅ Photos and business description
- ✅ Active status (not suspended)

### 2.2 Account Permissions
You need one of these permission levels:
- **Owner**: Full access to all features
- **Manager**: Can manage reviews and posts
- **Site Manager**: Limited posting abilities

## Step 3: FieldPulse Integration

### 3.1 Configure API Settings
In FieldPulse Settings page:

1. Navigate to **Settings > Integrations > Google My Business**
2. Enter your Google Places API key
3. Add your business Place ID (found in GMB dashboard)
4. Test the connection

```javascript
// Example configuration
const gmbConfig = {
  apiKey: "YOUR_GOOGLE_PLACES_API_KEY",
  placeId: "ChIJN1t_tDeuEmsRUsoyG83frY4", // Your business Place ID
  businessName: "Your Business Name",
  refreshInterval: 30 // Minutes between review checks
};
```

### 3.2 Business Place ID Location
Find your Place ID:
1. Go to [Google My Business](https://business.google.com/)
2. Select your business
3. Click "Info" in the sidebar
4. Scroll to "Your business on Google"
5. Copy the Place ID from the URL or use the Place ID Finder tool

### 3.3 Permissions Setup
Grant FieldPulse access to:
- ✅ Read business profile information
- ✅ Access customer reviews
- ✅ View business insights and analytics
- ✅ Manage business posts (optional)
- ✅ Respond to reviews (if desired)

## Step 4: Feature Configuration

### 4.1 Review Management
Configure automated review responses:

```yaml
Review Response Settings:
  - Auto-respond to 5-star reviews: Enabled
  - Auto-respond to negative reviews: Enabled with escalation
  - Response tone: Professional and friendly
  - Include business name: Yes
  - Thank customers by name: Yes
  - Escalation threshold: 3 stars or below
```

### 4.2 Monitoring Setup
Set up review monitoring:
- **Check frequency**: Every 15-30 minutes
- **Notification preferences**: Email and in-app
- **Response time goal**: Within 2 hours
- **Escalation alerts**: For negative reviews

### 4.3 Analytics Integration
Connect GMB insights:
- Customer actions (calls, website visits, direction requests)
- Photo views and engagement
- Search queries and visibility
- Customer reviews and ratings trends

## Step 5: Testing and Validation

### 5.1 Connection Test
Verify the integration:
1. Check FieldPulse can fetch your business information
2. Confirm recent reviews appear in the dashboard
3. Test review response generation (draft mode)
4. Validate analytics data synchronization

### 5.2 Review Response Test
Test automated responses:
1. Create a test review (using a different account)
2. Verify FieldPulse detects the new review
3. Check automated response generation
4. Confirm response posting (if auto-posting enabled)

## Step 6: Ongoing Management

### 6.1 Regular Monitoring
- Review FieldPulse dashboard daily
- Monitor review response performance
- Check for any API errors or connection issues
- Update business information as needed

### 6.2 Performance Optimization
Track these metrics:
- Average review response time
- Customer engagement with responses
- Review rating trends
- Local search visibility improvements

## Troubleshooting Common Issues

### API Connection Problems
```javascript
// Common error codes and solutions
const troubleshooting = {
  "INVALID_REQUEST": "Check API key and Place ID format",
  "OVER_QUERY_LIMIT": "Review API quota and usage limits",
  "REQUEST_DENIED": "Verify API key permissions and restrictions",
  "ZERO_RESULTS": "Confirm Place ID is correct and business is verified",
  "UNKNOWN_ERROR": "Temporary Google API issue, retry later"
};
```

### Business Profile Issues
- **Suspended Profile**: Contact Google My Business support
- **Unverified Location**: Complete verification process
- **Missing Reviews**: Check review settings and permissions
- **Outdated Information**: Update business profile data

### Integration Errors
- **Authentication Failed**: Verify API key and permissions
- **Data Sync Issues**: Check internet connection and API status
- **Missing Features**: Ensure all required APIs are enabled
- **Rate Limiting**: Reduce check frequency or upgrade API quota

## Security Best Practices

### API Key Management
- Store API keys securely in environment variables
- Use API key restrictions (HTTP referrers, IP addresses)
- Regularly rotate API keys
- Monitor API usage for unusual activity

### Data Protection
- Ensure GDPR compliance for customer data
- Implement proper data retention policies
- Secure review data transmission
- Regular backup of business analytics

## Advanced Features

### Custom Review Templates
```javascript
// Example review response templates
const responseTemplates = {
  fiveStars: {
    hvac: "Thank you {{customerName}} for the fantastic 5-star review! We're thrilled that our HVAC team exceeded your expectations. Your recommendation means the world to us!",
    plumbing: "{{customerName}}, thank you for the outstanding review! We're so glad our plumbing services solved your issue quickly and professionally."
  },
  
  fourStars: {
    general: "Hi {{customerName}}, thank you for the 4-star review! We appreciate your feedback and would love to know how we can earn that 5th star next time."
  },
  
  negative: {
    escalation: "Hi {{customerName}}, we sincerely apologize for not meeting your expectations. Please contact us directly at {{businessPhone}} so we can make this right."
  }
};
```

### Analytics Integration
Track advanced metrics:
- Review sentiment analysis
- Response rate impact on new reviews
- Customer engagement with GMB posts
- Local search ranking improvements
- Conversion tracking from GMB to website

## Support Resources

### Google My Business Help
- [GMB Help Center](https://support.google.com/business/)
- [API Documentation](https://developers.google.com/my-business)
- [Community Forums](https://support.google.com/business/community)

### FieldPulse Support
- In-app help documentation
- Video tutorials for GMB integration
- Email support for technical issues
- Community best practices sharing

## Compliance and Legal

### Terms of Service
- Review Google My Business Terms of Service
- Understand API usage limitations
- Comply with review response guidelines
- Follow local business regulation requirements

### Data Privacy
- GDPR compliance for EU customers
- Customer data protection protocols
- Review data retention policies
- Consent management for automated responses

---

**Last Updated**: January 2025  
**Integration Status**: Active and Supported  
**Support Level**: Full Documentation and Technical Support
