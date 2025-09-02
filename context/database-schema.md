# Database Schema Context

## Purpose
The Database Schema is FieldFlux's comprehensive PostgreSQL database design using Drizzle ORM, providing type-safe data operations for field service marketing automation. It supports multi-tenant architecture, user management, lead tracking, social media management, content creation, and business analytics with optimized performance and data integrity.

## Components

### Primary Components
- **`Schema Definition`** (`/shared/schema.ts`) - Complete Drizzle ORM schema
- **User Management** - Authentication, profiles, and subscription tracking
- **Business Data** - Leads, customers, reviews, and service information
- **Marketing Platform** - Social media, content, and campaign management
- **Multi-tenant Support** - Client isolation and white-label capabilities

### Supporting Components
- **Database migrations** - Schema evolution and updates
- **Indexes and constraints** - Performance optimization and data integrity
- **Triggers and functions** - Automated data processing
- **Backup and recovery** - Data protection and disaster recovery

## Status
- **Implementation**: ✅ Core schema implemented with Drizzle ORM
- **Multi-tenant Architecture**: ✅ Tenant isolation and client support
- **Performance Optimization**: 🔄 Indexes implemented, query optimization ongoing
- **Data Integrity**: ✅ Foreign keys and constraints properly configured
- **Migration System**: ⚠️ Basic migrations available, automated system needed

## Technical Details

### Core Database Tables

#### User Authentication & Management
```sql
-- Replit Auth session storage
sessions (
  sid VARCHAR PRIMARY KEY,           -- Session identifier
  sess JSONB NOT NULL,              -- Session data
  expire TIMESTAMP NOT NULL         -- Expiration time
);
CREATE INDEX IDX_session_expire ON sessions(expire);

-- User accounts and profiles
users (
  id VARCHAR PRIMARY KEY,           -- Replit user ID
  email VARCHAR UNIQUE,             -- User email address
  first_name VARCHAR,               -- First name
  last_name VARCHAR,                -- Last name
  profile_image_url VARCHAR,        -- Avatar image
  stripe_customer_id VARCHAR UNIQUE, -- Stripe customer reference
  stripe_subscription_id VARCHAR,   -- Active subscription
  subscription_status TEXT DEFAULT 'free', -- free, active, past_due, canceled
  subscription_plan TEXT DEFAULT 'free',   -- free, pro, enterprise
  subscription_current_period_end TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Multi-tenant Architecture
```sql
-- Tenant/client organizations
tenants (
  id SERIAL PRIMARY KEY,
  slug TEXT NOT NULL,               -- URL-friendly identifier
  name TEXT NOT NULL,               -- Organization name
  primary_domain TEXT,              -- Custom domain
  plan TEXT DEFAULT 'free',         -- Subscription plan
  stripe_customer_id TEXT,          -- Billing information
  created_at TIMESTAMP DEFAULT NOW()
);

-- Client configurations per business
client_configurations (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR REFERENCES users(id),
  business_name TEXT,               -- Company name
  business_type TEXT,               -- hvac, plumbing, electrical, landscaping
  business_address TEXT,            -- Primary location
  business_phone VARCHAR,           -- Contact number
  business_email VARCHAR,           -- Business email
  service_areas JSONB,              -- Geographic coverage
  business_hours JSONB,             -- Operating schedule
  logo_url TEXT,                    -- Company logo
  brand_colors JSONB,               -- Branding colors
  emergency_phone VARCHAR,          -- After-hours contact
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Lead Management System
```sql
-- Customer leads and prospects
leads (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR REFERENCES users(id),
  name VARCHAR,                     -- Lead contact name
  email VARCHAR,                    -- Email address
  phone VARCHAR,                    -- Phone number
  service_type TEXT,                -- Requested service type
  urgency TEXT,                     -- emergency, urgent, routine, planned
  score INTEGER,                    -- Lead quality score (1-100)
  status TEXT,                      -- new, contacted, qualified, proposal, won, lost
  source TEXT,                      -- Lead origin (website, referral, social)
  notes TEXT,                       -- Lead details and requirements
  address TEXT,                     -- Service location
  estimated_value DECIMAL(10,2),    -- Potential project value
  follow_up_date TIMESTAMP,         -- Next contact date
  converted_at TIMESTAMP,           -- Conversion timestamp
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  tenant_id INTEGER REFERENCES tenants(id)
);

-- Lead activity and interaction tracking
lead_activities (
  id SERIAL PRIMARY KEY,
  lead_id INTEGER REFERENCES leads(id),
  activity_type TEXT,               -- call, email, meeting, note
  description TEXT,                 -- Activity details
  completed_by VARCHAR REFERENCES users(id),
  completed_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### Social Media Management
```sql
-- Social media posts and scheduling
social_posts (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR REFERENCES users(id),
  platform TEXT,                   -- facebook, instagram, linkedin, twitter
  content TEXT,                     -- Post text content
  media_urls JSONB,                 -- Image/video URLs
  scheduled_at TIMESTAMP,           -- Publishing schedule
  published_at TIMESTAMP,           -- Actual publication
  status TEXT,                      -- draft, scheduled, published, failed
  post_id VARCHAR,                  -- Platform-specific ID
  engagement_metrics JSONB,         -- Likes, shares, comments
  hashtags JSONB,                   -- Post hashtags
  mentions JSONB,                   -- User mentions
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Social media platform configurations
social_media_configs (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR REFERENCES users(id),
  platform TEXT,                   -- Social platform name
  access_token TEXT,                -- Encrypted API token
  refresh_token TEXT,               -- Token refresh credentials
  page_id VARCHAR,                  -- Platform page/account ID
  page_name TEXT,                   -- Display name
  is_active BOOLEAN DEFAULT TRUE,   -- Configuration status
  expires_at TIMESTAMP,             -- Token expiration
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Review Management
```sql
-- Customer reviews from all platforms
reviews (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR REFERENCES users(id),
  platform TEXT,                   -- google, yelp, facebook, angies_list
  platform_review_id VARCHAR,      -- Platform-specific ID
  customer_name VARCHAR,            -- Reviewer name
  customer_email VARCHAR,           -- Email if available
  rating INTEGER,                   -- Star rating (1-5)
  review_text TEXT,                 -- Review content
  response_text TEXT,               -- Business response
  response_status TEXT,             -- pending, sent, none_needed
  sentiment_score DECIMAL(3,2),     -- AI sentiment (-1 to 1)
  review_date TIMESTAMP,            -- Original review date
  responded_at TIMESTAMP,           -- Response timestamp
  is_featured BOOLEAN DEFAULT FALSE, -- Showcase on website
  tags JSONB,                       -- Categorization tags
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Content Management
```sql
-- Blog posts and content
wordpress_posts (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR REFERENCES users(id),
  title TEXT,                       -- Post title
  content TEXT,                     -- Full content
  excerpt TEXT,                     -- Summary/meta description
  status TEXT,                      -- draft, published, scheduled
  seo_title TEXT,                   -- SEO optimized title
  seo_description TEXT,             -- Meta description
  keywords JSONB,                   -- Target keywords
  category TEXT,                    -- Content category
  tags JSONB,                       -- Content tags
  featured_image TEXT,              -- Hero image URL
  published_at TIMESTAMP,           -- Publication date
  wordpress_id INTEGER,             -- WordPress post ID
  slug TEXT,                        -- URL slug
  view_count INTEGER DEFAULT 0,     -- Page views
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Reusable content templates
content_templates (
  id SERIAL PRIMARY KEY,
  name TEXT,                        -- Template name
  type TEXT,                        -- blog, social, email, website
  industry TEXT,                    -- hvac, plumbing, electrical
  template_content TEXT,            -- Template with placeholders
  variables JSONB,                  -- Variable definitions
  usage_count INTEGER DEFAULT 0,    -- Usage tracking
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Communication & Marketing
```sql
-- Email campaigns and newsletters
email_campaigns (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR REFERENCES users(id),
  name TEXT,                        -- Campaign name
  subject TEXT,                     -- Email subject
  content TEXT,                     -- HTML content
  template_id INTEGER REFERENCES content_templates(id),
  recipient_count INTEGER,          -- Target recipients
  sent_count INTEGER,               -- Successfully sent
  open_rate DECIMAL(5,2),          -- Open percentage
  click_rate DECIMAL(5,2),         -- Click-through rate
  status TEXT,                      -- draft, scheduled, sent, paused
  scheduled_at TIMESTAMP,           -- Send time
  sent_at TIMESTAMP,                -- Actual send time
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Individual customer communications
customer_communications (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR REFERENCES users(id),
  customer_email VARCHAR,           -- Recipient
  customer_phone VARCHAR,           -- Phone number
  message_type TEXT,                -- email, sms, call_reminder
  template_type TEXT,               -- appointment, follow_up, promotion
  subject TEXT,                     -- Message subject
  content TEXT,                     -- Message content
  status TEXT,                      -- pending, sent, delivered, failed
  sent_at TIMESTAMP,                -- Delivery time
  opened_at TIMESTAMP,              -- Open tracking
  clicked_at TIMESTAMP,             -- Click tracking
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Analytics & Reporting
```sql
-- Performance analytics reports
analytics_reports (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR REFERENCES users(id),
  report_type TEXT,                 -- monthly, weekly, campaign
  date_range_start DATE,            -- Reporting period start
  date_range_end DATE,              -- Reporting period end
  metrics JSONB,                    -- Performance data
  generated_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Website and campaign tracking
tracking_events (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR REFERENCES users(id),
  event_type TEXT,                  -- page_view, lead_capture, conversion
  source TEXT,                      -- organic, social, email, direct
  campaign TEXT,                    -- Campaign identifier
  page_url TEXT,                    -- Page URL
  user_agent TEXT,                  -- Browser information
  ip_address INET,                  -- Visitor IP
  session_id VARCHAR,               -- Session identifier
  properties JSONB,                 -- Additional event data
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Database Indexes and Optimization

#### Performance Indexes
```sql
-- Lead management indexes
CREATE INDEX idx_leads_user_status ON leads(user_id, status);
CREATE INDEX idx_leads_created_desc ON leads(user_id, created_at DESC);
CREATE INDEX idx_leads_follow_up ON leads(user_id, follow_up_date) WHERE follow_up_date IS NOT NULL;

-- Social media indexes  
CREATE INDEX idx_social_posts_user_scheduled ON social_posts(user_id, scheduled_at);
CREATE INDEX idx_social_posts_platform_status ON social_posts(platform, status);

-- Review management indexes
CREATE INDEX idx_reviews_user_platform ON reviews(user_id, platform);
CREATE INDEX idx_reviews_rating_date ON reviews(user_id, rating, review_date DESC);
CREATE INDEX idx_reviews_response_status ON reviews(user_id, response_status) WHERE response_status = 'pending';

-- Content and analytics indexes
CREATE INDEX idx_wordpress_posts_user_status ON wordpress_posts(user_id, status);
CREATE INDEX idx_analytics_user_date ON analytics_reports(user_id, date_range_start, date_range_end);
CREATE INDEX idx_tracking_events_user_type ON tracking_events(user_id, event_type, created_at);
```

#### Full-text Search Indexes
```sql
-- Content search optimization
CREATE INDEX idx_wordpress_posts_search ON wordpress_posts USING gin(to_tsvector('english', title || ' ' || content));
CREATE INDEX idx_leads_search ON leads USING gin(to_tsvector('english', name || ' ' || notes));
CREATE INDEX idx_reviews_search ON reviews USING gin(to_tsvector('english', review_text || ' ' || response_text));
```

## Integration Points

### Application Layer
- **Drizzle ORM** - Type-safe database operations and query building
- **Connection Pooling** - Efficient database connection management
- **Migration System** - Schema versioning and automated updates
- **Backup System** - Automated backups and point-in-time recovery

### External Services
- **Stripe Integration** - Subscription and billing data synchronization
- **OAuth Providers** - Social media platform authentication
- **Analytics Services** - Google Analytics and performance tracking
- **Communication Services** - Email and SMS delivery tracking

### Monitoring & Maintenance
- **Query Performance** - Slow query identification and optimization
- **Database Health** - Connection monitoring and resource usage
- **Data Integrity** - Constraint validation and referential integrity
- **Growth Planning** - Capacity monitoring and scaling preparation

## Success Metrics

### Performance Benchmarks
- **Query Response Time**: <50ms average for standard operations
- **Index Usage**: 95%+ of queries use appropriate indexes
- **Connection Efficiency**: <20% of pool connections used during normal load
- **Storage Growth**: Predictable growth patterns with archiving strategy
- **Backup Recovery**: <15 minutes RTO, <1 hour RPO

### Data Quality Metrics
- **Data Integrity**: 100% referential integrity maintained
- **Constraint Violations**: <0.1% of operations fail validation
- **Duplicate Detection**: Automated prevention of duplicate records
- **Data Consistency**: Multi-table transactions maintain ACID properties
- **Audit Trail**: Complete tracking of data modifications

### Scalability Indicators
- **Concurrent Connections**: Support 200+ simultaneous connections
- **Transaction Throughput**: 1000+ transactions per second capability
- **Storage Utilization**: <70% of allocated storage used
- **Query Complexity**: Complex joins execute under performance targets
- **Multi-tenant Isolation**: Perfect tenant data separation

## Field Service Data Model

### Industry-Specific Optimizations

#### HVAC Business Data
- **Service Types**: Installation, repair, maintenance, emergency, inspection
- **Equipment Tracking**: Unit types, models, warranty information
- **Seasonal Patterns**: Heating/cooling demand forecasting
- **Emergency Response**: Priority routing and availability tracking
- **Maintenance Schedules**: Recurring service and filter replacement

#### Plumbing Service Data
- **Service Categories**: Repair, installation, drain cleaning, water heaters, leak detection
- **Emergency Classification**: Water damage priority and response time
- **Equipment Database**: Fixture types, pipe materials, water heater specifications
- **Water Quality**: Testing results and filtration system tracking
- **Preventive Maintenance**: Inspection schedules and maintenance history

#### Electrical Contractor Data
- **Service Areas**: Residential, commercial, industrial electrical work
- **Safety Compliance**: Code requirements and inspection tracking
- **Equipment Categories**: Panels, wiring, smart home, generators, solar
- **Licensing**: Electrician certifications and permit tracking
- **Project Management**: Multi-phase electrical projects and scheduling

#### Landscaping Business Data
- **Service Offerings**: Design, installation, maintenance, irrigation, hardscaping
- **Seasonal Planning**: Spring, summer, fall, winter service schedules
- **Plant Database**: Species information, care requirements, warranty periods
- **Equipment Tracking**: Mowers, irrigation systems, hardscaping materials
- **Client Properties**: Site plans, irrigation zones, maintenance schedules

### Customer Relationship Data
```sql
-- Enhanced customer profiles
customers (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR REFERENCES users(id),
  name VARCHAR NOT NULL,
  email VARCHAR,
  phone VARCHAR,
  address TEXT,
  property_type TEXT,               -- residential, commercial, industrial
  service_history JSONB,            -- Past services and preferences
  equipment_inventory JSONB,        -- Installed equipment and systems
  maintenance_schedule JSONB,       -- Recurring service schedules
  emergency_contact JSONB,          -- Alternative contact information
  billing_preferences JSONB,        -- Payment methods and preferences
  communication_preferences JSONB,   -- Email, SMS, call preferences
  lifetime_value DECIMAL(10,2),     -- Total customer value
  acquisition_cost DECIMAL(10,2),   -- Customer acquisition cost
  satisfaction_score DECIMAL(3,2),  -- Average satisfaction rating
  referral_count INTEGER DEFAULT 0, -- Number of referrals provided
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Current Challenges

### Performance Optimization
- Query optimization for complex multi-table joins
- Index strategy refinement for large datasets
- Connection pool tuning for varying load patterns
- Partitioning strategy for time-series data
- Archive and retention policy implementation

### Data Management
- Multi-tenant data isolation verification
- Backup and disaster recovery testing
- Data migration procedures for schema updates
- Data quality monitoring and cleanup processes
- Storage growth management and optimization

### Scalability Planning
- Database sharding strategy for horizontal scaling
- Read replica configuration for reporting workloads
- Caching layer integration for frequently accessed data
- Archive strategy for historical data management
- Monitoring and alerting for capacity planning

## Future Roadmap

### Phase 1 (Next 30 days)
- Complete index optimization for all major query patterns
- Implement automated backup verification system
- Add database health monitoring and alerting
- Create data archiving and retention policies

### Phase 2 (30-60 days)
- Implement read replicas for analytics workloads
- Add advanced data validation and quality checks
- Create automated schema migration system
- Implement data encryption at rest for sensitive fields

### Phase 3 (60-90 days)
- Design and implement database sharding strategy
- Add real-time data synchronization capabilities
- Implement advanced analytics and reporting tables
- Create disaster recovery automation and testing

## Security & Compliance

### Data Protection
```sql
-- Sensitive data encryption
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Encrypt sensitive fields
UPDATE social_media_configs 
SET access_token = pgp_sym_encrypt(access_token, 'encryption-key')
WHERE access_token IS NOT NULL;

-- Row-level security for multi-tenant isolation
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON leads FOR ALL TO application_user 
USING (user_id = current_setting('app.user_id'));
```

### Audit and Compliance
```sql
-- Audit trail table
audit_log (
  id SERIAL PRIMARY KEY,
  table_name TEXT,                  -- Affected table
  record_id TEXT,                   -- Affected record ID
  operation TEXT,                   -- INSERT, UPDATE, DELETE
  old_values JSONB,                 -- Previous values
  new_values JSONB,                 -- New values
  user_id VARCHAR,                  -- User who made change
  changed_at TIMESTAMP DEFAULT NOW(),
  ip_address INET                   -- Source IP address
);

-- Automatic audit trigger
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    INSERT INTO audit_log(table_name, record_id, operation, old_values, user_id)
    VALUES (TG_TABLE_NAME, OLD.id, TG_OP, row_to_json(OLD), current_setting('app.user_id', true));
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO audit_log(table_name, record_id, operation, old_values, new_values, user_id)
    VALUES (TG_TABLE_NAME, NEW.id, TG_OP, row_to_json(OLD), row_to_json(NEW), current_setting('app.user_id', true));
    RETURN NEW;
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO audit_log(table_name, record_id, operation, new_values, user_id)
    VALUES (TG_TABLE_NAME, NEW.id, TG_OP, row_to_json(NEW), current_setting('app.user_id', true));
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;
```

### Data Retention Policies
```sql
-- Automated data archival
CREATE OR REPLACE FUNCTION archive_old_data()
RETURNS void AS $$
BEGIN
  -- Archive tracking events older than 2 years
  DELETE FROM tracking_events 
  WHERE created_at < NOW() - INTERVAL '2 years';
  
  -- Archive completed campaigns older than 1 year
  DELETE FROM email_campaigns 
  WHERE status = 'sent' AND sent_at < NOW() - INTERVAL '1 year';
  
  -- Archive old social posts (keep metrics)
  UPDATE social_posts 
  SET content = '[ARCHIVED]', media_urls = '[]'
  WHERE status = 'published' AND published_at < NOW() - INTERVAL '2 years';
END;
$$ LANGUAGE plpgsql;

-- Schedule monthly archival
SELECT cron.schedule('archive-old-data', '0 2 1 * *', 'SELECT archive_old_data();');
```