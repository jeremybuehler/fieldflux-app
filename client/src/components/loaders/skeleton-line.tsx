import { Skeleton } from "@/components/ui/skeleton"

interface SkeletonLineProps {
  width?: string
  height?: string
  className?: string
}

/**
 * General-purpose skeleton line component for flexible placeholder rendering
 */
export function SkeletonLine({ width = "w-full", height = "h-4", className = "" }: SkeletonLineProps) {
  return <Skeleton className={`${width} ${height} ${className}`} />
}
