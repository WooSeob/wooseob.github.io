import { InternalEvent } from "./constants.js";

export default class Score {
  numOfClearedLines = 0;
  score = 0;
  constructor(eventBus) {
    // eventBus.on(InternalEvent.TimerTick, () => {
    //   this.score += 100;
    //   eventBus.emit(InternalEvent.ScoreChanged, this.score);
    // });
    eventBus.on(InternalEvent.LineCleared, (numOfLines) => {
      this.score += numOfLines * 1000;
      this.numOfClearedLines += numOfLines;
      eventBus.emit(InternalEvent.ScoreChanged, this.score);
    });
    eventBus.on(InternalEvent.DownFast, (amount) => {
      this.score += amount * 10;
      eventBus.emit(InternalEvent.ScoreChanged, this.score);
    });
  }

  get value() {
    return {
      score: this.score,
      clearedLines: this.numOfClearedLines,
    };
  }
}
