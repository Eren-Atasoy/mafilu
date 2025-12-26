import Link from "next/link";
import { XCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SubscriptionCancelPage() {
    return (
        <div className="min-h-screen bg-[#0A0510] flex items-center justify-center px-6">
            <div className="max-w-md w-full text-center">
                <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
                    <XCircle className="w-10 h-10 text-red-400" />
                </div>

                <h1 className="text-3xl font-bold text-[#F5F3FF] headline-serif mb-4">
                    Ödeme İptal Edildi
                </h1>

                <p className="text-[#A197B0] mb-8">
                    Ödeme işlemi iptal edildi. Endişelenmeyin, hiçbir ücret alınmadı.
                </p>

                <div className="space-y-3">
                    <Link href="/subscription">
                        <Button className="w-full bg-[#7C3AED] hover:bg-[#6D28D9]">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Planlara Geri Dön
                        </Button>
                    </Link>

                    <Link href="/browse">
                        <Button variant="ghost" className="w-full text-[#C4B5FD] hover:bg-[#7C3AED]/10">
                            Ücretsiz İzlemeye Devam Et
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
