import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "../app/lib/db/schema";

const DATABASE_URL =
  process.env.DATABASE_URL ?? "postgresql://app:app@localhost:5433/app_dev";

async function seed() {
  const pool = new Pool({ connectionString: DATABASE_URL });
  const db = drizzle(pool, { schema });

  console.log("Seeding database...");

  // Create example users
  const rows = await db
    .insert(schema.users)
    .values([
      { id: "user-1", name: "Alice Johnson", email: "alice@example.com" },
      { id: "user-2", name: "Bob Smith", email: "bob@example.com" },
    ])
    .returning();

  const alice = rows[0]!;
  const bob = rows[1]!;

  console.log(`Created users: ${alice.name}, ${bob.name}`);

  // Create example posts
  await db.insert(schema.posts).values([
    {
      title: "Getting Started with Next.js",
      content:
        "Next.js is a React framework for building full-stack web applications.",
      authorId: alice.id,
    },
    {
      title: "Understanding Server Components",
      content:
        "Server Components let you write UI that can be rendered and cached on the server.",
      authorId: bob.id,
    },
    {
      title: "Database Patterns with Drizzle",
      content:
        "Drizzle ORM provides a type-safe way to interact with your database.",
      authorId: alice.id,
    },
  ]);

  console.log("Created 3 example posts");

  await pool.end();
  console.log("Seed complete!");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
