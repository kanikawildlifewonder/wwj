import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucketName = process.env.R2_BUCKET_NAME;
const publicUrl = process.env.R2_PUBLIC_URL || "https://media.wildlifewonderjewellery.com";

export const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: accessKeyId || "",
    secretAccessKey: secretAccessKey || "",
  },
});

/**
 * Uploads a file buffer or stream to Cloudflare R2 bucket.
 * 
 * @param file - File content as Buffer or Uint8Array
 * @param key - Destination key (path) in the bucket
 * @param contentType - MIME type of the file
 */
export async function uploadToR2(
  file: Buffer | Uint8Array,
  key: string,
  contentType: string
): Promise<{ success: boolean; url?: string; error?: string }> {
  if (!accountId || !accessKeyId || !secretAccessKey || !bucketName) {
    return {
      success: false,
      error: "Cloudflare R2 is not fully configured in environment variables.",
    };
  }

  try {
    const cleanKey = key.startsWith("/") ? key.substring(1) : key;
    
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: cleanKey,
      Body: file,
      ContentType: contentType,
    });

    await r2Client.send(command);

    const cleanPublicUrl = publicUrl.replace(/\/$/, "");
    const finalUrl = `${cleanPublicUrl}/${cleanKey}`;

    return {
      success: true,
      url: finalUrl,
    };
  } catch (error) {
    console.error("Cloudflare R2 upload failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to upload file to Cloudflare R2",
    };
  }
}
