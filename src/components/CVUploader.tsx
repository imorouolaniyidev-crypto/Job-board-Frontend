'use client';

import { useState, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { candidateApi } from '@/lib/api';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Upload, File, Trash2 } from 'lucide-react';

interface CVUploaderProps {
  candidateId: string;
}

export default function CVUploader({ candidateId }: CVUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  // Upload CV mutation
  const uploadMutation = useMutation({
    mutationFn: (file: File) => candidateApi.uploadCV(candidateId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', candidateId] });
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      toast.success('CV uploadé avec succès');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'upload du CV');
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (file.type !== 'application/pdf') {
      toast.error('Seuls les fichiers PDF sont acceptés');
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast.error('Le fichier dépasse 10MB');
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    uploadMutation.mutate(selectedFile);
  };

  const handleCancel = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      {/* File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        className="hidden"
        disabled={uploadMutation.isPending}
      />

      {/* Upload Area */}
      {!selectedFile ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
          <p className="text-sm font-medium text-gray-700">
            Cliquez pour sélectionner un fichier ou glissez-déposez
          </p>
          <p className="text-xs text-gray-600 mt-1">PDF uniquement, max 10MB</p>
        </div>
      ) : (
        // Selected File Preview
        <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <File className="h-8 w-8 text-red-500" />
              <div>
                <p className="font-medium text-gray-900">{selectedFile.name}</p>
                <p className="text-xs text-gray-600">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              onClick={handleCancel}
              disabled={uploadMutation.isPending}
              className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-4 flex gap-2">
            <Button
              onClick={handleUpload}
              disabled={uploadMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {uploadMutation.isPending ? 'Upload en cours...' : 'Télécharger le CV'}
            </Button>
            <Button
              onClick={handleCancel}
              variant="outline"
              disabled={uploadMutation.isPending}
            >
              Annuler
            </Button>
          </div>
        </div>
      )}

      {/* Help Text */}
      <p className="text-xs text-gray-600 mt-4">
        💡 Les fichiers PDF seront stockés sur Cloudinary et accessibles immédiatement dans votre
        profil.
      </p>
    </div>
  );
}
