import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dowmnaaetqugtfoekkxq.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY is not defined');
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function uploadToSupabase(file: Buffer, filename: string, contentType: string): Promise<string> {
  const uniqueFilename = `${Date.now()}-${filename.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
  
  const { data, error } = await supabase.storage
    .from('portfolio')
    .upload(uniqueFilename, file, {
      contentType,
      upsert: true,
      cacheControl: '3600'
    });

  if (error) {
    console.error('Supabase upload error:', error);
    throw new Error(`Upload failed: ${error.message}`);
  }

  const { data: urlData } = supabase.storage
    .from('portfolio')
    .getPublicUrl(uniqueFilename);

  // Return the public URL. Note: For this to work, the 'portfolio' bucket 
  // must have "Public" access enabled in the Supabase Dashboard.
  return urlData.publicUrl;
}

export async function deleteFromSupabase(filename: string): Promise<void> {
  const { error } = await supabase.storage
    .from('portfolio')
    .remove([filename]);

  if (error) {
    console.error('Supabase delete error:', error);
    throw new Error(`Delete failed: ${error.message}`);
  }
}

export async function getSignedUrl(filename: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from('portfolio')
    .createSignedUrl(filename, 3600);

  if (error) {
    throw new Error(`Failed to get signed URL: ${error.message}`);
  }

  return data.signedUrl;
}
