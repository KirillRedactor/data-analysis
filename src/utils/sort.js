function sortByKey(array, key, order = 'asc') {
  return [...array].sort((a, b) => {
    if (a[key] === undefined) return 1;
    if (b[key] === undefined) return -1;

    const typeA = typeof a[key];
    const typeB = typeof b[key];

    if (typeA !== typeB) {
      const typeOrder = ['undefined', 'boolean', 'number', 'string', 'object', 'function'];
      return typeOrder.indexOf(typeA) - typeOrder.indexOf(typeB);
    }

    switch (typeA) {
      case 'number':
        return order === 'asc' ? a[key] - b[key] : b[key] - a[key];

      case 'string':
        return order === 'asc' ? a[key].localeCompare(b[key]) : b[key].localeCompare(a[key]);

      case 'boolean':
        return order === 'asc' ? (a[key] === b[key] ? 0 : a[key] ? 1 : -1) : a[key] === b[key] ? 0 : a[key] ? -1 : 1;

      case 'object':
        if (a[key] === null || b[key] === null) {
          return a[key] === b[key] ? 0 : a[key] === null ? -1 : 1;
        }
        return order === 'asc'
          ? JSON.stringify(a[key]).localeCompare(JSON.stringify(b[key]))
          : JSON.stringify(b[key]).localeCompare(JSON.stringify(a[key]));

      default:
        return 0;
    }
  });
}
