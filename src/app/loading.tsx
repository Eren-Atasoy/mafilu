export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--mf-black)] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-2 border-[var(--mf-primary-dark)]/30 border-t-[var(--mf-primary-dark)] rounded-full animate-spin" />
        <p className="text-[var(--mf-text-medium)]">Yükleniyor...</p>
      </div>
    </div>
  );
}

