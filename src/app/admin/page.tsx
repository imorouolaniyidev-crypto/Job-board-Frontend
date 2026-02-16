'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    // Rediriger vers dashboard
    router.replace('/admin/dashboard');
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-white to-[rgb(18,51,119)]/10">
      <p className="text-[rgb(18,51,119)]/75">Redirection...</p>
    </div>
  );
}
