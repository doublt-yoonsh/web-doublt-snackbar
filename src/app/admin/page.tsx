"use client";

import { AdminLogin } from "@/features/admin/components/admin-login";
import { AdminDashboard } from "@/features/admin/components/admin-dashboard";
import { useAdminAuth } from "@/features/admin/hooks/use-admin-auth";
import { Toaster } from "sonner";

export default function AdminPage() {
  const { isAuthenticated, isLoading, error, login, logout } = useAdminAuth();

  if (!isAuthenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4">
        <AdminLogin onLogin={login} isLoading={isLoading} error={error} />
        <Toaster />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <AdminDashboard onLogout={logout} />
      <Toaster />
    </main>
  );
}
