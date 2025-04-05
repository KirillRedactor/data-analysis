let storage = (() => {
  let setUrlParam = function (key, value) {
    if (value === '' || !value) {
      removeFromUrl(key);
      return;
    }
    const urlParams = new URLSearchParams(window.location.search);

    urlParams.set(key, value);

    window.history.pushState({}, '', '?' + urlParams.toString());
  };

  let getFromUrl = function (key) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(key);
  };

  let removeFromUrl = function (key) {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.delete(key);
    window.history.pushState({}, '', '?' + urlParams.toString());
  };

  return { setUrlParam, getFromUrl, removeFromUrl };
})();
