import { Tetromino } from "./tetris/model.js";
import Block, { createStyle } from "./graphics/block.js";
import { getRandomColor } from "./graphics/constants.js";
import { Actions, getRandomTetrominoType } from "./tetris/constants.js";
import { Timer, EventBus } from "./utils.js";
import Board from "./tetris/core.js";
export default class GameManager {
  constructor(row, col, canvasBoard) {
    this.canvasBoard = canvasBoard;
    this.row = row + 2;
    this.col = col + 2;

    this.board = new Board(row, col);
    // this.blockWidth = Math.floor(canvasBoard.width / (col + 2));
    // this.blockHeight = Math.floor(canvasBoard.height / (row + 2));
    this.blockWidth = 35;
    this.blockHeight = 35;

    this.offsetX = this.blockWidth;
    this.offsetY = this.blockHeight;
    console.log(this);

    this.current = this.spawn();
    this.handler = () => {
      // 바닥에 안닿았으면
      //  내려가고
      // 바닥에 닿았으면
      //  충돌진행 버블 스타트
      //  새로운 테트로미노 생성
      // console.log(action);
      if (this.board.isMoveable(this.current, Actions.Down)) {
        this.current = this.current.ofDown(1);
      } else {
        this.board.updateBoard(this.current);
        this.current = this.spawn();
      }
    };

    this.eventBus = new EventBus();
    this.eventBus.on(Actions.Rotate, () => {
      if (this.board.isRotatable(this.current)) {
        this.current = this.current.ofRotate();
      }
    });
    this.eventBus.on(Actions.Left, () => {
      if (this.board.isMoveable(this.current, Actions.Left)) {
        this.current = this.current.ofMove(Actions.Left.delta.x, Actions.Left.delta.y);
      }
    });
    this.eventBus.on(Actions.Right, () => {
      if (this.board.isMoveable(this.current, Actions.Right)) {
        this.current = this.current.ofMove(Actions.Right.delta.x, Actions.Right.delta.y);
      }
    });

    this.timer = new Timer(100, this.handler);
  }

  spawn() {
    return new Tetromino(
      getRandomTetrominoType(),
      0,
      0,
      this.offsetX,
      this.offsetY,
      getRandomColor(),
      this.blockWidth,
      this.blockHeight
    );
  }

  render() {
    this.canvasBoard.ctx.clearRect(0, 0, this.canvasBoard.width, this.canvasBoard.height);

    const drawBlock = (x, y, color) => {
      new Block(
        x * this.blockWidth,
        y * this.blockHeight,
        this.blockWidth,
        this.blockHeight,
        createStyle(color)
      ).draw(this.canvasBoard.ctx);
    };

    // this.current.clear(this.canvasBoard.ctx);
    for (let y = 0; y < this.row; y++) {
      for (let x = 0; x < this.col; x++) {
        if (this.board.board[y][x] != 0) {
          drawBlock(x, y, this.board.board[y][x].color);
        }
      }
    }
    this.current.draw(this.canvasBoard.ctx);

    this.timer.run();
    this.canvasBoard.render();
  }
}

export class CanvasBoard {
  constructor(canvas) {
    canvas.offscreenCanvas = document.createElement("canvas");
    canvas.offscreenCanvas.width = canvas.width;
    canvas.offscreenCanvas.height = canvas.height;

    this.width = canvas.width;
    this.height = canvas.height;

    this.ctx = canvas.offscreenCanvas.getContext("2d", { willReadFrequently: true });
    this._mainCtx = canvas.getContext("2d");
  }

  render() {
    this._mainCtx.putImageData(this.ctx.getImageData(0, 0, this.width, this.height), 0, 0);
  }
}
