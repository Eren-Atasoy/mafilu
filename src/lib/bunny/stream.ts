/**
 * Bunny.net Stream API Service
 * 
 * Handles video uploading, processing, and playback via Bunny.net Stream
 * 
 * Required environment variables:
 * - BUNNY_STREAM_API_KEY: API key from Bunny.net dashboard
 * - BUNNY_STREAM_LIBRARY_ID: Video library ID
 * - NEXT_PUBLIC_BUNNY_CDN_URL: CDN hostname for playback
 */

const BUNNY_API_BASE = "https://video.bunnycdn.com";

interface BunnyVideoCreateResponse {
    videoLibraryId: number;
    guid: string;
    title: string;
    dateUploaded: string;
    status: number;
    storageSize: number;
    thumbnailFileName: string;
    length: number;
    width: number;
    height: number;
    availableResolutions: string;
    framerate: number;
    isPublic: boolean;
}

interface BunnyVideoStatus {
    guid: string;
    status: number; // 0: created, 1: uploading, 2: processing, 3: transcoding, 4: finished, 5: error
    encodeProgress: number;
    storageSize: number;
    length: number;
    width: number;
    height: number;
    availableResolutions: string;
}

interface BunnyUploadResult {
    success: boolean;
    videoId: string;
    uploadUrl?: string;
    error?: string;
}

class BunnyStreamService {
    private apiKey: string;
    private libraryId: string;
    private cdnUrl: string;

    constructor() {
        this.apiKey = process.env.BUNNY_STREAM_API_KEY || "";
        this.libraryId = process.env.BUNNY_STREAM_LIBRARY_ID || "";
        this.cdnUrl = process.env.NEXT_PUBLIC_BUNNY_CDN_URL || "";

        if (!this.apiKey || !this.libraryId) {
            console.warn("⚠️ Bunny.net credentials not configured. Video features will be limited.");
        }
    }

    /**
     * Check if Bunny.net is properly configured
     */
    isConfigured(): boolean {
        return !!(this.apiKey && this.libraryId);
    }

    /**
     * Create a new video entry and get upload URL
     */
    async createVideo(title: string): Promise<BunnyUploadResult> {
        if (!this.isConfigured()) {
            return { success: false, videoId: "", error: "Bunny.net not configured" };
        }

        try {
            // Step 1: Create video entry
            const createResponse = await fetch(
                `${BUNNY_API_BASE}/library/${this.libraryId}/videos`,
                {
                    method: "POST",
                    headers: {
                        "AccessKey": this.apiKey,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ title }),
                }
            );

            if (!createResponse.ok) {
                const error = await createResponse.text();
                console.error("Bunny create video error:", {
                    status: createResponse.status,
                    statusText: createResponse.statusText,
                    error,
                    libraryId: this.libraryId,
                });

                let errorMessage = "Failed to create video entry";
                if (createResponse.status === 403) {
                    errorMessage = "Bunny.net API key yetkisi yok. API key ve Library ID'yi kontrol edin.";
                } else if (createResponse.status === 401) {
                    errorMessage = "Bunny.net API key geçersiz. API key'i kontrol edin.";
                }

                return { success: false, videoId: "", error: errorMessage };
            }

            const video: BunnyVideoCreateResponse = await createResponse.json();

            // Step 2: Generate TUS upload URL
            const uploadUrl = `${BUNNY_API_BASE}/library/${this.libraryId}/videos/${video.guid}`;

            return {
                success: true,
                videoId: video.guid,
                uploadUrl,
            };
        } catch (error) {
            console.error("Bunny.net create video error:", error);
            return { success: false, videoId: "", error: "Network error" };
        }
    }

    /**
     * Upload video file directly (for smaller files < 100MB)
     */
    async uploadVideo(videoId: string, file: ArrayBuffer): Promise<{ success: boolean; error?: string }> {
        if (!this.isConfigured()) {
            return { success: false, error: "Bunny.net not configured" };
        }

        try {
            const blob = new Blob([file], { type: "application/octet-stream" });
            const response = await fetch(
                `${BUNNY_API_BASE}/library/${this.libraryId}/videos/${videoId}`,
                {
                    method: "PUT",
                    headers: {
                        "AccessKey": this.apiKey,
                        "Content-Type": "application/octet-stream",
                    },
                    body: blob,
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Bunny.net upload error:", {
                    status: response.status,
                    statusText: response.statusText,
                    error: errorText,
                    videoId,
                    libraryId: this.libraryId,
                });

                let errorMessage = `Bunny.net upload failed: ${response.status} ${response.statusText}`;
                if (response.status === 403) {
                    errorMessage = "Bunny.net API key yetkisi yok. API key ve Library ID'yi kontrol edin.";
                } else if (response.status === 404) {
                    errorMessage = "Video bulunamadı. Video ID'yi kontrol edin.";
                }

                return { success: false, error: errorMessage };
            }

            return { success: true };
        } catch (error) {
            console.error("Bunny.net upload error:", error);
            return { success: false, error: error instanceof Error ? error.message : "Network error" };
        }
    }

    /**
     * Get video processing status
     */
    async getVideoStatus(videoId: string): Promise<BunnyVideoStatus | null> {
        if (!this.isConfigured()) return null;

        try {
            const response = await fetch(
                `${BUNNY_API_BASE}/library/${this.libraryId}/videos/${videoId}`,
                {
                    headers: {
                        "AccessKey": this.apiKey,
                    },
                }
            );

            if (!response.ok) return null;

            return response.json();
        } catch (error) {
            console.error("Bunny.net status error:", error);
            return null;
        }
    }

    /**
     * Delete a video
     */
    async deleteVideo(videoId: string): Promise<boolean> {
        if (!this.isConfigured()) return false;

        try {
            const response = await fetch(
                `${BUNNY_API_BASE}/library/${this.libraryId}/videos/${videoId}`,
                {
                    method: "DELETE",
                    headers: {
                        "AccessKey": this.apiKey,
                    },
                }
            );

            return response.ok;
        } catch (error) {
            console.error("Bunny.net delete error:", error);
            return false;
        }
    }

    /**
     * Get playback URL for a video
     */
    getPlaybackUrl(videoId: string): string {
        if (!this.cdnUrl) {
            return `https://iframe.mediadelivery.net/embed/${this.libraryId}/${videoId}`;
        }
        return `https://${this.cdnUrl}/${videoId}/playlist.m3u8`;
    }

    /**
     * Get thumbnail URL for a video
     */
    getThumbnailUrl(videoId: string): string {
        if (!this.cdnUrl) {
            return `https://vz-${this.libraryId}.b-cdn.net/${videoId}/thumbnail.jpg`;
        }
        return `https://${this.cdnUrl}/${videoId}/thumbnail.jpg`;
    }

    /**
     * Get embed iframe URL
     */
    getEmbedUrl(videoId: string, autoplay = false): string {
        const params = autoplay ? "?autoplay=true" : "";
        return `https://iframe.mediadelivery.net/embed/${this.libraryId}/${videoId}${params}`;
    }

    /**
     * Get direct upload signature for client-side uploads
     * This allows large file uploads directly from browser to Bunny.net
     */
    async getDirectUploadUrl(title: string): Promise<{
        videoId: string;
        uploadUrl: string;
        authorizationSignature: string;
        authorizationExpire: number;
        libraryId: string;
    } | null> {
        if (!this.isConfigured()) return null;

        try {
            // Create video first
            const createResult = await this.createVideo(title);
            if (!createResult.success || !createResult.videoId) return null;

            // Generate expiration (24 hours from now)
            const expirationTime = Math.floor(Date.now() / 1000) + 86400;

            return {
                videoId: createResult.videoId,
                uploadUrl: `${BUNNY_API_BASE}/library/${this.libraryId}/videos/${createResult.videoId}`,
                authorizationSignature: this.apiKey, // In production, use signed URLs
                authorizationExpire: expirationTime,
                libraryId: this.libraryId,
            };
        } catch (error) {
            console.error("Bunny.net direct upload error:", error);
            return null;
        }
    }
}

// Export singleton instance
export const bunnyStream = new BunnyStreamService();

// Export types
export type { BunnyVideoCreateResponse, BunnyVideoStatus, BunnyUploadResult };
