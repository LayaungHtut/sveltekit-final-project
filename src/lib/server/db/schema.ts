import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

/** USERS: clients and therapists */
export const user = sqliteTable('user', {
  id: text('id').primaryKey(),
  username: text('username').notNull().unique(),
  email: text('email').notNull(),
  passwordHash: text('password_hash').notNull(),
  age: integer('age'),
  role: text('role').notNull().default('client'), // 'client' | 'therapist'
});

/** SESSIONS */
export const session = sqliteTable('session', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => user.id),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
});

/** NOTES: for clients or therapist notes */
export const notes = sqliteTable('notes', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull().references(() => user.id),
  title: text('title').notNull(),
  content: text('content').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
});

/** PASSWORD RESET TOKENS */
export const passwordResetToken = sqliteTable('password_reset_token', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => user.id),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
});

/** CONVERSATIONS: group chats or 1-on-1 */
export const conversation = sqliteTable('conversation', {
  id: text('id').primaryKey(),
  title: text('title'), // optional for group chat
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`)
});

/** MESSAGES: chat messages */
export const messages = sqliteTable('messages', {
  id: text('id').primaryKey().notNull(),
  content: text('content').notNull(),
  senderId: text('sender_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  receiverId: text('receiver_id'), // nullable for group chat
  conversationId: text('conversation_id').notNull().references(() => conversation.id),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

/** TYPES */
export type User = typeof user.$inferSelect;
export type Session = typeof session.$inferSelect;
export type PasswordResetToken = typeof passwordResetToken.$inferSelect;
export type Note = typeof notes.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;
export type Conversation = typeof conversation.$inferSelect;
