import { getTranslations } from "next-intl/server";
import { PageLayout } from "@/components/page-layout";
import { SettingsView } from "./settings-view";

export default async function SettingsPage() {
  const t = await getTranslations("settings");

  return (
    <PageLayout title={t("title")}>
      <SettingsView />
    </PageLayout>
  );
}
