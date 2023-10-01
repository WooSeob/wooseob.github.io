import Block, { createStyle } from "../graphics/block.js";

export default class Tetromino {
  // blocks = [];
  constructor(arr, x, y, color) {
    this.arr = arr;
    this.x = x;
    this.y = y;
    this.color = color;
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
          createStyle(this.color)
        ).draw(ctx);
        // this.blocks.push(block);
      }
    }

    ctx.strokeRect(
      offset.x + this.x * block.width,
      offset.y + this.y * block.height,
      block.width * this.arr.length,
      block.height * this.arr[0].length
    );
  }

  ofRotate() {
    const newArr = JSON.parse(JSON.stringify(this.arr));

    for (let y = 0; y < newArr.length; ++y) {
      for (let x = 0; x < y; ++x) {
        [newArr[x][y], newArr[y][x]] = [newArr[y][x], newArr[x][y]];
      }
    }

    newArr.forEach((row) => row.reverse());

    return new Tetromino(newArr, this.x, this.y, this.color);
  }

  ofMove(dx, dy) {
    return new Tetromino(this.arr, this.x + dx, this.y + dy, this.color);
  }

  ofDown(dy) {
    return this.ofMove(0, dy);
  }
}

export class GuidedTetromino extends Tetromino {}
