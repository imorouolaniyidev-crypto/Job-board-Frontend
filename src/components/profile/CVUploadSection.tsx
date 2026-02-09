'use client';

import { CldUploadWidget } from 'next-cloudinary';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Upload, File, X } from 'lucide-react';

interface CVUploadSectionProps {
  onUpload: (url: string, filename: string) => void;
  currentCV?: { url: string; filename: string };
  onDelete?: () => void;
}

export default function CVUploadSection({
  onUpload,
  currentCV,
  onDelete,
}: CVUploadSectionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadPreset, setUploadPreset] = useState<string | null>(null);

  // On récupère la variable d'environnement côté client seulement
  useEffect(() => {
    setUploadPreset(process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || null);
  }, []);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">CV (PDF)</h3>

      {/* CV Actuel */}
      {currentCV?.url && (
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <File className="h-6 w-6 text-blue-600" />
            <div>
              <p className="font-medium text-gray-900">{currentCV.filename}</p>
              <p className="text-xs text-gray-600">CV actuel</p>
            </div>
          </div>
          <div className="flex gap-2">
            <a
              href={currentCV.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Voir
            </a>
            {onDelete && (
              <button
                onClick={() => {
                  onDelete();
                  toast.success('CV supprimé');
                }}
                className="px-3 py-2 text-sm bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Supprimer
              </button>
            )}
          </div>
        </div>
      )}

      {/* Upload Widget Cloudinary */}
      {uploadPreset ? (
        <CldUploadWidget
          uploadPreset={uploadPreset}
          onSuccess={(result: any) => {
            onUpload(result.info.secure_url, result.info.original_filename);
            toast.success('CV uploadé avec succès');
          }}
          onError={() => toast.error("Erreur lors de l'upload du CV")}
          options={{
            resourceType: 'auto',
            folder: 'job-board/cvs',
          }}
        >
          {({ open }) => (
            <button
              onClick={() => {
                open();
              }}
              disabled={isLoading}
              className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors disabled:opacity-50"
            >
              <Upload className="mx-auto h-10 w-10 text-gray-400 mb-2" />
              <p className="font-medium text-gray-700">Cliquez pour uploader un CV</p>
              <p className="text-sm text-gray-600 mt-1">PDF uniquement, max 10MB</p>
            </button>
          )}
        </CldUploadWidget>
      ) : (
        <p className="text-red-600 text-sm">
          Cloudinary non configuré - variable d'environnement manquante
        </p>
      )}
    </div>
  );
}
