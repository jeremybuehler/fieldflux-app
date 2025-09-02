# Social Media Management Context

## Purpose
Social Media Management is FieldFlux's comprehensive solution for field service businesses to maintain consistent, engaging social media presence across multiple platforms. It provides AI-powered content creation, automated posting schedules, engagement tracking, and performance analytics specifically tailored for HVAC, plumbing, electrical, and other field service industries.

## Components

### Primary Components
- **`Social`** (`/client/src/pages/social.tsx`) - Main social media management interface
- **Content creation wizard** - AI-powered post generation
- **Publishing scheduler** - Multi-platform posting automation
- **Performance dashboard** - Engagement metrics and analytics
- **Content calendar** - Visual posting schedule management

### Supporting Components
- **Platform connectors** - API integrations for each social platform
- **Content templates** - Industry-specific post templates
- **Image editor** - Basic photo editing and branding tools
- **Engagement monitor** - Comment and message tracking

## Status
- **Implementation**: ✅ Core social media interface implemented
- **Content Creation**: ✅ AI-powered content generation active
- **Multi-platform Posting**: 🔄 In development (Facebook, Instagram, LinkedIn)
- **Analytics Integration**: ⚠️ Basic metrics implemented, advanced analytics needed
- **Automation**: 🔄 Scheduled posting in progress

## Technical Details

### Database Tables
```sql
social_posts - Scheduled and published social media content
├── id (serial) - Unique post identifier
├── user_id (varchar) - Owner of the post
├── platform (text) - facebook, instagram, linkedin, twitter
├── content (text) - Post text content
├── media_urls (jsonb) - Array of image/video URLs
├── scheduled_at (timestamp) - When to publish
├── published_at (timestamp) - Actual publication time
├── status (text) - draft, scheduled, published, failed
├── post_id (varchar) - Platform-specific post ID
├── engagement_metrics (jsonb) - Likes, shares, comments
├── created_at (timestamp)
├── updated_at (timestamp)

social_media_configs - Platform API configurations
├── id (serial) - Configuration identifier
├── user_id (varchar) - Account owner
├── platform (text) - Social media platform
├── access_token (text) - Encrypted API access token
├── refresh_token (text) - Token refresh credentials
├── page_id (varchar) - Platform-specific page/account ID
├── is_active (boolean) - Configuration status
├── expires_at (timestamp) - Token expiration
├── created_at (timestamp)
├── updated_at (timestamp)
```

### API Endpoints
- `GET /api/social/posts` - Retrieve scheduled and published posts
- `POST /api/social/posts` - Create new social media post
- `PUT /api/social/posts/:id` - Update post content or schedule
- `DELETE /api/social/posts/:id` - Cancel scheduled post
- `POST /api/social/generate` - AI-powered content generation
- `POST /api/social/publish/:id` - Publish post immediately
- `GET /api/social/analytics` - Platform performance metrics
- `GET /api/social/configs` - User's platform configurations

### External Integrations
- **Facebook Graph API** - Facebook and Instagram posting
- **LinkedIn API** - Professional network sharing
- **Twitter API v2** - Tweet scheduling and engagement
- **OpenAI GPT-4o** - Content generation and optimization
- **Image APIs** - Stock photo integration and editing
- **Scheduling Service** - Automated posting infrastructure

## User Workflows

### Content Creation Process
1. **AI-Assisted Creation**:
   - User selects service type (HVAC, plumbing, electrical)
   - AI generates industry-specific content suggestions
   - User reviews and customizes generated content
   - Images selected from stock library or uploaded
   - Hashtags and mentions automatically suggested

2. **Manual Creation**:
   - User writes original post content
   - Platform-specific formatting applied
   - Media files uploaded and optimized
   - Preview generated for each platform
   - Content saved as draft or scheduled

### Scheduling and Publishing
1. User selects target platforms (Facebook, Instagram, LinkedIn)
2. Optimal posting times suggested based on audience data
3. Content adapted for each platform's requirements
4. Posts scheduled in content calendar
5. Automated publishing at scheduled times
6. Real-time notifications for published posts

### Performance Monitoring
1. Daily engagement summary delivered via email
2. Weekly performance reports with key metrics
3. Content performance ranking and insights
4. Audience growth and demographic analysis
5. Competitor benchmarking and industry comparisons

## Integration Points

### Connects To
- **AI Coach** - Content strategy recommendations and optimization
- **Dashboard** - Social media performance metrics
- **Lead Management** - Social media lead capture and tracking
- **Website Management** - Cross-platform content promotion
- **Analytics** - Social media ROI and conversion tracking
- **Communication** - Customer service and reputation management

### Data Sources
- Platform APIs for engagement metrics
- Industry trend data for content optimization
- Customer data for audience targeting
- Seasonal data for timing optimization
- Competitor data for benchmarking

## Success Metrics

### Engagement KPIs
- **Reach**: Number of unique users who see content
- **Engagement Rate**: Likes, comments, shares per post
- **Click-Through Rate**: Website traffic from social media
- **Lead Generation**: Inquiries originating from social platforms
- **Brand Awareness**: Mentions, tags, and organic sharing

### Target Benchmarks by Industry
- **HVAC**: 3-5% engagement rate, 50+ leads/month from social
- **Plumbing**: 4-6% engagement rate, emergency call tracking
- **Electrical**: 2-4% engagement rate, safety content focus
- **Landscaping**: 5-8% engagement rate, seasonal project showcasing

### Content Performance Metrics
- **Educational Content**: 15-25% engagement rate
- **Before/After Photos**: 20-30% engagement rate
- **Customer Testimonials**: 10-20% engagement rate
- **Promotional Content**: 5-15% engagement rate

## Field Service Content Strategy

### Content Categories
1. **Educational Content** (40% of posts):
   - Maintenance tips and seasonal advice
   - DIY vs. professional service guidance
   - Energy efficiency and cost savings
   - Safety tips and warning signs

2. **Social Proof** (30% of posts):
   - Before/after project photos
   - Customer testimonials and reviews
   - Team member spotlights
   - Company achievement announcements

3. **Promotional Content** (20% of posts):
   - Special offers and seasonal discounts
   - New service announcements
   - Emergency service availability
   - Contact information and booking

4. **Community Engagement** (10% of posts):
   - Local event participation
   - Community service activities
   - Industry news and trends
   - Behind-the-scenes content

### Seasonal Content Planning
- **Spring**: HVAC tune-ups, landscaping projects, electrical safety
- **Summer**: AC maintenance, pool equipment, outdoor electrical
- **Fall**: Heating system prep, gutter cleaning, winterization
- **Winter**: Emergency services, indoor air quality, holiday hours

## Current Challenges

### Platform Management
- Keeping up with changing API requirements across platforms
- Managing different content formats and character limits
- Synchronizing posting schedules across time zones
- Handling platform-specific engagement strategies

### Content Quality
- Maintaining consistent brand voice across all platforms
- Generating engaging content that drives actual business results
- Balancing promotional content with educational value
- Creating platform-specific content while maintaining efficiency

### Analytics and ROI
- Tracking social media leads through to completed sales
- Measuring brand awareness and reputation impact
- Attributing revenue to specific social media activities
- Comparing performance across different service types

## Future Roadmap

### Phase 1 (Next 30 days)
- Complete Facebook and Instagram posting integration
- Implement automated content scheduling
- Add basic engagement analytics dashboard
- Create industry-specific content templates

### Phase 2 (30-60 days)
- LinkedIn and Twitter API integration
- Advanced analytics with ROI tracking
- Customer service integration for comment management
- A/B testing for content optimization

### Phase 3 (60-90 days)
- AI-powered content personalization
- Competitor analysis and benchmarking
- Social listening and reputation monitoring
- Video content creation and management tools

## Technical Considerations

### API Management
- Rate limiting and quota management for platform APIs
- Token refresh automation for continuous access
- Error handling and retry logic for failed posts
- Webhook integration for real-time engagement data

### Content Storage and Management
- Efficient media file storage and CDN integration
- Content versioning for multi-platform adaptation
- Duplicate content detection and prevention
- Archive management for historical content

### Security and Compliance
- Secure storage of social media access tokens
- Compliance with platform terms of service
- User privacy protection in shared content
- Data retention policies for social media data

### Performance Optimization
- Lazy loading of social media feeds and analytics
- Efficient image compression and optimization
- Background processing for scheduled posts
- Caching strategies for frequently accessed content

## Industry-Specific Features

### HVAC Businesses
- Seasonal content automation (heating/cooling tips)
- Energy efficiency calculators and tips
- Emergency service promotion during extreme weather
- Indoor air quality education and solutions

### Plumbing Services
- Preventive maintenance reminders
- Emergency leak and burst pipe content
- Water conservation tips and rebates
- Seasonal plumbing preparation guides

### Electrical Contractors
- Electrical safety education and warnings
- Smart home technology promotion
- Energy audit and upgrade services
- Code compliance and inspection content

### Landscaping Companies
- Seasonal project showcases and ideas
- Plant care and gardening tips
- Irrigation and water management
- Hardscaping and outdoor living content