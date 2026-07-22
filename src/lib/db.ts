import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Supabase Postgres connection.
// Use the pooled connection string (Supabase "Transaction" pooler, port 6543)
// for serverless environments. `prepare: false` is required because the
// transaction pooler (PgBouncer) does not support prepared statements.
const client = postgres(process.env.DATABASE_URL!, { prepare: false });

export const db = drizzle(client, { schema });
