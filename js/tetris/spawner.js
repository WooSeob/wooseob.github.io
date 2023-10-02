import { getRandomTetrominoType } from "./constants.js";
import { getRandomColor } from "../graphics/constants.js";
import Tetromino, { GuidedTetromino } from "./model.js";
import { rand } from "../utils.js";
import { createStyle } from "../graphics/block.js";

export default class Spawner {
  _nexts = [];

  originState = {};

  constructor(manager, containingSize = 1) {
    this.next = this._spawnInternal(manager);
    this.config = manager.config;

    this._nexts = [];
    Array(containingSize)
      .fill(0)
      .forEach(() => (this.next = this._spawnInternal(manager)));
  }

  static TetrominoType = {
    Default: (manager, tetromino) => tetromino,
    Guided: (manager, tetromino) => {
      return new GuidedTetromino(
        tetromino,
        GuidedTetromino.createGuide(manager.board, tetromino),
        manager.board
      );
    },
  };

  spawn(manager) {
    const real = this.next;
    this.next = this._spawnInternal(manager);

    const tetrominoWrapper = this.config.spawningType ?? Spawner.TetrominoType.Default;
    return tetrominoWrapper(manager, real);
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

  get allNexts() {
    return this._nexts;
  }

  get next() {
    // 메인 캔버스에 스포닝 하기 위해 오프셋 정보 restore
    if (this._nexts.length === 0) {
      return undefined;
    }

    const _next = this._nexts.shift();

    return new Tetromino(
      _next.arr,
      this.originState.x,
      this.originState.y,
      _next.style,
      this.config.dev.showBound
    );
  }

  set next(value) {
    // 다음 테트로미노 영역에 표시하기 위해 오프셋 정보를 제거
    this.originState = {
      x: value.x,
      y: value.y,
    };

    this._nexts.push(new Tetromino(value.arr, 0, 0, value.style, value.showBound));
    console.log(this._nexts);
  }
}
