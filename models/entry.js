import entriesDb from '../database/entriesDb';

class Entry {
  constructor(entry = {}) {
    this.title = entry.title;
    this.dataStore = entriesDb;
    this.body = entry.body;
  }

  find(requestId) {
    const db = this.dataStore;
    return new Promise((resolve, reject) => {
      let result = null;

      db.forEach((item) => {
        if (Math.trunc(requestId) === item.id) {
          result = item;
        }
      });

      if (result) resolve(result);
      reject(new Error('error'));
    });
  }

  update(item, request) {
    const upDateEntry = {
      id: item.id,
      title: request.title,
      body: request.body,
    };
    this.dataStore = this.dataStore.map((entry) => {
      if (item.id === entry.id) {
        return upDateEntry;
      }
      return entry;
    });
    return true;
  }

  findAll() {
    return this.dataStore;
  }

  save(input) {
    const { title, body } = input;
    this.dataStore.push({
      id: this.dataStore.length + 1,
      title,
      body,
      created_at: new Date().toDateString(),
    });
    return this.dataStore[this.dataStore.length - 1];
  }

  delete(requestId) {
    const item = this.dataStore[requestId - 1];
    if (item) {
      this.dataStore = this.dataStore.filter(entry => item.id !== entry.id);
      return true;
    }
    return false;
  }
}


export default Entry;
