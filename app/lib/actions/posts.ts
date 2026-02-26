"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/app/lib/auth";
import { createPost } from "@/app/lib/db/posts";
import type { ActionResult } from "@/app/lib/action-result";
import { parseFormData } from "@/app/lib/action-utils";

const createPostSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  content: z.string().min(1, "Content is required").max(10000),
});

export async function createPostAction(
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: "Unauthorized" };
  if (!user.id) return { success: false, error: "Session is invalid" };

  const parsed = parseFormData(createPostSchema, formData);
  if (!parsed.success) return { success: false, error: parsed.error };

  try {
    await createPost({
      title: parsed.data.title,
      content: parsed.data.content,
      authorId: user.id,
    });
  } catch (error) {
    console.error("Failed to create post", { userId: user.id, error });
    return {
      success: false,
      error: "Failed to create post. Please try again.",
    };
  }

  revalidatePath("/dashboard");
  return { success: true };
}
