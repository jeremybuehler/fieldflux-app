# Deployment Context

## Purpose
Deployment is FieldFlux's comprehensive Azure-based infrastructure and deployment system designed for scalable, secure, and automated deployment of the field service marketing platform. It provides containerized application hosting, automated CI/CD pipelines, infrastructure as code, and monitoring capabilities optimized for production workloads.

## Components

### Primary Components
- **`Azure Container Apps`** - Serverless container hosting with auto-scaling
- **`GitHub Actions CI/CD`** (`/.github/workflows/`) - Automated deployment pipelines
- **`Bicep Infrastructure`** (`/infrastructure/`) - Infrastructure as code templates
- **`PostgreSQL Flexible Server`** - Managed database hosting
- **`Application Insights`** - Performance monitoring and analytics

### Supporting Components
- **Container registry** - GitHub Container Registry (GHCR) for image storage
- **Key Vault** - Secure credential and configuration management
- **Load balancer** - Traffic distribution and SSL termination
- **Backup system** - Database and configuration backup automation

## Status
- **Infrastructure**: ✅ Azure Bicep templates created and validated
- **CI/CD Pipeline**: ✅ Unified GitHub Actions workflow implemented
- **Container Deployment**: ✅ GitHub Container Registry integration working
- **Database Hosting**: ✅ PostgreSQL Flexible Server configured
- **Monitoring**: 🔄 Application Insights configured, advanced monitoring needed
- **Production Readiness**: 🔄 Development environment deployed, production pending

## Technical Details

### Infrastructure Architecture
```yaml
# Azure Resource Architecture
Resource Group: rg-fieldflux-dev
├── Container App Environment: cae-fieldflux-dev
│   ├── Container App: ca-fieldflux-app
│   └── Log Analytics Workspace: log-fieldflux-dev
├── PostgreSQL Flexible Server: psql-fieldflux-dev
│   ├── Database: fieldflux
│   └── Backup Configuration: 7-day retention
├── Key Vault: kv-fieldflux-dev
│   ├── Database Connection String
│   ├── OpenAI API Key
│   └── Session Secret
└── Application Insights: appi-fieldflux-dev
```

### Deployment Pipeline
```yaml
# .github/workflows/deploy-fieldflux.yml
name: Deploy FieldFlux
on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
      - name: Azure Login
      - name: Validate TypeScript & Bicep
      - name: Build and push container image
      - name: Deploy infrastructure
      - name: Deploy application
      - name: Run database migrations
      - name: Health check validation
      - name: Rollback on failure
```

### Container Configuration
```dockerfile
# Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM node:18-alpine AS runtime
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

EXPOSE 5000
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:5000/api/health || exit 1

CMD ["npm", "start"]
```

### Infrastructure as Code
```bicep
// infrastructure/main.bicep
param environmentName string = 'dev'
param location string = resourceGroup().location
param containerImage string

// Container App Environment
resource containerAppEnvironment 'Microsoft.App/managedEnvironments@2023-05-01' = {
  name: 'cae-fieldflux-${environmentName}'
  location: location
  properties: {
    appLogsConfiguration: {
      destination: 'log-analytics'
      logAnalyticsConfiguration: {
        customerId: logAnalytics.properties.customerId
        sharedKey: logAnalytics.listKeys().primarySharedKey
      }
    }
  }
}

// Container App
resource containerApp 'Microsoft.App/containerApps@2023-05-01' = {
  name: 'ca-fieldflux-app'
  location: location
  properties: {
    managedEnvironmentId: containerAppEnvironment.id
    configuration: {
      ingress: {
        external: true
        targetPort: 5000
        allowInsecure: false
        traffic: [{
          weight: 100
          latestRevision: true
        }]
      }
      secrets: [
        {
          name: 'database-url'
          keyVaultUrl: '${keyVault.properties.vaultUri}secrets/database-url'
          identity: managedIdentity.id
        }
      ]
    }
    template: {
      containers: [{
        name: 'fieldflux-app'
        image: containerImage
        resources: {
          cpu: json('0.5')
          memory: '1Gi'
        }
        env: [
          {
            name: 'DATABASE_URL'
            secretRef: 'database-url'
          }
          {
            name: 'NODE_ENV'
            value: 'production'
          }
        ]
      }]
      scale: {
        minReplicas: 1
        maxReplicas: 10
        rules: [{
          name: 'http-scaling'
          http: {
            metadata: {
              concurrentRequests: '50'
            }
          }
        }]
      }
    }
  }
}

// PostgreSQL Flexible Server
resource postgreSqlServer 'Microsoft.DBforPostgreSQL/flexibleServers@2023-03-01-preview' = {
  name: 'psql-fieldflux-${environmentName}'
  location: location
  sku: {
    name: 'Standard_B1ms'
    tier: 'Burstable'
  }
  properties: {
    version: '15'
    administratorLogin: 'fieldfluxadmin'
    administratorLoginPassword: keyVault.getSecret('postgres-password')
    storage: {
      storageSizeGB: 32
    }
    backup: {
      backupRetentionDays: 7
      geoRedundantBackup: 'Disabled'
    }
    highAvailability: {
      mode: 'Disabled'
    }
  }
}
```

## User Workflows

### Automated Deployment Process
1. **Code Commit & Trigger**:
   - Developer pushes code to main branch
   - GitHub Actions workflow automatically triggered
   - Multi-stage validation begins immediately
   - Notification sent to team channels
   - Deployment status tracking initiated

2. **Build & Validation Phase**:
   - TypeScript compilation and type checking
   - Bicep template validation and linting
   - Container image build with optimization
   - Security scanning of dependencies
   - Unit test execution and coverage

3. **Infrastructure Deployment**:
   - Azure resource provisioning via Bicep
   - Configuration validation and health checks
   - Database schema migrations execution
   - Secret and configuration management
   - Load balancer and SSL certificate setup

4. **Application Deployment**:
   - Container image push to GitHub Container Registry
   - Zero-downtime container app deployment
   - Health check validation and monitoring
   - Traffic routing and load balancing
   - Performance baseline verification

5. **Post-deployment Validation**:
   - End-to-end functionality testing
   - Database connectivity verification
   - External service integration testing
   - Performance metrics collection
   - Rollback execution if issues detected

### Emergency Deployment Procedures
1. **Hotfix Deployment**:
   - Critical bug fix or security patch needed
   - Fast-track approval process initiated
   - Automated deployment with enhanced monitoring
   - Immediate health check validation
   - Rollback preparation and execution ready

2. **Rollback Process**:
   - Automated detection of deployment issues
   - Previous container revision activation
   - Database migration rollback if needed
   - Traffic routing to stable version
   - Incident response team notification

### Environment Management
1. **Development Environment**:
   - Continuous deployment from main branch
   - Shared database with test data
   - Relaxed monitoring and alerting
   - Cost optimization with auto-shutdown
   - Development tool integrations

2. **Production Environment**:
   - Manual deployment approval required
   - High availability and disaster recovery
   - Comprehensive monitoring and alerting
   - Security scanning and compliance checks
   - Performance optimization and scaling

## Integration Points

### Development Workflow
- **GitHub Repository** - Source code and infrastructure templates
- **Visual Studio Code** - Development environment and Azure extensions
- **Local Development** - Docker-based local deployment testing
- **Testing Framework** - Automated testing and validation
- **Code Review** - Pull request validation and approval

### Azure Services
- **Container Apps** - Primary application hosting platform
- **PostgreSQL** - Managed database service
- **Key Vault** - Secure configuration and secret management
- **Application Insights** - Performance monitoring and analytics
- **Log Analytics** - Centralized logging and query capabilities

### External Services
- **GitHub Container Registry** - Container image storage and management
- **OpenAI API** - AI service integration and key management
- **Domain Management** - DNS and SSL certificate configuration
- **CDN Services** - Static asset delivery and optimization
- **Backup Services** - Data protection and disaster recovery

## Success Metrics

### Deployment Performance
- **Deployment Time**: <15 minutes from commit to production
- **Success Rate**: >99% successful deployments without rollback
- **Rollback Time**: <5 minutes to restore service
- **Zero Downtime**: 100% uptime during deployments
- **Validation Coverage**: 95% of critical paths tested automatically

### Infrastructure Reliability
- **Application Uptime**: 99.9% availability target
- **Database Availability**: 99.95% PostgreSQL uptime
- **Response Time**: <200ms average API response time
- **Scaling Efficiency**: Auto-scale response within 60 seconds
- **Recovery Time**: <15 minutes for disaster recovery

### Cost Optimization
- **Resource Utilization**: >70% average CPU and memory usage
- **Auto-scaling**: 50% cost reduction during low-traffic periods
- **Development Environment**: <$50/month operational cost
- **Production Environment**: Projected <$200/month at scale
- **Monitoring Overhead**: <5% of total infrastructure cost

## Azure Container Apps Configuration

### Scaling Configuration
```bicep
scale: {
  minReplicas: 1
  maxReplicas: 10
  rules: [
    {
      name: 'http-scaling'
      http: {
        metadata: {
          concurrentRequests: '50'
        }
      }
    }
    {
      name: 'cpu-scaling'
      custom: {
        type: 'cpu'
        metadata: {
          type: 'Utilization'
          value: '70'
        }
      }
    }
    {
      name: 'memory-scaling'
      custom: {
        type: 'memory'
        metadata: {
          type: 'Utilization'
          value: '80'
        }
      }
    }
  ]
}
```

### Environment Configuration
```yaml
# Production environment variables
env:
  - name: NODE_ENV
    value: production
  - name: DATABASE_URL
    secretRef: database-url
  - name: OPENAI_API_KEY
    secretRef: openai-api-key
  - name: SESSION_SECRET
    secretRef: session-secret
  - name: AZURE_KEY_VAULT_URL
    value: https://kv-fieldflux-prod.vault.azure.net/
  - name: APPLICATIONINSIGHTS_CONNECTION_STRING
    secretRef: app-insights-connection-string
```

### Health Check Configuration
```typescript
// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    // Database connectivity check
    await db.select().from(schema.users).limit(1);
    
    // External service checks
    const openaiHealth = await checkOpenAIConnection();
    const redisHealth = await checkRedisConnection();
    
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version,
      environment: process.env.NODE_ENV,
      database: 'connected',
      redis: redisHealth ? 'connected' : 'disconnected',
      openai: openaiHealth ? 'connected' : 'disconnected',
      uptime: process.uptime()
    };
    
    res.status(200).json(health);
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});
```

## Current Challenges

### Deployment Complexity
- Managing multiple Azure services and their dependencies
- Coordinating database migrations with application deployments
- Handling secrets and configuration across environments
- Balancing deployment speed with safety and validation
- Managing costs while maintaining performance and reliability

### Monitoring and Observability
- Comprehensive monitoring across all Azure services
- Log aggregation and analysis for troubleshooting
- Performance monitoring and alerting configuration
- Cost monitoring and optimization recommendations
- Security monitoring and compliance reporting

### Scalability and Performance
- Optimizing auto-scaling policies for cost and performance
- Managing database connection pooling at scale
- Implementing effective caching strategies
- Load testing and performance benchmarking
- Capacity planning and growth projections

## Future Roadmap

### Phase 1 (Next 30 days)
- Complete production environment deployment
- Implement comprehensive monitoring and alerting
- Add automated backup and disaster recovery testing
- Create deployment documentation and runbooks

### Phase 2 (30-60 days)
- Implement blue-green deployment strategy
- Add advanced security scanning and compliance checks
- Create multi-region deployment capabilities
- Implement advanced performance monitoring

### Phase 3 (60-90 days)
- Add infrastructure automation and self-healing
- Implement advanced cost optimization and governance
- Create disaster recovery automation
- Add compliance and audit reporting automation

## Security and Compliance

### Security Configuration
```bicep
// Key Vault access policies
resource keyVault 'Microsoft.KeyVault/vaults@2023-02-01' = {
  name: 'kv-fieldflux-${environmentName}'
  location: location
  properties: {
    sku: {
      family: 'A'
      name: 'standard'
    }
    tenantId: subscription().tenantId
    enableRbacAuthorization: true
    enablePurgeProtection: true
    enableSoftDelete: true
    softDeleteRetentionInDays: 7
    networkAcls: {
      defaultAction: 'Deny'
      ipRules: []
      virtualNetworkRules: []
    }
  }
}

// Managed Identity for secure access
resource managedIdentity 'Microsoft.ManagedIdentity/userAssignedIdentities@2023-01-31' = {
  name: 'mi-fieldflux-${environmentName}'
  location: location
}

// Role assignment for Key Vault access
resource keyVaultRoleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  scope: keyVault
  name: guid(keyVault.id, managedIdentity.id, 'Key Vault Secrets User')
  properties: {
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', '4633458b-17de-408a-b874-0445c86b69e6')
    principalId: managedIdentity.properties.principalId
    principalType: 'ServicePrincipal'
  }
}
```

### Database Security
```bicep
// PostgreSQL security configuration
resource postgreSqlServer 'Microsoft.DBforPostgreSQL/flexibleServers@2023-03-01-preview' = {
  properties: {
    authConfig: {
      activeDirectoryAuth: 'Enabled'
      passwordAuth: 'Enabled'
    }
    network: {
      publicNetworkAccess: 'Disabled'
      delegatedSubnetResourceId: subnet.id
      privateDnsZoneArmResourceId: privateDnsZone.id
    }
    dataEncryption: {
      type: 'AzureKeyVault'
      primaryKeyURI: keyVault.getSecret('postgres-encryption-key')
      primaryUserAssignedIdentityId: managedIdentity.id
    }
  }
}

// Firewall rules for container apps
resource postgreSqlFirewallRule 'Microsoft.DBforPostgreSQL/flexibleServers/firewallRules@2023-03-01-preview' = {
  parent: postgreSqlServer
  name: 'AllowContainerApps'
  properties: {
    startIpAddress: '0.0.0.0'
    endIpAddress: '0.0.0.0' // Allow Azure services
  }
}
```

### Monitoring and Alerting
```bicep
// Application Insights configuration
resource applicationInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: 'appi-fieldflux-${environmentName}'
  location: location
  kind: 'web'
  properties: {
    Application_Type: 'web'
    WorkspaceResourceId: logAnalytics.id
    IngestionMode: 'LogAnalytics'
    publicNetworkAccessForIngestion: 'Enabled'
    publicNetworkAccessForQuery: 'Enabled'
  }
}

// Alert rules for critical metrics
resource healthCheckAlert 'Microsoft.Insights/metricAlerts@2018-03-01' = {
  name: 'FieldFlux Health Check Alert'
  location: 'global'
  properties: {
    description: 'Alert when health check fails'
    severity: 1
    enabled: true
    scopes: [containerApp.id]
    evaluationFrequency: 'PT1M'
    windowSize: 'PT5M'
    criteria: {
      'odata.type': 'Microsoft.Azure.Monitor.SingleResourceMultipleMetricCriteria'
      allOf: [{
        name: 'HealthCheck'
        metricName: 'Requests'
        operator: 'LessThan'
        threshold: 1
        timeAggregation: 'Count'
      }]
    }
    actions: [{
      actionGroupId: alertActionGroup.id
    }]
  }
}
```

## Cost Optimization

### Resource Sizing Strategy
```yaml
# Development Environment (Cost Optimized)
Container App:
  CPU: 0.25 cores
  Memory: 0.5 Gi
  Min Replicas: 0
  Max Replicas: 2

Database:
  Tier: Burstable
  SKU: Standard_B1ms
  Storage: 32 GB
  Backup Retention: 7 days

# Production Environment (Performance Optimized)
Container App:
  CPU: 0.5 cores
  Memory: 1 Gi
  Min Replicas: 1
  Max Replicas: 10

Database:
  Tier: General Purpose
  SKU: Standard_D2s_v3
  Storage: 128 GB
  Backup Retention: 30 days
```

### Auto-shutdown Development Resources
```bicep
// Development environment auto-shutdown
resource automationAccount 'Microsoft.Automation/automationAccounts@2023-11-01' = if (environmentName == 'dev') {
  name: 'aa-fieldflux-dev'
  location: location
  properties: {
    sku: {
      name: 'Basic'
    }
  }
  
  // Runbook to shutdown development resources after hours
  resource shutdownRunbook 'runbooks' = {
    name: 'Shutdown-DevResources'
    properties: {
      runbookType: 'PowerShell'
      logProgress: false
      logVerbose: false
      description: 'Shutdown development resources to save costs'
      publishContentLink: {
        uri: 'https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.automation/101-automation/scripts/AzureAutomationTutorial.ps1'
      }
    }
  }
  
  // Schedule for weekday shutdown
  resource shutdownSchedule 'schedules' = {
    name: 'WeekdayShutdown'
    properties: {
      description: 'Shutdown dev resources at 6 PM weekdays'
      startTime: '2024-01-01T18:00:00-08:00'
      frequency: 'Week'
      interval: 1
      weekDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    }
  }
}
```

## Backup and Disaster Recovery

### Database Backup Strategy
```bicep
// Automated backup configuration
resource postgreSqlServer 'Microsoft.DBforPostgreSQL/flexibleServers@2023-03-01-preview' = {
  properties: {
    backup: {
      backupRetentionDays: environmentName == 'prod' ? 30 : 7
      geoRedundantBackup: environmentName == 'prod' ? 'Enabled' : 'Disabled'
    }
    highAvailability: environmentName == 'prod' ? {
      mode: 'ZoneRedundant'
    } : {
      mode: 'Disabled'
    }
  }
}

// Point-in-time restore capability
resource backupPolicy 'Microsoft.RecoveryServices/vaults/backupPolicies@2023-02-01' = if (environmentName == 'prod') {
  name: 'FieldFlux-Database-Policy'
  properties: {
    backupManagementType: 'AzureWorkload'
    workLoadType: 'PostgreSQL'
    settings: {
      timeZone: 'UTC'
      issqlcompression: true
      isCompression: true
    }
    schedulePolicy: {
      schedulePolicyType: 'SimpleSchedulePolicy'
      scheduleRunFrequency: 'Daily'
      scheduleRunTimes: ['2024-01-01T02:00:00Z']
      scheduleWeeklyFrequency: 0
    }
    retentionPolicy: {
      retentionPolicyType: 'LongTermRetentionPolicy'
      dailySchedule: {
        retentionTimes: ['2024-01-01T02:00:00Z']
        retentionDuration: {
          count: 30
          durationType: 'Days'
        }
      }
    }
  }
}
```