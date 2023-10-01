import { getRandomTetrominoType } from "./constants.js";
import { getRandomColor } from "../graphics/constants.js";
import { Tetromino } from "./model.js";
import { rand } from "../utils.js";

export default class Spawner {
  _next = undefined;
  originState = {};

  constructor(manager) {
    this.next = this._spawnInternal(manager);
  }

  spawn(manager) {
    const t = this.next;
    this.next = this._spawnInternal(manager);
    return t;
  }

  _spawnInternal(manager) {
    const center = (manager.col - 2) / 2 - 2;
    let tetromino = new Tetromino(
      getRandomTetrominoType(),
      center,
      0,
      manager.offsetX + center * manager.blockWidth,
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

  get next() {
    // 메인 캔버스에 스포닝 하기 위해 오프셋 정보 restore
    if (this._next === undefined) {
      return undefined;
    }

    return new Tetromino(
      this._next.arr,
      this.originState.x,
      this.originState.y,
      this.originState.offsetX,
      this.originState.offsetY,
      this._next.color,
      this._next.bWidth,
      this._next.bheight
    );
  }

  set next(value) {
    // 다음 테트로미노 영역에 표시하기 위해 오프셋 정보를 제거
    this.originState = {
      offsetX: value.offsetX,
      offsetY: value.offsetY,
      x: value.x,
      y: value.y,
    };

    this._next = new Tetromino(
      value.arr,
      0,
      0,
      0,
      0,
      value.color,
      value.bWidth,
      value.bheight
    );
  }
}
