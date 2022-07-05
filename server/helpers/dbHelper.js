import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const connectionString = process.env.DATABASE_URL;

/**
 * This function returns a connection to database.
 * @function
 * @param {string} connectionString - The database connection url.
 */
const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  },
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
});

export default pool;
