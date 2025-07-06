# KasamaAI - Where Field Service Meets Smart Marketing

![KasamaAI Logo](icons/icon.png)

KasamaAI is a comprehensive AI-powered marketing automation platform designed specifically for field service professionals. Transform your service business with intelligent content creation, automated social media management, lead tracking, and reputation building - all while you focus on delivering exceptional service to your customers.

## 🚀 Features

### 🤖 AI-Powered Content Generation
- **Blog Posts**: Generate SEO-optimized blog content for your industry
- **Social Media**: Create platform-specific posts for Facebook, Instagram, LinkedIn, and TikTok
- **Email Campaigns**: Craft compelling email marketing content
- **Review Responses**: AI-generated professional responses to customer reviews

### 📱 Multi-Platform Social Media Management
- **Unified Scheduler**: Plan and schedule content across all major platforms
- **Platform Optimization**: Content automatically adapted for each platform's requirements
- **Character Limits**: Smart truncation and optimization for platform-specific limits
- **Hashtag Generation**: Industry-relevant hashtags for maximum reach

### 📊 Analytics & Insights
- **Performance Tracking**: Monitor engagement, reach, and conversion metrics
- **Google Analytics Integration**: Connect your GA4 property for comprehensive insights
- **Lead Attribution**: Track which marketing efforts generate the most leads
- **ROI Analysis**: Understand the return on your marketing investments

### 🎯 Lead Management
- **Lead Tracking**: Capture and organize customer inquiries
- **Automated Follow-ups**: Smart reminders and follow-up sequences
- **Lead Scoring**: Prioritize high-value prospects
- **Conversion Tracking**: Monitor lead-to-customer conversion rates

### 🔍 SEO Optimization
- **Website Analysis**: Comprehensive SEO audits and recommendations
- **Keyword Tracking**: Monitor your rankings for important search terms
- **Local SEO**: Optimize for local search results in your service area
- **Content Optimization**: SEO-friendly content suggestions

### ⭐ Reputation Management
- **Review Monitoring**: Track reviews across Google, Yelp, and Facebook
- **Response Generation**: AI-powered review responses
- **Reputation Analytics**: Monitor your online reputation score
- **Review Request Automation**: Systematic review collection campaigns

## 🛠 Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** with custom HVAC industry theming
- **shadcn/ui** component library for modern, accessible UI
- **TanStack Query** for efficient server state management
- **Wouter** for lightweight client-side routing

### Backend
- **Express.js** with TypeScript
- **PostgreSQL** database with Neon serverless hosting
- **Drizzle ORM** for type-safe database operations
- **OpenAI GPT-4** for AI content generation
- **Passport.js** for authentication

### Development Tools
- **TypeScript** for full-stack type safety
- **ESBuild** for fast bundling
- **Drizzle Kit** for database migrations
- **TSX** for TypeScript execution

## 🏗 Architecture

```
┌─────────────────────┐    ┌─────────────────────┐    ┌─────────────────────┐
│     React Client    │    │   Express Server    │    │   PostgreSQL DB     │
│                     │    │                     │    │                     │
│ • TypeScript        │◄──►│ • RESTful API       │◄──►│ • Drizzle ORM       │
│ • TanStack Query    │    │ • OpenAI Integration│    │ • User Management   │
│ • Tailwind CSS     │    │ • Authentication    │    │ • Content Storage   │
│ • shadcn/ui         │    │ • File Processing   │    │ • Analytics Data    │
└─────────────────────┘    └─────────────────────┘    └─────────────────────┘
```

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (Neon recommended)
- OpenAI API key

### Environment Variables
Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL=your_postgresql_connection_string

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Analytics (Optional)
VITE_GA_MEASUREMENT_ID=your_google_analytics_id

# Session Secret
SESSION_SECRET=your_session_secret_key
```

### Quick Start
1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/kasama-ai.git
   cd kasama-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   ```bash
   npm run db:push
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Visit the application**
   Open [http://localhost:5000](http://localhost:5000) in your browser

## 🚦 Usage

### Getting Started
1. **Access the Platform**: Visit the landing page and create an account or use demo credentials (admin/demo123)
2. **Dashboard Overview**: Familiarize yourself with the main dashboard showing key metrics and recent activity
3. **Connect Integrations**: Set up Google Analytics, social media accounts, and other integrations in Settings

### Content Creation Workflow
1. **Navigate to Social**: Go to the Social Media section
2. **Generate Content**: Use the AI content generator to create posts
3. **Platform Optimization**: Review and customize content for each platform
4. **Schedule Posts**: Set your posting schedule across all platforms
5. **Monitor Performance**: Track engagement and adjust strategy

### Lead Management
1. **Lead Capture**: Leads automatically appear in the Leads section
2. **Follow-up Tasks**: Review suggested follow-up actions
3. **Conversion Tracking**: Monitor lead progression through your sales funnel

## 📱 Platform Support

### Social Media Platforms
- **Facebook**: Posts, images, hashtags, scheduling
- **Instagram**: Posts, stories, hashtags, optimal timing
- **LinkedIn**: Professional content, company updates
- **TikTok**: Short-form video concepts and scripts

### Content Types
- **Blog Posts**: SEO-optimized articles for your website
- **Social Posts**: Platform-specific content with optimal formatting
- **Email Campaigns**: Customer retention and lead nurturing
- **Review Responses**: Professional, brand-consistent replies

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run check` - Type check with TypeScript
- `npm run db:push` - Push database schema changes

### Project Structure
```
├── client/              # React frontend application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   ├── hooks/       # Custom React hooks
│   │   └── lib/         # Utility libraries
├── server/              # Express backend application
│   ├── routes.ts        # API route definitions
│   ├── db.ts           # Database connection
│   └── storage.ts      # Data access layer
├── shared/              # Shared TypeScript schemas
└── icons/              # Application icons and assets
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Documentation
- [API Documentation](docs/api.md)
- [Deployment Guide](docs/deployment.md)
- [Integration Setup](docs/integrations.md)

### Getting Help
- **GitHub Issues**: For bug reports and feature requests
- **Documentation**: Comprehensive guides and API reference
- **Community**: Join our Discord community for discussions

### Demo Access
Try KasamaAI with our demo account:
- **Username**: admin
- **Password**: demo123

## 🔮 Roadmap

### Upcoming Features
- [ ] Advanced analytics dashboard with custom reports
- [ ] WhatsApp Business API integration
- [ ] Automated review collection campaigns
- [ ] Custom AI training on your business data
- [ ] Mobile app for iOS and Android
- [ ] Integration marketplace for popular field service tools

### Long-term Vision
- AI-powered customer service automation
- Predictive analytics for business forecasting
- Voice-to-content generation
- Advanced personalization and targeting

---

**KasamaAI** - Empowering field service professionals with intelligent marketing automation.

Built with ❤️ for the field service community.