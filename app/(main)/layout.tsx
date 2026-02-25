import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/lib/auth";
import { AppShellWrapper } from "./app-shell-wrapper";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return <AppShellWrapper user={user}>{children}</AppShellWrapper>;
}
