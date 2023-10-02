import Block, { createEmptyDashedStyle, createStyle } from "../graphics/block.js";
import { Actions } from "./constants.js";

export default class Tetromino {
  // blocks = [];
  constructor(arr, x, y, style, showBound = false) {
    this.arr = arr;
    this.x = x;
    this.y = y;
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
        // this.blocks.push(block);
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

export class GuidedTetromino {
  constructor(real, guide, board) {
    this.real = real;
    this.guide = guide;
    this.board = board;
  }

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
      createEmptyDashedStyle(real.style.baseColor),
      real.showBound
    );
    while (board.isMoveable(guide, Actions.Down)) {
      guide = guide.ofDown(1);
    }
    return guide;
  }
}
