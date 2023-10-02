import { InternalEvent } from "./constants.js";

export default class Score {
  score = 0;
  constructor(eventBus) {
    // eventBus.on(InternalEvent.TimerTick, () => {
    //   this.score += 100;
    //   eventBus.emit(InternalEvent.ScoreChanged, this.score);
    // });
    eventBus.on(InternalEvent.LineCleared, (numOfLines) => {
      this.score += numOfLines * 1000;
      eventBus.emit(InternalEvent.ScoreChanged, this.score);
    });
    eventBus.on(InternalEvent.DownFast, (amount) => {
      this.score += amount * 10;
      eventBus.emit(InternalEvent.ScoreChanged, this.score);
    });
  }

  get value() {
    return this.score;
  }
}
