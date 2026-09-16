import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Contact form schema
export const contactFormSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(120, "Name is too long"),
  email: z.string().trim().email("Please enter a valid email address").max(320, "Email is too long"),
  subject: z.string().trim().min(5, "Subject must be at least 5 characters").max(200, "Subject is too long"),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(12000, "Message is too long"),
  website: z.string().trim().max(0, "Please leave this field empty").optional(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
