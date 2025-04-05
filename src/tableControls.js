// (pagination, sorting, filtering)

class TableControls {
  constructor() {
    this.currentPage = +storage.getFromUrl('currentPage') || 1;
    this.rowsPerPage = +storage.getFromUrl('rowsPerPage') || 50;
    this.sortColumn = storage.getFromUrl('sortColumn') || 'baristaId';
    this.sortDirection = storage.getFromUrl('sortDirection') || 'asc';
    this.searchTerm = '';
    this.filters = {};
    this.visibleColumns = null; // null means all columns are visible
    this.activeMetrics = ['total', 'average'];

    this.initEventListeners();
  }

  setCurrentPage(newPage) {
    this.currentPage = newPage;
    storage.setUrlParam('currentPage', newPage);
    this.refreshTable();
  }

  setRowsPerPage(newRowsPerPage) {
    this.rowsPerPage = newRowsPerPage;
    storage.setUrlParam('rowsPerPage', newRowsPerPage);
    this.refreshTable();
  }

  setSortColumn(newSortColumn) {
    this.sortColumn = newSortColumn;
    storage.setUrlParam('sortColumn', newSortColumn);
    this.refreshTable();
  }

  setSortDirection(newSortDirection) {
    this.sortDirection = newSortDirection;
    storage.setUrlParam('sortDirection', newSortDirection);
    this.refreshTable();
  }

  setSearchTerm(newSearchTerm) {
    this.searchTerm = newSearchTerm;
    storage.setUrlParam('searchTerm', newSearchTerm);
  }

  initEventListeners() {
    // Pagination controls
    document.getElementById('prevPage').addEventListener('click', () => {
      if (this.currentPage > 1) {
        // this.currentPage--;
        this.setCurrentPage(this.currentPage - 1);
        this.refreshTable();
      }
    });
    
    document.getElementById('nextPage').addEventListener('click', () => {
      const totalPages = this.calculateTotalPages();
      if (this.currentPage < totalPages) {
        // this.currentPage++;
        this.setCurrentPage(this.currentPage + 1);
        this.refreshTable();
      }
    });

    // Rows per page selector
    document.getElementById('rowsPerPage').addEventListener('change', (e) => {
      // this.rowsPerPage = parseInt(e.target.value);
      this.setRowsPerPage(parseInt(e.target.value));
      // this.currentPage = 1;
      this.setCurrentPage(1);
      this.refreshTable();
    });

    const searchInput = document.getElementById('searchInput');
    const debouncedSearch = debounce(() => {
      // this.searchTerm = searchInput.value;
      this.setSearchTerm(searchInput.value);
      // this.currentPage = 1;
      this.setCurrentPage(1);
      this.refreshTable();
    }, 300);

    searchInput.addEventListener('input', debouncedSearch);
    document.getElementById('searchButton').addEventListener('click', debouncedSearch);

    // Coffee filter
    document.getElementById('coffeeFilter').addEventListener('change', (e) => {
      if (e.target.value) {
        this.filters.coffeeName = e.target.value;
      } else {
        delete this.filters.coffeeName;
      }
      // this.currentPage = 1;
      this.setCurrentPage(1);
      this.refreshTable();
    });

    // Sorting
    document.getElementById('tableHeader').addEventListener('click', (e) => {
      const th = e.target.closest('th');
      if (!th || !th.dataset.columnId) return;

      const columnId = th.dataset.columnId;

      if (this.sortColumn === columnId) {
        // this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        this.setSortDirection(this.sortDirection === 'asc' ? 'desc' : 'asc');
      } else {
        this.setSortColumn(columnId);
        this.setSortDirection(this.sortDirection = 'asc');
        // this.sortColumn = columnId;
        // this.sortDirection = 'asc';
      }

      this.refreshTable();
    });

    // Toggle columns button
    document.getElementById('toggleColumnsBtn').addEventListener('click', () => {
      toggleVisibility('columnSelector');
    });

    // Column visibility toggles
    document.addEventListener('change', (e) => {
      if (e.target.classList.contains('column-visibility-toggle')) {
        this.updateVisibleColumns();
        this.refreshTable();
      }
    });

    // Metrics selector
    document.getElementById('metricsOptions').addEventListener('change', (e) => {
      if (e.target.type === 'checkbox' && e.target.dataset.metric) {
        this.updateActiveMetrics();
        this.refreshTable();
      }
    });

    // Click outside column selector to close it
    document.addEventListener('click', (e) => {
      const columnSelector = document.getElementById('columnSelector');
      const toggleBtn = document.getElementById('toggleColumnsBtn');

      if (!columnSelector.contains(e.target) && e.target !== toggleBtn) {
        columnSelector.classList.add('hidden');
      }
    });
  }

  calculateTotalPages() {
    const totalRows = this.getFilteredData().length;
    return Math.ceil(totalRows / this.rowsPerPage);
  }

  getFilteredData() {
    return filterData(window.processedData, this.searchTerm, this.filters);
  }

  updateVisibleColumns() {
    const checkboxes = document.querySelectorAll('.column-visibility-toggle');
    const visibleColumns = [];

    checkboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        visibleColumns.push(checkbox.dataset.columnId);
      }
    });

    this.visibleColumns = visibleColumns.length === checkboxes.length ? null : visibleColumns;
  }

  updateActiveMetrics() {
    const checkboxes = document.querySelectorAll('#metricsOptions input[type="checkbox"]');
    const activeMetrics = [];

    checkboxes.forEach((checkbox) => {
      if (checkbox.checked && checkbox.dataset.metric) {
        activeMetrics.push(checkbox.dataset.metric);
      }
    });

    this.activeMetrics = activeMetrics;
  }
}
