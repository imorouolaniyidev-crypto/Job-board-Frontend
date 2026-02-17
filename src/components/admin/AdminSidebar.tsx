'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Briefcase, Users, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/store';

export default function AdminSidebar() {
  const pathname = usePathname();
  const logout = useAuthStore((state) => state.logout);

  const menuItems = [
    {
      label: 'Dashboard',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
    },
    {
      label: 'Offres d\'emploi',
      href: '/admin/jobs',
      icon: Briefcase,
    },
    {
      label: 'Candidats',
      href: '/admin/candidates',
      icon: Users,
    },
  ];

  const isActive = (href: string) => pathname.startsWith(href);

  const handleLogout = async () => {
    try {
      await fetch('/api/admin-auth/logout', { method: 'POST' });
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } finally {
      logout();
      window.location.href = '/admin/login';
    }
  };

  return (
    <aside className="border-b border-[rgb(18,51,119)]/20 bg-white p-4 md:flex md:min-h-screen md:w-64 md:flex-shrink-0 md:flex-col md:border-b-0 md:border-r md:p-6">
      {/* Header */}
      <div className="mb-4 md:mb-8">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <img
            src="/JobBooster-Enterprises-ENG-FullColor.png"
            width={200}
            height={50}
            className="h-10 w-auto object-contain"
            alt="logo_job-booster"
          />
        </Link>
      </div>

      {/* Menu Items */}
      <nav className="flex flex-wrap gap-2 md:flex-1 md:flex-col md:space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm transition-colors md:gap-3 md:px-4 md:py-3 md:text-base ${
                active
                  ? 'bg-[rgb(18,51,119)] text-white'
                  : 'text-[rgb(18,51,119)] hover:bg-[rgb(18,51,119)]/10'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="mt-3 md:mt-6">
        <Button
          variant="outline"
          onClick={handleLogout}
          className="w-full justify-start gap-3 border-[rgb(249,153,28)] text-[rgb(249,153,28)] hover:bg-[rgb(249,153,28)] hover:text-white"
        >
          <LogOut size={20} />
          <span>Déconnexion</span>
        </Button>
      </div>
    </aside>
  );
}
