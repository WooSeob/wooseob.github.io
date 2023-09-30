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

    this.timer = new Timer(100, () => {
      this.handle();
    });
  }

  handle() {
    if (this.board.isMoveable(this.current, Actions.Down)) {
      this.current = this.current.ofDown(1);
    } else {
      this.board.updateBoard(this.current);

      let clearLines = this.board.getClearableLines();
      while (clearLines.length > 0) {
        this.board.spliceLines(clearLines);
        this.board.mergeLines(clearLines);
        clearLines = this.board.getClearableLines();
      }

      const spawningTetromino = this.spawn();
      if (this.board.isGameOver(spawningTetromino)) {
        alert("gameover");
      }

      this.current = spawningTetromino;
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
