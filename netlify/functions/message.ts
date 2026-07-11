import type { Config } from "@netlify/functions";
import { db } from "../../db/index.js";
import { messages, settings } from "../../db/schema.js";
import { eq } from "drizzle-orm";

const DEFAULT_PASSWORD = "admin123";

async function getAdminPassword(): Promise<string> {
  const [row] = await db.select().from(settings).where(eq(settings.key, "admin_password"));
  return row?.value ?? DEFAULT_PASSWORD;
}

async function verifyAdmin(req: Request): Promise<boolean> {
  const pwd = req.headers.get("X-Admin-Password");
  if (!pwd) return false;
  const stored = await getAdminPassword();
  return pwd === stored;
}

export default async (req: Request, context: { params: { id: string } }) => {
  const id = parseInt(context.params.id, 10);
  if (isNaN(id)) {
    return new Response("Invalid id", { status: 400 });
  }

  if (req.method === "PUT") {
    if (!(await verifyAdmin(req))) {
      return new Response("未授权", { status: 401 });
    }

    const { author, content } = await req.json();

    if (!author || typeof author !== "string" || !content || typeof content !== "string") {
      return new Response("昵称和留言内容不能为空", { status: 400 });
    }

    if (author.length > 20 || content.length > 500) {
      return new Response("昵称或内容超出长度限制", { status: 400 });
    }

    const [updated] = await db
      .update(messages)
      .set({ author: author.trim(), content: content.trim() })
      .where(eq(messages.id, id))
      .returning();

    if (!updated) return new Response("Not found", { status: 404 });
    return Response.json(updated);
  }

  if (req.method === "DELETE") {
    if (!(await verifyAdmin(req))) {
      return new Response("未授权", { status: 401 });
    }

    await db.delete(messages).where(eq(messages.id, id));
    return new Response(null, { status: 204 });
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config: Config = {
  path: "/api/messages/:id",
};
