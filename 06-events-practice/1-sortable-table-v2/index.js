export default class SortableTable {
  subElements = {};

  constructor(headerConfig, {
    data = [],
    sorted = {},
    isSortLocally = true
  } = {}) {

    this.headerConfig = headerConfig;
    this.data = data;
    this.sorted = sorted;
    this.isSortLocally = isSortLocally;
    this.init();
  }

  destroy() {
    this.element.remove();
    this.subElements = null;
  }

  init() {
    const wraper = document.createElement('div');
    if (this.sorted.id) {
      this.sort(this.sorted.id, this.sorted.order);
    }
    wraper.innerHTML = `
    <div data-element="productsContainer" class="products-list__container">
      <div class="sortable-table">
        <div data-element="header" class="sortable-table__header sortable-table__row">
          ${this.getTableHeaderHTML()}
        </div>
        
        <div data-element="body" class="sortable-table__body">
          ${this.getTableHTML()}
        </div>
      </div>
    </div>`;
    this.element = wraper.firstElementChild;
    this.fillSubElements();
    this.subElements.header.addEventListener('pointerdown', this.onHeaderFieldPointerDown);
  }

  fillSubElements() {    
    const allDataElem = this.element.querySelectorAll("[data-element]");
    for (const element of allDataElem) {
      this.subElements[element.dataset.element] = element;
    }
  }

  onHeaderFieldPointerDown = (event) => {
    const curColElement = event.target.closest('div .sortable-table__cell');
    if (!(curColElement && curColElement.dataset.sortable === 'true')) {
      return;
    }

    if (this.sorted.id !== curColElement.dataset.id) {
      this.sorted.id = curColElement.dataset.id;
      curColElement.append(this.subElements.arrow);
    } 

    const ord = {
      asc: 'desc',
      desc: 'asc'
    };
    this.sorted.order = ord[this.sorted.order]; //инверсия

    curColElement.setAttribute('data-order', this.sorted.order);
    this.sort(this.sorted.id, this.sorted.order);
    this.subElements.body.innerHTML = this.getTableHTML();
  }

  getTableHeaderHTML() {
    const arrowSortText = `<span data-element="arrow" class="sortable-table__sort-arrow">
      <span class="sort-arrow"></span>
    </span>`;
    return this.headerConfig.map(value => {
      return `<div class="sortable-table__cell" data-id="${value.id}" data-sortable="${value.sortable}" data-order="${this.sorted.order}">
            <span>${value.title}</span>
            ${this.sorted.id === value.id ? arrowSortText : ''}
            </div>`;
    }).join('');
  }

  getTableHTML() {
    return this.data.map(row => {
      return `<a href="#" class="sortable-table__row">${this.headerConfig.map(col => {
        return col.template ? col.template(row[col.id]) : `<div class="sortable-table__cell">${row[col.id]}</div>`;
      }).join('')}</a>`;
    }).join('');
  }

  sort(fieldValue, orderValue) {
    if (this.isSortLocally) {
      this.sortOnClient(fieldValue, orderValue);
    } else {
      this.sortOnServer(fieldValue, orderValue);
    }
  }

  sortOnClient(fieldValue, orderValue) {
    const sortOrderNum = {
      desc: -1,
      asc: 1
    };
    const curSortType = this.headerConfig.find(value => value.id === fieldValue).sortType;
    this.data.sort((a, b) => {
      if (curSortType === 'string') {
        return a[fieldValue].localeCompare(b[fieldValue], ['ru', 'en']) * sortOrderNum[orderValue];
      } else { //number все остальные
        return (a[fieldValue] - b[fieldValue]) * sortOrderNum[orderValue];
      }
    });
  }

  sortOnServer(fieldValue, orderValue) {

  }
}
