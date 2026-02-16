'use client';

import AdminSidebar from '@/components/admin/AdminSidebar';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminLoginPage = pathname === '/admin/login';

  if (isAdminLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-[rgb(18,51,119)]/5">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="h-full w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
