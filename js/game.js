import { MainView, SpawnView } from "./graphics/canvas.js";
import { Actions, InternalEvent } from "./tetris/constants.js";
import { Timer, EventBus } from "./utils.js";
import Board from "./tetris/core.js";
import Score from "./tetris/score.js";
import Spawner from "./tetris/spawner.js";
import Level from "./tetris/level.js";

export default class GameManager {
  isRunning = false;
  config = {
    spawningType: Spawner.TetrominoType.Guided,
    dev: {
      showBound: false,
    },
  };

  constructor(row, col, mainCanvas, spawnCanvas, onScoreChange, onGameOver) {
    const blockWidth = Math.floor(mainCanvas.width / (col + 2));
    const blockHeight = Math.floor(mainCanvas.height / (row + 2));

    this.canvasBoard = new MainView(mainCanvas, blockWidth, blockHeight);
    this.nextCanvasBoard = new SpawnView(spawnCanvas, blockWidth * 0.5, blockHeight * 0.5);
    this.row = row + 2;
    this.col = col + 2;

    this.board = new Board(this.row, this.col);
    console.log(this);

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
    this.eventBus.on(Actions.Down, () => {
      if (this.board.isMoveable(this.current, Actions.Down)) {
        this.current = this.current.ofMove(Actions.Down.delta.x, Actions.Down.delta.y);
      }
    });

    this.eventBus.on(Actions.Drop, () => {
      while (this.board.isMoveable(this.current, Actions.Down)) {
        this.current = this.current.ofMove(Actions.Down.delta.x, Actions.Down.delta.y);
      }
    });
    this.eventBus.on(InternalEvent.ScoreChanged, (score) => {
      onScoreChange(score);
    });
    this.eventBus.on(InternalEvent.GameOvered, (score) => {
      onGameOver(score);
    });
  }

  start() {
    this.spawner = new Spawner(this);
    this.board = new Board(this.row, this.col);
    this.score = new Score(this.eventBus);

    this.current = this.spawner.spawn(this);

    this.isRunning = true;
    this.timer = new Timer(500, () => {
      if (this.isRunning) {
        this.eventBus.emit(InternalEvent.TimerTick);
        this.handle();
      }
    });
    this.level = new Level(this.eventBus, this.timer);
  }

  handle() {
    if (this.board.isMoveable(this.current, Actions.Down)) {
      this.current = this.current.ofDown(1);
    } else {
      this.board.updateBoard(this.current);

      let clearLines = this.board.getClearableLines();
      while (clearLines.length > 0) {
        this.eventBus.emit(InternalEvent.LineCleared, clearLines.length);
        this.board.spliceLines(clearLines);
        this.board.mergeLines(clearLines);
        clearLines = this.board.getClearableLines();
      }

      const spawningTetromino = this.spawner.spawn(this);
      if (this.board.isGameOver(spawningTetromino)) {
        this.isRunning = false;
        this.eventBus.emit(InternalEvent.GameOvered, this.score.value);
        return;
      }

      this.current = spawningTetromino;
    }
  }

  render() {
    this.canvasBoard.clear();
    this.nextCanvasBoard.clear();

    this.canvasBoard.draw(this.board, this.current);
    this.nextCanvasBoard.draw(this.spawner);

    this.timer?.run();

    this.canvasBoard.render();
    this.nextCanvasBoard.render();
  }
}
