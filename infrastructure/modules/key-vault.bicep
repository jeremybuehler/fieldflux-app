// Key Vault Module for FieldPulse
// Based on DOCC security patterns

@description('Key Vault name')
param keyVaultName string

@description('Location for resources')
param location string

@description('Tags for resources')
param tags object

@description('OpenAI API Key')
@secure()
param openaiApiKey string

@description('GitHub Token for container registry')
@secure()
param githubToken string

@description('Environment (dev, intg, prod)')
param environment string = 'dev'

@description('SKU name for Key Vault')
param skuName string = 'standard'

@description('Enable soft delete')
param enableSoftDelete bool = true

@description('Soft delete retention days')
param softDeleteRetentionInDays int = 90

@description('Enable purge protection')
param enablePurgeProtection bool = true

// Get current user/service principal for access policies
var currentUserObjectId = 'PLACEHOLDER' // This will be replaced in the deployment workflow

// Key Vault
resource keyVault 'Microsoft.KeyVault/vaults@2023-07-01' = {
  name: keyVaultName
  location: location
  tags: tags
  properties: {
    sku: {
      family: 'A'
      name: skuName
    }
    tenantId: subscription().tenantId
    enabledForDeployment: false
    enabledForTemplateDeployment: true
    enabledForDiskEncryption: false
    enableRbacAuthorization: false
    enableSoftDelete: enableSoftDelete
    softDeleteRetentionInDays: softDeleteRetentionInDays
    enablePurgeProtection: enablePurgeProtection
    networkAcls: {
      bypass: 'AzureServices'
      defaultAction: 'Allow'
      ipRules: []
      virtualNetworkRules: []
    }
    accessPolicies: [
      // Access policy for deployment service principal will be added via GitHub Actions
      // This is a placeholder structure
    ]
  }
}

// Store OpenAI API Key
resource openaiApiKeySecret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  parent: keyVault
  name: 'openai-api-key'
  properties: {
    value: openaiApiKey
    contentType: 'text/plain'
    attributes: {
      enabled: true
    }
  }
}

// Store GitHub Token
resource githubTokenSecret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  parent: keyVault
  name: 'github-token'
  properties: {
    value: githubToken
    contentType: 'text/plain'
    attributes: {
      enabled: true
    }
  }
}

// Store application configuration secrets
resource appEnvironmentSecret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  parent: keyVault
  name: 'app-environment'
  properties: {
    value: environment
    contentType: 'text/plain'
    attributes: {
      enabled: true
    }
  }
}

// Store Node.js environment setting
resource nodeEnvSecret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  parent: keyVault
  name: 'node-env'
  properties: {
    value: 'production'
    contentType: 'text/plain'
    attributes: {
      enabled: true
    }
  }
}

// Store port configuration
resource appPortSecret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  parent: keyVault
  name: 'app-port'
  properties: {
    value: '8080'
    contentType: 'text/plain'
    attributes: {
      enabled: true
    }
  }
}

// Diagnostic settings removed - requires Log Analytics workspace

// Outputs
output keyVaultName string = keyVault.name
output keyVaultId string = keyVault.id
output keyVaultUri string = keyVault.properties.vaultUri
output keyVaultResource object = keyVault
output openaiApiKeySecretUri string = openaiApiKeySecret.properties.secretUri
output githubTokenSecretUri string = githubTokenSecret.properties.secretUri