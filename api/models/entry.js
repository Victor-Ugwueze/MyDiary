import entriesDb from '../database/entriesDb';

class Entry {
  constructor() {
    this.title = null;
    this.dataStore = entriesDb;
    this.body = null;
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
    const entryObj = this;
    return new Promise((resolve, reject) => {
      entryObj.find(requestId)
        .then((item) => {
          entryObj.dataStore = entryObj.dataStore.filter(entry => item.id !== entry.id);
          resolve(true);
        })
        .catch(() => {
          reject(new Error('not found'));
        });
    });
  }
}


export default Entry;
