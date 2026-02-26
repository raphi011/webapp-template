import { Suspense } from "react";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getCurrentUser } from "@/app/lib/auth";
import { getPostsByAuthor } from "@/app/lib/db/posts";
import { PageLayout } from "@/components/page-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/empty-state";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("dashboard");
  return {
    title: t("title"),
  };
}

function PostsSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }, (_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      ))}
    </div>
  );
}

async function RecentPosts({ userId }: { userId: string }) {
  const [posts, t] = await Promise.all([
    getPostsByAuthor(userId),
    getTranslations("dashboard"),
  ]);

  if (posts.length === 0) {
    return (
      <EmptyState title={t("noPosts")} description={t("noPostsDescription")} />
    );
  }

  return (
    <ul className="divide-y divide-slate-200 dark:divide-slate-800">
      {posts.map((post) => (
        <li key={post.id} className="py-3 first:pt-0 last:pb-0">
          <p className="text-sm font-medium text-slate-900 dark:text-white">
            {post.title}
          </p>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            {post.createdAt.toLocaleDateString()}
          </p>
        </li>
      ))}
    </ul>
  );
}

export default async function DashboardPage() {
  const [user, t] = await Promise.all([
    getCurrentUser(),
    getTranslations("dashboard"),
  ]);

  if (!user?.id) {
    redirect("/login");
  }

  return (
    <PageLayout title={t("title")}>
      <Card>
        <CardContent className="mt-0">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {t("welcome", { name: user.name ?? "User" })}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("recentPosts")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<PostsSkeleton />}>
            <RecentPosts userId={user.id} />
          </Suspense>
        </CardContent>
      </Card>
    </PageLayout>
  );
}
