'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { X } from 'lucide-react';
import type { Candidate, CandidateStatus } from '@/lib/types';

interface CandidateFormProps {
  candidate?: Candidate;
  onSave: (candidate: Candidate) => void;
  onCancel: () => void;
}

export default function CandidateForm({ candidate, onSave, onCancel }: CandidateFormProps) {
  const [formData, setFormData] = useState<Candidate>(
    candidate || {
      id: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      skills: [],
      experience: '',
      cvUrl: '',
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      applicationsCount: 0,
    }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Validation
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Le prénom est requis';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Le nom est requis';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!formData.email.includes('@')) {
      newErrors.email = 'L\'email est invalide';
    }

    if (!formData.experience?.trim()) {
      newErrors.experience = 'L\'expérience est requise';
    } else if (formData.experience.length < 10) {
      newErrors.experience = 'Minimum 10 caractères';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      onSave({
        ...formData,
        skills: formData.skills || [],
        updatedAt: new Date().toISOString(),
      });
      setIsLoading(false);
    }, 500);
  };

  const handleSkillsChange = (value: string) => {
    const skills = value
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);
    setFormData({ ...formData, skills });
  };

  const isEditing = !!candidate;

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950">
          <h2 className="text-xl font-bold">
            {isEditing ? 'Éditer le candidat' : 'Ajouter un candidat'}
          </h2>
          <button
            onClick={onCancel}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Personal Information */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Informations personnelles
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="firstName">Prénom *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="Jean"
                  className={errors.firstName ? 'border-red-500' : ''}
                />
                {errors.firstName && (
                  <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>
                )}
              </div>
              <div>
                <Label htmlFor="lastName">Nom *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="Dupont"
                  className={errors.lastName ? 'border-red-500' : ''}
                />
                {errors.lastName && (
                  <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Informations de contact
            </h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email * {isEditing && '(non modifiable)'}</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="jean.dupont@email.com"
                  disabled={isEditing}
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                )}
              </div>
              <div>
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  value={formData.phone || ''}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+33 6 12 34 56 78"
                />
              </div>
            </div>
          </div>

          {/* Skills */}
          <div>
            <Label htmlFor="skills">Compétences</Label>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              Séparées par des virgules
            </p>
            <Input
              id="skills"
              value={(formData.skills || []).join(', ')}
              onChange={e => handleSkillsChange(e.target.value)}
              placeholder="React, TypeScript, Tailwind CSS"
            />
          </div>

          {/* Experience */}
          <div>
            <Label htmlFor="experience">Expérience *</Label>
            <textarea
              id="experience"
              value={formData.experience || ''}
              onChange={e => setFormData({ ...formData, experience: e.target.value })}
              placeholder="Décrivez votre expérience professionnelle..."
              rows={4}
              className={`w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.experience ? 'border-red-500' : ''}`}
            />
            {errors.experience && (
              <p className="text-xs text-red-500 mt-1">{errors.experience}</p>
            )}
          </div>

          {/* CV URL */}
          <div>
            <Label htmlFor="cvUrl">URL du CV</Label>
            <Input
              id="cvUrl"
              type="url"
              value={formData.cvUrl || ''}
              onChange={e => setFormData({ ...formData, cvUrl: e.target.value })}
              placeholder="https://storage.example.com/cv/..."
            />
          </div>

          {/* Status */}
          <div>
            <Label htmlFor="status">Statut</Label>
            <Select
              value={formData.status}
              onValueChange={value => setFormData({ ...formData, status: value as CandidateStatus })}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Sélectionner un statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Actif</SelectItem>
                <SelectItem value="REVIEWING">En révision</SelectItem>
                <SelectItem value="REJECTED">Rejeté</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 pt-4 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? '⏳ Enregistrement...' : isEditing ? 'Modifier' : 'Créer'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
