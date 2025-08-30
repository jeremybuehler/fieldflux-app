// Database Secrets Module for FieldPulse
// Handles creation of database-related secrets in Key Vault

@description('Key Vault name')
param keyVaultName string

@description('Database connection string')
@secure()
param connectionString string

@description('Database host FQDN')
param databaseHost string

@description('Database name')
param databaseName string

@description('Database administrator login')
param administratorLogin string

@description('Database administrator password')
@secure()
param administratorPassword string

// Reference existing Key Vault
resource keyVault 'Microsoft.KeyVault/vaults@2023-07-01' existing = {
  name: keyVaultName
}

// Store database connection string in Key Vault
resource connectionStringSecret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  name: 'database-connection-string'
  parent: keyVault
  properties: {
    value: connectionString
    contentType: 'text/plain'
    attributes: {
      enabled: true
    }
  }
}

// Store individual database components in Key Vault for flexibility
resource dbHostSecret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  name: 'database-host'
  parent: keyVault
  properties: {
    value: databaseHost
    contentType: 'text/plain'
  }
}

resource dbNameSecret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  name: 'database-name'
  parent: keyVault
  properties: {
    value: databaseName
    contentType: 'text/plain'
  }
}

resource dbUserSecret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  name: 'database-username'
  parent: keyVault
  properties: {
    value: administratorLogin
    contentType: 'text/plain'
  }
}

resource dbPasswordSecret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  name: 'database-password'
  parent: keyVault
  properties: {
    value: administratorPassword
    contentType: 'text/plain'
  }
}

// Outputs
output connectionStringSecretUri string = connectionStringSecret.properties.secretUri
output connectionStringSecretName string = connectionStringSecret.name
output databaseHostSecretUri string = dbHostSecret.properties.secretUri
output databaseNameSecretUri string = dbNameSecret.properties.secretUri
output databaseUserSecretUri string = dbUserSecret.properties.secretUri
output databasePasswordSecretUri string = dbPasswordSecret.properties.secretUri