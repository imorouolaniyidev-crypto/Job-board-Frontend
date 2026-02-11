'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Briefcase, Users, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminSidebar() {
  const pathname = usePathname();

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
    } finally {
      window.location.href = '/admin/login';
    }
  };

  return (
    <aside className="flex flex-col gap-4 border-r border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 w-64 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white font-bold">
            A
          </div>
          <span className="font-bold text-xl text-gray-900 dark:text-white">Admin</span>
        </Link>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                active
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <Button
        variant="outline"
        onClick={handleLogout}
        className="w-full justify-start gap-3 text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900 dark:hover:text-red-300"
      >
        <LogOut size={20} />
        <span>Déconnexion</span>
      </Button>
    </aside>
  );
}
