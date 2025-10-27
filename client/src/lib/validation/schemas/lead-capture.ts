import { z } from "zod"

export const leadCaptureSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be 50 characters or less"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be 50 characters or less"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^[\d\s\-\+\(\)\.]+$/, "Invalid phone number format"),
  serviceType: z
    .enum(["hvac", "plumbing", "electrical", "landscaping", "pest-control", "cleaning", "other"], {
      errorMap: () => ({ message: "Please select a service type" }),
    }),
  description: z
    .string()
    .max(1000, "Description must be 1000 characters or less")
    .optional(),
})

export type LeadCaptureFormData = z.infer<typeof leadCaptureSchema>

export const serviceTypes = [
  { value: "hvac", label: "HVAC" },
  { value: "plumbing", label: "Plumbing" },
  { value: "electrical", label: "Electrical" },
  { value: "landscaping", label: "Landscaping" },
  { value: "pest-control", label: "Pest Control" },
  { value: "cleaning", label: "Cleaning" },
  { value: "other", label: "Other" },
]
