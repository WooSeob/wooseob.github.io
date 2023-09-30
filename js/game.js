import { Tetromino } from "./tetris/model.js";
import Block, { createStyle } from "./graphics/block.js";
import { Colors, getRandomColor } from "./graphics/constants.js";
import { Actions, getRandomTetrominoType } from "./tetris/constants.js";
import { Timer, EventBus } from "./utils.js";
export default class GameManager {
  constructor(row, col, canvasBoard) {
    this.canvasBoard = canvasBoard;
    this.board = new Array(row + 2).fill(0).map(() => new Array(col + 2).fill(0));
    this.row = row + 2;
    this.col = col + 2;

    // this.blockWidth = Math.floor(canvasBoard.width / (col + 2));
    // this.blockHeight = Math.floor(canvasBoard.height / (row + 2));
    this.blockWidth = 35;
    this.blockHeight = 35;

    this.offsetX = this.blockWidth;
    this.offsetY = this.blockHeight;
    console.log(this);
    this.drawEdge();

    this.current = this.spawn();
    this.handler = () => {
      // 바닥에 안닿았으면
      //  내려가고
      // 바닥에 닿았으면
      //  충돌진행 버블 스타트
      //  새로운 테트로미노 생성
      // console.log(action);
      if (this.isMoveable(Actions.Down)) {
        this.current = this.current.ofDown(1);
      } else {
        for (let y = 0; y < this.current.arr.length; y++) {
          for (let x = 0; x < this.current.arr[0].length; x++) {
            if (this.current.arr[y][x] == 0) {
              continue;
            }
            this.board[this.current.y + y + 1][this.current.x + x + 1] = {
              color: this.current.color,
            };
          }
        }
        this.current = this.spawn();
      }
    };

    this.eventBus = new EventBus();
    this.eventBus.on(Actions.Rotate, () => {
      if (this.isRotatable(Actions.Rotate)) {
        this.current = this.current.ofRotate();
      }
    });
    this.eventBus.on(Actions.Left, () => {
      if (this.isMoveable(Actions.Left)) {
        this.current = this.current.ofMove(Actions.Left.delta.x, Actions.Left.delta.y);
      }
    });
    this.eventBus.on(Actions.Right, () => {
      if (this.isMoveable(Actions.Right)) {
        this.current = this.current.ofMove(Actions.Right.delta.x, Actions.Right.delta.y);
      }
    });

    this.timer = new Timer(500, this.handler);
  }

  previewPosition(action) {
    return {
      newX: this.current.x + action.delta.x,
      newY: this.current.y + action.delta.y,
    };
  }

  isRotatable() {
    const rotatedState = this.current.ofRotate();

    for (let y = 0; y < rotatedState.arr.length; y++) {
      for (let x = 0; x < rotatedState.arr[0].length; x++) {
        if (
          rotatedState.arr[y][x] &&
          this.getBoardState(rotatedState.y + y, rotatedState.x + x)
        ) {
          return false;
        }
      }
    }
    return true;
  }

  isMoveable(action) {
    // 내부 표현
    const { newX, newY } = this.previewPosition(action);

    for (let y = 0; y < this.current.arr.length; y++) {
      for (let x = 0; x < this.current.arr[0].length; x++) {
        if (this.current.arr[y][x] && this.getBoardState(newY + y, newX + x)) {
          return false;
        }
      }
    }

    return true;
  }

  getBoardState(y, x) {
    return this.board[y + 1][x + 1];
  }

  drawEdge() {
    // 상
    for (let x = 0; x < this.col; x++) {
      this.board[0][x] = { color: Colors.Gray };
    }
    // 좌측
    for (let y = 1; y < this.row; y++) {
      this.board[y][0] = { color: Colors.Gray };
    }
    //우측
    for (let y = 1; y < this.row; y++) {
      this.board[y][this.col - 1] = { color: Colors.Gray };
    }
    // 하단
    for (let x = 0; x < this.col; x++) {
      this.board[this.row - 1][x] = { color: Colors.Gray };
    }
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
        if (this.board[y][x] != 0) {
          drawBlock(x, y, this.board[y][x].color);
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
