import {
  pgTable,
  integer,
  varchar,
  text,
  timestamp,
  boolean,
  serial,
  char,
  date,
  time,
  unique,
  index,
} from "drizzle-orm/pg-core";

export const estados = pgTable("estados", {
  id: serial("id").primaryKey(),
  sigla: char("sigla", { length: 2 }).unique().notNull(), // Ex: 'SP', 'RJ'
  nome: varchar("nome", { length: 50 }).notNull(),
  regiao: varchar("regiao", { length: 20 }),
});