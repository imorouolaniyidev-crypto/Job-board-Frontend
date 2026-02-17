'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import { api, persistAuthTokenFromPayload } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import axios from 'axios';
import { Briefcase, Home, LogIn, Users, UserCircle } from 'lucide-react';
import ProfileDropdown from '@/components/navbar/ProfileDropdown';
import UserMobileMenu from '@/components/navbar/UserMobileMenu';

type AuthUser = { id: string; email: string; role: 'ADMIN' | 'CANDIDATE' };

export default function LoginPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const setAuth = useAuthStore((state) => state.setAuth);
  const fetchMe = useAuthStore((state) => state.fetchMe);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const newErrors: Record<string, string> = {};
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get('email') || '');
    const password = String(formData.get('password') || '');

    if (!email) newErrors.email = 'Veuillez entrer votre email';
    if (!password) newErrors.password = 'Veuillez entrer votre mot de passe';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/auth/login', { email, password });
      persistAuthTokenFromPayload(response?.data);
      const payload = response?.data as
        | { user?: AuthUser; data?: { user?: AuthUser } }
        | undefined;

      const loggedUser = payload?.user || payload?.data?.user;
      if (loggedUser) {
        setAuth(loggedUser);
      } else {
        await fetchMe({ ignoreForceLogout: true });
      }

      const sessionUser = useAuthStore.getState().user;
      if (!sessionUser) {
        newErrors.password = 'Connexion backend invalide: session utilisateur introuvable.';
        setErrors(newErrors);
        toast.error("La connexion a echoue: aucune session active detectee.");
        return;
      }

      toast.success('Connexion reussie !');
      router.push('/');
      router.refresh();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          newErrors.password = 'Email ou mot de passe incorrect';
        } else {
          const message = error.response?.data?.message || 'Erreur de connexion';
          toast.error(message);
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
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-3 px-4 py-3">
          <img
            src="/JobBooster-Enterprises-ENG-FullColor.png"
            width={200}
            height={50}
            className="h-10 w-auto object-contain sm:h-11"
            alt="logo_job-booster"
          />
          <UserMobileMenu isAuthenticated={user?.role === 'CANDIDATE'} />
          <ul className="hidden w-full items-center gap-x-4 gap-y-2 overflow-x-auto pb-1 text-sm font-semibold text-[#0a1530] sm:flex sm:w-auto sm:text-base md:text-[17px]">
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
              <UserCircle size={24} />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-900">Connexion</CardTitle>
            <CardDescription>Accedez a votre espace candidat</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
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
                  required
                  className={errors.password ? 'border-red-500' : ''}
                />
                {errors.password ? <p className="text-sm text-red-500">{errors.password}</p> : null}
              </div>

              <Button type="submit" className="w-full bg-[#2c3e6e] hover:bg-[#223159]" disabled={loading}>
                {loading ? 'Connexion en cours...' : 'Se connecter'}
              </Button>

              <Link href="/register" className="block">
                <Button type="button" variant="outline" className="w-full">
                  Creer un compte
                </Button>
              </Link>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
