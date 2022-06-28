export default class ColumnChart {
  
  chartHeight = 50; 

  constructor(
    { data = [], 
      label = '',
      value = '',
      formatHeading = valueF => valueF } = {}) {

    this.data = data;
    this.label = label;
    this.value = formatHeading(value);
     
    this.render();
    this.update();
  }

  getLinkText() {
    return this.link !== undefined ? `<a class="column-chart__link" href="${this.link}">View all</a>` : '';
  }

  getTemplate() {
    return `
    <div class="column-chart column-chart_loading" style="--chart-height: 50">
      <div class="column-chart__title">
        ${this.label}
        ${this.getLinkText()}
      </div>
      <div class="column-chart__container">
        <div data-element="header" class="column-chart__header">
          ${this.value}
        </div>
        <div data-element="body" class="column-chart__chart">
        </div>
      </div>
    </div>
    `;
  }

  render() {
    const element = document.createElement('div');

    element.innerHTML = this.getTemplate();
    this.element = element.firstElementChild;
  }

  remove() {
    this.element.remove();
  }

  update(newData) {
    if (newData) { //из конструктора вызываем без параметров
      this.data = [...newData];
    }

    if ((this.data.length === 0) !== this.element.classList.contains('column-chart_loading')) {
      this.element.classList.toggle('column-chart_loading');
    }

    const maxValue = Math.max(...this.data);
    const scale = this.chartHeight/maxValue;

    this.element.querySelector('.column-chart__container .column-chart__chart').innerHTML =
      this.data.map(value => {
        return `
        <div style="--value: ${Math.floor(value*scale)}" data-tooltip="${(value/maxValue*100).toFixed()}%"></div>`
      }).join('');
  }

  destroy() {
    this.remove();
  }

}
