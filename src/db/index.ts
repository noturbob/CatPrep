import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

const url = process.env.DATABASE_URL;
if (!url) throw new Error('DATABASE_URL is not set');

/**
 * One driver for both local Postgres and Neon. Fluid Compute runs real
 * Node.js and reuses instances across invocations, so a small pool is the
 * right shape here — no serverless-specific HTTP driver needed.
 *
 * Stashed on globalThis so dev HMR doesn't leak a pool per reload.
 */
const g = globalThis as unknown as { __catprepPool?: Pool };

const pool =
  g.__catprepPool ??
  new Pool({
    connectionString: url,
    max: 5,
    idleTimeoutMillis: 30_000,
    ssl: /neon\.tech|sslmode=require/.test(url) ? { rejectUnauthorized: true } : undefined,
  });

if (process.env.NODE_ENV !== 'production') g.__catprepPool = pool;

export const db = drizzle(pool, { schema });
export { schema, pool };
