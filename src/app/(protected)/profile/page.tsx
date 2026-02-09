'use client';

import ProfileForm from '@/components/profile/ProfileForm';
import { UserProfile } from '@/lib/types';

export default function ProfilePage() {
  const handleSaveProfile = (data: UserProfile) => {
    // Les données sont sauvegardées dans localStorage par le formulaire
    // En production, ce serait envoyé à l'API backend
    console.log('Profil sauvegardé:', data);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-6 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold text-gray-900">Mon Profil</h1>
          <p className="text-gray-600 mt-2">
            Complétez votre profil pour améliorer vos chances de candidature
          </p>
        </div>
      </div>

      {/* Formulaire */}
      <div className="py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <ProfileForm onSave={handleSaveProfile} />
        </div>
      </div>
    </div>
  );
}
