'use server'

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Note: Using anon key for server-side upload requires RLS policies to allow inserts to the storage bucket.
// If RLS fails, ensure you have a public bucket named "products" with an insert policy for anon users,
// or use a Service Role Key.
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function uploadImage(formData: FormData) {
  try {
    const file = formData.get('image') as File;
    if (!file) {
      return { success: false, error: 'No file provided' };
    }

    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const filename = `${uniqueSuffix}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;

    let targetBucket = 'product';

    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    if (!bucketsError && buckets && buckets.length > 0) {
      console.log("Available buckets:", buckets.map(b => b.id));
      // check if PRODUCT exists
      const exists = buckets.some(b => b.id === 'PRODUCT');
      if (!exists) {
        targetBucket = buckets[0].id; // fallback to the first available bucket
        console.log("Fallback to bucket:", targetBucket);
      }
    }

    let { error } = await supabase
      .storage
      .from(targetBucket)
      .upload(filename, file, {
        cacheControl: '31536000',
        upsert: false
      })

    if (error && error.message === 'Bucket not found') {
      console.log("Bucket not found, trying lowercase 'product'...");
      targetBucket = targetBucket.toLowerCase();
      const retryResult = await supabase.storage.from(targetBucket).upload(filename, file, { cacheControl: '31536000', upsert: false });
      error = retryResult.error;
    }

    if (error) {
      console.error('Supabase Storage Error:', error);
      return { success: false, error: `Upload failed: ${error.message}. (Attempted bucket: ${targetBucket})` };
    }

    // Get public URL
    const { data: publicUrlData } = supabase
      .storage
      .from(targetBucket)
      .getPublicUrl(filename)

    return { success: true, url: publicUrlData.publicUrl };
  } catch (error) {
    console.error('Failed to upload image:', error);
    return { success: false, error: 'Failed to upload image' };
  }
}
