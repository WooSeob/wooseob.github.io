import Block, { createStyle } from "../graphics/block.js";

export class Tetromino {
  constructor(arr, offsetX, offsetY, color, bWidth, bheight) {
    this.arr = arr;
    this.offsetX = offsetX;
    this.offsetY = offsetY;

    this.bWidth = bWidth;
    this.bheight = bheight;
    this.color = color;
  }

  draw(ctx) {
    for (let y = 0; y < this.arr.length; y++) {
      for (let x = 0; x < this.arr[0].length; x++) {
        if (this.arr[y][x] != 1) {
          continue;
        }
        new Block(
          this.offsetX + x * this.bWidth,
          this.offsetY + y * this.bheight,
          this.bWidth,
          this.bheight,
          createStyle(this.color)
        ).draw(ctx);
      }
    }
  }
}
