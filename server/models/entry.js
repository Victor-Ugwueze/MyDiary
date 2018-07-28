import pool from '../helpers/dbHelper';
import formartEntry from '../helpers/entryHelper';

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
      .then(result => result.rows[0])
      .catch(err => err);
  }

  update(request) {
    console.log(request.body.body, this.userId, request.params.id);
    const query = {
      text: 'UPDATE entries SET title = $1, body = $2 WHERE user_id = $3 and id = $4',
      values: [request.body.title, request.body.body, this.userId, request.params.id],
    };

    return this.pool.query(query)
      .then(result => result)
      .catch(err => err);
  }

  findAll() {
    const query = {
      text: 'SELECT * FROM entries WHERE user_id = $1',
      values: [this.userId],
    };

    return this.pool.query(query)
      .then((result) => {
        const entries = result.rows.map(entry => formartEntry(entry));
        return entries;
      })
      .catch(err => err);
  }


  save(input) {
    const query = {
      text: 'INSERT INTO entries (title,body,user_id) VALUES($1, $2, $3) RETURNING id,title,body,created_at',
      values: [input.title, input.body, input.userId],
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

  findWere(condition) {
    const query = `${condition}`;
    const thisObj = this;
    return new Promise((resolve, reject) => {
      thisObj.pool.query(query)
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}


export default Entry;
