// Container Apps Module for FieldPulse
// Based on DOCC Container Apps patterns

@description('Container App name')
param containerAppName string

@description('Container Apps Environment name')
param containerEnvironmentName string

@description('Location for resources')
param location string

@description('Environment (dev, intg, prod)')
param environment string

@description('Container image')
param containerImage string

@description('Tags for resources')
param tags object

@description('Key Vault name for secrets')
param keyVaultName string

@description('Application Insights connection string')
param appInsightsConnectionString string

@description('Database connection string secret URI from Key Vault')
param databaseConnectionStringSecretUri string

// Environment-specific configurations
var environmentConfig = {
  dev: {
    cpu: '0.5'
    memory: '1Gi'
    minReplicas: 0
    maxReplicas: 2
  }
  intg: {
    cpu: '0.5'
    memory: '1Gi'
    minReplicas: 1
    maxReplicas: 3
  }
  prod: {
    cpu: '1.0'
    memory: '2Gi'
    minReplicas: 2
    maxReplicas: 10
  }
}

var config = environmentConfig[environment]

// Log Analytics Workspace for Container Apps Environment
resource logAnalytics 'Microsoft.OperationalInsights/workspaces@2023-09-01' = {
  name: 'law-${containerEnvironmentName}'
  location: location
  tags: tags
  properties: {
    sku: {
      name: 'PerGB2018'
    }
    retentionInDays: 30
    features: {
      enableLogAccessUsingOnlyResourcePermissions: true
    }
  }
}

// Container Apps Environment
resource containerAppsEnvironment 'Microsoft.App/managedEnvironments@2024-03-01' = {
  name: containerEnvironmentName
  location: location
  tags: tags
  properties: {
    appLogsConfiguration: {
      destination: 'log-analytics'
      logAnalyticsConfiguration: {
        customerId: logAnalytics.properties.customerId
        sharedKey: logAnalytics.listKeys().primarySharedKey
      }
    }
    zoneRedundant: false
  }
}

// User Assigned Managed Identity for Key Vault access
resource managedIdentity 'Microsoft.ManagedIdentity/userAssignedIdentities@2023-01-31' = {
  name: 'id-${containerAppName}'
  location: location
  tags: tags
}

// Key Vault access policy for managed identity
resource keyVault 'Microsoft.KeyVault/vaults@2023-07-01' existing = {
  name: keyVaultName
}

resource keyVaultAccessPolicy 'Microsoft.KeyVault/vaults/accessPolicies@2023-07-01' = {
  name: 'add'
  parent: keyVault
  properties: {
    accessPolicies: [
      {
        tenantId: managedIdentity.properties.tenantId
        objectId: managedIdentity.properties.principalId
        permissions: {
          secrets: [
            'get'
            'list'
          ]
        }
      }
    ]
  }
}

// Container App
resource containerApp 'Microsoft.App/containerApps@2024-03-01' = {
  name: containerAppName
  location: location
  tags: tags
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: {
      '${managedIdentity.id}': {}
    }
  }
  properties: {
    managedEnvironmentId: containerAppsEnvironment.id
    configuration: {
      ingress: {
        external: true
        targetPort: 8080
        allowInsecure: false
        traffic: [
          {
            weight: 100
            latestRevision: true
          }
        ]
      }
      secrets: [
        {
          name: 'database-connection-string'
          keyVaultUrl: databaseConnectionStringSecretUri
          identity: managedIdentity.id
        }
        {
          name: 'app-insights-connection-string'
          value: appInsightsConnectionString
        }
      ]
    }
    template: {
      containers: [
        {
          image: containerImage
          name: 'fieldpulse-app'
          env: [
            {
              name: 'NODE_ENV'
              value: 'production'
            }
            {
              name: 'PORT'
              value: '8080'
            }
            {
              name: 'DATABASE_URL'
              secretRef: 'database-connection-string'
            }
            {
              name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
              secretRef: 'app-insights-connection-string'
            }
          ]
          resources: {
            cpu: json(config.cpu)
            memory: config.memory
          }
          probes: [
            {
              type: 'Liveness'
              httpGet: {
                path: '/api/health'
                port: 8080
                scheme: 'HTTP'
              }
              initialDelaySeconds: 30
              periodSeconds: 30
              timeoutSeconds: 5
              failureThreshold: 3
            }
            {
              type: 'Readiness'
              httpGet: {
                path: '/api/health'
                port: 8080
                scheme: 'HTTP'
              }
              initialDelaySeconds: 5
              periodSeconds: 10
              timeoutSeconds: 3
              failureThreshold: 3
            }
          ]
        }
      ]
      scale: {
        minReplicas: config.minReplicas
        maxReplicas: config.maxReplicas
        rules: [
          {
            name: 'http-scaler'
            http: {
              metadata: {
                concurrentRequests: '50'
              }
            }
          }
          {
            name: 'cpu-scaler'
            custom: {
              type: 'cpu'
              metadata: {
                type: 'Utilization'
                value: '70'
              }
            }
          }
        ]
      }
    }
  }
  dependsOn: [
    keyVaultAccessPolicy
  ]
}

// Outputs
output containerAppUrl string = 'https://${containerApp.properties.configuration.ingress.fqdn}'
output containerAppName string = containerApp.name
output managedIdentityId string = managedIdentity.id
output containerAppsEnvironmentId string = containerAppsEnvironment.id