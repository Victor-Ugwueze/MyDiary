import pool from '../helpers/dbHelper';

class Entry {
  constructor() {
    this.title = null;
    this.pool = pool;
    this.body = null;
  }

  find(requestId, query) {
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

  update(id, request) {
    const query = `${request}`;
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

  findAll() {
    const query = '';
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

  save(input) {
    const query = `${input}`;
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

  delete(requestId) {
    const thisObj = this;
    const query = `${requestId}`;
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
