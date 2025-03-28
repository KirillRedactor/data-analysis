let settingsRender = (() => {
  const selector = sortBySelect;

  function initSettings() {
    sortBySelect.innerHTML = ``;
    [
      'index',
      'baristaId',
      ...Object.values(COFFEE_BY_ID)
        .map((el) => [el, el + ' price'])
        .flat(),
        'sum'
    ].forEach((val, i) => {
        const optEl = document.createElement('option');
        optEl.value = val;
        optEl.label = val;
        optEl.selected = i === 0;
        selector.appendChild(optEl);
    });
  }

  return {
    initSettings,
  };
})();
