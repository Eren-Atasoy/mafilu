"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    ArrowLeft,
    Save,
    Upload,
    FileVideo,
    Image as ImageIcon,
    X,
    Check,
    AlertCircle,
    Loader2,
    CheckCircle
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

interface Movie {
    id: string;
    title: string;
    description: string | null;
    genre: string;
    release_year: number | null;
    tags: string[] | null;
    status: string;
    bunny_video_id: string | null;
    thumbnail_url: string | null;
}

export default function EditMoviePage() {
    const router = useRouter();
    const params = useParams();
    const movieId = params.id as string;
    const supabase = createClient();

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [movie, setMovie] = useState<Movie | null>(null);

    // Form state
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [genre, setGenre] = useState("");
    const [releaseYear, setReleaseYear] = useState("");
    const [tags, setTags] = useState("");

    // Video state
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);

    // Thumbnail state
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);

    // Fetch movie data
    useEffect(() => {
        async function fetchMovie() {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    router.push("/login");
                    return;
                }

                const { data, error } = await supabase
                    .from("movies")
                    .select("*")
                    .eq("id", movieId)
                    .eq("producer_id", user.id)
                    .single();

                if (error || !data) {
                    router.push("/movies");
                    return;
                }

                setMovie(data);
                setTitle(data.title || "");
                setDescription(data.description || "");
                setGenre(data.genre || "");
                setReleaseYear(data.release_year?.toString() || "");
                setTags(data.tags?.join(", ") || "");
            } catch (err) {
                console.error(err);
                setError("Film yüklenirken bir hata oluştu");
            } finally {
                setIsLoading(false);
            }
        }

        fetchMovie();
    }, [movieId, router, supabase]);

    const handleThumbnailSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith("image/")) {
                setError("Sadece resim dosyaları yüklenebilir");
                return;
            }

            // Validate size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setError("Resim dosyası çok büyük (maksimum 5MB)");
                return;
            }

            setThumbnailFile(file);
            setError(null);
        }
    };

    const handleUploadThumbnail = async () => {
        if (!thumbnailFile || !movieId) return;

        setIsUploadingThumbnail(true);
        setError(null);

        try {
            const fileExt = thumbnailFile.name.split('.').pop();
            const fileName = `${movieId}-${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            // Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('thumbnails')
                .upload(filePath, thumbnailFile);

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('thumbnails')
                .getPublicUrl(filePath);

            // Update movie record
            const { error: updateError } = await supabase
                .from("movies")
                .update({ thumbnail_url: publicUrl })
                .eq("id", movieId);

            if (updateError) throw updateError;

            setSuccess("Kapak fotoğrafı başarıyla yüklendi!");
            setThumbnailFile(null);

            // Refresh local state
            setMovie(prev => prev ? { ...prev, thumbnail_url: publicUrl } : null);

        } catch (err: any) {
            console.error(err);
            setError(err.message || "Kapak yüklenirken bir hata oluştu");
        } finally {
            setIsUploadingThumbnail(false);
        }
    };

    const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Security: Validate file type
            const validTypes = ["video/mp4", "video/webm", "video/quicktime", "video/x-msvideo"];
            if (!validTypes.includes(file.type) && !file.type.startsWith("video/")) {
                setError("Sadece MP4, WebM, MOV veya AVI formatları desteklenir");
                return;
            }

            // Security: Validate file size (max 2GB)
            const maxSize = 2 * 1024 * 1024 * 1024; // 2GB
            if (file.size > maxSize) {
                setError("Video dosyası çok büyük (maksimum 2GB)");
                return;
            }

            // Security: Minimum file size check (prevent empty files)
            const minSize = 1024; // 1KB
            if (file.size < minSize) {
                setError("Video dosyası çok küçük");
                return;
            }

            setVideoFile(file);
            setError(null);
        }
    };

    const handleUploadVideo = async () => {
        if (!videoFile || !movieId) return;

        setIsUploading(true);
        setUploadProgress(0);
        setError(null);

        try {
            // 1. Create Video Entry & Link to Movie
            const createResponse = await fetch("/api/videos/upload", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, movieId }),
            });

            if (!createResponse.ok) {
                const data = await createResponse.json();
                throw new Error(data.error || "Create failed");
            }

            const { videoId, uploadUrl, accessKey } = await createResponse.json();

            // Security: Validate response data
            if (!videoId || !uploadUrl || !accessKey) {
                throw new Error("Upload bilgileri alınamadı");
            }

            // Security: Validate upload URL is from Bunny.net
            if (!uploadUrl.includes("video.bunnycdn.com")) {
                throw new Error("Geçersiz upload URL");
            }

            // 2. Upload Content Directly to Bunny.net (Direct Upload)
            await new Promise<void>((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                // Upload directly to Bunny.net
                xhr.open("PUT", uploadUrl, true);

                // Security: Set Bunny.net authentication header
                // Note: API key is scoped to this specific video ID only
                xhr.setRequestHeader("AccessKey", accessKey);
                xhr.setRequestHeader("Content-Type", "application/octet-stream");

                xhr.upload.onprogress = (e) => {
                    if (e.lengthComputable) {
                        const percentComplete = (e.loaded / e.total) * 100;
                        setUploadProgress(Math.round(percentComplete));
                    }
                };

                xhr.onload = () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        resolve();
                    } else {
                        try {
                            const errorText = xhr.responseText;
                            let errorMessage = `Upload failed: ${xhr.status} ${xhr.statusText}`;

                            if (xhr.status === 403) {
                                errorMessage = "Bunny.net API key yetkisi yok. Lütfen yöneticiye başvurun.";
                            } else if (xhr.status === 404) {
                                errorMessage = "Video bulunamadı. Lütfen tekrar deneyin.";
                            } else if (errorText) {
                                errorMessage = errorText;
                            }

                            reject(new Error(errorMessage));
                        } catch {
                            reject(new Error(`Upload failed: ${xhr.status} ${xhr.statusText}`));
                        }
                    }
                };

                xhr.onerror = () => reject(new Error("Network error - İnternet bağlantınızı kontrol edin"));
                xhr.ontimeout = () => reject(new Error("Upload timeout - Dosya çok büyük olabilir"));

                // Set timeout to 30 minutes for large files
                xhr.timeout = 30 * 60 * 1000;

                xhr.send(videoFile);
            });

            // 3. Update UI state (DB link is already done in step 1)
            setSuccess("Video başarıyla yüklendi!");
            setVideoFile(null);

            // Refresh movie data
            const { data } = await supabase
                .from("movies")
                .select("*")
                .eq("id", movieId)
                .single();
            if (data) setMovie(data);
        } catch (err: unknown) {
            console.error(err);
            setError(err instanceof Error ? err.message : "Video yüklenirken bir hata oluştu");
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        setError(null);
        setSuccess(null);

        try {
            const { error: updateError } = await supabase
                .from("movies")
                .update({
                    title,
                    description,
                    genre,
                    release_year: releaseYear ? parseInt(releaseYear) : null,
                    tags: tags.split(",").map(t => t.trim()).filter(Boolean),
                    updated_at: new Date().toISOString(),
                })
                .eq("id", movieId);

            if (updateError) throw updateError;

            setSuccess("Değişiklikler kaydedildi!");
        } catch (err) {
            console.error(err);
            setError("Kaydetme sırasında bir hata oluştu");
        } finally {
            setIsSaving(false);
        }
    };

    const handleSubmitForReview = async () => {
        setIsSaving(true);
        setError(null);

        try {
            const { error: updateError } = await supabase
                .from("movies")
                .update({
                    title,
                    description,
                    genre,
                    release_year: releaseYear ? parseInt(releaseYear) : null,
                    tags: tags.split(",").map(t => t.trim()).filter(Boolean),
                    status: "pending_review",
                    submitted_at: new Date().toISOString(),
                })
                .eq("id", movieId);

            if (updateError) throw updateError;

            router.push("/movies");
        } catch (err) {
            console.error(err);
            setError("Gönderme sırasında bir hata oluştu");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-[#A855F7] animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link
                    href={`/movies/${movieId}`}
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-[#A197B0] hover:text-white transition-colors"
                    style={{ background: "rgba(124, 58, 237, 0.1)" }}
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-[#F5F3FF] headline-serif">Filmi Düzenle</h1>
                    <p className="text-[#A197B0]">{movie?.title}</p>
                </div>
            </div>

            {/* Messages */}
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

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Video Upload */}
                    <Card variant="glass">
                        <CardHeader>
                            <CardTitle className="text-lg">Video Dosyası</CardTitle>
                            <CardDescription>
                                {movie?.bunny_video_id
                                    ? "Video yüklendi. Değiştirmek için yeni bir dosya seçin."
                                    : "MP4, MOV veya AVI formatında video yükleyin (maks. 5GB)"
                                }
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {movie?.bunny_video_id && !videoFile && (
                                <div className="p-4 rounded-xl mb-4" style={{
                                    background: "rgba(34, 197, 94, 0.1)",
                                    border: "1px solid rgba(34, 197, 94, 0.2)"
                                }}>
                                    <div className="flex items-center gap-3">
                                        <Check className="w-5 h-5 text-emerald-400" />
                                        <span className="text-emerald-400">Video yüklendi ve işleniyor</span>
                                    </div>
                                </div>
                            )}

                            {!videoFile ? (
                                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer hover:border-[#A855F7] transition-colors" style={{
                                    borderColor: "rgba(124, 58, 237, 0.3)",
                                    background: "rgba(21, 10, 36, 0.4)"
                                }}>
                                    <div className="flex flex-col items-center justify-center py-4">
                                        <Upload className="w-10 h-10 text-[#6B5F7C] mb-3" />
                                        <p className="mb-2 text-sm text-[#A197B0]">
                                            <span className="font-semibold text-[#A855F7]">Tıklayarak seçin</span> veya sürükleyip bırakın
                                        </p>
                                        <p className="text-xs text-[#6B5F7C]">MP4, MOV, AVI (maks. 5GB)</p>
                                    </div>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="video/*"
                                        onChange={handleVideoSelect}
                                    />
                                </label>
                            ) : (
                                <div className="p-4 rounded-xl" style={{ background: "rgba(21, 10, 36, 0.4)" }}>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{
                                            background: "rgba(124, 58, 237, 0.1)"
                                        }}>
                                            <FileVideo className="w-6 h-6 text-[#A855F7]" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-[#F5F3FF] truncate">{videoFile.name}</p>
                                            <p className="text-sm text-[#6B5F7C]">
                                                {(videoFile.size / (1024 * 1024)).toFixed(1)} MB
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setVideoFile(null)}
                                            className="p-2 text-[#6B5F7C] hover:text-red-400 transition-colors"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                    {isUploading && (
                                        <div className="mt-4">
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-[#A197B0]">Yükleniyor...</span>
                                                <span className="text-[#A855F7]">{uploadProgress}%</span>
                                            </div>
                                            <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(124, 58, 237, 0.2)" }}>
                                                <div
                                                    className="h-full transition-all duration-300"
                                                    style={{
                                                        width: `${uploadProgress}%`,
                                                        background: "linear-gradient(90deg, #7C3AED 0%, #A855F7 100%)"
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                    {!isUploading && (
                                        <Button
                                            className="mt-4 w-full"
                                            onClick={handleUploadVideo}
                                        >
                                            <Upload className="w-4 h-4" />
                                            Video Yükle
                                        </Button>
                                    )}
                                </div>
                            )}

                        </CardContent>
                    </Card>

                    {/* Thumbnail Upload */}
                    <Card variant="glass">
                        <CardHeader>
                            <CardTitle className="text-lg">Kapak Fotoğrafı</CardTitle>
                            <CardDescription>
                                {movie?.thumbnail_url
                                    ? "Kapak yüklendi. Değiştirmek için yeni bir resim seçin."
                                    : "JPG, PNG veya WEBP (maks. 5MB)"
                                }
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {movie?.thumbnail_url && !thumbnailFile && (
                                <div className="mb-4 relative w-full aspect-video rounded-xl overflow-hidden border border-[#7C3AED]/20">
                                    <img src={movie.thumbnail_url} alt="Thumbnail" className="w-full h-full object-cover" />
                                </div>
                            )}

                            {!thumbnailFile ? (
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer hover:border-[#A855F7] transition-colors" style={{
                                    borderColor: "rgba(124, 58, 237, 0.3)",
                                    background: "rgba(21, 10, 36, 0.4)"
                                }}>
                                    <div className="flex flex-col items-center justify-center py-4">
                                        <ImageIcon className="w-8 h-8 text-[#6B5F7C] mb-2" />
                                        <p className="text-sm text-[#A197B0]">
                                            <span className="font-semibold text-[#A855F7]">Fotoğraf seç</span>
                                        </p>
                                    </div>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleThumbnailSelect}
                                    />
                                </label>
                            ) : (
                                <div className="p-4 rounded-xl" style={{ background: "rgba(21, 10, 36, 0.4)" }}>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{
                                            background: "rgba(124, 58, 237, 0.1)"
                                        }}>
                                            <ImageIcon className="w-6 h-6 text-[#A855F7]" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-[#F5F3FF] truncate">{thumbnailFile.name}</p>
                                            <p className="text-sm text-[#6B5F7C]">
                                                {(thumbnailFile.size / (1024 * 1024)).toFixed(1)} MB
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setThumbnailFile(null)}
                                            className="p-2 text-[#6B5F7C] hover:text-red-400 transition-colors"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <Button
                                        className="mt-4 w-full"
                                        onClick={handleUploadThumbnail}
                                        isLoading={isUploadingThumbnail}
                                    >
                                        <Upload className="w-4 h-4" />
                                        Kapak Yükle
                                    </Button>
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
                                <label className="text-sm font-medium text-[#C4B5FD]">Açıklama</label>
                                <textarea
                                    className="flex w-full rounded-xl px-4 py-3 text-sm text-[#F5F3FF] placeholder:text-[#6B5F7C] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/50 transition-all duration-200 min-h-[120px] resize-none"
                                    style={{
                                        background: "rgba(21, 10, 36, 0.6)",
                                        border: "1px solid rgba(124, 58, 237, 0.2)",
                                    }}
                                    placeholder="Filminizin konusu ve hikayesi hakkında kısa bir açıklama yazın..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-[#C4B5FD]">Kategori</label>
                                    <select
                                        className="flex h-11 w-full rounded-xl px-4 py-2 text-sm text-[#F5F3FF] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/50 transition-all duration-200 appearance-none cursor-pointer"
                                        style={{
                                            background: "rgba(21, 10, 36, 0.6)",
                                            border: "1px solid rgba(124, 58, 237, 0.2)",
                                        }}
                                        value={genre}
                                        onChange={(e) => setGenre(e.target.value)}
                                        required
                                    >
                                        <option value="" className="bg-[#1A0B2E]">Kategori seçin</option>
                                        {genres.map((g) => (
                                            <option key={g.value} value={g.value} className="bg-[#1A0B2E]">
                                                {g.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <Input
                                    label="Yapım Yılı"
                                    type="number"
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
                    <Card variant="glass">
                        <CardHeader>
                            <CardTitle className="text-lg">İşlemler</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={handleSave}
                                isLoading={isSaving}
                            >
                                <Save className="w-4 h-4" />
                                Kaydet
                            </Button>

                            {movie?.status === "draft" && (
                                <Button
                                    className="w-full"
                                    onClick={handleSubmitForReview}
                                    isLoading={isSaving}
                                >
                                    <Check className="w-4 h-4" />
                                    İncelemeye Gönder
                                </Button>
                            )}

                            <p className="text-xs text-[#6B5F7C] text-center">
                                İncelemeye gönderilen filmler ekibimiz tarafından değerlendirilir
                            </p>
                        </CardContent>
                    </Card>

                    {/* Status Info */}
                    <Card variant="glass">
                        <CardContent className="p-6">
                            <div className="text-center">
                                <p className="text-sm text-[#A197B0]">Mevcut Durum</p>
                                <p className="text-lg font-semibold text-[#F5F3FF] mt-1 capitalize">
                                    {movie?.status === "draft" && "Taslak"}
                                    {movie?.status === "pending_review" && "İnceleniyor"}
                                    {movie?.status === "approved" && "Yayında"}
                                    {movie?.status === "rejected" && "Reddedildi"}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div >
    );
}
