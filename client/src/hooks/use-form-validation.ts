import { useCallback } from "react"
import { useForm, UseFormProps, FieldValues, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ZodSchema } from "zod"
import { useToast } from "@/hooks/use-toast"
import { toast } from "@/lib/toast-service"

/**
 * Custom hook for React Hook Form with Zod validation
 * Handles form submission with error and success toast notifications
 */
export function useFormValidation<T extends ZodSchema, TFieldValues extends FieldValues = any>(
  schema: T,
  onSubmit: SubmitHandler<any>,
  options?: Omit<UseFormProps<TFieldValues>, "resolver">
) {
  const { toast: showToast } = useToast()

  const form = useForm<TFieldValues>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    ...options,
  })

  const handleSubmit = useCallback(
    (successMessage?: string) => {
      return form.handleSubmit(async (data) => {
        try {
          await onSubmit(data)
          toast.formSuccess(successMessage || "Changes saved successfully")
        } catch (error) {
          if (error instanceof Error) {
            toast.formError(error.message)
          } else {
            toast.formError("An unexpected error occurred")
          }
        }
      })
    },
    [form, onSubmit]
  )

  return {
    form,
    handleSubmit,
    formState: form.formState,
  }
}
