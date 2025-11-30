import { requireAuth } from "@/lib/auth";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminLogoutButton } from "./logout-button";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAuth();

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-foreground">Admin Panel</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-text-secondary">{session.user.email}</span>
            <AdminLogoutButton />
          </div>
        </div>
      </div>
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {children}
      </main>
    </div>
  );
}

