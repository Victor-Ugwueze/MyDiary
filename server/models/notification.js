import User from './user';

class Notification extends User {
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
      .catch((err) => {
        console.log(err);
      });
  }

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
      .catch((err) => {
        console.log(err);
        throw new Error();
      });
  }

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
