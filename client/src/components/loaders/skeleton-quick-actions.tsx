import { Skeleton } from "@/components/ui/skeleton"

/**
 * Skeleton loader for quick actions section
 */
export function SkeletonQuickActions() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-4 w-24" />
        </div>
      ))}
    </div>
  )
}
