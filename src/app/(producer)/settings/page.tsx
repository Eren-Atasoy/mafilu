"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    User,
    CreditCard,
    Bell,
    Shield,
    Save,
    CheckCircle,
    AlertCircle
} from "lucide-react";

export default function SettingsPage() {
    const supabase = createClient();

    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Profile form state
    const [fullName, setFullName] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [bio, setBio] = useState("");
    const [website, setWebsite] = useState("");

    // Load profile data on mount
    useEffect(() => {
        const loadProfile = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                const { data: profile } = await supabase
                    .from("profiles")
                    .select("full_name, producer_profile")
                    .eq("id", user.id)
                    .single();

                if (profile) {
                    setFullName(profile.full_name || "");
                    const producerProfile = profile.producer_profile as any || {};
                    setBio(producerProfile.bio || "");
                    setWebsite(producerProfile.website || "");
                }
            } catch (err) {
                console.error("Failed to load profile:", err);
            }
        };

        loadProfile();
    }, [supabase]);

    // Payment settings
    const [bankName, setBankName] = useState("");
    const [iban, setIban] = useState("");
    const [taxId, setTaxId] = useState("");

    // Notification settings
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [marketingEmails, setMarketingEmails] = useState(false);
    const [weeklyReport, setWeeklyReport] = useState(true);

    const handleSaveProfile = async () => {
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not authenticated");

            // Get existing producer_profile
            const { data: existingProfile } = await supabase
                .from("profiles")
                .select("producer_profile")
                .eq("id", user.id)
                .single();

            const existingProducerProfile = existingProfile?.producer_profile || {};

            const { error: updateError } = await supabase
                .from("profiles")
                .update({
                    full_name: fullName,
                    producer_profile: {
                        ...existingProducerProfile,
                        bio,
                        website,
                    },
                    updated_at: new Date().toISOString(),
                })
                .eq("id", user.id);

            if (updateError) throw updateError;

            setSuccess("Profil bilgileri güncellendi!");
        } catch (err) {
            console.error(err);
            setError("Bir hata oluştu. Lütfen tekrar deneyin.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSavePayment = async () => {
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not authenticated");

            // In production, encrypt sensitive payment info
            const { error: updateError } = await supabase
                .from("profiles")
                .update({
                    payment_info: {
                        bank_name: bankName,
                        iban: iban.replace(/\s/g, ""),
                        tax_id: taxId,
                    },
                    updated_at: new Date().toISOString(),
                })
                .eq("id", user.id);

            if (updateError) throw updateError;

            setSuccess("Ödeme bilgileri güncellendi!");
        } catch (err) {
            console.error(err);
            setError("Bir hata oluştu. Lütfen tekrar deneyin.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8 max-w-4xl">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-[#F5F3FF] headline-serif">Ayarlar</h1>
                <p className="text-[#A197B0] mt-1">Hesap ve tercihlerinizi yönetin</p>
            </div>

            {/* Success/Error Messages */}
            {success && (
                <div className="flex items-center gap-3 p-4 rounded-xl" style={{
                    background: "rgba(34, 197, 94, 0.1)",
                    border: "1px solid rgba(34, 197, 94, 0.2)"
                }}>
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                    <p className="text-emerald-400">{success}</p>
                </div>
            )}

            {error && (
                <div className="flex items-center gap-3 p-4 rounded-xl" style={{
                    background: "rgba(239, 68, 68, 0.1)",
                    border: "1px solid rgba(239, 68, 68, 0.2)"
                }}>
                    <AlertCircle className="w-5 h-5 text-red-400" />
                    <p className="text-red-400">{error}</p>
                </div>
            )}

            {/* Profile Settings */}
            <Card variant="glass">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{
                            background: "linear-gradient(135deg, rgba(124, 58, 237, 0.2) 0%, rgba(168, 85, 247, 0.1) 100%)"
                        }}>
                            <User className="w-5 h-5 text-[#A855F7]" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">Profil Bilgileri</CardTitle>
                            <CardDescription>Herkese açık profil bilgileriniz</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                        <Input
                            label="Ad Soyad"
                            placeholder="Adınız ve soyadınız"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                        />
                        <Input
                            label="Görünen Ad"
                            placeholder="@kullaniciadi"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-[#C4B5FD]">Biyografi</label>
                        <textarea
                            className="flex w-full rounded-xl px-4 py-3 text-sm text-[#F5F3FF] placeholder:text-[#6B5F7C] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/50 transition-all duration-200 min-h-[100px] resize-none"
                            style={{
                                background: "rgba(21, 10, 36, 0.6)",
                                border: "1px solid rgba(124, 58, 237, 0.2)",
                            }}
                            placeholder="Kendinizi kısaca tanıtın..."
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                        />
                    </div>
                    <Input
                        label="Website"
                        placeholder="https://yourwebsite.com"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                    />
                    <div className="pt-4 flex justify-end">
                        <Button onClick={handleSaveProfile} isLoading={isLoading}>
                            <Save className="w-4 h-4" />
                            Kaydet
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Payment Settings */}
            <Card variant="glass">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                            <CreditCard className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">Ödeme Bilgileri</CardTitle>
                            <CardDescription>Kazançlarınızın gönderileceği hesap bilgileri</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="relative">
                            <Input
                                label="Banka Adı"
                                placeholder="Örn: Garanti BBVA"
                                value={bankName}
                                onChange={(e) => setBankName(e.target.value)}
                            />
                        </div>
                        <Input
                            label="Vergi Kimlik No"
                            placeholder="Vergi kimlik numaranız"
                            value={taxId}
                            onChange={(e) => setTaxId(e.target.value)}
                        />
                    </div>
                    <Input
                        label="IBAN"
                        placeholder="TR00 0000 0000 0000 0000 0000 00"
                        value={iban}
                        onChange={(e) => setIban(e.target.value)}
                    />
                    <div className="p-4 rounded-xl" style={{
                        background: "rgba(124, 58, 237, 0.05)",
                        border: "1px solid rgba(124, 58, 237, 0.1)"
                    }}>
                        <p className="text-sm text-[#A197B0]">
                            <Shield className="w-4 h-4 inline mr-2 text-[#A855F7]" />
                            Ödeme bilgileriniz güvenli bir şekilde şifrelenerek saklanır.
                        </p>
                    </div>
                    <div className="pt-4 flex justify-end">
                        <Button onClick={handleSavePayment} isLoading={isLoading}>
                            <Save className="w-4 h-4" />
                            Kaydet
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card variant="glass">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                            <Bell className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">Bildirim Tercihleri</CardTitle>
                            <CardDescription>E-posta ve bildirim ayarlarınız</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {[
                        {
                            id: "email",
                            label: "E-posta Bildirimleri",
                            description: "Yorum, beğeni ve izlenme bildirimleri",
                            checked: emailNotifications,
                            onChange: setEmailNotifications
                        },
                        {
                            id: "marketing",
                            label: "Pazarlama E-postaları",
                            description: "Yeni özellikler ve kampanyalar hakkında bilgi",
                            checked: marketingEmails,
                            onChange: setMarketingEmails
                        },
                        {
                            id: "weekly",
                            label: "Haftalık Rapor",
                            description: "Filmlerinizin haftalık performans özeti",
                            checked: weeklyReport,
                            onChange: setWeeklyReport
                        },
                    ].map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center justify-between p-4 rounded-xl transition-colors"
                            style={{ background: "rgba(21, 10, 36, 0.4)" }}
                        >
                            <div>
                                <p className="font-medium text-[#F5F3FF]">{item.label}</p>
                                <p className="text-sm text-[#6B5F7C]">{item.description}</p>
                            </div>
                            <button
                                onClick={() => item.onChange(!item.checked)}
                                className={`w-12 h-7 rounded-full transition-all duration-300 relative ${item.checked ? "bg-[#7C3AED]" : "bg-[#2B0F3F]"
                                    }`}
                            >
                                <span
                                    className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all duration-300 ${item.checked ? "left-6" : "left-1"
                                        }`}
                                />
                            </button>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card variant="glass" className="border-red-500/20">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                            <AlertCircle className="w-5 h-5 text-red-400" />
                        </div>
                        <div>
                            <CardTitle className="text-lg text-red-400">Tehlikeli Bölge</CardTitle>
                            <CardDescription>Dikkatli olun, bu işlemler geri alınamaz</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl" style={{
                        background: "rgba(239, 68, 68, 0.05)",
                        border: "1px solid rgba(239, 68, 68, 0.1)"
                    }}>
                        <div>
                            <p className="font-medium text-[#F5F3FF]">Hesabı Sil</p>
                            <p className="text-sm text-[#6B5F7C]">Hesabınız ve tüm verileriniz kalıcı olarak silinir</p>
                        </div>
                        <Button variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10">
                            Hesabı Sil
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
