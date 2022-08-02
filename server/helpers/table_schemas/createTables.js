import pool from '../dbHelper';

export default class CreateTableSchema {
/**
 * Represents an database schemma.
 * @constructor
 *
 */
  constructor() {
    this.pool = pool;
    this.createEntriesTable = `CREATE TABLE IF NOT EXISTS entries(
      id serial PRIMARY KEY NOT NULL,
      title varchar(255) NOT NULL,
      user_id integer NOT NULL, 
      body varchar(255) NOT NULL,
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

    this.createTodoTable = `CREATE TABLE IF NOT EXISTS todos(
      id serial PRIMARY KEY NOT NULL,
      user_id integer NOT NULL,
      completed BOOLEAN DEFAULT true,
      title varchar(255) NOT NULL,
      content varchar(255) NOT NULL,
      status varchar(255),
      created_at timestamp DEFAULT NOW()
      updated_at timestamp DEFAULT NOW()
    )`;
  }

  /**
 * This method creates database tables as defined.
 * @method
 *
 */
  run() {
    try {
      Promise.all([
        this.pool.query(this.createUsersTable),
        this.pool.query(this.createEntriesTable),
        this.pool.query(this.createNotificationsTable),
        this.pool.query(this.createTodoTable),
      ]);
    } catch (error) {
      console.log('error encountered', error);
    }
  }
}

new CreateTableSchema().run();
