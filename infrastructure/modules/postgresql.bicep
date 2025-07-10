// PostgreSQL Module for FieldPulse
// Based on DOCC database patterns

@description('PostgreSQL server name')
param serverName string

@description('Location for resources')
param location string

@description('Environment (dev, intg, prod)')
param environment string

@description('Tags for resources')
param tags object


@description('Database administrator username')
param administratorLogin string = 'fieldpulseadmin'

@description('Database administrator password')
@secure()
param administratorPassword string = newGuid()

// Environment-specific configurations
var environmentConfig = {
  dev: {
    skuName: 'Standard_B1ms'
    tier: 'Burstable'
    storageSizeGB: 32
    backupRetentionDays: 7
    geoRedundantBackup: 'Disabled'
    highAvailability: 'Disabled'
  }
  intg: {
    skuName: 'Standard_B2s'
    tier: 'Burstable'
    storageSizeGB: 64
    backupRetentionDays: 14
    geoRedundantBackup: 'Disabled'
    highAvailability: 'Disabled'
  }
  prod: {
    skuName: 'Standard_B4ms'
    tier: 'Burstable'
    storageSizeGB: 128
    backupRetentionDays: 35
    geoRedundantBackup: 'Enabled'
    highAvailability: 'ZoneRedundant'
  }
}

var config = environmentConfig[environment]
var databaseName = 'fieldpulse'

// PostgreSQL Flexible Server
resource postgresqlServer 'Microsoft.DBforPostgreSQL/flexibleServers@2023-06-01-preview' = {
  name: serverName
  location: location
  tags: tags
  sku: {
    name: config.skuName
    tier: config.tier
  }
  properties: {
    version: '14'
    administratorLogin: administratorLogin
    administratorLoginPassword: administratorPassword
    storage: {
      storageSizeGB: config.storageSizeGB
      autoGrow: 'Enabled'
    }
    backup: {
      backupRetentionDays: config.backupRetentionDays
      geoRedundantBackup: config.geoRedundantBackup
    }
    highAvailability: {
      mode: config.highAvailability
    }
    maintenanceWindow: {
      customWindow: 'Enabled'
      dayOfWeek: 0
      startHour: 2
      startMinute: 0
    }
    authConfig: {
      activeDirectoryAuth: 'Enabled'
      passwordAuth: 'Enabled'
    }
  }
}

// Database
resource database 'Microsoft.DBforPostgreSQL/flexibleServers/databases@2023-06-01-preview' = {
  parent: postgresqlServer
  name: databaseName
  properties: {
    charset: 'UTF8'
    collation: 'en_US.UTF8'
  }
}

// Firewall rule to allow Azure services
resource allowAzureServices 'Microsoft.DBforPostgreSQL/flexibleServers/firewallRules@2023-06-01-preview' = {
  parent: postgresqlServer
  name: 'AllowAzureServices'
  properties: {
    startIpAddress: '0.0.0.0'
    endIpAddress: '0.0.0.0'
  }
}

// Firewall rule for Container Apps (will be updated with actual subnet ranges)
resource allowContainerApps 'Microsoft.DBforPostgreSQL/flexibleServers/firewallRules@2023-06-01-preview' = {
  parent: postgresqlServer
  name: 'AllowContainerApps'
  properties: {
    startIpAddress: '10.0.0.0'
    endIpAddress: '10.255.255.255'
  }
}

// Configuration for SSL enforcement
resource sslEnforcement 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2023-06-01-preview' = {
  parent: postgresqlServer
  name: 'ssl'
  properties: {
    value: 'on'
    source: 'user-override'
  }
}

// Configuration for connection limits
resource connectionLimits 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2023-06-01-preview' = {
  parent: postgresqlServer
  name: 'max_connections'
  properties: {
    value: environment == 'prod' ? '200' : '100'
    source: 'user-override'
  }
}

// Database connection string for output
var connectionString = 'postgresql://${administratorLogin}:${administratorPassword}@${postgresqlServer.properties.fullyQualifiedDomainName}:5432/${databaseName}?sslmode=require'

// Outputs
output serverName string = postgresqlServer.name
output fullyQualifiedDomainName string = postgresqlServer.properties.fullyQualifiedDomainName
output databaseName string = database.name
output connectionString string = connectionString
output administratorPassword string = administratorPassword
output administratorLogin string = administratorLogin