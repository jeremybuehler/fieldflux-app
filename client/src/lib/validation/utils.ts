import { ZodError } from "zod"

/**
 * Convert Zod error to a user-friendly message
 */
export function getZodErrorMessage(error: ZodError): string {
  const firstError = error.errors[0]
  if (!firstError) return "Validation error"

  const path = firstError.path.join(".")
  const message = firstError.message

  return `${path ? `${path}: ` : ""}${message}`
}

/**
 * Extract field errors from Zod error
 */
export function getFieldErrors(error: ZodError): Record<string, string> {
  const errors: Record<string, string> = {}

  error.errors.forEach((err) => {
    const path = err.path.join(".")
    if (path) {
      errors[path] = err.message
    }
  })

  return errors
}

/**
 * Get error message for a specific field
 */
export function getFieldError(error: ZodError, fieldName: string): string | undefined {
  const fieldError = error.errors.find((err) => err.path.join(".") === fieldName)
  return fieldError?.message
}

/**
 * Check if error is a Zod validation error
 */
export function isZodError(error: unknown): error is ZodError {
  return error instanceof ZodError
}
