import "server-only";
import { eq, desc, count } from "drizzle-orm";
import { db } from "@/app/lib/db";
import { posts } from "./schema";

const DEFAULT_PAGE_SIZE = 20;

export async function getPostsByAuthor(authorId: string) {
  return db
    .select()
    .from(posts)
    .where(eq(posts.authorId, authorId))
    .orderBy(desc(posts.createdAt));
}

export async function getAllPosts(page = 1, pageSize = DEFAULT_PAGE_SIZE) {
  const offset = (page - 1) * pageSize;
  const [rows, totalResult] = await Promise.all([
    db
      .select()
      .from(posts)
      .orderBy(desc(posts.createdAt))
      .limit(pageSize)
      .offset(offset),
    db.select({ total: count() }).from(posts),
  ]);
  const total = totalResult[0]?.total ?? 0;
  return { rows, total, page, pageSize };
}

export async function getPostById(id: number) {
  const result = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
  return result[0] ?? null;
}

export async function createPost(data: {
  title: string;
  content: string;
  authorId: string;
}) {
  const result = await db.insert(posts).values(data).returning();
  const post = result[0];
  if (!post) {
    throw new Error("createPost: insert returned no rows");
  }
  return post;
}
