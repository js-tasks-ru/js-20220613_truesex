export default class SortableTable {
  constructor(headerConfig = [], data = []) {
    this.headerConfig = [...headerConfig];
    this.data = [...data];

    this.init();
  }

  init() {
    // //init header
    
    const headerParts = {
      sortFieldsSelect: [],
      headerTable: [],
      arrowSortText: `<span data-element="arrow" class="sortable-table__sort-arrow">
      <span class="sort-arrow"></span>
    </span>`
    };
    
    this.curSortOrder = 'asc';
    this.headerConfig.forEach(value => {
      
      if(value.sortable) {
        if(!this.curSortField) { 
          this.curSortField = value; //при инициализации берем первый сортабл столбец
        }
        headerParts.sortFieldsSelect.push(`<option${this.curSortField === value ? ' selected':''} value="${value.id}">${value.title}</option>`);  
      }

      headerParts.headerTable.push(`<div class="sortable-table__cell" data-id="${value.id}" data-sortable="${value.sortable}" data-order="asc">
        <span>${value.title}</span>
        ${this.curSortField === value ? headerParts.arrowSortText:''}
      </div>`);
          
    });

    document.getElementById('field').innerHTML = headerParts.sortFieldsSelect.join('');
    this.sort(this.curSortField.id, this.curSortOrder);

    const wraper = document.createElement('div');
    wraper.innerHTML = `
    <div data-element="productsContainer" class="products-list__container">
      <div class="sortable-table">
        <div data-element="header" class="sortable-table__header sortable-table__row">
          ${headerParts.headerTable.join('')}
        </div>
        
        <div data-element="body" class="sortable-table__body">
          ${this.getTableHTML()}
        </div>
      </div>
    </div>`;
    this.element = wraper.firstElementChild;

  }

  getTableHTML() {
    return this.data.map(row => {     
      return `<a href="#" class="sortable-table__row">${this.headerConfig.map(col => {
        return col.template ? col.template(row[col.id]) : `<div class="sortable-table__cell">${row[col.id]}</div>`     
      }).join('')}</a>`
    }).join('');
  }
  sort(fieldValue, orderValue) {

  }
}

