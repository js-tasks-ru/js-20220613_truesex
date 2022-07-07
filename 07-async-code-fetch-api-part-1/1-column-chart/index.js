import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChart {

    chartHeight = 50;
    subElements = {};

    constructor({
        url = '',
        range = {},
        label = '',
        value = '',
        link = '',
        formatHeading = valueF => valueF
    } = {}) {

        this.url = url;
        this.range = range;
        this.label = label;
        this.value = formatHeading(value);
        this.link = link;
        this.render();
        this.update();
    }

    getLinkText() {
        return this.link ? `<a class="column-chart__link" href="${this.link}">View all</a>` : '';
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
        </div>`;
    }

    fillSubElements() {
        const allDataElem = this.element.querySelectorAll("[data-element]");
        for (const element of allDataElem) {
            this.subElements[element.dataset.element] = element;
        }
    }

    render() {
        const element = document.createElement('div');

        element.innerHTML = this.getTemplate();
        this.element = element.firstElementChild;
        this.fillSubElements();
    }

    remove() {
        this.element.remove();
    }

    update(from, to) {
        if (from && to) { //из конструктора вызываем без параметров
            this.range.from = from;
            this.range.to = to;
        }

        //отображаем скелет
        if (!this.element.classList.contains('column-chart_loading')) {
            this.element.classList.add('column-chart_loading');
        }

        if (!(this.range.from || this.range.to)) {
            return;
        }
        const url = new URL(this.url, BACKEND_URL);
        url.searchParams.set('from', this.range.from.toISOString());
        url.searchParams.set('to', this.range.to.toISOString());

        return fetchJson(url).then(result => {
            if (!result) {
                return result;
            }

            this.data = Object.values(result);
            const maxValue = Math.max(...this.data);
            const scale = this.chartHeight / maxValue;

            this.subElements.body.innerHTML =
                this.data.map(value => {
                    return `
                    <div style="--value: ${Math.floor(value * scale)}" data-tooltip="${(value / maxValue * 100).toFixed()}%"></div>`
                }).join('');
            this.element.classList.remove('column-chart_loading');
            return result;         
                
        });
        
    }

    destroy() {
        this.element.remove();
    }

}