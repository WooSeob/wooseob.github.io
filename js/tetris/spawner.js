import { getRandomTetrominoType } from "./constants.js";
import { getRandomColor } from "../graphics/constants.js";
import { Tetromino } from "./model.js";
import { rand } from "../utils.js";

export default class Spawner {
  next;
  constructor() {}

  spawn(manager) {
    if (this.next) {
      const t = this.next;
      this.next = this._spawnInternal(manager);
      return t;
    }

    this.next = this._spawnInternal(manager);
    return this._spawnInternal(manager);
  }

  _spawnInternal(manager) {
    let tetromino = new Tetromino(
      getRandomTetrominoType(),
      0,
      0,
      manager.offsetX,
      manager.offsetY,
      getRandomColor(),
      manager.blockWidth,
      manager.blockHeight
    );

    // 랜덤 횟수 만큼 회전한 테트로미노를 생성
    const rotateCnt = rand(0, 4);
    for (let i = 0; i < rotateCnt; i++) {
      tetromino = tetromino.ofRotate();
    }
    return tetromino;
  }
}
