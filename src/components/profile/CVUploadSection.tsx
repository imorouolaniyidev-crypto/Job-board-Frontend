'use client';

import { useRef } from 'react';
import { toast } from 'sonner';
import { Upload, File, X } from 'lucide-react';

interface CVUploadSectionProps {
  onUpload: (file: File) => void;
  currentCV?: { url?: string; filename?: string };
  pendingFileName?: string;
  onDelete?: () => void;
}

export default function CVUploadSection({
  onUpload,
  currentCV,
  pendingFileName,
  onDelete,
}: CVUploadSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Seuls les fichiers PDF sont acceptes');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Le fichier depasse 2MB');
      return;
    }

    onUpload(file);
    toast.success('CV selectionne');
  };

  const displayName = pendingFileName || currentCV?.filename;
  const displayUrl = (() => {
    const raw = currentCV?.url?.trim();
    if (!raw) return undefined;
    if (/^https?:\/\//i.test(raw)) return raw;
    const apiBase =
      process.env.NEXT_PUBLIC_API_URL ||
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      'http://localhost:3030/api';
    const apiOrigin = apiBase.replace(/\/api\/?$/, '');
    return `${apiOrigin}${raw.startsWith('/') ? '' : '/'}${raw}`;
  })();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">CV (PDF)</h3>

      {displayName ? (
        <div className="flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="flex items-center gap-3">
            <File className="h-6 w-6 text-blue-600" />
            <div>
              <p className="font-medium text-gray-900">{displayName}</p>
              <p className="text-xs text-gray-600">
                {pendingFileName ? 'Fichier en attente d\'envoi' : 'CV actuel'}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {displayUrl ? (
              <a
                href={displayUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-blue-600 px-3 py-2 text-sm text-white transition-colors hover:bg-blue-700"
              >
                Voir
              </a>
            ) : null}
            {onDelete ? (
              <button
                onClick={() => {
                  onDelete();
                  toast.success('CV supprime');
                }}
                className="flex items-center gap-2 rounded-lg bg-red-100 px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-200"
              >
                <X className="h-4 w-4" />
                Supprimer
              </button>
            ) : null}
          </div>
        </div>
      ) : null}

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        className="hidden"
      />

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="w-full cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-8 text-center transition-colors hover:border-blue-500 hover:bg-blue-50"
      >
        <Upload className="mx-auto mb-2 h-10 w-10 text-gray-400" />
        <p className="font-medium text-gray-700">Cliquez pour selectionner un CV</p>
        <p className="mt-1 text-sm text-gray-600">PDF uniquement, max 2MB</p>
      </button>
    </div>
  );
}
