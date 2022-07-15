import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class SortableTable {
  subElements = {};
  serverPortionSize = 30; //элементов за запрос
  constructor(headerConfig, {
    data = [],
    sorted = {
      id: headerConfig.find(item => item.sortable).id,
      order: 'asc'
    },
    url = '',
    isSortLocally = (url === '')
  } = {}) {

    this.headerConfig = headerConfig;
    this.data = data;
    this.sorted = sorted;
    this.url = url;
    this.isSortLocally = isSortLocally;
    this.init();
  }

  destroy() {
    this.element.remove();
    this.subElements = null;
    if(!this.isSortLocally) {
      window.removeEventListener('scroll', this.onWindowScroll);
    }
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
          
        </div>

        <div data-element="loading" class="loading-line sortable-table__loading-line"></div>

        <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
          <div>
            <p>No products satisfies your filter criteria</p>
          <button type="button" class="button-primary-outline">Reset all filters</button>
          </div>
        </div>
      </div>
    </div>`;
    this.element = wraper.firstElementChild;
    this.fillSubElements();
    
    if (this.sorted.id) {
      this.render();
    }

    this.subElements.header.addEventListener('pointerdown', this.onHeaderFieldPointerDown);
    if(!this.isSortLocally) {
      window.addEventListener('scroll', this.onWindowScroll);  
    }
    
  }

  fillSubElements() {
    const allDataElem = this.element.querySelectorAll("[data-element]");
    for (const element of allDataElem) {
      this.subElements[element.dataset.element] = element;
    }
  }

  onWindowScroll = (event) => {
    const windowRelativeBottom = document.documentElement.getBoundingClientRect().bottom;  
    if (windowRelativeBottom < (document.documentElement.clientHeight + 100) && !this.loading) {
      this.loading = true;
      this.sortOnServer(this.sorted.id, this.sorted.order).then(result => {
        if(result.length) {
          //Идея в том, чтобы не бросать серверу запросы, когда он вернул пустые данные. До пока пользователь не изменит значения фильтров(сортировки)
          this.loading = false; 
        }
      });
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

    if(!this.isSortLocally) {
      this.data = []; //очищаем данные
      this.loading = false; //признак "загрузка данных"
      this.subElements.body.innerHTML = ''; //очищаем содержимое таблицы
    }

    curColElement.setAttribute('data-order', this.sorted.order);
    this.render();

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

  getTableHTML(data = this.data) {
    return data.map(row => {
      return `<a href="#" class="sortable-table__row">${this.headerConfig.map(col => {
        return col.template ? col.template(row[col.id]) : `<div class="sortable-table__cell">${row[col.id]}</div>`;
      }).join('')}</a>`;
    }).join('');
  }

  render() {
    if (this.isSortLocally) {
      this.sortOnClient(this.sorted.id, this.sorted.order);
      this.subElements.body.innerHTML = this.getTableHTML();
      return this.data; 
    } else {

      return this.sortOnServer(this.sorted.id, this.sorted.order);
      
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

  async sortOnServer(fieldValue, orderValue) {

    const url = new URL(this.url, BACKEND_URL);
    const curDataLength = this.data.length;
    url.searchParams.set('_sort', fieldValue);
    url.searchParams.set('_order', orderValue);
    url.searchParams.set('_start', curDataLength);
    url.searchParams.set('_end', curDataLength+this.serverPortionSize);

    //отображаем индикатор загрузки
    this.subElements.loading.style.display = "block";
    let result = [];
    try {

      result = await fetchJson(url);  
      
      if(result.length) {
        this.data = [...this.data, ...result];
        this.subElements.body.insertAdjacentHTML('beforeend', this.getTableHTML(result)); 
      }
         
    } catch (error) {
      console.log(error);  //видимо...что-то случилось 
    }
    //отображаем сообщение "нет данных"
    this.subElements.emptyPlaceholder.style.display = (!result && !this.data) ? "block": "none";
    //скрываем индикатор загрузки
    this.subElements.loading.style.display = "none";
    return result;

  }
}

