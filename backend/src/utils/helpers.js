exports.isEmpty = (value) => {
  return (
    value === undefined ||
    value === null ||
    value === ""
  );
};

exports.formatDate = (date) => {
  return new Date(date).toISOString();
};

exports.slugify = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
};
