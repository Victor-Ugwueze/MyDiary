/**
   * This function formats created_at field of an entry to a data string.
   * @method
   * @param {Entry} entry - The entry object.
   */
const formatEntryDate = (entry) => {
  const formatedEntry = {
    id: entry.id,
    title: entry.title,
    body: entry.body,
    created_at: new Date(entry.created_at).toDateString(),
  };
  return formatedEntry;
};
/**
   * This function removes leaing and trailling spaces from an entry.
   * @method
   * @param {string} input - The string to trim.
   */
const trimeSpaces = (input) => {
  const trimedString = input.replace(/^\s+|\s+$/g, '');
  return trimedString;
};

export { formatEntryDate, trimeSpaces };
