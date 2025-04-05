// Format currency for display
function formatCurrency(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '--';
  }
  return '$' + amount.toFixed(2);
}

function formatNumber(num) {
  if (!num || num === undefined || num === null || isNaN(num)) {
    return '--';
  }
  return num
    .toString()
    .replace(/(\.\w{2})\w*/, '$1')
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function getCoffeeName(coffeeId) {
  return COFFEE_BY_ID[coffeeId] || 'Unknown';
}

function createCoffeeColumnKey(coffeeId) {
  return `coffee_${coffeeId}`;
}

function createPriceColumnKey(coffeeId) {
  return `price_${coffeeId}`;
}

function debounce(func, wait) {
  let timeout;
  return function (...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

function toggleVisibility(elementId) {
  const element = document.getElementById(elementId);
  if (element.classList.contains('hidden')) {
    element.classList.remove('hidden');
  } else {
    element.classList.add('hidden');
  }
}

function containsSearchTerm(text, searchTerm) {
  if (!searchTerm) return true;
  searchTerm = searchTerm.replace(' ', '').split(',');
  return searchTerm.some((term) => {
    return String(text).toLowerCase().includes(term.toLowerCase());
  });
}
