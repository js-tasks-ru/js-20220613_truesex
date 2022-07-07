class Tooltip {
  static curTooltip;
  constructor() {
    if (Tooltip.curTooltip) {
      return Tooltip.curTooltip;
    }
    Tooltip.curTooltip = this;   
  }

  render = (tooltipText) => {
    this.element.innerHTML = tooltipText; 
    if(this.element.parentElement !== document.body) {
      document.body.append(this.element);
      document.addEventListener('pointermove', this.onPointerMove);
    }
  }

  onPointerOver = (event) => {
    if (event.target.dataset.tooltip) {
      this.render(event.target.dataset.tooltip);
      this.element.style.left = event.clientX + 'px';
      this.element.style.top = event.clientY + 'px';
    }
  }

  onPointerOut = (event) => {
    if (event.target.dataset.tooltip) {
      document.removeEventListener('pointermove', this.onPointerMove); 
      this.element.remove();  
    }
  }

  onPointerMove = (event) => {
    this.element.style.left = event.clientX + 'px';
    this.element.style.top = event.clientY + 'px';
  }

  initialize() {
    const wraper = document.createElement('div');
    wraper.innerHTML = `<div class="tooltip">This is tooltip</div>`;
    this.element = wraper.firstElementChild;
    document.addEventListener('pointerover', this.onPointerOver);
    document.addEventListener('pointerout', this.onPointerOut);
    
  }

  destroy() {
    if (this.element) {
      this.element.remove();
      this.element = null;
    }
    document.removeEventListener('pointerover', this.onPointerOver);
    document.removeEventListener('pointerout', this.onPointerOut);
    document.removeEventListener('pointermove', this.onPointerMove);
  }
}

export default Tooltip;
