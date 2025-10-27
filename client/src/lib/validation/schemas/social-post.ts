import { z } from "zod"

export const socialPostSchema = z.object({
  content: z
    .string()
    .min(1, "Post content is required")
    .max(2000, "Post content must be 2000 characters or less")
    .refine(
      (content) => content.trim().length > 0,
      "Post content cannot be empty or whitespace only"
    ),
  platforms: z
    .array(z.enum(["facebook", "twitter", "instagram", "linkedin", "tiktok"]))
    .min(1, "Select at least one platform"),
  scheduledDate: z
    .date()
    .refine(
      (date) => date > new Date(),
      "Scheduled date must be in the future"
    )
    .optional()
    .or(z.literal("")),
  includeImage: z.boolean().default(false),
})

export type SocialPostFormData = z.infer<typeof socialPostSchema>

/**
 * Character count validation per platform
 */
export const platformCharacterLimits: Record<string, number> = {
  twitter: 280,
  linkedin: 3000,
  facebook: 63206,
  instagram: 2200,
  tiktok: 2200,
}

/**
 * Get character limit for a platform
 */
export function getPlatformCharacterLimit(platform: string): number {
  return platformCharacterLimits[platform] || 2000
}

/**
 * Validate content length for specific platforms
 */
export function validatePlatformContent(
  content: string,
  platforms: string[]
): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {}

  platforms.forEach((platform) => {
    const limit = getPlatformCharacterLimit(platform)
    if (content.length > limit) {
      errors[platform] = `Content exceeds ${platform} limit of ${limit} characters`
    }
  })

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  }
}
