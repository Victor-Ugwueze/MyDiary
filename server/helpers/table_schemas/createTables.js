import pool from '../dbHelper';


export default class CreateTableSchema {
  constructor() {
    this.pool = pool;
    this.createEntriesTable = `CREATE TABLE IF NOT EXISTS entries(
      id serial PRIMARY KEY NOT NULL,
      title varchar(255) NOT NULL,
      user_id integer NOT NULL, 
      body varchar(255) NOT NULL,
      created_at timestamp DEFAULT NOW(),
      updated_at timestamp, DEFAULT NOW()
    )`;

    this.createNotificationsTable = `CREATE TABLE IF NOT EXISTS notifications(
      id serial PRIMARY KEY NOT NULL,
      title varchar(255) NOT NULL,
      user_id varchar(255) NOT NULL,
      created_at timestamp DEFAULT NOW(),
      time timestamp NOT NULL
    )`;

    this.createUsersTable = `CREATE TABLE IF NOT EXISTS users(
      id serial PRIMARY KEY NOT NULL,
      first_name varchar(255) NOT NULL,
      last_name varchar(255) NOT NULL,
      email varchar(255) NOT NULL,
      password varchar(255) NOT NULL,
      created_at timestamp DEFAULT NOW()
    )`;
  }

  run() {
    return this.pool.query(this.createUsersTable)
      .then(() => this.pool.query(this.createEntriesTable))
      .then(() => this.pool.query(this.createNotificationsTable))
      .then(() => this.pool.end())
      .catch(err => err);
  }
}

new CreateTableSchema().run();
