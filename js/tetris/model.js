import Block, { createStyle } from "../graphics/block.js";

export class Tetromino {
  blocks = [];
  constructor(arr, offsetX, offsetY, color, bWidth, bheight) {
    this.arr = arr;
    this.offsetX = offsetX;
    this.offsetY = offsetY;

    this.bWidth = bWidth;
    this.bheight = bheight;
    this.color = color;
  }

  draw(ctx) {
    this.blocks.forEach((b) => b.clear(ctx));
    this.blocks = [];
    for (let y = 0; y < this.arr.length; y++) {
      for (let x = 0; x < this.arr[0].length; x++) {
        if (this.arr[y][x] != 1) {
          continue;
        }
        const block = new Block(
          this.offsetX + x * this.bWidth,
          this.offsetY + y * this.bheight,
          this.bWidth,
          this.bheight,
          createStyle(this.color)
        );
        block.draw(ctx);
        this.blocks.push(block);
      }
    }
  }

  rotate() {
    for (let y = 0; y < this.arr.length; ++y) {
      for (let x = 0; x < y; ++x) {
        [this.arr[x][y], this.arr[y][x]] = [this.arr[y][x], this.arr[x][y]];
      }
    }

    this.arr.forEach((row) => row.reverse());
  }

  move(dx, dy) {
    this.offsetX += dx;
    this.offsetY += dy;
  }

  down(dy) {
    this.move(0, dy);
  }
}
