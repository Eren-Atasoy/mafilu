export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--mf-black)]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        {/* Header Skeleton */}
        <div className="mb-8 space-y-4">
          <div className="h-10 w-64 bg-[var(--mf-surface)]/50 rounded animate-pulse" />
          <div className="h-6 w-96 bg-[var(--mf-surface)]/50 rounded animate-pulse" />
        </div>

        {/* Filters Skeleton */}
        <div className="mb-8 flex flex-wrap gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-10 w-24 bg-[var(--mf-surface)]/50 rounded-full animate-pulse"
            />
          ))}
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="aspect-[2/3] bg-[var(--mf-surface)]/50 rounded-xl animate-pulse" />
              <div className="h-4 w-3/4 bg-[var(--mf-surface)]/50 rounded animate-pulse" />
              <div className="h-3 w-1/2 bg-[var(--mf-surface)]/50 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

