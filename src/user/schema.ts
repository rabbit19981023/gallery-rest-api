import { getTableColumns } from "drizzle-orm";
import { pgTable, pgEnum, serial, text, timestamp } from "drizzle-orm/pg-core";

export enum ROLE {
  Admin = "admin",
  User = "user",
}

// pgEnum must be exported, or it will not generate `create enum` SQL clause by drizzle-orm
export const roleEnum = pgEnum("role", [ROLE.Admin, ROLE.User]);

export const users = pgTable("users", {
  id: serial("id").primaryKey().notNull(),
  email: text("email").unique().notNull(),
  password: text("password").notNull(),
  role: roleEnum("role").default(ROLE.User).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

const { password: _, ...NON_PASSWORD_COLUMNS } = getTableColumns(users);

export { NON_PASSWORD_COLUMNS };

export type User = typeof users.$inferSelect;
export type UserWithoutPassword = Omit<User, "password">;
