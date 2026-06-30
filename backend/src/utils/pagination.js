exports.getPagination = (page = 1, limit = 10) => {
  page = parseInt(page);
  limit = parseInt(limit);

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  return {
    page,
    limit,
    from,
    to,
  };
};
