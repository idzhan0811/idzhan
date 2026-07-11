import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const messages = pgTable("messages", {
  id: serial().primaryKey(),
  author: text().notNull(),
  content: text().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const settings = pgTable("settings", {
  key: text().primaryKey(),
  value: text().notNull(),
});
