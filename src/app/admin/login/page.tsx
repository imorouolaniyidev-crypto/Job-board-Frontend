'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/admin-auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(data?.message ?? 'Connexion admin impossible.');
        return;
      }

      router.push('/admin/dashboard');
      router.refresh();
    } catch {
      setError('Erreur reseau. Reessayez.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-white to-[rgb(18,51,119)]/10 p-4">
      <Card className="w-full max-w-md border-[rgb(18,51,119)]/20">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-[rgb(18,51,119)]">Connexion Admin</CardTitle>
          <CardDescription className="text-[rgb(18,51,119)]/70">
            Acces reserve a l&apos;espace administrateur
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[rgb(18,51,119)]">Email admin</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@jobboard.local"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[rgb(18,51,119)]">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error ? <p className="text-sm text-[rgb(249,153,28)]">{error}</p> : null}
            <Button
              type="submit"
              className="w-full bg-[rgb(249,153,28)] text-white hover:bg-[rgb(249,153,28)]/90"
              disabled={loading}
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
