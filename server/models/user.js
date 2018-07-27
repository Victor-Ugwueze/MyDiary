import bcrypt from 'bcrypt';
import pool from '../helpers/dbHelper';


class User {
  constructor(firstName, lastName, email, password) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.pool = pool;
    this.email = email;
    this.password = password;
  }

  doLogin() {
    const query = {
      text: 'SELECT * FROM users WHERE email = $1',
      values: [this.email],
    };

    const thisObj = this;
    return new Promise((resolve, reject) => {
      thisObj.pool.query(query)
        .then((result) => {
          // User not found
          if (!result.rows[0]) resolve({ code: 1, id: null });
          // User found
          const passwordMatch = bcrypt.compareSync(thisObj.password, result.rows[0].password);
          if (passwordMatch) {
            resolve({ code: 2, id: result.rows[0].id });
          }
          resolve({ code: 3, id: null });
        })
        .catch(err => reject(err));
    });
  }

  doSignup() {
    const hash = bcrypt.hashSync(this.password, 10);
    const query = {
      text: 'INSERT INTO users(first_name, last_name,email,password) VALUES($1, $2, $3, $4) RETURNING id',
      values: [this.firstName, this.lastName, this.email, hash],
    };
    const thisObj = this;
    return new Promise((resolve, reject) => {
      thisObj.pool.query(query)
        .then((result) => {
          resolve(result.rows[0].id);
        })
        .catch(err => reject(err));
    });
  }

  checkIfEmailExists(input) {
    this.firstName = input.firstName;
    this.lastName = input.lastName;
    this.email = input.email;
    this.password = input.password;
    return this.pool.query('SELECT * FROM users WHERE email = $1', [input.email])
      .then((result) => {
        if (result.rows[0]) {
          return result.rows[0];
        }
        return false;
      })
      .catch(err => err);
  }
}

export default User;
