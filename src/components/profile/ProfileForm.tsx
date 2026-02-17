'use client';

import { useState } from 'react';
import { UserProfile } from '@/lib/types';
import { defaultUserProfile } from '@/lib/mockData';
import CVUploadSection from './CVUploadSection';
import { toast } from 'sonner';
import { Save, X } from 'lucide-react';

interface ProfileFormProps {
  initialData?: UserProfile;
  onSave?: (
    data: UserProfile,
    cvFile?: File | null
  ) => void | UserProfile | Promise<void | UserProfile>;
}

export default function ProfileForm({ initialData = defaultUserProfile, onSave }: ProfileFormProps) {
  const [formData, setFormData] = useState<UserProfile>(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDirty, setIsDirty] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'Prenom requis';
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Nom requis';
    }

    if (formData.phone && !/^[\d\s+\-()]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Numero de telephone invalide';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setIsDirty(true);

    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleCVUpload = (file: File) => {
    setCvFile(file);
    setFormData((prev) => ({
      ...prev,
      cv_filename: file.name,
      cv_url: undefined,
    }));
    setIsDirty(true);
  };

  const handleCVDelete = () => {
    setCvFile(null);
    setFormData((prev) => ({
      ...prev,
      cv_url: undefined,
      cv_filename: undefined,
    }));
    setIsDirty(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Veuillez corriger les erreurs du formulaire');
      return;
    }

    setIsSaving(true);
    try {
      const savedData = await onSave?.(formData, cvFile);
      if (savedData) {
        setFormData((prev) => ({
          ...prev,
          ...savedData,
          email: savedData.email || prev.email,
        }));
      }
      setCvFile(null);
      setIsDirty(false);
      toast.success('Profil sauvegarde avec succes');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la sauvegarde';
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setFormData(initialData);
    setCvFile(null);
    setIsDirty(false);
    setErrors({});
    toast.info('Formulaire reinitialise');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-gray-900">Informations de base</h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Prenom *</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleInputChange}
              className={`w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.first_name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Votre prenom"
            />
            {errors.first_name ? <p className="mt-1 text-sm text-red-600">{errors.first_name}</p> : null}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Nom *</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleInputChange}
              className={`w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.last_name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Votre nom"
            />
            {errors.last_name ? <p className="mt-1 text-sm text-red-600">{errors.last_name}</p> : null}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Telephone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={`w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ex: 06 12 34 56 78"
            />
            {errors.phone ? <p className="mt-1 text-sm text-red-600">{errors.phone}</p> : null}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={formData.email || ''}
              disabled
              className="w-full cursor-not-allowed rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-500"
            />
            <p className="mt-1 text-xs text-gray-500">Non modifiable</p>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <CVUploadSection
          onUpload={handleCVUpload}
          currentCV={formData.cv_url ? { url: formData.cv_url, filename: formData.cv_filename || 'CV' } : undefined}
          pendingFileName={cvFile?.name}
          onDelete={handleCVDelete}
        />
      </div>

      <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-gray-900">Formations</h2>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Decrivez vos formations</label>
          <textarea
            name="formations"
            value={formData.formations}
            onChange={handleInputChange}
            rows={4}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: Master Informatique - Universite Paris, 2022"
          />
          <p className="mt-1 text-xs text-gray-500">Diplomes, ecoles et dates</p>
        </div>
      </div>

      <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-gray-900">Experiences</h2>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Decrivez vos experiences professionnelles
          </label>
          <textarea
            name="experiences"
            value={formData.experiences}
            onChange={handleInputChange}
            rows={4}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: Developpeur React - TechCorp, 2021-2024"
          />
          <p className="mt-1 text-xs text-gray-500">Postes, entreprises et periodes</p>
        </div>
      </div>

      <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-gray-900">Competences</h2>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Listez vos competences</label>
          <textarea
            name="competences"
            value={formData.competences}
            onChange={handleInputChange}
            rows={3}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: JavaScript, React, Node.js, TypeScript"
          />
          <p className="mt-1 text-xs text-gray-500">Separez par des virgules</p>
        </div>

        {formData.competences ? (
          <div className="pt-2">
            <p className="mb-2 text-sm font-medium text-gray-700">Apercu:</p>
            <div className="flex flex-wrap gap-2">
              {formData.competences
                .split(',')
                .map((comp) => comp.trim())
                .filter((comp) => comp.length > 0)
                .map((comp, idx) => (
                  <span
                    key={idx}
                    className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700"
                  >
                    {comp}
                  </span>
                ))}
            </div>
          </div>
        ) : null}
      </div>

      <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
        <button
          type="button"
          onClick={handleReset}
          disabled={isSaving || !isDirty}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 px-6 py-2 text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          <X className="h-4 w-4" />
          Annuler
        </button>
        <button
          type="submit"
          disabled={isSaving || !isDirty}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          <Save className="h-4 w-4" />
          {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
        </button>
      </div>
    </form>
  );
}
