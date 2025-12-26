import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Shield, Film as FilmIcon, Calendar } from "lucide-react";

export default async function AdminUsersPage() {
    const supabase = await createClient();

    const { data: users } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

    const roleColors: Record<string, string> = {
        viewer: "bg-blue-500/10 text-blue-400",
        producer: "bg-purple-500/10 text-purple-400",
        admin: "bg-red-500/10 text-red-400",
        super_admin: "bg-yellow-500/10 text-yellow-400",
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">Kullanıcı Yönetimi</h1>
                <p className="text-slate-400 mt-1">Platform kullanıcılarını görüntüle ve yönet</p>
            </div>

            <Card variant="glass">
                <CardHeader>
                    <CardTitle className="text-lg">Tüm Kullanıcılar ({users?.length || 0})</CardTitle>
                </CardHeader>
                <CardContent>
                    {users && users.length > 0 ? (
                        <div className="space-y-3">
                            {users.map((user) => (
                                <div
                                    key={user.id}
                                    className="flex items-center justify-between p-4 rounded-xl bg-slate-800/30"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                            {user.display_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "?"}
                                        </div>
                                        <div>
                                            <p className="font-medium text-white">
                                                {user.display_name || user.full_name || "İsimsiz"}
                                            </p>
                                            <p className="text-sm text-slate-500">{user.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <Badge className={roleColors[user.role] || roleColors.viewer}>
                                            {user.role === "producer" && <FilmIcon className="w-3 h-3 mr-1" />}
                                            {user.role === "admin" && <Shield className="w-3 h-3 mr-1" />}
                                            {user.role}
                                        </Badge>
                                        <span className="text-sm text-slate-500 flex items-center gap-1">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {new Date(user.created_at).toLocaleDateString("tr-TR")}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <User className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                            <p className="text-slate-400">Henüz kullanıcı yok</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
