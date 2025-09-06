/**
 * Environment Configuration Validation
 * 🔐 Ensures production security requirements are met
 */

export interface EnvironmentConfig {
  NODE_ENV: string;
  isProduction: boolean;
  isDevelopment: boolean;
  
  // Authentication
  hasOIDC: boolean;
  hasReplit: boolean;
  hasValidAuth: boolean;
  
  // Database
  DATABASE_URL?: string;
  
  // Security
  SESSION_SECRET?: string;
  
  // Base configuration
  BASE_URL?: string;
  PORT: number;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  config: EnvironmentConfig;
}

/**
 * Validates environment configuration for production security
 */
export function validateEnvironment(): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  const NODE_ENV = process.env.NODE_ENV || 'development';
  const isProduction = NODE_ENV === 'production';
  const isDevelopment = NODE_ENV === 'development';
  
  // Authentication validation
  const hasOIDC = !!(
    process.env.OIDC_ISSUER_URL && 
    process.env.OIDC_CLIENT_ID && 
    process.env.OIDC_CLIENT_SECRET
  );
  
  const hasReplit = !!process.env.REPLIT_DOMAINS;
  const hasValidAuth = hasOIDC || hasReplit;
  
  // Production security requirements
  if (isProduction) {
    // Authentication requirements
    if (!hasValidAuth) {
      errors.push('🔐 AUTHENTICATION: Production requires either OIDC or Replit authentication');
      errors.push('   Configure: OIDC_ISSUER_URL + OIDC_CLIENT_ID + OIDC_CLIENT_SECRET');
      errors.push('   Or: REPLIT_DOMAINS for Replit environments');
    }
    
    // Session security
    const sessionSecret = process.env.SESSION_SECRET;
    if (!sessionSecret || sessionSecret === 'change-me' || sessionSecret.length < 32) {
      errors.push('🔐 SESSION: Production requires a secure SESSION_SECRET (32+ characters)');
    }
    
    // Database requirement
    if (!process.env.DATABASE_URL) {
      warnings.push('📊 DATABASE: No DATABASE_URL configured - using memory storage');
    }
    
    // HTTPS requirement
    const baseUrl = process.env.BASE_URL || process.env.VERCEL_URL;
    if (baseUrl && !baseUrl.startsWith('https://')) {
      warnings.push('🌐 SECURITY: BASE_URL should use HTTPS in production');
    }
    
    // Disable auth checks
    if (process.env.DISABLE_AUTH === 'true') {
      errors.push('🚨 SECURITY: DISABLE_AUTH=true is not allowed in production');
    }
    
    // Demo mode checks  
    if (process.env.DEMO_MODE === 'true') {
      warnings.push('🎭 DEMO: Running in demo mode in production environment');
    }
  }
  
  // Development warnings
  if (isDevelopment) {
    if (hasOIDC) {
      console.log('✅ Development environment with OIDC configured');
    } else if (hasReplit) {
      console.log('✅ Development environment with Replit auth configured');
    } else if (process.env.DISABLE_AUTH === 'true') {
      console.log('⚠️  Development environment with authentication disabled');
    } else {
      console.log('ℹ️  Development environment - set DISABLE_AUTH=true to bypass authentication');
    }
  }
  
  const config: EnvironmentConfig = {
    NODE_ENV,
    isProduction,
    isDevelopment,
    hasOIDC,
    hasReplit,
    hasValidAuth,
    DATABASE_URL: process.env.DATABASE_URL,
    SESSION_SECRET: process.env.SESSION_SECRET,
    BASE_URL: process.env.BASE_URL || process.env.VERCEL_URL,
    PORT: parseInt(process.env.PORT || '5000', 10),
  };
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    config,
  };
}

/**
 * Validates environment and throws on production security errors
 */
export function enforceProductionSecurity(): EnvironmentConfig {
  const result = validateEnvironment();
  
  // Always log configuration status
  console.log(`🌍 Environment: ${result.config.NODE_ENV}`);
  console.log(`🔐 Authentication: ${result.config.hasValidAuth ? '✅ Configured' : '❌ Missing'}`);
  
  if (result.config.hasOIDC) {
    console.log('   • OIDC authentication enabled');
  }
  if (result.config.hasReplit) {
    console.log('   • Replit authentication enabled');
  }
  
  // Log warnings
  if (result.warnings.length > 0) {
    console.log('\n⚠️  Configuration warnings:');
    result.warnings.forEach(warning => console.log(`   ${warning}`));
  }
  
  // Enforce production security
  if (!result.isValid) {
    console.error('\n❌ Environment configuration errors:');
    result.errors.forEach(error => console.error(`   ${error}`));
    console.error('\n🚨 Application startup blocked for security reasons');
    throw new Error('Production security requirements not met. Please fix configuration errors.');
  }
  
  if (result.config.isProduction) {
    console.log('✅ Production security requirements validated');
  }
  
  return result.config;
}

/**
 * Gets authentication strategy recommendations
 */
export function getAuthStrategyRecommendations(): string[] {
  const recommendations: string[] = [];
  
  const isProduction = process.env.NODE_ENV === 'production';
  const hasOIDC = !!(process.env.OIDC_ISSUER_URL && process.env.OIDC_CLIENT_ID);
  
  if (!hasOIDC) {
    recommendations.push('🔐 Configure OIDC Authentication:');
    recommendations.push('   OIDC_ISSUER_URL=https://your-provider.com');
    recommendations.push('   OIDC_CLIENT_ID=your-client-id');
    recommendations.push('   OIDC_CLIENT_SECRET=your-client-secret');
    
    if (!isProduction) {
      recommendations.push('');
      recommendations.push('🛠️  For development, you can:');
      recommendations.push('   • Set DISABLE_AUTH=true to bypass authentication');
      recommendations.push('   • Set DEMO_MODE=true for demo user simulation');
    }
  }
  
  return recommendations;
}
