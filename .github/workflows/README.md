# GitHub Actions Workflows

This directory contains the GitHub Actions workflows for automated deployment and monitoring of FieldPulse, based on DOCC (DevOps Operations Command Center) patterns.

## 🔄 Workflow Overview

The workflows implement a complete CI/CD pipeline with the following components:

### 1. **Infrastructure Deployment** (`deploy-infrastructure.yml`)
- **Trigger**: Infrastructure changes, manual dispatch
- **Purpose**: Deploy Azure infrastructure using Bicep templates
- **Environments**: Development (with future expansion to Integration/Production)
- **Features**:
  - Bicep template validation
  - Cost estimation
  - Resource naming convention checks
  - Automated deployment to development
  - Health verification
  - Rollback on failure

### 2. **Application Deployment** (`deploy-application.yml`)
- **Trigger**: Application code changes, manual dispatch
- **Purpose**: Build and deploy FieldPulse application
- **Process**:
  - Node.js 18 build with dependency caching
  - TypeScript compilation and linting
  - Container image build and push to ACR
  - Deployment to Azure Container Apps
  - Integration testing
  - Rollback capabilities

### 3. **Database Migration** (`database-migration.yml`)
- **Trigger**: Schema changes, manual dispatch
- **Purpose**: Manage database schema changes safely
- **Features**:
  - Schema validation
  - Migration file generation
  - Database backup before migration
  - Automated migration execution
  - Rollback procedures
  - Integration testing

### 4. **Health Monitoring** (`health-monitoring.yml`)
- **Trigger**: Scheduled (every 15 minutes during business hours)
- **Purpose**: Continuous health monitoring and alerting
- **Checks**:
  - Application health endpoints
  - Performance testing
  - Cost analysis
  - Security configuration validation
  - Automated issue creation for failures

## 🔧 Setup Requirements

### Required GitHub Secrets

```yaml
# Azure Authentication
AZURE_SUBSCRIPTION_ID: "your-azure-subscription-id"
AZURE_TENANT_ID: "your-azure-tenant-id"
AZURE_CLIENT_ID: "your-azure-client-id"

# Application Configuration
OPENAI_API_KEY: "your-openai-api-key"
```

### Required GitHub Environments

1. **development**
   - Protection rules: None (auto-deployment)
   - Secrets: Environment-specific overrides if needed

2. **integration** (future)
   - Protection rules: Require approval
   - Reviewers: Platform team

3. **production** (future)
   - Protection rules: Require approval + wait timer
   - Reviewers: Platform team + management

## 🚀 Deployment Flow

### Typical Development Workflow

1. **Code Change** → Push to `main` branch
2. **Infrastructure Check** → Validates any infrastructure changes
3. **Application Build** → Builds and tests application
4. **Database Migration** → Applies schema changes if needed
5. **Application Deployment** → Deploys to Container Apps
6. **Health Verification** → Validates deployment success
7. **Monitoring** → Continuous health monitoring begins

### Manual Deployment

All workflows support manual dispatch with options:

```yaml
# Infrastructure Deployment
environment: [dev, intg, prod]
force_deploy: [true, false]

# Application Deployment
environment: [dev, intg, prod]
skip_tests: [true, false]

# Database Migration
environment: [dev, intg, prod]
migration_type: [push, generate, rollback]
force_migration: [true, false]

# Health Monitoring
environment: [dev, intg, prod]
check_type: [full, health-only, performance, cost-analysis]
```

## 📊 Monitoring and Alerting

### Health Monitoring Schedule

- **Business Hours (9 AM - 6 PM UTC, Mon-Fri)**: Every 15 minutes
- **Off-Hours and Weekends**: Every hour
- **Manual**: On-demand via workflow dispatch

### Automated Alerting

- **Health Check Failures**: Creates GitHub issues automatically
- **Performance Degradation**: Logs warnings and creates issues
- **Cost Overruns**: Alerts when approaching budget thresholds
- **Security Issues**: Validates configurations and reports issues

### Notification Channels

1. **GitHub Issues**: Automatically created for failures
2. **Workflow Summaries**: Detailed results in Actions tab
3. **Email Notifications**: Via GitHub notifications (if configured)

## 🛠️ Troubleshooting

### Common Issues

#### 1. **Infrastructure Deployment Failures**
```bash
# Check Azure permissions
az role assignment list --assignee $AZURE_CLIENT_ID

# Validate Bicep templates locally
az deployment sub validate --location eastus --template-file infrastructure/main.bicep
```

#### 2. **Application Deployment Issues**
```bash
# Check Container App logs
az containerapp logs show --name ca-fieldpulse-app-dev --resource-group rg-fieldpulse-platform-dev

# Verify image in ACR
az acr repository list --name your-acr-name
```

#### 3. **Database Migration Problems**
```bash
# Test database connectivity
psql $DATABASE_URL -c "SELECT version();"

# Check migration status
npm run db:generate
```

#### 4. **Health Monitoring Failures**
```bash
# Test health endpoint manually
curl -v https://your-app-url/api/health

# Check Application Insights
az monitor app-insights query --app your-app-insights --analytics-query "requests | where timestamp > ago(1h)"
```

### Workflow Debugging

1. **Enable Debug Logging**:
   - Add `ACTIONS_STEP_DEBUG: true` to workflow environment
   - Add `ACTIONS_RUNNER_DEBUG: true` for runner debugging

2. **Check Workflow Logs**:
   - Navigate to Actions tab in GitHub
   - Select failed workflow run
   - Expand individual steps for detailed logs

3. **Manual Testing**:
   - Use workflow dispatch to run individual workflows
   - Test with different parameters and environments

## 🔒 Security Considerations

### Authentication

- **Azure**: Uses OIDC (OpenID Connect) for secure authentication
- **GitHub**: Uses GitHub App tokens for API access
- **Container Registry**: Uses managed identity for secure image access

### Secrets Management

- **Azure Key Vault**: All application secrets stored securely
- **GitHub Secrets**: Only authentication credentials
- **No Hardcoded Secrets**: All sensitive data referenced from secure stores

### Access Control

- **Principle of Least Privilege**: Minimal required permissions
- **Environment Protection**: Approval gates for sensitive environments
- **Audit Logging**: All actions logged in Azure and GitHub

## 📈 Performance Optimization

### Workflow Optimization

- **Dependency Caching**: npm, Docker layer caching
- **Parallel Jobs**: Independent operations run concurrently
- **Conditional Execution**: Skip unnecessary steps based on changes
- **Artifact Reuse**: Build once, deploy multiple times

### Resource Optimization

- **Auto-scaling**: Container Apps scale based on demand
- **Cost Monitoring**: Automated cost tracking and alerts
- **Resource Cleanup**: Failed deployments cleaned up automatically

## 📚 References

### Azure Documentation
- [Azure Container Apps](https://docs.microsoft.com/en-us/azure/container-apps/)
- [Azure PostgreSQL Flexible Server](https://docs.microsoft.com/en-us/azure/postgresql/flexible-server/)
- [Azure Key Vault](https://docs.microsoft.com/en-us/azure/key-vault/)

### GitHub Actions
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Azure Actions](https://github.com/Azure/actions)
- [Workflow Syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)

### DOCC Reference
- [DOCC Repository](https://github.com/jeremybuehler/docc)
- [DOCC Patterns and Best Practices](https://github.com/jeremybuehler/docc/tree/main/.github/workflows)

## 🔄 Workflow Maintenance

### Regular Updates

1. **Dependency Updates**: Keep action versions current
2. **Security Patches**: Monitor for security advisories
3. **Performance Tuning**: Optimize based on usage patterns
4. **Cost Optimization**: Review and adjust resource allocations

### Monitoring

1. **Workflow Success Rates**: Track deployment success/failure rates
2. **Performance Metrics**: Monitor deployment times and resource usage
3. **Cost Tracking**: Regular cost analysis and optimization
4. **Security Audits**: Periodic security configuration reviews

### Expansion Planning

The workflows are designed for easy expansion:

- **Integration Environment**: Add approval gates and additional testing
- **Production Environment**: Add advanced security and monitoring
- **Multi-Region**: Extend for global deployment
- **Blue-Green Deployment**: Implement zero-downtime deployments

---

For support and questions, please refer to the GitHub Issues in this repository or consult the DOCC repository for advanced patterns and best practices.