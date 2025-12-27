"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[var(--mf-black)] flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-8 h-8 text-red-400" />
        </div>
        <h1 className="text-2xl font-bold text-[var(--mf-text-high)] mb-3">
          Bir hata oluştu
        </h1>
        <p className="text-[var(--mf-text-medium)] mb-6">
          Üzgünüz, beklenmeyen bir hata meydana geldi. Lütfen tekrar deneyin.
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
          <Button
            variant="ghost"
            onClick={() => (window.location.href = "/")}
            className="text-[var(--mf-text-medium)] hover:text-[var(--mf-text-high)]"
          >
            Ana Sayfaya Dön
          </Button>
        </div>
      </div>
    </div>
  );
}

