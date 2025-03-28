const RECORDS_N = 10000;
const records = Object.values(
  generateOrders(RECORDS_N)
    .filter((val) => val.baristaId && val.coffeeId)
    .reduce((baristas, el) => {
      if (!baristas[el.baristaId]) {
        baristas[el.baristaId] = {
          baristaId: el.baristaId,
          ...Object.values(COFFEE_BY_ID)
            .map((el) => [el, el + ' price'])
            .flat()
            .reduce((obj, val) => {
              obj[val] = 0;
              return obj;
            }, {}),
          summ: 0,
        };
      }

      baristas[el.baristaId][COFFEE_BY_ID[el.coffeeId]] += el.cups;
      baristas[el.baristaId][COFFEE_BY_ID[el.coffeeId] + ' price'] += +(el.cups * el.price);
      baristas[el.baristaId].summ += +(el.cups * el.price);
      return baristas;
    }, {}),
);
const KEYS = ['index', ...new Set(records.flatMap((el) => Object.keys(el)))]; 

const forPrint = (lst = []) =>
  Array.from(lst, (el, i) => {
    let newEl = Object.assign({}, el);
    newEl.index = i;
    [...Object.values(COFFEE_BY_ID)
      .map((el) => [el, el + ' price']), 'summ']
      .flat()
      .forEach((val) => (newEl[val] = newEl[val].toFixed(+newEl[val] !== 0 ? 2 : 0)));
    return newEl;
  });

// console.table(records);
// console.log(COFFEE_BY_ID);

function renderTable(headers, rows, footer) {
  const rowsEl = document.createElement('table');

  const theadEl = document.createElement('thead');
  headers.forEach((key) => {
    const tdEl = document.createElement('th');
    tdEl.innerText = key;
    theadEl.appendChild(tdEl);
  });
  rowsEl.appendChild(theadEl);

  rows.forEach((el) => {
    const rowEl = document.createElement('tr');
    headers.forEach((key) => {
      const cellEl = document.createElement('td');
      cellEl.innerText = el[key];
      rowEl.appendChild(cellEl);
    });
    rowsEl.appendChild(rowEl);
  });

  const tfootEl = document.createElement('tfoot');
  if (footer) {
    footer.forEach((eli) => {
      const footerRowEl = document.createElement('tr');
      eli.forEach((elj) => {
        const cellEl = document.createElement('td');
        cellEl.innerHTML = elj;
        footerRowEl.appendChild(cellEl);
      });
      tfootEl.appendChild(footerRowEl);
    });

    rowsEl.appendChild(tfootEl);
  }

  tableView.appendChild(rowsEl);
}

let mertics = {};

// validStudents.forEach((s) => {
//   s.avg = exams.reduce((sum, x) => sum + s[x], 0) / exams.length
// })


renderTable(
  KEYS,
  paginate(sortByKey(forPrint(records), 'coffeeId')).data,
  [
    ['Avg', 20, 30, 40],
    ['Avg', 20, 30, 40],
  ],
);
