import "server-only";
import { eq, desc } from "drizzle-orm";
import { db } from "@/app/lib/db";
import { posts } from "./schema";

export async function getPostsByAuthor(authorId: string) {
  return db
    .select()
    .from(posts)
    .where(eq(posts.authorId, authorId))
    .orderBy(desc(posts.createdAt));
}

export async function getAllPosts() {
  return db.select().from(posts).orderBy(desc(posts.createdAt));
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
  return result[0];
}
