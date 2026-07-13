import type { Config } from "@netlify/functions";
import { db } from "../../db/index.js";
import { settings } from "../../db/schema.js";
import { eq } from "drizzle-orm";

const DEFAULT_PASSWORD = "admin123";

async function getAdminPassword(): Promise<string> {
  const [row] = await db.select().from(settings).where(eq(settings.key, "admin_password"));
  return row?.value ?? DEFAULT_PASSWORD;
}

export default async (req: Request) => {
  if (req.method === "POST") {
    const { password } = await req.json();
    const stored = await getAdminPassword();
    if (password === stored) {
      return Response.json({ success: true });
    }
    return Response.json({ success: false }, { status: 401 });
  }

  if (req.method === "PUT") {
    const { currentPassword, newPassword } = await req.json();

    if (!newPassword || typeof newPassword !== "string" || newPassword.length < 4) {
      return new Response("新密码至少4个字符", { status: 400 });
    }

    const stored = await getAdminPassword();
    if (currentPassword !== stored) {
      return new Response("当前密码错误", { status: 401 });
    }

    await db
      .insert(settings)
      .values({ key: "admin_password", value: newPassword })
      .onConflictDoUpdate({ target: settings.key, set: { value: newPassword } });

    return Response.json({ success: true });
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config: Config = {
  path: "/api/admin",
};
