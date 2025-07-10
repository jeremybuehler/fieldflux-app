// FieldPulse Development Environment - Main Infrastructure Template
// Based on DOCC Container Apps patterns

targetScope = 'subscription'

// Parameters
@description('Environment name (dev, intg, prod)')
param environment string = 'dev'

@description('Location for all resources')
param location string = 'eastus'

@description('Application name')
param applicationName string = 'fieldpulse'

@description('Container image for the application')
param containerImage string = 'fieldpulse:latest'

@description('OpenAI API Key for AI features')
@secure()
param openaiApiKey string

@description('Tags to apply to all resources')
param tags object = {
  Environment: environment
  Application: applicationName
  Owner: 'platform-team'
  CostCenter: 'engineering'
  Project: 'fieldpulse-platform'
  ManagedBy: 'bicep-iac'
}

// Variables
var resourceGroupName = 'rg-${applicationName}-platform-${environment}'
var dataResourceGroupName = 'rg-${applicationName}-data-${environment}'
var uniqueSuffix = substring(uniqueString(subscription().subscriptionId, resourceGroupName), 0, 6)

// Resource Groups
resource platformResourceGroup 'Microsoft.Resources/resourceGroups@2023-07-01' = {
  name: resourceGroupName
  location: location
  tags: tags
}

resource dataResourceGroup 'Microsoft.Resources/resourceGroups@2023-07-01' = {
  name: dataResourceGroupName
  location: location
  tags: tags
}

// Key Vault Module
module keyVault 'modules/key-vault.bicep' = {
  name: 'key-vault-deployment'
  scope: platformResourceGroup
  params: {
    keyVaultName: 'kv-${applicationName}-${environment}-${uniqueSuffix}'
    location: location
    tags: tags
    openaiApiKey: openaiApiKey
  }
}

// Application Insights Module
module appInsights 'modules/app-insights.bicep' = {
  name: 'app-insights-deployment'
  scope: platformResourceGroup
  params: {
    appInsightsName: 'ai-${applicationName}-${environment}'
    location: location
    tags: tags
  }
}

// PostgreSQL Database Module
module database 'modules/postgresql.bicep' = {
  name: 'postgresql-deployment'
  scope: dataResourceGroup
  params: {
    serverName: 'psql-${applicationName}-${environment}-${uniqueSuffix}'
    location: location
    environment: environment
    tags: tags
  }
}

// Database secrets module to handle cross-scope secret creation
module databaseSecrets 'modules/database-secrets.bicep' = {
  name: 'database-secrets-deployment'
  scope: platformResourceGroup
  params: {
    keyVaultName: keyVault.outputs.keyVaultName
    connectionString: database.outputs.connectionString
    databaseHost: database.outputs.fullyQualifiedDomainName
    databaseName: database.outputs.databaseName
    administratorLogin: database.outputs.administratorLogin
    administratorPassword: database.outputs.administratorPassword
  }
}

// Container Apps Module
module containerApps 'modules/container-apps.bicep' = {
  name: 'container-apps-deployment'
  scope: platformResourceGroup
  params: {
    containerAppName: 'ca-${applicationName}-app-${environment}'
    containerEnvironmentName: 'cae-${applicationName}-${environment}'
    location: location
    environment: environment
    containerImage: containerImage
    tags: tags
    keyVaultName: keyVault.outputs.keyVaultName
    appInsightsConnectionString: appInsights.outputs.connectionString
    databaseConnectionStringSecretUri: databaseSecrets.outputs.connectionStringSecretUri
  }
}

// Outputs
output resourceGroupName string = platformResourceGroup.name
output dataResourceGroupName string = dataResourceGroup.name
output keyVaultName string = keyVault.outputs.keyVaultName
output containerAppName string = containerApps.outputs.containerAppName
output containerAppUrl string = containerApps.outputs.containerAppUrl
output databaseServerName string = database.outputs.serverName
output appInsightsName string = appInsights.outputs.appInsightsName