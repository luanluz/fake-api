function parseSort(sortParam, allowedFields, defaultField = "createdAt") {
  if (!sortParam) return { field: defaultField, order: "desc" };

  const isDesc = sortParam.startsWith("-");
  const field = isDesc ? sortParam.slice(1) : sortParam;

  if (!allowedFields.includes(field)) {
    return { field: defaultField, order: "desc" };
  }

  return { field, order: isDesc ? "desc" : "asc" };
}

function sortItems(items, field, order) {
  return [...items].sort((a, b) => {
    const aVal = a[field];
    const bVal = b[field];

    if (aVal == null) return 1;
    if (bVal == null) return -1;

    const comparison =
      typeof aVal === "string"
        ? aVal.localeCompare(bVal)
        : aVal < bVal
        ? -1
        : aVal > bVal
        ? 1
        : 0;

    return order === "asc" ? comparison : -comparison;
  });
}

module.exports = { parseSort, sortItems };
