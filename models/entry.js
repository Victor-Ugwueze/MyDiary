import entriesDb from '../database/entriesDb';

// class Entry {
//   contructor(id, title, body) {
//     this.id = id;
//     this.title = title;
//     this.body = body;
//     this.created_at = new Date();
//   }

//   setEntry(id, title, body) {
//     this.id = id;
//     this.title = title;
//     this.body = body;
//     this.created_at = new Date();
//   }

//   getEntry() {
//     return this;
//   }
// }

const EntryDb = {
  entries: entriesDb,
  find(id) {
    return this.entries[id];
  },
  getAll() {
    return this.entries;
  },
  save(input) {
    const { title, body } = input;
    this.entries.push({
      id: this.entries.length + 1,
      title,
      body,
      created_at: '12/24/18',
    });
    return this.entries[this.entries.length - 1];
  },
  validate({ title }) {
    return new Promise((resolve, reject) => {
      if (title !== '' && title !== undefined) {
        resolve(EntryDb);
      }
      reject(new Error('title is required'));
    });
  },
};

export default EntryDb;
