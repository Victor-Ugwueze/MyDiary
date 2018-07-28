
const formatEntryDate = (entry) => {
  const formatedEntry = {
    id: entry.id,
    title: entry.title,
    body: entry.body,
    created_at: new Date(entry.created_at).toDateString(),
  };
  return formatedEntry;
};

export default formatEntryDate;
