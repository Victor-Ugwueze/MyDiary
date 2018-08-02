import { Pool } from 'pg';

const connection = process.env.DATABASE_URL || 'localhost://postgres:root@localhost:5432/mydia';

const pool = new Pool({
  connectionString: connection,
});

export default pool;
