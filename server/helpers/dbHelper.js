import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;

/**
 * This function returns a connection to database.
 * @function
 * @param {string} connectionString - The database connection url.
 */
const pool = new Pool({
  connectionString,
});

export default pool;
