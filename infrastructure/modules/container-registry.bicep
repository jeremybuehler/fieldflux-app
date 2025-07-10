// Azure Container Registry Module for FieldPulse
// Eliminates external registry authentication issues

@description('Container Registry name')
param registryName string

@description('Location for resources')
param location string

@description('Tags for resources')
param tags object

@description('Environment (dev, intg, prod)')
param environment string = 'dev'

@description('SKU for the container registry')
param sku string = environment == 'prod' ? 'Premium' : 'Basic'

// Azure Container Registry
resource containerRegistry 'Microsoft.ContainerRegistry/registries@2023-07-01' = {
  name: registryName
  location: location
  tags: tags
  sku: {
    name: sku
  }
  properties: {
    adminUserEnabled: true
    policies: {
      quarantinePolicy: {
        status: 'disabled'
      }
      trustPolicy: {
        type: 'Notary'
        status: 'disabled'
      }
      retentionPolicy: {
        days: environment == 'prod' ? 30 : 7
        status: 'enabled'
      }
    }
    encryption: {
      status: 'disabled'
    }
    dataEndpointEnabled: false
    publicNetworkAccess: 'Enabled'
    networkRuleBypassOptions: 'AzureServices'
  }
}

// Outputs
output registryName string = containerRegistry.name
output registryId string = containerRegistry.id
output loginServer string = containerRegistry.properties.loginServer
output registryUrl string = 'https://${containerRegistry.properties.loginServer}'