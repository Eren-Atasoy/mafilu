export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--mf-black)]">
      {/* Hero Section Skeleton */}
      <div className="relative h-[60vh] min-h-[500px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--mf-elevated)] via-[var(--mf-dark)] to-[var(--mf-black)] animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--mf-black)] via-transparent to-transparent" />
        
        <div className="relative z-20 h-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col justify-end pb-20">
          <div className="max-w-2xl space-y-4">
            <div className="h-8 w-32 bg-[var(--mf-surface)]/50 rounded animate-pulse" />
            <div className="h-16 w-3/4 bg-[var(--mf-surface)]/50 rounded animate-pulse" />
            <div className="h-6 w-1/2 bg-[var(--mf-surface)]/50 rounded animate-pulse" />
            <div className="flex gap-4">
              <div className="h-12 w-32 bg-[var(--mf-surface)]/50 rounded animate-pulse" />
              <div className="h-12 w-32 bg-[var(--mf-surface)]/50 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-6 w-48 bg-[var(--mf-surface)]/50 rounded animate-pulse" />
            <div className="h-64 w-full bg-[var(--mf-surface)]/50 rounded-xl animate-pulse" />
          </div>
          <div className="space-y-6">
            <div className="h-48 bg-[var(--mf-surface)]/50 rounded-xl animate-pulse" />
            <div className="h-48 bg-[var(--mf-surface)]/50 rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

