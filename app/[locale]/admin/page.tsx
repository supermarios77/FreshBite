import { requireAuth } from "@/lib/auth";
import { redirect } from "@/i18n/routing";

export default async function AdminPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  await requireAuth(locale);
  redirect(`/${locale}/admin/dishes`);
}

