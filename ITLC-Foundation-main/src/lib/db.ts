import mysql from 'mysql2/promise';

// Connection configuration loaded securely from environment
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || '',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || '',
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

let pool: mysql.Pool | null = null;
let isDbAvailable: boolean | null = null;

export function getPool(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool(dbConfig);
  }
  return pool;
}

/**
 * Test if the MySQL database connection is live and healthy
 */
export async function isDbConnected(): Promise<boolean> {
  if (isDbAvailable !== null) return isDbAvailable;
  try {
    const p = getPool();
    const conn = await p.getConnection();
    await conn.ping();
    conn.release();
    isDbAvailable = true;
    return true;
  } catch (err: any) {
    // Only log once to avoid cluttering terminal
    console.warn('[DB] MySQL not reachable locally (' + err.message + '). Using fallback JSON storage.');
    isDbAvailable = false;
    return false;
  }
}

/**
 * Execute a parameterized query with safe fallback
 */
export async function executeQuery<T = any>(sql: string, params: any[] = []): Promise<T[] | null> {
  try {
    const connected = await isDbConnected();
    if (!connected) return null;
    const p = getPool();
    const [rows] = await p.execute(sql, params);
    return rows as T[];
  } catch (error) {
    console.error('[DB Query Error]:', error);
    return null;
  }
}

export default {
  getPool,
  isDbConnected,
  executeQuery,
};
