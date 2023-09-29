import { Tetromino } from "./tetris/model.js";
import Block, { createStyle } from "./graphics/block.js";
import { Colors } from "./graphics/constants.js";
import { TetrominoTypes } from "./tetris/constants.js";

export default class GameManager {
  constructor(row, col, canvasBoard) {
    this.canvasBoard = canvasBoard;
    this.board = new Array(row).fill(0).map(() => new Array(col).fill(0));
    this.row = row;
    this.col = col;

    // this.blockWidth = Math.floor(canvasBoard.width / (col + 2));
    // this.blockHeight = Math.floor(canvasBoard.height / (row + 2));
    this.blockWidth = 25;
    this.blockHeight = 25;

    this.offsetX = this.blockWidth;
    this.offsetY = this.blockHeight;
    console.log(this);
    this.drawEdge();

    this.spawn().draw(this.canvasBoard.ctx);
  }

  drawEdge() {
    const drawBlock = (x, y) => {
      new Block(x, y, this.blockWidth, this.blockHeight, createStyle(Colors.Gray)).draw(
        this.canvasBoard.ctx
      );
    };

    // 상
    for (let x = 0; x < this.col + 2; x++) {
      drawBlock(0 + x * this.blockWidth, 0);
    }

    // 좌측
    for (let y = 1; y < this.row; y++) {
      drawBlock(0, 0 + y * this.blockHeight);
    }

    //우측
    for (let y = 1; y < this.row; y++) {
      drawBlock((this.col + 1) * this.blockWidth, 0 + y * this.blockHeight);
    }

    // 하단
    for (let x = 0; x < this.col + 2; x++) {
      drawBlock(0 + x * this.blockWidth, this.row * this.blockHeight);
    }
  }

  spawn() {
    return new Tetromino(
      TetrominoTypes.Z,
      this.offsetX,
      this.offsetY,
      Colors.Red,
      this.blockWidth,
      this.blockHeight
    );
  }
}

export class CanvasBoard {
  constructor(canvas) {
    this.ctx = canvas.getContext("2d");
    this.width = canvas.width;
    this.height = canvas.height;
  }
}
