/**
 * Smart UI Spacing Optimizer
 * Provides intelligent spacing, typography, and layout utilities
 */

export interface SpacingConfig {
  component: 'card' | 'section' | 'header' | 'nav';
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  context: 'desktop' | 'mobile' | 'tablet';
}

export interface TypographyConfig {
  level: 'display' | 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'caption';
  weight: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
  context: 'header' | 'content' | 'nav' | 'ui';
}

export class UIOptimizer {
  // Smart spacing system based on 8px grid
  private static spacingMap = {
    xs: { mobile: 'p-3', tablet: 'p-4', desktop: 'p-4' },
    sm: { mobile: 'p-4', tablet: 'p-5', desktop: 'p-6' },
    md: { mobile: 'p-5', tablet: 'p-6', desktop: 'p-8' },
    lg: { mobile: 'p-6', tablet: 'p-8', desktop: 'p-10' },
    xl: { mobile: 'p-8', tablet: 'p-10', desktop: 'p-12' }
  };

  private static marginMap = {
    xs: { mobile: 'm-2', tablet: 'm-3', desktop: 'm-3' },
    sm: { mobile: 'm-3', tablet: 'm-4', desktop: 'm-4' },
    md: { mobile: 'm-4', tablet: 'm-5', desktop: 'm-6' },
    lg: { mobile: 'm-5', tablet: 'm-6', desktop: 'm-8' },
    xl: { mobile: 'm-6', tablet: 'm-8', desktop: 'm-10' }
  };

  private static gapMap = {
    xs: { mobile: 'gap-3', tablet: 'gap-4', desktop: 'gap-4' },
    sm: { mobile: 'gap-4', tablet: 'gap-5', desktop: 'gap-6' },
    md: { mobile: 'gap-5', tablet: 'gap-6', desktop: 'gap-8' },
    lg: { mobile: 'gap-6', tablet: 'gap-8', desktop: 'gap-10' },
    xl: { mobile: 'gap-8', tablet: 'gap-10', desktop: 'gap-12' }
  };

  // Smart typography system
  private static typographyMap = {
    display: { mobile: 'text-2xl font-bold', tablet: 'text-3xl font-bold', desktop: 'text-4xl font-bold' },
    h1: { mobile: 'text-xl font-bold', tablet: 'text-2xl font-bold', desktop: 'text-3xl font-bold' },
    h2: { mobile: 'text-lg font-semibold', tablet: 'text-xl font-semibold', desktop: 'text-2xl font-semibold' },
    h3: { mobile: 'text-base font-semibold', tablet: 'text-lg font-semibold', desktop: 'text-xl font-semibold' },
    h4: { mobile: 'text-sm font-medium', tablet: 'text-base font-medium', desktop: 'text-lg font-medium' },
    body: { mobile: 'text-sm', tablet: 'text-base', desktop: 'text-base' },
    caption: { mobile: 'text-xs text-gray-600', tablet: 'text-sm text-gray-600', desktop: 'text-sm text-gray-600' }
  };

  // Component-specific optimizations
  private static componentMap = {
    card: {
      base: 'bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200',
      spacing: { mobile: 'p-5', tablet: 'p-6', desktop: 'p-8' }
    },
    section: {
      base: 'w-full',
      spacing: { mobile: 'py-6', tablet: 'py-8', desktop: 'py-12' }
    },
    header: {
      base: 'border-b border-gray-100 bg-white/80 backdrop-blur-sm',
      spacing: { mobile: 'px-4 py-4', tablet: 'px-6 py-5', desktop: 'px-8 py-6' }
    },
    nav: {
      base: 'transition-colors duration-200',
      spacing: { mobile: 'px-3 py-2', tablet: 'px-4 py-3', desktop: 'px-5 py-3' }
    }
  } as const;

  /**
   * Get optimized spacing classes
   */
  static getSpacing(config: SpacingConfig): string {
    const spacing = this.spacingMap[config.size][config.context];
    const component = this.componentMap[config.component];
    
    if (component?.spacing) {
      return component.spacing[config.context];
    }
    
    return spacing;
  }

  /**
   * Get optimized margin classes
   */
  static getMargin(size: SpacingConfig['size'], context: SpacingConfig['context']): string {
    return this.marginMap[size][context];
  }

  /**
   * Get optimized gap classes for flexbox/grid
   */
  static getGap(size: SpacingConfig['size'], context: SpacingConfig['context']): string {
    return this.gapMap[size][context];
  }

  /**
   * Get optimized typography classes
   */
  static getTypography(config: TypographyConfig): string {
    const base = this.typographyMap[config.level];
    const desktop = base.desktop;
    const tablet = base.tablet;
    const mobile = base.mobile;

    return `${mobile} md:${tablet} lg:${desktop}`;
  }

  /**
   * Get complete component optimization
   */
  static getComponent(
    component: SpacingConfig['component'], 
    size: SpacingConfig['size'] = 'md',
    additionalClasses: string = ''
  ): string {
    const componentConfig = this.componentMap[component];
    const spacing = {
      mobile: componentConfig.spacing?.mobile || this.spacingMap[size].mobile,
      tablet: componentConfig.spacing?.tablet || this.spacingMap[size].tablet,
      desktop: componentConfig.spacing?.desktop || this.spacingMap[size].desktop
    };

    const spacingClasses = `${spacing.mobile} md:${spacing.tablet} lg:${spacing.desktop}`;
    
    return `${componentConfig.base} ${spacingClasses} ${additionalClasses}`.trim();
  }

  /**
   * Smart grid system with proper gaps
   */
  static getGrid(cols: number, gap: SpacingConfig['size'] = 'md'): string {
    const gapClasses = {
      mobile: this.gapMap[gap].mobile,
      tablet: this.gapMap[gap].tablet,
      desktop: this.gapMap[gap].desktop
    };

    const gridCols = {
      1: 'grid-cols-1',
      2: 'grid-cols-1 md:grid-cols-2',
      3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
      6: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6'
    };

    return `grid ${gridCols[cols as keyof typeof gridCols] || gridCols[3]} ${gapClasses.mobile} md:${gapClasses.tablet} lg:${gapClasses.desktop}`;
  }

  /**
   * Smart responsive container
   */
  static getContainer(size: 'sm' | 'md' | 'lg' | 'xl' | 'full' = 'lg'): string {
    const containers = {
      sm: 'max-w-2xl',
      md: 'max-w-4xl', 
      lg: 'max-w-6xl',
      xl: 'max-w-7xl',
      full: 'max-w-full'
    };

    return `w-full ${containers[size]} mx-auto px-4 md:px-6 lg:px-8`;
  }

  /**
   * Smart button optimization
   */
  static getButton(variant: 'primary' | 'secondary' | 'ghost' = 'primary', size: 'sm' | 'md' | 'lg' = 'md'): string {
    const baseClasses = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const sizes = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-2.5 text-sm',
      lg: 'px-6 py-3 text-base'
    };

    const variants = {
      primary: 'bg-primary text-white hover:bg-primary/90 focus:ring-primary/50 shadow-sm hover:shadow-md',
      secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500/50',
      ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500/50'
    };

    return `${baseClasses} ${sizes[size]} ${variants[variant]}`;
  }
}

// Convenience hooks for React components
export const useUIOptimizer = () => {
  return {
    spacing: UIOptimizer.getSpacing,
    margin: UIOptimizer.getMargin,
    gap: UIOptimizer.getGap,
    typography: UIOptimizer.getTypography,
    component: UIOptimizer.getComponent,
    grid: UIOptimizer.getGrid,
    container: UIOptimizer.getContainer,
    button: UIOptimizer.getButton
  };
};