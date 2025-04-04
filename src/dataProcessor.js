function processOrderData(records) {
  const baristaIds = [
    ...new Set(
      records
        .filter((record) => record.baristaId)
        .map((record) => record.baristaId),
    ),
  ];

  const coffeeIds = Object.keys(COFFEE_BY_ID);

  const aggregatedData = baristaIds.map((baristaId) => {
    const baristaData = {
      baristaId,
      totalOrders: 0,
      totalCups: 0,
      totalRevenue: 0,
    };

    coffeeIds.forEach((coffeeId) => {
      baristaData[createCoffeeColumnKey(coffeeId)] = 0;
      baristaData[createPriceColumnKey(coffeeId)] = 0; 
    });

    return baristaData;
  });

  records.forEach((record) => {
    if (!record.baristaId || !record.coffeeId) return;

    const baristaData = aggregatedData.find((data) => data.baristaId === record.baristaId);
    if (!baristaData) return;

    baristaData.totalOrders++;
    baristaData.totalCups += record.cups || 0;
    baristaData.totalRevenue += (record.price || 0) * (record.cups || 0);

    const coffeeKey = createCoffeeColumnKey(record.coffeeId);
    const priceKey = createPriceColumnKey(record.coffeeId);

    baristaData[coffeeKey] += record.cups || 0;
    baristaData[priceKey] += (record.price || 0) * (record.cups || 0);
  });

  aggregatedData.forEach((baristaData) => {
    baristaData.averagePricePerCup = baristaData.totalCups > 0 ? baristaData.totalRevenue / baristaData.totalCups : 0;

    baristaData.revenuePerOrder = baristaData.totalOrders > 0 ? baristaData.totalRevenue / baristaData.totalOrders : 0;
  });

  return aggregatedData;
}

function calculateFooterMetrics(data, coffeeIds, metrics = ['total', 'average']) {
  const footerRows = {};

  if (metrics.includes('total')) {
    const totalRow = {
      baristaId: 'Total',
      totalOrders: 0,
      totalCups: 0,
      totalRevenue: 0,
    };

    coffeeIds.forEach((coffeeId) => {
      totalRow[createCoffeeColumnKey(coffeeId)] = 0;
      totalRow[createPriceColumnKey(coffeeId)] = 0;
    });

    data.forEach((baristaData) => {
      totalRow.totalOrders += baristaData.totalOrders;
      totalRow.totalCups += baristaData.totalCups;
      totalRow.totalRevenue += baristaData.totalRevenue;

      coffeeIds.forEach((coffeeId) => {
        const coffeeKey = createCoffeeColumnKey(coffeeId);
        const priceKey = createPriceColumnKey(coffeeId);

        totalRow[coffeeKey] += baristaData[coffeeKey] || 0;
        totalRow[priceKey] += baristaData[priceKey] || 0;
      });
    });

    footerRows.total = totalRow;
  }

  if (metrics.includes('average') && data.length > 0) {
    const averageRow = {
      baristaId: 'Average',
      totalOrders: 0,
      totalCups: 0,
      totalRevenue: 0,
    };

    coffeeIds.forEach((coffeeId) => {
      averageRow[createCoffeeColumnKey(coffeeId)] = 0;
      averageRow[createPriceColumnKey(coffeeId)] = 0;
    });

    const total = { ...footerRows.total };

    averageRow.totalOrders = total.totalOrders / data.length;
    averageRow.totalCups = total.totalCups / data.length;
    averageRow.totalRevenue = total.totalRevenue / data.length;

    coffeeIds.forEach((coffeeId) => {
      const coffeeKey = createCoffeeColumnKey(coffeeId);
      const priceKey = createPriceColumnKey(coffeeId);

      averageRow[coffeeKey] = total[coffeeKey] / data.length;
      averageRow[priceKey] = total[priceKey] / data.length;
    });

    footerRows.average = averageRow;
  }

  return footerRows;
}

function filterData(data, searchTerm, filters) {
  return data.filter((item) => {
    if (searchTerm && !containsSearchTerm(item.baristaId, searchTerm)) {
      return false;
    }
    for (const [key, value] of Object.entries(filters)) {
      if (key && value.startsWith('coffee_')) {
        if (item[value] === 0) {
          return false;
        }
      }
    }

    return true;
  });
}

function sortData(data, sortColumn, sortDirection) {
  if (!sortColumn) return data;

  return [...data].sort((a, b) => {
    const aValue = a[sortColumn] !== undefined ? a[sortColumn] : 0;
    const bValue = b[sortColumn] !== undefined ? b[sortColumn] : 0;

    if (sortDirection === 'asc') {
      return aValue - bValue;
    } else {
      return bValue - aValue;
    }
  });
}
