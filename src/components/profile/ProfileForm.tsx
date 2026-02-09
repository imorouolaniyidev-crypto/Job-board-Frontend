'use client';

import { useState, useEffect } from 'react';
import { UserProfile } from '@/lib/types';
import { defaultUserProfile } from '@/lib/mockData';
import CVUploadSection from './CVUploadSection';
import { toast } from 'sonner';
import { Save, X } from 'lucide-react';

interface ProfileFormProps {
  initialData?: UserProfile;
  onSave?: (data: UserProfile) => void;
}

export default function ProfileForm({
  initialData = defaultUserProfile,
  onSave,
}: ProfileFormProps) {
  const [formData, setFormData] = useState<UserProfile>(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDirty, setIsDirty] = useState(false);

  // Charger depuis localStorage au mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('userProfile');
      if (saved) {
        try {
          setFormData(JSON.parse(saved));
        } catch (e) {
          console.error('Erreur chargement profil');
        }
      }
    }
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'Prénom requis';
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Nom requis';
    }

    if (formData.phone && !/^[\d\s+\-()]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Numéro de téléphone invalide';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setIsDirty(true);
    // Effacer le message d'erreur pour ce champ
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleCVUpload = (url: string, filename: string) => {
    setFormData((prev) => ({
      ...prev,
      cv_url: url,
      cv_filename: filename,
    }));
    setIsDirty(true);
  };

  const handleCVDelete = () => {
    setFormData((prev) => ({
      ...prev,
      cv_url: undefined,
      cv_filename: undefined,
    }));
    setIsDirty(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Veuillez corriger les erreurs du formulaire');
      return;
    }

    setIsSaving(true);

    // Simuler une sauvegarde
    setTimeout(() => {
      // Sauvegarder dans localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('userProfile', JSON.stringify(formData));
      }

      // Appeler le callback si fourni
      if (onSave) {
        onSave(formData);
      }

      setIsSaving(false);
      setIsDirty(false);
      toast.success('✅ Profil sauvegardé avec succès');
    }, 500);
  };

  const handleReset = () => {
    setFormData(defaultUserProfile);
    setIsDirty(false);
    setErrors({});
    toast.info('Formulaire réinitialisé');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Section 1: Informations de Base */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Informations de base
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Prénom */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prénom *
            </label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.first_name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Votre prénom"
            />
            {errors.first_name && (
              <p className="text-sm text-red-600 mt-1">{errors.first_name}</p>
            )}
          </div>

          {/* Nom */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom *
            </label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.last_name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Votre nom"
            />
            {errors.last_name && (
              <p className="text-sm text-red-600 mt-1">{errors.last_name}</p>
            )}
          </div>

          {/* Téléphone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Téléphone
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ex: 06 12 34 56 78"
            />
            {errors.phone && (
              <p className="text-sm text-red-600 mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Email (lecture seule) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email || ''}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">Non modifiable</p>
          </div>
        </div>
      </div>

      {/* Section 2: CV */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <CVUploadSection
          onUpload={handleCVUpload}
          currentCV={
            formData.cv_url
              ? { url: formData.cv_url, filename: formData.cv_filename || 'CV' }
              : undefined
          }
          onDelete={handleCVDelete}
        />
      </div>

      {/* Section 3: Formations */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Formations</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Décrivez vos formations
          </label>
          <textarea
            name="formations"
            value={formData.formations}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: Master Informatique - Université Paris, 2022&#10;Licence Développement Web - IUT, 2020"
          />
          <p className="text-xs text-gray-500 mt-1">
            Décrivez vos diplômes, écoles et dates
          </p>
        </div>
      </div>

      {/* Section 4: Expériences */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Expériences</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Décrivez vos expériences professionnelles
          </label>
          <textarea
            name="experiences"
            value={formData.experiences}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: Développeur Senior React - TechCorp, 2021-2024&#10;Développeur Full Stack - StartupXYZ, 2019-2021"
          />
          <p className="text-xs text-gray-500 mt-1">
            Listez vos postes, entreprises et périodes
          </p>
        </div>
      </div>

      {/* Section 5: Compétences */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Compétences</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Listez vos compétences
          </label>
          <textarea
            name="competences"
            value={formData.competences}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: JavaScript, React, Node.js, TypeScript, Tailwind CSS"
          />
          <p className="text-xs text-gray-500 mt-1">
            Séparez vos compétences par des virgules
          </p>
        </div>

        {/* Affichage des compétences */}
        {formData.competences && (
          <div className="pt-2">
            <p className="text-sm font-medium text-gray-700 mb-2">Aperçu :</p>
            <div className="flex flex-wrap gap-2">
              {formData.competences
                .split(',')
                .map((comp) => comp.trim())
                .filter((comp) => comp.length > 0)
                .map((comp, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                  >
                    {comp}
                  </span>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Boutons d'action */}
      <div className="flex gap-3 justify-end">
        <button
          type="button"
          onClick={handleReset}
          disabled={isSaving || !isDirty}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <X className="h-4 w-4" />
          Annuler
        </button>
        <button
          type="submit"
          disabled={isSaving || !isDirty}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="h-4 w-4" />
          {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
        </button>
      </div>
    </form>
  );
}
