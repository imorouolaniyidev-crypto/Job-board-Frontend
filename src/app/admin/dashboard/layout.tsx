import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ADMIN_SESSION_COOKIE, getAdminSessionValue } from '@/lib/admin-auth';

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const adminSession = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (adminSession !== getAdminSessionValue()) {
    redirect('/admin/login');
  }

  return <>{children}</>;
}
