import { getTranslations } from "next-intl/server";
import { getCurrentUser } from "@/app/lib/auth";
import { PageLayout } from "@/components/page-layout";
import { Card, CardContent } from "@/components/card";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const t = await getTranslations("dashboard");

  return (
    <PageLayout title={t("title")}>
      <Card>
        <CardContent className="mt-0">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {t("welcome", { name: user?.name ?? "User" })}
          </p>
        </CardContent>
      </Card>
    </PageLayout>
  );
}
