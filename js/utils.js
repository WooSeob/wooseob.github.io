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
  blockElapsed = 0;
  prev = undefined;

  constructor(tick, callback) {
    this.tick = tick;
    const now = Date.now();
    this.start = now;
    this.startTime = now;
    this.callback = callback;
  }

  run(timestamp) {
    this._accumulatePausedTime(Math.floor(timestamp));
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

  _accumulatePausedTime(timestamp) {
    if (this.prev === undefined) {
      this.prev = timestamp;
    }

    const diff = timestamp - this.prev;
    if (diff > 160) {
      console.log(diff);
      this.blockElapsed += diff;
    }

    this.prev = timestamp;
  }

  get elapsed() {
    return Date.now() - this.startTime - this.blockElapsed;
  }
}

export const rand = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

export const wrapAlert = (callback) => {
  var _old_alert = window.alert;
  window.alert = function () {
    const start = Date.now();
    _old_alert.apply(window, arguments);
    const elapsed = Date.now() - start;
    callback(elapsed);
  };
};
