import entriesDb from '../database/entriesDb';


const EntryDb = {
  entries: entriesDb,
  find(id) {
    return this.entries[id - 1];
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
  update(request) {
    const entryToUpdate = {
      id: request.id,
      title: request.title,
      body: request.body,
    };
    this.entries[request.id - 1] = entryToUpdate;
    return this.entries[request.id - 1];
  },
  delete(requestId) {
    const item = this.entries[requestId - 1];
    if (item) {
      this.entries = this.entries.filter(entry => item.id !== entry.id);
      return true;
    }
    return false;
  },
};

export default EntryDb;
