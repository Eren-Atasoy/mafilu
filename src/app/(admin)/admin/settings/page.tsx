import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Bell, Shield, Globe } from "lucide-react";

export default async function AdminSettingsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">Admin Ayarları</h1>
                <p className="text-slate-400 mt-1">Platform yapılandırması ve ayarlar</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                <Card variant="glass">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Globe className="w-5 h-5 text-blue-400" />
                            Site Ayarları
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-slate-400">Site ayarları yakında eklenecek.</p>
                    </CardContent>
                </Card>

                <Card variant="glass">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Bell className="w-5 h-5 text-yellow-400" />
                            Bildirim Ayarları
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-slate-400">Bildirim ayarları yakında eklenecek.</p>
                    </CardContent>
                </Card>

                <Card variant="glass">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Shield className="w-5 h-5 text-red-400" />
                            Güvenlik
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-slate-400">Güvenlik ayarları yakında eklenecek.</p>
                    </CardContent>
                </Card>

                <Card variant="glass">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Settings className="w-5 h-5 text-purple-400" />
                            Genel
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-slate-400">Genel ayarlar yakında eklenecek.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
