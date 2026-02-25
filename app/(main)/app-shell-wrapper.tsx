"use client";

import { usePathname, useRouter } from "next/navigation";
import { HomeIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";
import { AppShell } from "@/components/app-shell";
import type { NavItem } from "@/components/sidebar-nav";

type User = {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

export function AppShellWrapper({
  user,
  children,
}: {
  user: User;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("nav");

  const navSections: NavItem[] = [
    { icon: <HomeIcon />, label: t("dashboard"), href: "/dashboard" },
  ];

  return (
    <AppShell
      appName="App"
      navSections={navSections}
      profile={{
        name: user.name ?? user.email ?? "User",
        avatarSrc: user.image,
        href: "/settings",
      }}
      activeHref={pathname}
      onNavigate={(href) => router.push(href)}
    >
      {children}
    </AppShell>
  );
}
