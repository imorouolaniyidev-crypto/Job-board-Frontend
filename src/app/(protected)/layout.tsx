'use client';

import { useAuthStore } from '@/lib/store';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Briefcase, Home, LogIn, Users } from 'lucide-react';
import ProfileDropdown from '@/components/navbar/ProfileDropdown';
import UserMobileMenu from '@/components/navbar/UserMobileMenu';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((state) => state.user);
  const fetchMe = useAuthStore((state) => state.fetchMe);
  const [hasCheckedSession, setHasCheckedSession] = useState(false);

  useEffect(() => {
    if (user) return;
    let isMounted = true;
    fetchMe().finally(() => {
      if (isMounted) setHasCheckedSession(true);
    });
    return () => {
      isMounted = false;
    };
  }, [user, fetchMe]);

  const isReady = Boolean(user) || hasCheckedSession;

  if (!isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
      <main className="py-6 sm:py-8">{children}</main>
    </div>
  );
}
