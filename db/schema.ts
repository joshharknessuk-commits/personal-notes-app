import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const day = sqliteTable('day', {
  id: text('id').primaryKey(),
  date: text('date').notNull().unique(),
  build: text('build').default(''),
  train: text('train').default(''),
  study: text('study').default(''),
  reflection: text('reflection').default(''),
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
});

export type Day = typeof day.$inferSelect;
export type NewDay = typeof day.$inferInsert;
