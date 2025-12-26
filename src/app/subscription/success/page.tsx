import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SubscriptionSuccessPage() {
    return (
        <div className="min-h-screen bg-[#0A0510] flex items-center justify-center px-6">
            <div className="max-w-md w-full text-center">
                <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-400" />
                </div>

                <h1 className="text-3xl font-bold text-[#F5F3FF] headline-serif mb-4">
                    Abonelik Başarılı!
                </h1>

                <p className="text-[#A197B0] mb-8">
                    Ödemeniz başarıyla alındı. Artık premium içeriklere erişebilirsiniz.
                </p>

                <div className="space-y-3">
                    <Link href="/browse">
                        <Button className="w-full bg-[#7C3AED] hover:bg-[#6D28D9]">
                            Film İzlemeye Başla
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>

                    <Link href="/dashboard">
                        <Button variant="ghost" className="w-full text-[#C4B5FD] hover:bg-[#7C3AED]/10">
                            Dashboard&apos;a Git
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
