import Block, { createEmptyDashedStyle, createStyle } from "../graphics/block.js";
import { Actions } from "./constants.js";

// 여러개의 블록이 모여서 구성된 테트로미노를 추상화한 클래스
export default class Tetromino {
  // blocks = [];
  constructor(arr, x, y, style, showBound = false) {
    // 2차원 배열을 통해 테트로미노의 모양을 정의함
    this.arr = arr;
    // x, y : 해당 테트로미노의 2차원배열의 0,0(좌측 상단)좌표가 보드에서 위치하는 좌표
    this.x = x;
    this.y = y;
    // 블럭의 스타일은 외부에서 주입받음
    this.style = style;
    this.showBound = showBound;
  }

  draw(ctx, offset, block) {
    for (let y = 0; y < this.arr.length; y++) {
      for (let x = 0; x < this.arr[0].length; x++) {
        if (this.arr[y][x] != 1) {
          continue;
        }
        new Block(
          offset.x + (this.x + x) * block.width,
          offset.y + (this.y + y) * block.height,
          block.width,
          block.height,
          this.style
        ).draw(ctx);
      }
    }

    if (this.showBound) {
      ctx.strokeRect(
        offset.x + this.x * block.width,
        offset.y + this.y * block.height,
        block.width * this.arr.length,
        block.height * this.arr[0].length
      );
    }
  }

  ofRotate() {
    const newArr = JSON.parse(JSON.stringify(this.arr));

    for (let y = 0; y < newArr.length; ++y) {
      for (let x = 0; x < y; ++x) {
        [newArr[x][y], newArr[y][x]] = [newArr[y][x], newArr[x][y]];
      }
    }

    newArr.forEach((row) => row.reverse());

    return new Tetromino(newArr, this.x, this.y, this.style, this.showBound);
  }

  ofMove(dx, dy) {
    return new Tetromino(this.arr, this.x + dx, this.y + dy, this.style, this.showBound);
  }

  ofDown(dy) {
    return this.ofMove(0, dy);
  }
}

// 실제 테트로미노를 기반으로 바닥에 떨어졌을떄의 모습을 함께 보여주는 테트로미노
export class GuidedTetromino {
  constructor(real, guide, board) {
    this.real = real;
    this.guide = guide;
    this.board = board;
  }

  // 외부에서 참조하는 부분은 모두 실제 테트로미노의 값을 기준으로 반환
  get x() {
    return this.real.x;
  }

  get y() {
    return this.real.y;
  }

  get arr() {
    return this.real.arr;
  }

  get style() {
    return this.real.style;
  }

  draw(ctx, offset, block) {
    this.guide.draw(ctx, offset, block);
    this.real.draw(ctx, offset, block);
  }

  ofRotate() {
    return new GuidedTetromino(
      this.real.ofRotate(),
      GuidedTetromino.createGuide(this.board, this.real.ofRotate()),
      this.board
    );
  }

  ofMove(dx, dy) {
    return new GuidedTetromino(
      this.real.ofMove(dx, dy),
      // 상단에서 사영한 모습을 위해 guide 객체는 dy = 0 으로 생성함
      GuidedTetromino.createGuide(this.board, this.real.ofMove(dx, 0)),
      this.board
    );
  }

  ofDown(dy) {
    return this.ofMove(0, dy);
  }

  static createGuide(board, real) {
    let guide = new Tetromino(
      real.arr,
      real.x,
      real.y,
      createEmptyDashedStyle(real.style.baseColor), // 가이드는 대시 스타일로 생성
      real.showBound
    );
    // 하단으로 갈때까지 간 모습을 얻어낸다
    while (board.isMoveable(guide, Actions.Down)) {
      guide = guide.ofDown(1);
    }
    return guide;
  }
}
