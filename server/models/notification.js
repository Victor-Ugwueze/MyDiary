import User from './user';

class Notification extends User {
  /**
 * This method finds a notifation to be sent.
 * @method
 * @param {string} title - The title of the notifications.
 *
 */
  getNotification(title) {
    const query = {
      text: `SELECT users.email, 
      users.first_name 
      FROM users INNER JOIN
      notifications ON users.id = notifications.user_id 
      WHERE notifications.reminder = true AND notifications.title = $1`,
      values: [title],
    };
    return this.pool.query(query)
      .then((result) => {
        if (!result.rows) throw new Error();
        return result.rows;
      })
      .catch((err) => {
        throw new Error(err);
      });
  }

  /**
   * This method adds a reminder.
   * @method
   * @param {string} title - The title of the notifications.
   *
   */
  addReminder(title) {
    const query = {
      text: 'INSERT INTO notifications (title, user_id) VALUES ($1,$2) ',
      values: [title, this.userId],
    };
    return this.pool.query(query)
      .then((result) => {
        if (!result.rowCount) throw new Error();
        return result;
      })
      .catch(() => {
      });
  }

  /**
   * This method updates users notifications status.
   * @method
   * @param {boolean} remind - The boelaan to send reminder.
   * @param {string} title - The title of the notifications.
   *
   */
  updateNotification(remind, title) {
    const query = {
      text: `UPDATE notifications SET reminder = $1 
              WHERE title = $2 AND user_id = $3
              RETURNING id, title, reminder`,
      values: [remind, title, this.userId],
    };
    return this.pool.query(query)
      .then((result) => {
        if (!result.rowCount) throw new Error();
        return result.rows[0];
      })
      .catch(() => {
        throw new Error();
      });
  }

  /**
 * This method gets all users notifications.
 * @method
 */
  getAllNotifications() {
    const query = {
      text: 'SELECT * FROM notifications WHERE user_id = $1',
      values: [this.userId],
    };
    return this.pool.query(query)
      .then((result) => {
        if (!result.rows[0]) throw new Error();
        return result.rows;
      })
      .catch(() => {
        throw new Error();
      });
  }
}


export default Notification;
