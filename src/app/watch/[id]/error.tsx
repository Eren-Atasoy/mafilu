"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home } from "lucide-react";
import Link from "next/link";

export default function WatchError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Watch page error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[var(--mf-black)] flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-8 h-8 text-red-400" />
        </div>
        <h1 className="text-2xl font-bold text-[var(--mf-text-high)] mb-3">
          Film yüklenemedi
        </h1>
        <p className="text-[var(--mf-text-medium)] mb-6">
          Bu filmi görüntülerken bir sorun oluştu. Lütfen tekrar deneyin veya başka bir film seçin.
        </p>
        {error.digest && (
          <p className="text-xs text-[var(--mf-text-low)] mb-6 font-mono">
            Hata ID: {error.digest}
          </p>
        )}
        <div className="flex gap-3 justify-center">
          <Button onClick={reset} className="bg-[var(--mf-primary-dark)] hover:bg-[var(--mf-primary-darker)]">
            Tekrar Dene
          </Button>
          <Link href="/">
            <Button
              variant="ghost"
              className="text-[var(--mf-text-medium)] hover:text-[var(--mf-text-high)]"
            >
              <Home className="w-4 h-4 mr-2" />
              Ana Sayfa
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

