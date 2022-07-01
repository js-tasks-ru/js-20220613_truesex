export default class NotificationMessage {
  static curNotificationObj;

  constructor(textMessage = '', {
    duration = 2000,
    type = 'success'
  } = {}) {
    this.textMessage = textMessage;
    this.duration = duration;
    this.type = type;

    //init element
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.getTemplate();
    this.element = wrapper.firstElementChild;
  }

  getTemplate() {
    return `<div class="notification ${this.type}" style="--value:${(this.duration/1000).toFixed()}s">
    <div class="timer"></div>
    <div class="inner-wrapper">
      <div class="notification-header">${this.type}</div>
      <div class="notification-body">
      ${this.textMessage}
      </div>
    </div>
  </div>`;
  }

  show(targetElement = document.body) {

    if (NotificationMessage.curNotificationObj) {
      NotificationMessage.curNotificationObj.destroy();
    }
    NotificationMessage.curNotificationObj = this;

    targetElement.append(this.element);
    setTimeout(thisNotificationObj => {
      if (thisNotificationObj === NotificationMessage.curNotificationObj) {
        thisNotificationObj.destroy();
      }
    }, this.duration, this); 
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
    NotificationMessage.curNotificationObj = null;
  }
}
