export const cloudinaryConfig = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
};

export async function validatePDFFile(file: File): Promise<{ valid: boolean; error?: string }> {
  // Vérifier type
  if (file.type !== 'application/pdf') {
    return { valid: false, error: 'Seuls les fichiers PDF sont acceptés' };
  }

  // Vérifier taille (max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return { valid: false, error: 'Le fichier dépasse 10MB' };
  }

  return { valid: true };
}

export function getFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}
