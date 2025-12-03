import { getSession } from "@/lib/auth";
import { AdminLogoutButton } from "./logout-button";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // Don't check authentication here - let individual pages handle it
  // This prevents redirect loops on the login page

  return (
    <div className="min-h-screen bg-background">
      {session && (
        <div className="border-b border-border bg-card/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 max-w-7xl">
            <h1 className="text-xl sm:text-2xl font-normal text-foreground tracking-widest uppercase">Admin Panel</h1>
            <div className="flex items-center gap-3 sm:gap-4">
              <span className="text-xs sm:text-sm text-text-secondary tracking-wide">{session.user.email}</span>
              <AdminLogoutButton />
            </div>
          </div>
        </div>
      )}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 max-w-7xl">
        {children}
      </main>
    </div>
  );
}

