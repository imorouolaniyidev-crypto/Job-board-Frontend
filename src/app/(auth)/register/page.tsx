'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, persistAuthTokenFromPayload } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import axios from 'axios';
import { Briefcase, Home, LogIn, Users, UserPlus } from 'lucide-react';
import ProfileDropdown from '@/components/navbar/ProfileDropdown';

type AuthUser = { id: string; email: string; role: 'ADMIN' | 'CANDIDATE' };

export default function RegisterPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const setAuth = useAuthStore((state) => state.setAuth);
  const [loading, setLoading] = useState(false);
  const role: 'ADMIN' | 'CANDIDATE' = 'CANDIDATE';
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) return 'Le mot de passe doit contenir au moins 8 caracteres';
    if (!/[A-Z]/.test(password)) return 'Le mot de passe doit contenir au moins une majuscule';
    if (!/[0-9]/.test(password)) return 'Le mot de passe doit contenir au moins un chiffre';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    setErrors({});
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get('email') || '');
    const password = String(formData.get('password') || '');

    if (!email) {
      newErrors.email = "L'email est requis";
    }
    if (!password) {
      newErrors.password = 'Le mot de passe est requis';
    } else {
      const passwordError = validatePassword(password);
      if (passwordError) newErrors.password = passwordError;
    }
    if (!termsAccepted) {
      newErrors.terms = "Vous devez accepter les conditions d'utilisation";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/auth/register', { email, password, role });
      persistAuthTokenFromPayload(response?.data);
      const payload = response?.data as
        | { user?: AuthUser; data?: { user?: AuthUser } }
        | undefined;
      const createdUser = payload?.user || payload?.data?.user;

      if (createdUser) {
        setAuth(createdUser);
      }

      toast.success('Compte cree avec succes !');
      router.push('/');
      router.refresh();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || "Erreur lors de l'inscription";
        if (error.response?.status === 409) {
          newErrors.email = 'Cet email est deja utilise';
        } else {
          toast.error(errorMessage);
        }
      } else {
        toast.error('Une erreur inattendue est survenue');
      }
      setErrors(newErrors);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <nav className="sticky top-0 z-50 bg-white/95 shadow backdrop-blur">
        <div className="container mx-auto flex items-center justify-between p-4">
         qaé&
          <ul className="flex items-center space-x-5 text-base font-semibold text-[#0a1530] md:text-[17px]">
            <Link href="/" className="flex cursor-pointer items-center gap-1.5 hover:underline">
              <Home size={16} />
              Accueil
            </Link>
            <Link href="/" className="flex cursor-pointer items-center gap-1.5 hover:underline">
              <Briefcase size={16} />
              Offres
            </Link>
            <Link href="/candidats" className="flex cursor-pointer items-center gap-1.5 hover:underline">
              <Users size={16} />
              Candidats
            </Link>
            {user?.role === 'CANDIDATE' ? (
              <ProfileDropdown />
            ) : (
              <Link href="/login" className="flex cursor-pointer items-center gap-1.5 hover:underline">
                <LogIn size={16} />
                Se connecter
              </Link>
            )}
          </ul>
        </div>
      </nav>

      <main className="container mx-auto grid min-h-[calc(100vh-88px)] place-items-center p-4">
        <Card className="w-full max-w-md border-slate-200 shadow-xl">
          <CardHeader className="space-y-2 text-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-[#2c3e6e] text-white">
              <UserPlus size={24} />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-900">Creer un compte</CardTitle>
            <CardDescription>Rejoignez la plateforme Job Board</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="nom@exemple.com"
                  required
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email ? <p className="text-sm text-red-500">{errors.email}</p> : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Min 8 caracteres, 1 majuscule, 1 chiffre"
                  required
                  className={errors.password ? 'border-red-500' : ''}
                />
                {errors.password ? <p className="text-sm text-red-500">{errors.password}</p> : null}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={termsAccepted}
                  onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                />
                <Label htmlFor="terms" className="cursor-pointer font-normal">
                  J&apos;accepte les{' '}
                  <a href="#" className="text-[#2c3e6e] underline">
                    conditions d&apos;utilisation
                  </a>
                </Label>
              </div>
              {errors.terms ? <p className="text-sm text-red-500">{errors.terms}</p> : null}

              <Button
                type="submit"
                className="w-full bg-[#2c3e6e] hover:bg-[#223159]"
                disabled={loading || !termsAccepted}
              >
                {loading ? 'Creation en cours...' : "S'inscrire"}
              </Button>

              <Link href="/login" className="block">
                <Button type="button" variant="outline" className="w-full">
                  Deja un compte ? Se connecter
                </Button>
              </Link>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
