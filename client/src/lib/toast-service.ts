import { toast as baseToast } from "@/hooks/use-toast"

type ToastVariant = "default" | "destructive" | "success" | "warning"

interface ToastOptions {
  title?: string
  description?: string
  variant?: ToastVariant
  duration?: number
}

/**
 * Enhanced toast service with convenience methods for common toast types
 * Built on top of the existing useToast hook
 */
class ToastService {
  /**
   * Show a success toast notification
   * @param title - Toast title
   * @param description - Optional description text
   */
  success(title: string, description?: string) {
    return baseToast({
      title,
      description,
      variant: "default" as const,
    })
  }

  /**
   * Show an error toast notification
   * @param title - Toast title
   * @param description - Optional description text
   */
  error(title: string, description?: string) {
    return baseToast({
      title,
      description,
      variant: "destructive",
    })
  }

  /**
   * Show a warning toast notification
   * @param title - Toast title
   * @param description - Optional description text
   */
  warning(title: string, description?: string) {
    return baseToast({
      title,
      description,
      variant: "destructive" as const,
    })
  }

  /**
   * Show an info toast notification
   * @param title - Toast title
   * @param description - Optional description text
   */
  info(title: string, description?: string) {
    return baseToast({
      title,
      description,
      variant: "default",
    })
  }

  /**
   * Show form submission success toast
   * @param message - Custom success message (optional)
   */
  formSuccess(message: string = "Changes saved successfully") {
    return this.success("Success", message)
  }

  /**
   * Show form submission error toast
   * @param error - Error message or Error object
   */
  formError(error: string | Error | unknown) {
    let message = "Failed to save changes"
    if (typeof error === "string") {
      message = error
    } else if (error instanceof Error) {
      message = error.message
    }
    return this.error("Error", message)
  }

  /**
   * Show network error toast with helpful context
   * @param message - Custom error message (optional)
   */
  networkError(message: string = "Network error. Please check your connection.") {
    return this.error("Network Error", message)
  }

  /**
   * Show validation error toast
   * @param fieldName - Name of the field with error
   * @param error - Validation error message
   */
  validationError(fieldName: string, error: string) {
    return this.error(`${fieldName} Error`, error)
  }

  /**
   * Show loading toast (doesn't auto-dismiss)
   * @param message - Loading message
   */
  loading(title: string, description?: string) {
    return baseToast({
      title,
      description,
      variant: "default",
    })
  }

  /**
   * Show custom toast with all options
   */
  custom(options: ToastOptions) {
    return baseToast({
      ...options,
    })
  }
}

export const toast = new ToastService()
