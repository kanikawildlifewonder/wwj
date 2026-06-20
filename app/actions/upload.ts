'use server'

import { requireAdmin } from '@/lib/auth-guard'
import { uploadToR2 } from '@/lib/storage'

export async function uploadImage(formData: FormData) {
  try {
    await requireAdmin()
    
    const file = formData.get('image') as File;
    if (!file) {
      return { success: false, error: 'No file provided' };
    }

    const folder = formData.get('folder') as string || 'misc';

    // Server-side validation
    const mimeType = file.type.toLowerCase();
    const size = file.size;

    const isImage = mimeType.startsWith("image/");
    const isVideo = mimeType.startsWith("video/");

    if (!isImage && !isVideo) {
      return { success: false, error: `Unsupported file type: ${mimeType}` };
    }

    if (isImage) {
      const allowedImageTypes = ["image/jpeg", "image/png", "image/webp", "image/avif"];
      if (!allowedImageTypes.includes(mimeType)) {
        return { success: false, error: `Allowed image types are jpeg, png, webp, avif. Got: ${mimeType}` };
      }
      if (size > 5 * 1024 * 1024) {
        return { success: false, error: "Image size exceeds the 5MB limit." };
      }
    }

    if (isVideo) {
      const allowedVideoTypes = ["video/mp4", "video/webm"];
      if (!allowedVideoTypes.includes(mimeType)) {
        return { success: false, error: `Allowed video types are mp4, webm. Got: ${mimeType}` };
      }
      if (size > 50 * 1024 * 1024) {
        return { success: false, error: "Video size exceeds the 50MB limit." };
      }
    }

    // Convert file to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Format unique filename and key
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const sanitizedFilename = `${uniqueSuffix}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
    const cleanFolder = folder.replace(/^\/|\/$/g, "");
    const key = cleanFolder ? `${cleanFolder}/${sanitizedFilename}` : sanitizedFilename;

    // Upload to Cloudflare R2
    const uploadResult = await uploadToR2(buffer, key, mimeType);
    if (!uploadResult.success) {
      return { success: false, error: uploadResult.error || "Upload to Cloudflare R2 failed" };
    }

    return { 
      success: true, 
      url: uploadResult.url 
    };

  } catch (error) {
    console.error('Failed to upload media:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to upload media' };
  }
}
