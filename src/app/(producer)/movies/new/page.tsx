"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    ArrowLeft,
    Check,
    AlertCircle
} from "lucide-react";

const genres = [
    { value: "drama", label: "Drama" },
    { value: "comedy", label: "Komedi" },
    { value: "thriller", label: "Gerilim" },
    { value: "documentary", label: "Belgesel" },
    { value: "horror", label: "Korku" },
    { value: "sci_fi", label: "Bilim Kurgu" },
    { value: "romance", label: "Romantik" },
    { value: "animation", label: "Animasyon" },
    { value: "experimental", label: "Deneysel" },
    { value: "short_film", label: "Kısa Film" },
];

export default function NewMoviePage() {
    const router = useRouter();
    const supabase = createClient();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form state
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [genre, setGenre] = useState("");
    const [releaseYear, setReleaseYear] = useState(new Date().getFullYear().toString());
    const [tags, setTags] = useState("");

    const handleSubmit = async (e: React.FormEvent, action: "draft" | "submit") => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                setError("Oturum açmanız gerekiyor");
                return;
            }

            // Create movie record
            const { data: movie, error: movieError } = await supabase
                .from("movies")
                .insert({
                    producer_id: user.id,
                    title,
                    description,
                    genre,
                    release_year: parseInt(releaseYear),
                    tags: tags.split(",").map(t => t.trim()).filter(Boolean),
                    status: action === "submit" ? "pending_review" : "draft",
                    submitted_at: action === "submit" ? new Date().toISOString() : null,
                })
                .select()
                .single();

            if (movieError) {
                console.error("Movie creation error:", movieError);
                setError("Film oluşturulurken bir hata oluştu");
                return;
            }

            // Redirect to edit page for video upload
            router.push(`/movies/${movie.id}/edit`);
            router.refresh();
        } catch (err) {
            console.error(err);
            setError("Beklenmeyen bir hata oluştu");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link
                    href="/movies"
                    className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-white">Yeni Film Ekle</h1>
                    <p className="text-slate-400">Filminizi platforma yükleyin</p>
                </div>
            </div>

            {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                    <p className="text-red-400">{error}</p>
                </div>
            )}

            <form onSubmit={(e) => handleSubmit(e, "draft")}>
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Movie Details */}
                        <Card variant="glass">
                            <CardHeader>
                                <CardTitle className="text-lg">Film Bilgileri</CardTitle>
                                <CardDescription>Video dosyasını bir sonraki adımda yükleyebilirsiniz.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Input
                                    label="Film Adı"
                                    placeholder="Örn: Kayıp Şehir"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Açıklama</label>
                                    <textarea
                                        className="flex w-full rounded-lg border border-slate-700 bg-slate-900/50 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 min-h-[120px] resize-none"
                                        placeholder="Filminizin konusu ve hikayesi hakkında kısa bir açıklama yazın..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </div>

                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">Kategori</label>
                                        <select
                                            className="flex h-11 w-full rounded-lg border border-slate-700 bg-slate-900/50 px-4 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer"
                                            value={genre}
                                            onChange={(e) => setGenre(e.target.value)}
                                            required
                                        >
                                            <option value="" className="bg-slate-900">Kategori seçin</option>
                                            {genres.map((g) => (
                                                <option key={g.value} value={g.value} className="bg-slate-900">
                                                    {g.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <Input
                                        label="Yapım Yılı"
                                        type="number"
                                        min="1900"
                                        max={new Date().getFullYear()}
                                        value={releaseYear}
                                        onChange={(e) => setReleaseYear(e.target.value)}
                                    />
                                </div>

                                <Input
                                    label="Etiketler"
                                    placeholder="bağımsız, ödüllü, gerilim (virgülle ayırın)"
                                    value={tags}
                                    onChange={(e) => setTags(e.target.value)}
                                />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Submit Actions */}
                        <Card variant="glass">
                            <CardHeader>
                                <CardTitle className="text-lg">Yayınla</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button
                                    type="submit"
                                    variant="outline"
                                    className="w-full"
                                    isLoading={isLoading}
                                >
                                    Taslak Olarak Kaydet
                                </Button>
                                <Button
                                    type="button"
                                    className="w-full"
                                    onClick={(e) => handleSubmit(e, "submit")}
                                    isLoading={isLoading}
                                >
                                    <Check className="w-5 h-5" />
                                    İncelemeye Gönder
                                </Button>
                                <p className="text-xs text-slate-500 text-center">
                                    İncelemeye gönderilen filmler ekibimiz tarafından değerlendirilir
                                </p>
                            </CardContent>
                        </Card>

                        {/* Guidelines */}
                        <Card variant="glass">
                            <CardHeader>
                                <CardTitle className="text-lg">İçerik Kuralları</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm text-slate-400">
                                    <li className="flex items-start gap-2">
                                        <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                                        Orijinal içerik olmalı
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                                        HD veya üzeri kalite
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                                        Telif hakkı ihlali yok
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                                        Uygun içerik politikası
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </form>
        </div>
    );
}
