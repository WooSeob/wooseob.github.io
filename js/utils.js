export class EventBus {
  callbackByEvent = new Map();
  emit(event, args) {
    const callbacks = this.callbackByEvent.get(event);
    callbacks?.forEach((element) => {
      element(args);
    });
  }
  on(event, callback) {
    if (!this.callbackByEvent.get(event)) {
      this.callbackByEvent.set(event, []);
    }
    this.callbackByEvent.get(event).push(callback);
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
      this.callback();
      this.start = Date.now();
    }
  }

  decrease(val) {
    if (this.tick - val > 0) {
      this.tick -= val;
      return true;
    }
    return false;
  }
}

export const rand = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};
