class EventEmitter {
  static lastEventId = 0;

  id;
  eventElement;

  constructor() {
    this.id = EventEmitter.lastEventId;
    EventEmitter.lastEventId += 1;

    this.eventElement = Utility.e({
      name: "div",
      parent: document.body,
      style: "display: none;",
    });
  }

  on(eventName, callback) {
    this.eventElement.addEventListener("generic-event", (e) => {
      const detail = e.detail;
      if (detail && detail.key && detail.key == eventName) {
        callback(...detail.args);
      }
    });
  }

  emit(eventName, ...args) {
    const event = new CustomEvent("generic-event", {
      bubbles: false,
      detail: {
        key: eventName,
        args,
      },
    });
    this.eventElement.dispatchEvent(event);
  }
}
