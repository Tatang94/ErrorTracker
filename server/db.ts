import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

// Database connection configuration
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://runner@localhost:5432/zona_gold';

export const pool = new Pool({
  connectionString: DATABASE_URL,
});

export const db = drizzle(pool, { schema });