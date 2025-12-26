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
    Upload,
    FileVideo,
    X,
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

    // Video state (will be implemented with Bunny.net later)
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [uploadProgress, _setUploadProgress] = useState(0);

    const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith("video/")) {
                setError("Lütfen geçerli bir video dosyası seçin");
                return;
            }
            // Validate file size (max 5GB)
            if (file.size > 5 * 1024 * 1024 * 1024) {
                setError("Video dosyası 5GB'dan küçük olmalıdır");
                return;
            }
            setVideoFile(file);
            setError(null);
        }
    };

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
            const { data: _movie, error: movieError } = await supabase
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

            // TODO: Upload video to Bunny.net and update movie with bunny_video_id
            // This will be implemented when Bunny.net integration is added

            router.push("/movies");
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
                        {/* Video Upload */}
                        <Card variant="glass">
                            <CardHeader>
                                <CardTitle className="text-lg">Video Dosyası</CardTitle>
                                <CardDescription>MP4, MOV veya AVI formatında video yükleyin (maks. 5GB)</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {!videoFile ? (
                                    <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-700 rounded-xl cursor-pointer hover:border-violet-500 hover:bg-violet-500/5 transition-colors">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <Upload className="w-10 h-10 text-slate-500 mb-3" />
                                            <p className="mb-2 text-sm text-slate-400">
                                                <span className="font-semibold text-violet-400">Tıklayarak seçin</span> veya sürükleyip bırakın
                                            </p>
                                            <p className="text-xs text-slate-500">MP4, MOV, AVI (maks. 5GB)</p>
                                        </div>
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="video/*"
                                            onChange={handleVideoSelect}
                                        />
                                    </label>
                                ) : (
                                    <div className="p-4 bg-slate-800/50 rounded-xl">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center">
                                                <FileVideo className="w-6 h-6 text-violet-400" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-white truncate">{videoFile.name}</p>
                                                <p className="text-sm text-slate-400">
                                                    {(videoFile.size / (1024 * 1024)).toFixed(1)} MB
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setVideoFile(null)}
                                                className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                        {uploadProgress > 0 && uploadProgress < 100 && (
                                            <div className="mt-4">
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span className="text-slate-400">Yükleniyor...</span>
                                                    <span className="text-violet-400">{uploadProgress}%</span>
                                                </div>
                                                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-300"
                                                        style={{ width: `${uploadProgress}%` }}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Movie Details */}
                        <Card variant="glass">
                            <CardHeader>
                                <CardTitle className="text-lg">Film Bilgileri</CardTitle>
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
