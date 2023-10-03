import { InternalEvent } from "./constants.js";

// 게임의 점수 시스템을 추상화한 클래스
export default class Score {
  numOfClearedLines = 0;
  score = 0;
  constructor(eventBus) {
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
