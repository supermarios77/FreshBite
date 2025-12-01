import { requireAuth } from "@/lib/auth";
import { redirect } from "@/i18n/routing";

export default async function AdminPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await requireAuth();
  const { locale } = await params;
  redirect(`/${locale}/admin/dishes`);
}

