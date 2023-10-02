import { InternalEvent } from "./constants.js";

export default class Level {
  constructor(eventBus, timer) {
    this.timer = timer;
    this.level = 1;
    eventBus.on(InternalEvent.LineCleared, () => {
      if (timer.decrease(25)) {
        this.level += 1;
        console.log(this.level);
      }
    });
  }
}
