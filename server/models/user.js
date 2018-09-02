import bcrypt from 'bcrypt';
import pool from '../helpers/dbHelper';


class User {
  /**
 * Represents a user.
 * @constructor
 * @param {string} firstName - The user first name.
 * @param {string} lastName - The user last name.
 * @param {string} email - The user email.
 * @param {string} password - The user passord.
 *
 */
  constructor(firstName, lastName, email, password) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.pool = pool;
    this.email = email;
    this.password = password;
  }

  /**
   * This method logs the user in.
   * @method
   */
  doLogin() {
    const query = {
      text: 'SELECT * FROM users WHERE email = $1',
      values: [this.email],
    };

    return this.pool.query(query)
      .then((result) => {
        // User not found
        if (!result.rows[0]) return ({ code: 1, id: null });
        // User found
        const passwordMatch = bcrypt.compareSync(this.password, result.rows[0].password);
        if (passwordMatch) {
          return ({ code: 2, id: result.rows[0].id });
        }
        return ({ code: 3, id: null });
      })
      .catch(err => err);
  }

  /**
   * This method logs the user in.
   * @method
   */
  doSignup() {
    const hash = bcrypt.hashSync(this.password, 10);
    const query = {
      text: 'INSERT INTO users(first_name, last_name,email,password) VALUES($1, $2, $3, $4) RETURNING id',
      values: [this.firstName, this.lastName, this.email, hash],
    };
    const userObj = this;
    return this.pool.query(query)
      .then((result) => {
        const title = 'journal';
        const userId = result.rows[0].id;
        if (!userId) throw new Error();
        return userObj.createDefaultReminder(userId, title, 'signup');
      })
      .then((result) => {
        if (!result.rows[0]) return 'created only account';
        return result.rows[0].id;
      })
      .catch(() => { throw new Error(); });
  }

  /**
   * This method check if email exist on database.
   * @method
   * @param {object} input - The user details object.
   */

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

  /**
   * This method updates user details.
   * @method
   * @param {object} request - The request object.
   */
  updateUser(request) {
    const id = this.userId;
    const query = {
      text: `UPDATE users 
      SET first_name = $1, 
      last_name = $2, 
      email = $3, 
      location = $4 WHERE id = $5
       RETURNING first_name, last_name, email, created_at, location`,
      values: [
        request.body.firstName,
        request.body.lastName,
        request.body.email,
        request.body.location,
        id,
      ],
    };

    return this.pool.query(query)
      .then(result => result)
      .catch(err => err);
  }

  /**
   * This method finds a logged in user.
   * @method
   */
  getUser() {
    const id = this.userId;
    return this.pool.query(
      `SELECT email, 
      first_name, 
      last_name, 
      location,
      created_at FROM users 
      WHERE id = $1`, [id],
    )
      .then((result) => {
        if (result.rows[0]) {
          return result.rows[0];
        }
        return false;
      })
      .catch(err => err);
  }

  /**
   * This method returnes total number of entries created by user.
   * @method
   */
  getEntryCount() {
    const id = this.userId;
    return this.pool.query('SELECT * FROM entries WHERE user_id = $1', [id])
      .then((result) => {
        if (result.rows[0]) {
          return result.rows.length;
        }
        return 0;
      })
      .catch(err => err);
  }

  /**
   * This method compares password of a logged user to password sent along with request.
   * @method
   * @param {object} req - The request object.
   */
  checkPassword(req) {
    const id = this.userId;
    this.password = req.body.password;
    return this.pool.query('SELECT * FROM users WHERE id = $1', [id])
      .then((result) => {
        if (!result.rows[0]) {
          throw new Error();
        }
        const passwordMatch = bcrypt.compareSync(req.body.currentPassword, result.rows[0].password);
        return passwordMatch;
      })
      .catch(() => { throw new Error(); });
  }

  /**
   * This method updates user password.
   * @method
   */
  updatePassword() {
    const id = this.userId;
    const password = bcrypt.hashSync(this.password, 10);
    const query = {
      text: 'UPDATE users SET password = $1 WHERE id = $2',
      values: [
        password,
        id,
      ],
    };
    return this.pool.query(query)
      .then((result) => {
        if (!result.rowCount) {
          throw new Error();
        }
        return { status: 'updated' };
      })
      .catch(() => { throw new Error(); });
  }

  /**
   * This method subscribe user to receive, daily reminder and monthly newsletter,
     after signup.
   * @method
   * @param {object} input - The user details object.
   */
  createDefaultReminder(userId, title, action) {
    let text = 'INSERT INTO notifications (title, user_id) VALUES($1, $2) RETURNING id';
    if (action === 'signup') {
      text = `INSERT INTO notifications (title, user_id) VALUES
              ($1, $2), ('newsletter', $2) RETURNING id`;
    }
    const query = {
      text,
      values: [title, userId],
    };
    return this.pool.query(query)
      .then((result) => {
        if (!result.rows[0]) {
          throw new Error();
        }
        return result;
      })
      .catch(() => { throw new Error(); });
  }
}

export default User;
