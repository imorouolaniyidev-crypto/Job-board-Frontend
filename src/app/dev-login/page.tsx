'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function TestLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@test.com');
  const [isLoading, setIsLoading] = useState(false);
  const role = 'ADMIN';

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      router.replace('/admin/login');
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Créer un token simple pour test
      const token = `test-token-${Date.now()}`;
      
      // Set les cookies
      document.cookie = `token=${token}; path=/; max-age=86400`; // 24h
      document.cookie = `userRole=${role}; path=/; max-age=86400`;
      
      // Petit délai pour que les cookies soient set
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Redirection vers dashboard
      router.push('/admin/dashboard');
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la connexion');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            🧪 Test Frontend
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Connexion locale pour tester les pages admin
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Instructions */}
          <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm text-blue-900 dark:text-blue-200">
              ℹ️ Cela crée une session locale avec des cookies de test. 
              <br className="mt-2" /> Parfait pour tester le frontend sans backend.
            </p>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@test.com"
              disabled={isLoading}
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
          >
            {isLoading ? '⏳ Connexion...' : '✨ Se Connecter Localement'}
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-8 pt-8 border-t dark:border-gray-700 text-center">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            ⚠️ Cette page est uniquement pour les tests frontend.
            <br />
            À supprimer ou protéger en production.
          </p>
        </div>
      </Card>
    </div>
  );
}
