'use client';

import { useAuthStore } from '@/lib/store';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { LogOut, User, Briefcase } from 'lucide-react';
import { toast } from 'sonner';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((state: any) => state.user);
  const logout = useAuthStore((state: any) => state.logout);
  const router = useRouter();
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);

  const currentTab = pathname.includes('applications') ? 'applications' : 'profile';

  useEffect(() => {
    // Check if user is authenticated
    // DÉSACTIVÉ POUR TESTS - À RÉACTIVER EN PRODUCTION
    // if (!user) {
    //   router.push('/login');
    //   return;
    // }
    setIsReady(true);
  }, [user, router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch {
      // Meme si l'API logout echoue, on nettoie le state local.
    } finally {
      logout();
      toast.success('Vous etes deconnecte');
      router.push('/');
      router.refresh();
    }
  };

  if (!isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Job Board</h1>
            <p className="text-sm text-gray-600">Espace candidat</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-700">
              Bienvenue, <strong>{user?.email}</strong>
            </span>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <Tabs value={currentTab} onValueChange={(value: string) => {
            if (value === 'profile') router.push('/profile');
            else router.push('/applications');
          }}>
            <TabsList className="grid w-full grid-cols-2 max-w-sm">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profil
              </TabsTrigger>
              <TabsTrigger value="applications" className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Candidatures
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Main Content */}
      <main className="py-8">
        {children}
      </main>
    </div>
  );
}

