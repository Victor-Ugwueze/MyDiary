import bcrypt from 'bcrypt';
import pool from '../dbHelper';


class SeeTestData {
  constructor() {
    this.pool = pool;
    this.seedEntriesTable = `INSERT INTO entries
    (
      title
      user_id  
      body 
    )  
    VALUES
     (
       the reason, I write,
       1,
       come and join me
    )
    `;

    this.createNotificationsTable = `CREATE TABLE IF NOT EXISTS notifications(
      id serial PRIMARY KEY NOT NULL,
      title varchar(255) NOT NULL,
      user_id varchar(255) NOT NULL,
      created_at timestamp DEFAULT NOW(),
      time timestamp NOT NULL
    )`;
    const password = bcrypt.hashSync('test123', 10);
    this.SeedUsersTable = `INSERT INTO users
     (first_name,
      last_name,
      email,
     password
    )VALUES 
    (
     victor,
     gozman,
     test@gmail.com,
     ${password} 
    )`;
  }

  run() {
    return this.pool.query(this.SeedUsersTable)
      .then(() => this.pool.query(this.seedEntriesTable))
      .then(() => this.pool.end())
      .catch(err => err);
  }
}

new SeeTestData().run();
