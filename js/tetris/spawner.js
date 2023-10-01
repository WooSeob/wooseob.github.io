import { getRandomTetrominoType } from "./constants.js";
import { getRandomColor } from "../graphics/constants.js";
import Tetromino, { GuidedTetromino } from "./model.js";
import { rand } from "../utils.js";
import { Actions } from "./constants.js";
import { createEmptyDashedStyle, createStyle } from "../graphics/block.js";

export default class Spawner {
  _next = undefined;
  originState = {};

  constructor(manager) {
    this.next = this._spawnInternal(manager);
  }

  spawn(manager) {
    const real = this.next;
    this.next = this._spawnInternal(manager);
    return new GuidedTetromino(real, this._getGuide(manager, real), manager.board);
  }

  _getGuide(manager, real) {
    let guide = new Tetromino(
      real.arr,
      real.x,
      real.y,
      createEmptyDashedStyle(real.style.baseColor)
    );
    while (manager.board.isMoveable(guide, Actions.Down)) {
      guide = guide.ofDown(1);
    }
    return guide;
  }

  _spawnInternal(manager) {
    const center = (manager.col - 2) / 2 - 2;
    let tetromino = new Tetromino(
      getRandomTetrominoType(),
      center,
      0,
      createStyle(getRandomColor())
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
      this._next.style
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

    this._next = new Tetromino(value.arr, 0, 0, value.style);
  }
}
