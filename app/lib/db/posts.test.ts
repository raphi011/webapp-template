import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { eq } from "drizzle-orm";
import { db } from "@/app/lib/db";
import { users, posts } from "./schema";
import {
  createPost,
  getPostById,
  getPostsByAuthor,
  getAllPosts,
} from "./posts";

const TEST_USER_ID = "test-user-posts";

beforeAll(async () => {
  // Clean up any leftover test data
  await db.delete(posts).where(eq(posts.authorId, TEST_USER_ID));
  await db.delete(users).where(eq(users.id, TEST_USER_ID));

  // Insert test user
  await db.insert(users).values({
    id: TEST_USER_ID,
    name: "Test User",
    email: "test-posts@example.com",
  });
});

afterAll(async () => {
  await db.delete(posts).where(eq(posts.authorId, TEST_USER_ID));
  await db.delete(users).where(eq(users.id, TEST_USER_ID));
});

describe("posts repository", () => {
  it("creates a post and retrieves it by id", async () => {
    const post = await createPost({
      title: "Test Post",
      content: "Test content",
      authorId: TEST_USER_ID,
    });

    expect(post).toBeDefined();
    expect(post!.title).toBe("Test Post");
    expect(post!.authorId).toBe(TEST_USER_ID);

    const found = await getPostById(post!.id);
    expect(found).not.toBeNull();
    expect(found!.title).toBe("Test Post");
  });

  it("retrieves posts by author", async () => {
    const authorPosts = await getPostsByAuthor(TEST_USER_ID);
    expect(authorPosts.length).toBeGreaterThanOrEqual(1);
    expect(authorPosts.every((p) => p.authorId === TEST_USER_ID)).toBe(true);
  });

  it("returns posts ordered by createdAt desc", async () => {
    await createPost({
      title: "Second Post",
      content: "More content",
      authorId: TEST_USER_ID,
    });

    const authorPosts = await getPostsByAuthor(TEST_USER_ID);
    expect(authorPosts.length).toBeGreaterThanOrEqual(2);

    for (let i = 1; i < authorPosts.length; i++) {
      expect(authorPosts[i - 1].createdAt.getTime()).toBeGreaterThanOrEqual(
        authorPosts[i].createdAt.getTime(),
      );
    }
  });

  it("returns all posts", async () => {
    const all = await getAllPosts();
    expect(all.length).toBeGreaterThanOrEqual(2);
  });

  it("returns null for non-existent post", async () => {
    const result = await getPostById(999999);
    expect(result).toBeNull();
  });
});
