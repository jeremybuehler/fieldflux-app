# Review Management Context

## Purpose
Review Management is FieldFlux's comprehensive reputation management system designed specifically for field service businesses. It monitors customer reviews across all major platforms (Google, Yelp, Facebook, Angie's List, etc.), automates response generation, tracks reputation trends, and helps businesses proactively manage their online presence to attract more customers.

## Components

### Primary Components
- **`Reviews`** (`/client/src/pages/reviews.tsx`) - Main review management interface
- **Review monitoring dashboard** - Multi-platform review aggregation
- **Response automation** - AI-powered review response generation
- **Reputation analytics** - Review trends and sentiment analysis
- **Review request system** - Automated customer review solicitation

### Supporting Components
- **Platform connectors** - API integrations with review platforms
- **Sentiment analysis engine** - AI-powered review sentiment scoring
- **Template manager** - Customizable response templates
- **Alert system** - Real-time notifications for new reviews

## Status
- **Implementation**: ✅ Core review management interface implemented
- **Multi-platform Monitoring**: 🔄 Google Reviews integrated, others in development
- **AI Response Generation**: ✅ Basic AI responses working
- **Analytics Dashboard**: ⚠️ Basic metrics available, advanced analytics needed
- **Automation**: 🔄 Review request automation in development

## Technical Details

### Database Tables
```sql
reviews - Customer reviews from all platforms
├── id (serial) - Unique review identifier
├── user_id (varchar) - Business owner
├── platform (text) - google, yelp, facebook, angies_list, homeadvisor
├── platform_review_id (varchar) - Platform-specific review ID
├── customer_name (varchar) - Reviewer name
├── customer_email (varchar) - Email if available
├── rating (integer) - Star rating (1-5)
├── review_text (text) - Full review content
├── response_text (text) - Business response
├── response_status (text) - pending, sent, none_needed
├── sentiment_score (decimal) - AI sentiment analysis (-1 to 1)
├── review_date (timestamp) - When review was posted
├── responded_at (timestamp) - When business responded
├── created_at (timestamp) - When review was imported
├── updated_at (timestamp)
├── is_featured (boolean) - Showcase on website
├── tags (jsonb) - Review categorization tags

review_requests - Automated review solicitation tracking
├── id (serial) - Request identifier
├── user_id (varchar) - Business owner
├── customer_email (varchar) - Customer email address
├── customer_name (varchar) - Customer name
├── service_type (text) - Type of service provided
├── job_completion_date (timestamp) - Service completion
├── request_sent_at (timestamp) - When request was sent
├── reminder_sent_at (timestamp) - Follow-up reminder
├── review_received (boolean) - Whether customer left review
├── platform_used (text) - Which platform customer used
├── created_at (timestamp)
```

### API Endpoints
- `GET /api/reviews` - Retrieve reviews with filtering and pagination
- `POST /api/reviews/sync` - Sync reviews from external platforms
- `PUT /api/reviews/:id/respond` - Submit business response to review
- `POST /api/reviews/generate-response` - AI-powered response generation
- `GET /api/reviews/analytics` - Review metrics and trends
- `POST /api/reviews/request` - Send review request to customer
- `GET /api/reviews/sentiment` - Sentiment analysis results

### External Integrations
- **Google My Business API** - Google Reviews monitoring and response
- **Yelp Fusion API** - Yelp review tracking and management
- **Facebook Graph API** - Facebook page review monitoring
- **OpenAI GPT-4o** - AI-powered response generation
- **Email Service** - Review request automation
- **SMS Service** - Text-based review requests

## User Workflows

### Review Monitoring Process
1. **Automated Platform Sync**:
   - System checks connected platforms every 4 hours
   - New reviews automatically imported and categorized
   - Sentiment analysis performed on review content
   - Urgent alerts sent for negative reviews (1-2 stars)
   - Dashboard updated with latest review metrics

2. **Review Response Workflow**:
   - Negative reviews flagged for immediate attention
   - AI generates professional response suggestions
   - Business owner reviews and customizes response
   - Response submitted to original platform
   - Follow-up tracking for customer satisfaction

### Review Request Automation
1. **Job Completion Trigger**:
   - Service completion date recorded in system
   - 24-48 hour delay before review request sent
   - Personalized email/SMS sent to customer
   - Follow-up reminder sent after 7 days if no response
   - Tracking of request effectiveness and conversion

2. **Strategic Review Generation**:
   - Target customers with positive service experiences
   - Customize request messaging by service type
   - Provide easy links to preferred review platforms
   - Track which platforms generate most reviews
   - Optimize timing and messaging based on results

### Reputation Crisis Management
1. **Negative Review Alert System**:
   - Immediate notification for 1-2 star reviews
   - Escalation process for serious complaints
   - Template responses for common issues
   - Internal tracking of resolution efforts
   - Follow-up monitoring for review updates

## Integration Points

### Connects To
- **Dashboard** - Review metrics and reputation scores
- **Lead Management** - Review scores influence lead qualification
- **Social Media** - Positive reviews shared on social platforms
- **Website Management** - Featured reviews displayed on website
- **Communication** - Review request campaigns and responses
- **AI Coach** - Reputation improvement recommendations

### Data Sources
- Google My Business for Google Reviews
- Yelp API for Yelp reviews and business listings
- Facebook API for Facebook page reviews
- Industry review platforms (Angie's List, HomeAdvisor)
- Customer service records for review context

## Success Metrics

### Reputation KPIs
- **Overall Rating**: Average star rating across all platforms
- **Review Volume**: Number of new reviews per month
- **Response Rate**: Percentage of reviews that receive responses
- **Response Time**: Average time to respond to negative reviews
- **Sentiment Improvement**: Month-over-month sentiment score improvement

### Target Benchmarks by Platform
- **Google Reviews**: 4.5+ stars, 10+ new reviews/month
- **Yelp**: 4.0+ stars (typically lower than Google)
- **Facebook**: 4.5+ stars, focus on local community
- **Angie's List**: 4.0+ stars, detailed service reviews
- **HomeAdvisor**: High completion rate, detailed project reviews

### Business Impact Metrics
- **Lead Quality**: Higher ratings attract better leads
- **Conversion Rate**: Reviews influence customer decisions
- **Price Premium**: Better reputation supports higher pricing
- **Customer Lifetime Value**: Positive reviews indicate satisfied customers

## Field Service Reputation Strategies

### Service Type Specific Approaches
1. **HVAC Services**:
   - Emphasize comfort, reliability, and energy savings
   - Highlight emergency response capabilities
   - Focus on maintenance program satisfaction
   - Showcase energy efficiency improvements

2. **Plumbing Services**:
   - Stress cleanliness and professionalism
   - Highlight emergency availability
   - Focus on problem resolution and prevention
   - Emphasize fair pricing and honest estimates

3. **Electrical Services**:
   - Emphasize safety and code compliance
   - Highlight expertise with complex systems
   - Focus on reliability and problem-solving
   - Showcase modern technology installation

### Review Response Strategies
- **5-Star Reviews**: Thank customer, highlight specific service aspects
- **4-Star Reviews**: Thank and ask how to achieve 5 stars next time
- **3-Star Reviews**: Acknowledge concerns, offer to improve
- **1-2 Star Reviews**: Apologize, take responsibility, offer resolution

## Current Challenges

### Platform Integration
- Managing multiple API connections and rate limits
- Handling different review formats and data structures
- Keeping up with platform policy and API changes
- Dealing with platform-specific authentication requirements

### Response Quality
- Generating authentic, personalized responses at scale
- Maintaining brand voice consistency across responses
- Balancing professional tone with personal touch
- Handling complex complaints and technical issues

### Review Request Optimization
- Timing requests for maximum response rate
- Avoiding customer fatigue with review requests
- Balancing automation with personal touch
- Managing unsubscribe and preference management

## Future Roadmap

### Phase 1 (Next 30 days)
- Complete Yelp and Facebook review integration
- Implement automated review request campaigns
- Add advanced sentiment analysis and categorization
- Create industry-specific response templates

### Phase 2 (30-60 days)
- Integration with Angie's List and HomeAdvisor
- Advanced analytics with competitor comparison
- Photo and video review management
- Custom review widget for website embedding

### Phase 3 (60-90 days)
- AI-powered reputation improvement recommendations
- Predictive analytics for review trends
- Integration with field service management systems
- White-label review management for partners

## Technical Considerations

### Data Privacy and Security
- Secure storage of customer review data
- Compliance with platform terms of service
- Customer privacy protection in review responses
- Data retention policies for review archives

### API Management
- Efficient polling strategies for platform APIs
- Rate limiting and quota management
- Error handling for failed API requests
- Webhook integration where available

### Performance Optimization
- Efficient review data synchronization
- Fast search and filtering for large review datasets
- Real-time notification system for urgent reviews
- Caching strategies for frequently accessed reviews

### Mobile Optimization
- Mobile-responsive review management interface
- Push notifications for urgent reviews
- Quick response templates for mobile use
- Offline capability for response drafting

## Reputation Recovery Strategies

### Crisis Response Protocol
1. **Immediate Response** (within 2 hours):
   - Acknowledge the issue publicly
   - Take responsibility where appropriate
   - Offer to resolve offline
   - Provide direct contact information

2. **Resolution Process**:
   - Contact customer directly to understand issue
   - Work toward mutually acceptable solution
   - Document resolution process
   - Follow up to ensure satisfaction

3. **Reputation Rebuilding**:
   - Increase positive review generation
   - Showcase improvements made
   - Monitor for follow-up reviews
   - Use experience to improve service delivery

### Proactive Reputation Building
- Systematically request reviews from satisfied customers
- Feature positive reviews in marketing materials
- Address common negative themes proactively
- Train staff on review-generating service behaviors