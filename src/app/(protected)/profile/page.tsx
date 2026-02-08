'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store';
import { candidateApi } from '@/lib/api';
import { Candidate } from '@/lib/types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CVUploader from '@/components/CVUploader';

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const [formData, setFormData] = useState<Partial<Candidate>>({});
  const [isFormDirty, setIsFormDirty] = useState(false);
  const queryClient = useQueryClient();

  // Fetch profile data
  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: () => (user?.id ? candidateApi.getProfile(user.id) : Promise.reject('No user ID')),
    enabled: !!user?.id,
  });

  // Update profile mutation
  const updateMutation = useMutation({
    mutationFn: (data: Partial<Candidate>) =>
      user?.id ? candidateApi.updateProfile(user.id, data) : Promise.reject('No user ID'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
      setIsFormDirty(false);
      toast.success('Profil mis à jour avec succès');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour');
    },
  });

  // Initialize form with profile data
  useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setIsFormDirty(true);
  };

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const skills = e.target.value.split(',').map((s) => s.trim());
    setFormData((prev) => ({
      ...prev,
      skills: skills.filter((s) => s.length > 0),
    }));
    setIsFormDirty(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
          <p className="mt-4 text-gray-600">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-red-600">
              Erreur lors du chargement du profil. Veuillez réessayer.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mon Profil</h1>
          <p className="text-gray-600 mt-2">Gérez vos informations personnelles et professionnelles</p>
        </div>

        {/* Profile Information Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Informations Personnelles</CardTitle>
            <CardDescription>Mettez à jour vos données de profil</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName || ''}
                    onChange={handleInputChange}
                    placeholder="Jean"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Nom</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName || ''}
                    onChange={handleInputChange}
                    placeholder="Dupont"
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Email and Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email || ''}
                    disabled
                    className="mt-1 bg-gray-100"
                  />
                  <p className="text-xs text-gray-500 mt-1">Non modifiable</p>
                </div>
                <div>
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone || ''}
                    onChange={handleInputChange}
                    placeholder="+33 6 12 34 56 78"
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Skills */}
              <div>
                <Label htmlFor="skills">Compétences (séparées par des virgules)</Label>
                <Input
                  id="skills"
                  name="skills"
                  value={formData.skills?.join(', ') || ''}
                  onChange={handleSkillsChange}
                  placeholder="React, TypeScript, Node.js"
                  className="mt-1"
                />
              </div>

              {/* Experience */}
              <div>
                <Label htmlFor="experience">Expérience Professionnelle</Label>
                <textarea
                  id="experience"
                  name="experience"
                  value={formData.experience || ''}
                  onChange={handleInputChange}
                  placeholder="Décrivez votre expérience professionnelle..."
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  rows={5}
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={!isFormDirty || updateMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {updateMutation.isPending ? 'Enregistrement...' : 'Enregistrer les modifications'}
                </Button>
                {isFormDirty && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setFormData(profile || {});
                      setIsFormDirty(false);
                    }}
                  >
                    Annuler
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* CV Section */}
        <Card>
          <CardHeader>
            <CardTitle>Votre CV</CardTitle>
            <CardDescription>Gérez votre CV en format PDF</CardDescription>
          </CardHeader>
          <CardContent>
            {profile?.cvUrl && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-medium text-blue-900 mb-2">CV actuellement enregistré :</p>
                <a
                  href={profile.cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline break-all text-sm"
                >
                  {profile.cvUrl}
                </a>
              </div>
            )}
            {user?.id && <CVUploader candidateId={user.id} />}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
