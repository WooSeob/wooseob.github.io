import Block, { createStyle } from "../graphics/block.js";

export class Tetromino {
  // blocks = [];
  constructor(arr, x, y, offsetX, offsetY, color, bWidth, bheight) {
    this.arr = arr;
    this.x = x;
    this.y = y;
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
        const block = new Block(
          this.offsetX + x * this.bWidth,
          this.offsetY + y * this.bheight,
          this.bWidth,
          this.bheight,
          createStyle(this.color)
        );
        block.draw(ctx);
        // this.blocks.push(block);
      }
    }

    ctx.strokeRect(
      this.offsetX,
      this.offsetY,
      this.bWidth * this.arr.length,
      this.bheight * this.arr[0].length
    );
  }

  // clear(ctx) {
  //   this.blocks.forEach((b) => b.clear(ctx));
  //   this.blocks = [];
  //   ctx.clearRect(
  //     this.offsetX,
  //     this.offsetY,
  //     this.bWidth * this.arr.length,
  //     this.bheight * this.arr[0].length
  //   );
  // }

  ofRotate() {
    const newArr = JSON.parse(JSON.stringify(this.arr));

    for (let y = 0; y < newArr.length; ++y) {
      for (let x = 0; x < y; ++x) {
        [newArr[x][y], newArr[y][x]] = [newArr[y][x], newArr[x][y]];
      }
    }

    newArr.forEach((row) => row.reverse());

    return new Tetromino(
      newArr,
      this.x,
      this.y,
      this.offsetX,
      this.offsetY,
      this.color,
      this.bWidth,
      this.bheight
    );
  }

  ofMove(dx, dy) {
    return new Tetromino(
      this.arr,
      this.x + dx,
      this.y + dy,
      this.offsetX + dx * this.bWidth,
      this.offsetY + dy * this.bheight,
      this.color,
      this.bWidth,
      this.bheight
    );
  }

  ofDown(dy) {
    return this.ofMove(0, dy);
  }
}
