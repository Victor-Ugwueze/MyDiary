class Entry {
  contructor(id, title, body) {
    this.id = id;
    this.title = title;
    this.body = body;
    this.created_at = new Date();
  }

  setEntry(id, title, body) {
    this.id = id;
    this.title = title;
    this.body = body;
    this.created_at = new Date();
  }

  getEntry() {
    return this;
  }
}

const entries = [
  {
    id: 1,
    title: 'Why I am writting',
    body: 'The reason I am writing this is so that',
    created_at: '12/7/2018',
  },
  {
    id: 2,
    title: 'There is joy  in writing',
    body: 'People write to share and explain their mind',
    created_at: '14/7/2018',
  },
];

module.exports = entries;
