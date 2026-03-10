import {
  pgTable,
  integer,
  varchar,
  text,
  serial,
} from "drizzle-orm/pg-core";

export const partidos = pgTable("partidos", {
  id: serial("id").primaryKey(),
  idApi: integer("id_api").unique().notNull(),
  nome: varchar("nome", { length: 100 }).notNull(),
  sigla: varchar("sigla", { length: 15 }).unique().notNull(),
  logoUrl: text("logo_url"),
});
