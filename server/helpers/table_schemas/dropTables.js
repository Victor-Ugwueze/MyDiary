import pool from '../dbHelper';


class SetupTestDb {
  /**
 * Represents an database schemma.
 * @constructor
 *
 */
  constructor() {
    this.pool = pool;
    this.dropEntreiesTable = 'DROP TABLE IF EXISTS entries';

    this.dropNotificationsTable = 'DROP TABLE IF EXISTS notifications';

    this.dropUsersTable = 'DROP TABLE IF EXISTS users';
    this.createEntriesTable = `CREATE TABLE IF NOT EXISTS entries(
      id serial PRIMARY KEY NOT NULL,
      title varchar(255) NOT NULL,
      user_id integer NOT NULL, 
      body text NOT NULL,
      created_at timestamp DEFAULT NOW()
    )`;
    this.createNotificationsTable = `CREATE TABLE IF NOT EXISTS notifications(
      id serial PRIMARY KEY NOT NULL,
      title varchar(255) NOT NULL,
      user_id integer NOT NULL,
      created_at timestamp DEFAULT NOW(),
      reminder bool DEFAULT TRUE
    )`;
    this.createUsersTable = `CREATE TABLE IF NOT EXISTS users(
      id serial PRIMARY KEY NOT NULL,
      first_name varchar(255) NOT NULL,
      last_name varchar(255) NOT NULL,
      email varchar(255) NOT NULL,
      location varchar(255),
      password varchar(255) NOT NULL,
      created_at timestamp DEFAULT NOW()
    )`;
  }

  /**
 * This method creates database tables as defined.
 * @method
 *
 */
  up() {
    this.pool.query(this.createUsersTable)
      .then(() => this.pool.query(this.createEntriesTable))
      .then(() => this.pool.query(this.createNotificationsTable))
      .then(() => this.pool.end())
      .catch(err => err);
  }

  /**
 * This method drops database tables as defined.
 * @method
 *
 */
  down() {
    return this.pool.query(this.dropUsersTable)
      .then(() => this.pool.query(this.dropEntreiesTable))
      .then(() => this.pool.query(this.dropNotificationsTable))
      .then(() => this.up())
      .catch(err => err);
  }
}
const testDb = new SetupTestDb();

testDb.down();
