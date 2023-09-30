export class EventBus {
  callbackByEvent = new Map();
  emit(event, args) {
    this.callbackByEvent.get(event)(args);
  }
  on(event, callback) {
    this.callbackByEvent.set(event, callback);
  }
}

export class Timer {
  constructor(tick, callback) {
    this.tick = tick;
    this.start = Date.now();
    this.callback = callback;
  }
  run() {
    if (Date.now() - this.start > this.tick) {
      console.log("invoke");
      this.callback();
      this.start = Date.now();
    }
  }
}

export const rand = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};
