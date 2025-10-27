import React, { useState } from "react"
import { AlertTriangle, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ErrorFallbackProps {
  error: Error | null
  onReset: () => void
}

/**
 * User-friendly error UI fallback displayed by ErrorBoundary
 * Shows error message, stack trace details, and recovery actions
 */
export function ErrorFallback({ error, onReset }: ErrorFallbackProps) {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 px-4">
      <div className="max-w-md w-full space-y-6 rounded-lg bg-white p-8 shadow-lg">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="rounded-full bg-red-100 p-4">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </div>

        {/* Error Title */}
        <div>
          <h1 className="text-center text-2xl font-bold text-gray-900">
            Oops, something went wrong
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            We encountered an unexpected error. Please try refreshing the page or contact support if
            the problem persists.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
            <p className="font-semibold">Error Details:</p>
            <p className="mt-1 break-words">{error.message || "Unknown error"}</p>
          </div>
        )}

        {/* Details Toggle */}
        {error?.stack && (
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <ChevronDown
              className={`h-4 w-4 transition-transform ${showDetails ? "rotate-180" : ""}`}
            />
            {showDetails ? "Hide" : "Show"} technical details
          </button>
        )}

        {/* Technical Details */}
        {showDetails && error?.stack && (
          <div className="max-h-48 overflow-auto rounded-md bg-gray-900 p-4 font-mono text-xs text-gray-100">
            {error.stack}
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            onClick={onReset}
            className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              window.location.href = "/"
            }}
          >
            Go to Homepage
          </Button>
        </div>

        {/* Support Note */}
        <p className="text-center text-xs text-gray-500">
          If this problem continues, please contact our support team
        </p>
      </div>
    </div>
  )
}
