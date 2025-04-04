const RECORDS_N = 5000;
const records = generateOrders(RECORDS_N);

let processedData = [];
let tableColumns = [];
let tableControls;

document.addEventListener('DOMContentLoaded', function () {
  const coffeeIds = Object.keys(COFFEE_BY_ID);

  processedData = processOrderData(records);
  window.processedData = processedData;

  tableColumns = getTableColumns(coffeeIds);

  tableControls = new TableControls();
  tableControls.refreshTable = refreshTable;

  renderCoffeeFilterOptions(coffeeIds);
  renderColumnSelector(tableColumns, tableControls.visibleColumns);
  renderMetricsSelector(tableControls.activeMetrics);

  refreshTable();
});

function refreshTable() {
  const coffeeIds = Object.keys(COFFEE_BY_ID);

  let filteredData = tableControls.getFilteredData();

  filteredData = sortData(filteredData, tableControls.sortColumn, tableControls.sortDirection);

  const footerData = calculateFooterMetrics(filteredData, coffeeIds, tableControls.activeMetrics);

  renderTableHeader(tableColumns, tableControls.visibleColumns, tableControls.sortColumn, tableControls.sortDirection);

  renderTableBody(
    filteredData,
    tableColumns,
    tableControls.visibleColumns,
    tableControls.currentPage,
    tableControls.rowsPerPage,
    tableControls.searchTerm,
  );

  renderTableFooter(footerData, tableColumns, tableControls.visibleColumns, tableControls.activeMetrics);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / tableControls.rowsPerPage));
  updatePaginationInfo(tableControls.currentPage, totalPages);

  renderMetricsSelector(tableControls.activeMetrics);

  setupColumnReordering();
}

function setupColumnReordering() {
  const tableHeader = document.getElementById('tableHeader');

  Array.from(tableHeader.children).forEach((th) => {
    th.setAttribute('draggable', 'true');

    th.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', th.dataset.columnId);
    });

    th.addEventListener('dragover', (e) => {
      e.preventDefault();
    });

    th.addEventListener('drop', (e) => {
      e.preventDefault();
      const sourceColumnId = e.dataTransfer.getData('text/plain');
      const targetColumnId = th.dataset.columnId;

      if (sourceColumnId && targetColumnId && sourceColumnId !== targetColumnId) {
        const sourceIndex = tableColumns.findIndex((col) => col.id === sourceColumnId);
        const targetIndex = tableColumns.findIndex((col) => col.id === targetColumnId);

        const [movedColumn] = tableColumns.splice(sourceIndex, 1);
        tableColumns.splice(targetIndex, 0, movedColumn);

        refreshTable();
      }
    });
  });
}
