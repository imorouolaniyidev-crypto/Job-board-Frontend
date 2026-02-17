'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Home, Briefcase, Users, LogIn, UserCircle } from 'lucide-react';

interface UserMobileMenuProps {
  isAuthenticated?: boolean;
}

export default function UserMobileMenu({ isAuthenticated = false }: UserMobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const links = [
    { href: '/', label: 'Accueil', icon: Home },
    { href: '/', label: 'Offres', icon: Briefcase },
    { href: '/candidats', label: 'Candidats', icon: Users },
  ];

  return (
    <div className="relative sm:hidden">
      <button
        type="button"
        aria-label="Ouvrir le menu mobile"
        onClick={() => setIsOpen((prev) => !prev)}
        className="rounded-md bg-[#2c3e6e] p-2.5 text-white shadow"
      >
        <Menu size={22} />
      </button>

      {isOpen ? (
        <div className="absolute right-0 top-full z-[70] mt-2 w-52 rounded-xl border border-slate-200 bg-white p-3 shadow-2xl">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[#0a1530]">Menu</h2>
            <button
              type="button"
              aria-label="Fermer le menu mobile"
              onClick={() => setIsOpen(false)}
              className="rounded-md p-1 text-[#0a1530]"
            >
              <X size={16} />
            </button>
          </div>

          <nav className="space-y-1">
            {links.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 rounded-md px-2 py-2 text-sm text-[#0a1530] hover:bg-slate-50"
                >
                  <Icon size={16} />
                  {item.label}
                </Link>
              );
            })}
            {isAuthenticated ? (
              <Link href="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-2 rounded-md px-2 py-2 text-sm text-[#0a1530] hover:bg-slate-50">
                <UserCircle size={16} />
                Mon profil
              </Link>
            ) : (
              <Link href="/login" onClick={() => setIsOpen(false)} className="flex items-center gap-2 rounded-md px-2 py-2 text-sm text-[#0a1530] hover:bg-slate-50">
                <LogIn size={16} />
                Se connecter
              </Link>
            )}
          </nav>
        </div>
      ) : null}
    </div>
  );
}
