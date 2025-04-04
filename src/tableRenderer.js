function getTableColumns(coffeeIds) {
  const columns = [
    { id: 'baristaId', label: 'Barista ID', sortable: true, filterable: true, searchable: true },
    { id: 'totalOrders', label: 'Total Orders', sortable: true },
    { id: 'totalCups', label: 'Total Cups', sortable: true },
  ];

  coffeeIds.forEach((coffeeId) => {
    const coffeeName = getCoffeeName(coffeeId);
    columns.push(
      {
        id: createCoffeeColumnKey(coffeeId),
        label: coffeeName + ' (cups)',
        sortable: true,
        filterable: true,
      },
      {
        id: createPriceColumnKey(coffeeId),
        label: coffeeName + ' Revenue',
        sortable: true,
        isPrice: true,
      },
    );
  });

  columns.push(
    { id: 'totalRevenue', label: 'Total Revenue', sortable: true, isPrice: true },
    { id: 'averagePricePerCup', label: 'Avg Price/Cup', sortable: true, isPrice: true },
    { id: 'revenuePerOrder', label: 'Revenue/Order', sortable: true, isPrice: true },
  );

  return columns;
}

function renderTableHeader(columns, visibleColumns, sortColumn, sortDirection) {
  const tableHeader = document.getElementById('tableHeader');
  tableHeader.innerHTML = '';

  columns.forEach((column) => {
    if (visibleColumns && !visibleColumns.includes(column.id)) {
      return;
    }

    const th = document.createElement('th');
    th.textContent = column.label;

    if (column.sortable) {
      th.classList.add('sortable');
      th.dataset.columnId = column.id;

      if (sortColumn === column.id) {
        th.classList.add(sortDirection === 'asc' ? 'sorted-asc' : 'sorted-desc');
      }
    }

    tableHeader.appendChild(th);
  });
}

function renderTableBody(data, columns, visibleColumns, currentPage, rowsPerPage, searchTerm) {
  const tableBody = document.getElementById('tableBody');
  tableBody.innerHTML = '';

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = data.slice(startIndex, endIndex);

  if (paginatedData.length === 0) {
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.colSpan = visibleColumns ? visibleColumns.length : columns.length;
    td.textContent = 'No data found';
    td.style.textAlign = 'center';
    tr.appendChild(td);
    tableBody.appendChild(tr);
    return;
  }

  paginatedData.forEach((rowData) => {
    const tr = document.createElement('tr');

    columns.forEach((column) => {
      if (visibleColumns && !visibleColumns.includes(column.id)) {
        return;
      }

      const td = document.createElement('td');

      let value = rowData[column.id];

      if (column.isPrice) {
        td.textContent = formatCurrency(value);
      } else {
        if (column.id.startsWith('coffee_') && (!value || value === 0)) {
          td.textContent = '--';
          td.classList.add('empty-cell');
        } else {
          td.textContent = formatNumber(value);
        }
      }

      if (searchTerm && column.searchable && containsSearchTerm(value, searchTerm)) {
        td.classList.add('highlight');
      }

      tr.appendChild(td);
    });

    tableBody.appendChild(tr);
  });
}

function renderTableFooter(footerData, columns, visibleColumns, activeMetrics) {
  const tableFooter = document.getElementById('tableFooter');
  tableFooter.innerHTML = '';

  activeMetrics.forEach((metricName) => {
    if (!footerData[metricName]) return;

    const tr = document.createElement('tr');
    tr.classList.add('footer-row', `footer-${metricName}`);

    columns.forEach((column) => {
      if (visibleColumns && !visibleColumns.includes(column.id)) {
        return;
      }

      const td = document.createElement('td');
      const value = footerData[metricName][column.id];

      if (column.id === 'baristaId') {
        td.textContent = metricName === 'total' ? 'Total' : 'Average';
        td.style.fontWeight = 'bold';
      } else if (column.isPrice) {
        td.textContent = formatCurrency(value);
      } else {
        if (metricName === 'total' || !column.id.startsWith('coffee_')) {
          td.textContent = formatNumber(value);
        } else {
          td.textContent = '--';
        }
      }

      tr.appendChild(td);
    });

    tableFooter.appendChild(tr);
  });
}

function updatePaginationInfo(currentPage, totalPages) {
  const pageInfo = document.getElementById('pageInfo');
  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;

  document.getElementById('prevPage').disabled = currentPage <= 1;
  document.getElementById('nextPage').disabled = currentPage >= totalPages;
}

function renderCoffeeFilterOptions(coffeeIds) {
  const coffeeFilter = document.getElementById('coffeeFilter');
  coffeeFilter.innerHTML = '<option value="">All coffees</option>';

  coffeeIds.forEach((coffeeId) => {
    const option = document.createElement('option');
    option.value = createCoffeeColumnKey(coffeeId);
    option.textContent = getCoffeeName(coffeeId);
    coffeeFilter.appendChild(option);
  });
}

function renderColumnSelector(columns, visibleColumns) {
  const columnSelector = document.getElementById('columnSelector');
  columnSelector.innerHTML = '';

  columns.forEach((column) => {
    const label = document.createElement('label');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = column.id;
    checkbox.checked = !visibleColumns || visibleColumns.includes(column.id);
    checkbox.dataset.columnId = column.id;
    checkbox.classList.add('column-visibility-toggle');

    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(' ' + column.label));

    columnSelector.appendChild(label);
  });
}

function renderMetricsSelector(activeMetrics) {
  const metricsOptions = document.getElementById('metricsOptions');

  Array.from(metricsOptions.querySelectorAll('input[type="checkbox"]')).forEach((checkbox) => {
    checkbox.checked = activeMetrics.includes(checkbox.dataset.metric);
  });
}
