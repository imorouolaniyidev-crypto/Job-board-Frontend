'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserCircle, ChevronDown } from 'lucide-react';
import { useAuthStore } from '@/lib/store';

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    const confirmed = window.confirm('Voulez-vous vraiment vous deconnecter ?');
    if (!confirmed) return;

    setIsLoggingOut(true);
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } finally {
      logout();
      setIsOpen(false);
      setIsLoggingOut(false);
      router.push('/');
      router.refresh();
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex cursor-pointer items-center gap-1.5 whitespace-nowrap text-sm font-semibold text-[#0a1530] hover:underline sm:text-base md:text-[17px]"
      >
        <UserCircle size={16} />
        Mon Profil
        <ChevronDown size={14} />
      </button>

      {isOpen ? (
        <div className="absolute right-0 mt-2 w-44 rounded-md border border-slate-200 bg-white py-1 shadow-lg">
          <Link
            href="/profile"
            className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
            onClick={() => setIsOpen(false)}
          >
            Profile
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-slate-50"
          >
            {isLoggingOut ? 'Deconnexion...' : 'Deconnexion'}
          </button>
        </div>
      ) : null}
    </div>
  );
}
