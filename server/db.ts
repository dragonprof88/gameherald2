import { drizzle } from 'drizzle-orm/neon-serverless';
import { neon, neonConfig } from '@neondatabase/serverless';
import pkg from 'pg';
const { Pool } = pkg;
import pgConnectionString from 'pg-connection-string';
const { parse } = pgConnectionString;

// Use WebSockets in production, HTTP in local dev
neonConfig.fetchConnectionCache = true;

// Initialize database connection
function createDrizzleConnection() {
  const connectionString = process.env.DATABASE_URL || '';
  
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  const config = parse(connectionString);
  
  // For local development and direct connection
  if (config.host) {
    const pool = new Pool({
      connectionString,
      max: 10,
    });
    
    return drizzle(pool);
  }
  
  // For serverless environments
  const sql = neon(connectionString);
  return drizzle(sql);
}

export const db = createDrizzleConnection();