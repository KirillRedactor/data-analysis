/**
   * Базовый метод пагинации с нуля
   * @param {Array} array - Исходный массив
   * @param {number} page - Номер страницы (начинается с 1)
   * @param {number} pageSize - Количество элементов на странице
   * @returns {Object} Объект с данными страницы
   */
function paginate(array, page = 1, pageSize = 100) {
    page = Math.max(1, page);
    pageSize = Math.max(1, pageSize);

    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    const paginatedItems = array.slice(startIndex, endIndex);

    return {
      page,
      pageSize,
      total: array.length,
      totalPages: Math.ceil(array.length / pageSize),
      data: paginatedItems,
      hasNextPage: endIndex < array.length,
      hasPrevPage: page > 1
    };
  }