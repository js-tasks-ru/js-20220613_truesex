export default class SortableTable {
  constructor(headerConfig = [], data = []) {
    this.headerConfig = [...headerConfig];
    this.data = [...data];
    this.curSortOrder = '';
    this.init();
  }

  destroy() {
    this.element.remove();
    this.subElements = null;
  }

  init() {
    const wraper = document.createElement('div');
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
  }

  fillSubElements() {
    this.subElements = {};
    const allDataElem = this.element.querySelectorAll("[data-element]");
    for (const element of allDataElem) {
      this.subElements[element.dataset.element] = element;
    }
  }

  getTableHeaderHTML() {
    const arrowSortText = `<span data-element="arrow" class="sortable-table__sort-arrow">
      <span class="sort-arrow"></span>
    </span>`;
    return this.headerConfig.map(value => {
      if (value.sortable && !this.curSortField) {
        this.curSortField = value;
      }
      return `<div class="sortable-table__cell" data-id="${value.id}" data-sortable="${value.sortable}" data-order="${this.curSortOrder}">
            <span>${value.title}</span>
            ${this.curSortField === value ? arrowSortText : ''}
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

    let sortFlag = false;
    const headerElement = this.subElements.header.querySelector(`[data-id=${fieldValue}]`);
    headerElement.setAttribute('data-order', orderValue);
    if (fieldValue !== this.curSortField.id) {
      headerElement.append(this.subElements.arrow);
      this.curSortField = this.headerConfig.find(value => value.id === fieldValue);
      sortFlag = true;
    }
    sortFlag = sortFlag || orderValue !== this.curSortOrder;
    this.curSortOrder = orderValue;
    
    //если ни направление сортировки не поменялось ни поле сортировки и нажали на кнопку - не обновляем таблицы
    if(sortFlag) {
      this.sortData(); 
      this.subElements.body.innerHTML = this.getTableHTML();
    }
  }

  sortData() {
    const sortOrderNum = {
      desc: -1,
      asc: 1
    };
    const curSortFieldId = this.curSortField.id;
    this.data.sort((a, b) => {
      if (this.curSortField.sortType === 'string') {
        return a[curSortFieldId].localeCompare(b[curSortFieldId], ['ru', 'en']) * sortOrderNum[this.curSortOrder];
      } else { //number все остальные
        return (a[curSortFieldId] - b[curSortFieldId]) * sortOrderNum[this.curSortOrder];
      }
    });
  }
}