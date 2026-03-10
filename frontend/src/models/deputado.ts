import {
  pgTable,
  integer,
  varchar,
  text,
  timestamp,
  boolean,
  serial,
} from "drizzle-orm/pg-core";
import { estados } from "./estado";
import { partidos } from "./partido";

export const deputados = pgTable("deputados", {
  id: serial("id").primaryKey(),
  idApi: integer("id_api").unique().notNull(),
  idLegislatura: integer("id_legislatura").notNull(),
  uriApi: text("uri_api"),
  nomeUrna: varchar("nome_urna", { length: 100 }).notNull(),
  nomeCompleto: varchar("nome_completo", { length: 255 }),
  cargo: varchar("cargo", { length: 50 }),
  estadoId: integer("estado_id").references(() => estados.id),
  partidoId: integer("partido_id").references(() => partidos.id),
  email: varchar("email", { length: 100 }),
  fotoUrl: text("foto_url"),
  ativo: boolean("ativo").default(true),
  atualizadoEm: timestamp("atualizado_em").defaultNow(),
});
