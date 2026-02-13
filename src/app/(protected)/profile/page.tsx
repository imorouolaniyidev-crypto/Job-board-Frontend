'use client';

import ProfileForm from '@/components/profile/ProfileForm';
import { UserProfile } from '@/lib/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { profileApi } from '@/lib/api';
import { defaultUserProfile } from '@/lib/mockData';
import { useAuthStore } from '@/lib/store';

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['my-profile'],
    queryFn: profileApi.getMyProfile,
    enabled: Boolean(user),
    staleTime: 60 * 1000,
  });

  const profileData: UserProfile = {
    ...defaultUserProfile,
    ...(data ?? {}),
    user_id: data?.user_id || user?.id || defaultUserProfile.user_id,
    first_name: data?.first_name || defaultUserProfile.first_name,
    last_name: data?.last_name || defaultUserProfile.last_name,
    phone: data?.phone || defaultUserProfile.phone,
    // Email vient du user connecté (table user), pas de profile.
    email: user?.email || data?.email || defaultUserProfile.email,
    experiences: data?.experiences || defaultUserProfile.experiences,
    formations: data?.formations || defaultUserProfile.formations,
    competences: data?.competences || defaultUserProfile.competences,
  };

  const saveMutation = useMutation({
    mutationFn: (vars: { payload: UserProfile; cvFile?: File | null }) =>
      profileApi.updateMyProfile(vars.payload, vars.cvFile ?? undefined),
    onSuccess: (updated) => {
      queryClient.setQueryData(['my-profile'], updated);
    },
  });

  const handleSaveProfile = async (payload: UserProfile, cvFile?: File | null) => {
    if (!user) return;
    const updated = await saveMutation.mutateAsync({ payload, cvFile });
    await queryClient.invalidateQueries({ queryKey: ['my-profile'] });
    return updated;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b border-gray-200 bg-white px-4 py-6">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold text-gray-900">Mon Profil</h1>
          <p className="mt-2 text-gray-600">
            Completez votre profil pour ameliorer vos chances de candidature
          </p>
        </div>
      </div>

      <div className="px-4 py-8">
        <div className="container mx-auto max-w-4xl">
          {!user ? (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-8 text-center text-amber-700">
              Session introuvable. Veuillez vous reconnecter.
            </div>
          ) : null}

          {isLoading ? (
            <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-600">
              Chargement du profil...
            </div>
          ) : null}

          {error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center text-red-700">
              {error instanceof Error ? error.message : 'Impossible de charger votre profil depuis le backend.'}
            </div>
          ) : null}

          {user && !isLoading && !error ? (
            <ProfileForm initialData={profileData} onSave={handleSaveProfile} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
