import type { Config } from "@netlify/functions";
import { db } from "../../db/index.js";
import { messages } from "../../db/schema.js";
import { desc } from "drizzle-orm";

export default async (req: Request) => {
  if (req.method === "GET") {
    const all = await db.select().from(messages).orderBy(desc(messages.createdAt));
    return Response.json(all);
  }

  if (req.method === "POST") {
    const { author, content } = await req.json();

    if (!author || typeof author !== "string" || !content || typeof content !== "string") {
      return new Response("昵称和留言内容不能为空", { status: 400 });
    }

    if (author.length > 20 || content.length > 500) {
      return new Response("昵称或内容超出长度限制", { status: 400 });
    }

    const [msg] = await db.insert(messages).values({ author: author.trim(), content: content.trim() }).returning();
    return Response.json(msg, { status: 201 });
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config: Config = {
  path: "/api/messages",
};
