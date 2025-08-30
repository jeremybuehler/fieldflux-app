# FieldPulse Infrastructure

This directory contains the Infrastructure as Code (IaC) templates for deploying FieldPulse to Azure using Bicep templates, based on DOCC (DevOps Operations Command Center) patterns.

## 🏗️ Architecture Overview

The infrastructure implements a modern, secure, and scalable architecture:

- **Container Apps**: Serverless container hosting with auto-scaling
- **PostgreSQL Flexible Server**: Managed database with automated backups
- **Key Vault**: Secure secrets management
- **Application Insights**: Comprehensive monitoring and alerting
- **Managed Identity**: Secure service-to-service authentication

## 📁 Directory Structure

```
infrastructure/
├── main.bicep                 # Main deployment template
├── modules/                   # Reusable Bicep modules
│   ├── container-apps.bicep   # Container Apps configuration
│   ├── postgresql.bicep       # PostgreSQL database
│   ├── key-vault.bicep        # Key Vault setup
│   └── app-insights.bicep     # Application Insights
├── parameters/                # Environment-specific parameters
│   └── dev.parameters.json    # Development environment
└── README.md                  # This file
```

## 🚀 Deployment

### Prerequisites

1. **Azure CLI** installed and configured
2. **Azure subscription** with appropriate permissions
3. **OpenAI API Key** for AI features
4. **GitHub Actions secrets** configured (for automated deployment)

### Manual Deployment

```bash
# Login to Azure
az login

# Set subscription
az account set --subscription "your-subscription-id"

# Deploy to development environment
az deployment sub create \
  --location eastus \
  --template-file infrastructure/main.bicep \
  --parameters infrastructure/parameters/dev.parameters.json \
  --parameters openaiApiKey="your-openai-api-key"
```

### Automated Deployment via GitHub Actions

The infrastructure is designed to be deployed via GitHub Actions workflows:

1. **Infrastructure Deployment Workflow** (`.github/workflows/deploy-infrastructure.yml`)
   - Validates Bicep templates
   - Deploys to development environment
   - Performs health checks

2. **Application Deployment Workflow** (`.github/workflows/deploy-application.yml`)
   - Builds and pushes container image
   - Deploys to Container Apps
   - Runs integration tests

## 🔧 Configuration

### Environment-Specific Settings

The infrastructure supports different environments with specific configurations:

| Environment | CPU  | Memory | Min Replicas | Max Replicas | DB SKU         | Storage |
|-------------|------|--------|--------------|--------------|----------------|---------|
| Development | 0.5  | 1Gi    | 0            | 2            | Standard_B1ms  | 32GB    |
| Integration | 0.5  | 1Gi    | 1            | 3            | Standard_B2s   | 64GB    |
| Production  | 1.0  | 2Gi    | 2            | 10           | Standard_B4ms  | 128GB   |

### Required Secrets

The following secrets must be configured in Key Vault or GitHub Actions:

- `openai-api-key`: OpenAI API key for AI features
- `database-connection-string`: PostgreSQL connection string (auto-generated)
- `app-insights-connection-string`: Application Insights connection string (auto-generated)

## 📊 Monitoring

### Application Insights

The infrastructure includes comprehensive monitoring:

- **Application Performance Monitoring (APM)**
- **Custom dashboards** for operational visibility
- **Automated alerts** for critical issues
- **Availability tests** for uptime monitoring

### Health Checks

The Container Apps are configured with health probes:

- **Liveness Probe**: `GET /api/health` (every 30s)
- **Readiness Probe**: `GET /api/health` (every 10s)
- **Startup Probe**: `GET /api/health` (60s timeout)

### Alerting

Automated alerts are configured for:

- Application availability < 95%
- Error rate > 5%
- Response time > 5 seconds
- Database connectivity issues

## 🔐 Security

### Key Vault Integration

All secrets are stored in Azure Key Vault:

- Database credentials
- API keys
- Connection strings
- Application configuration

### Managed Identity

Container Apps use User Assigned Managed Identity for:

- Secure Key Vault access
- Database authentication
- Azure service integration

### Network Security

- PostgreSQL firewall rules restrict access
- SSL/TLS enforcement for all connections
- Container Apps isolated in managed environment

## 💰 Cost Optimization

### Development Environment

Estimated monthly cost: **~$45**

- Container Apps: ~$15/month
- PostgreSQL: ~$30/month
- Key Vault: ~$1/month
- Application Insights: Minimal usage

### Auto-Scaling

- **Scale to zero** in development during idle periods
- **CPU and HTTP-based scaling** for cost efficiency
- **Burstable database tiers** for optimal cost/performance

## 🛠️ Troubleshooting

### Common Issues

1. **Deployment Failures**
   ```bash
   # Check deployment status
   az deployment sub show --name <deployment-name>
   
   # View deployment logs
   az deployment sub show --name <deployment-name> --query "properties.error"
   ```

2. **Container App Health Issues**
   ```bash
   # Check container app status
   az containerapp show --name <app-name> --resource-group <rg-name>
   
   # View container logs
   az containerapp logs show --name <app-name> --resource-group <rg-name>
   ```

3. **Database Connection Issues**
   ```bash
   # Test database connectivity
   psql "postgresql://user:password@server:5432/database?sslmode=require"
   ```

### Support

For issues and support:

1. Check the GitHub Issues in the repository
2. Review Application Insights logs and metrics
3. Consult the DOCC repository for patterns and best practices

## 📚 References

- [Azure Container Apps Documentation](https://docs.microsoft.com/en-us/azure/container-apps/)
- [Azure PostgreSQL Flexible Server](https://docs.microsoft.com/en-us/azure/postgresql/flexible-server/)
- [Azure Bicep Documentation](https://docs.microsoft.com/en-us/azure/azure-resource-manager/bicep/)
- [DOCC Repository](https://github.com/jeremybuehler/docc) - Reference implementation patterns