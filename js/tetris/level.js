import { InternalEvent } from "./constants.js";

// 게임의 레벨 시스템을 추상화한 클래스
export default class Level {
  constructor(eventBus, timer) {
    this.timer = timer;
    this.level = 1;
    eventBus.on(InternalEvent.LineCleared, () => {
      // 라인 클리어 시 타이머 속도를 25ms 빠르게 설정
      if (timer.decrease(25)) {
        this.level += 1;
        console.log(this.level);
      }
    });
  }
}
