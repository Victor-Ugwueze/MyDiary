import pool from '../helpers/dbHelper';
import { formatEntryDate, trimeSpaces } from '../helpers/entryHelper';

class Entry {
  constructor() {
    this.title = null;
    this.pool = pool;
    this.body = null;
    this.userId = null;
  }

  find(requestId) {
    const query = {
      text: 'SELECT * FROM entries WHERE user_id = $1 AND id = $2',
      values: [this.userId, requestId],
    };
    return this.pool.query(query)
      .then((result) => {
        if (result.rows[0]) {
          return formatEntryDate(result.rows[0]);
        }
        return false;
      })
      .catch(err => err);
  }

  update(request) {
    const query = {
      text: `UPDATE entries SET title = $1, 
      body = $2 WHERE user_id = $3 and id = $4 
      `,
      values: [trimeSpaces(request.body.title),
        trimeSpaces(request.body.body), this.userId, request.params.id],
    };
    let date = null;
    this.find(request.params.id)
      .then((result) => {
        date = result.created_at;
        const date1 = new Date(date);
        const date2 = new Date();
        if (date1.getFullYear === date2.getFullYear
          && date1.getMonth === date2.getMonth
          && date1.getDay === !date2.getDay
        ) {
          return false;
        }
      });
    return this.pool.query(query)
      .then((result) => {
        if (result.rowCount === 1) {
          return this.find(request.params.id);
        }
        return false;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  findAll(req) {
    const currentPage = req.query.page || 1;
    const entryPerPage = req.query.perpage || 5;
    const query = {};

    if (Math.trunc(currentPage) === 1) {
      query.text = 'SELECT * FROM entries where user_id = $1 ORDER BY id DESC LIMIT $2';
      query.values = [this.userId, entryPerPage];
    } else {
      const start = ((currentPage * entryPerPage) - entryPerPage);
      query.text = 'SELECT * FROM entries where user_id = $1 ORDER BY id DESC LIMIT $2 OFFSET $3';
      query.values = [this.userId, entryPerPage, start];
    }
    return this.pool.query(query)
      .then((result) => {
        const entries = result.rows.map(entry => formatEntryDate(entry));
        return entries;
      })
      .catch(err => err);
  }


  save(input) {
    const query = {
      text: 'INSERT INTO entries (title,body,user_id) VALUES($1, $2, $3) RETURNING id,title,body,created_at',
      values: [trimeSpaces(input.title), trimeSpaces(input.body), input.userId],
    };

    return this.pool.query(query)
      .then(result => result)
      .catch(err => err);
  }

  delete(requestId) {
    const query = {
      text: 'DELETE FROM entries WHERE id = $1 AND user_id = $2',
      values: [requestId, this.userId],
    };
    return this.pool.query(query)
      .then(result => result)
      .catch(err => err);
  }
}


export default Entry;
