import { MainView, SpawnView } from "./graphics/canvas.js";
import { Actions, InternalEvent } from "./tetris/constants.js";
import { Timer, EventBus } from "./utils.js";
import Board from "./tetris/core.js";
import Score from "./tetris/score.js";
import Spawner from "./tetris/spawner.js";
import Level from "./tetris/level.js";

// 게임 매니저 클래스. 리스너, 출력 등을 포함한 외부 인터페이스에 해당함
export default class GameManager {
  isRunning = false;
  config = {
    spawningType: Spawner.TetrominoType.Guided,
    dev: {
      showBound: false,
    },
  };

  constructor(row, col, mainCanvas, spawnCanvas, onScoreChange, onGameOver) {
    this.row = row + 2;
    this.col = col + 2;
    this.board = new Board(this.row, this.col);

    const blockWidth = Math.floor(mainCanvas.width / (col + 2));
    const blockHeight = Math.floor(mainCanvas.height / (row + 2));

    this.mainView = new MainView(mainCanvas, blockWidth, blockHeight);
    this.spawnView = new SpawnView(
      spawnCanvas,
      Math.floor(blockWidth * 0.7),
      Math.floor(blockHeight * 0.7)
    );

    this.eventBus = new EventBus();
    this._initEventBusListeners(onScoreChange, onGameOver);
  }

  _initEventBusListeners(onScoreChange, onGameOver) {
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
        this.eventBus.emit(InternalEvent.DownFast, 1);
      }
    });
    this.eventBus.on(Actions.Drop, () => {
      let amount = 0;
      while (this.board.isMoveable(this.current, Actions.Down)) {
        this.current = this.current.ofMove(Actions.Down.delta.x, Actions.Down.delta.y);
        amount += 1;
      }
      if (amount > 0) {
        this.eventBus.emit(InternalEvent.DownFast, amount);
      }
    });
    this.eventBus.on(InternalEvent.ScoreChanged, (score) => {
      onScoreChange(score);
    });
    this.eventBus.on(InternalEvent.GameOvered, (result) => {
      onGameOver({
        ...result,
        elapsed: this.timer.elapsed,
      });
    });
  }

  start() {
    const timer = new Timer(400, () => {
      if (this.isRunning) {
        this.eventBus.emit(InternalEvent.TimerTick);
        this._handle();
      }
    });

    this.board = new Board(this.row, this.col);
    this.score = new Score(this.eventBus);
    this.level = new Level(this.eventBus, timer);
    this.spawner = new Spawner(this, 3);

    this.current = this.spawner.spawn(this);
    this.isRunning = true;
    this.timer = timer;
  }

  // 게임 진행 타이머가 작동할 떄 마다 호출되는 게임루프 메서드
  _handle() {
    if (this.board.isMoveable(this.current, Actions.Down)) {
      // 내려갈 수 있으면, 내려간다.
      this.current = this.current.ofDown(1);
      return;
    }

    // 현재 테트로미노가 최종적으로 내려오면, 기존 보드에 반영하고,
    this.board.updateBoard(this.current);

    // 삭제할 수 있는 라인들을 모두 찾아 삭제한 후
    let clearLines = this.board.getClearableLines();
    while (clearLines.length > 0) {
      this.eventBus.emit(InternalEvent.LineCleared, clearLines.length);
      this.board.spliceLines(clearLines);
      this.board.mergeLines(clearLines);
      clearLines = this.board.getClearableLines();
    }

    // 새로운 테트로미노를 스폰
    const spawningTetromino = this.spawner.spawn(this);

    // 게임 오버 체크
    if (this.board.isGameOver(spawningTetromino)) {
      this.isRunning = false;
      this.eventBus.emit(InternalEvent.GameOvered, this.score.value);
      return;
    }

    this.current = spawningTetromino;
  }

  // 해당 클래스를 가지는쪽에서
  // requestAnimationFrame을 통해 화면 주사율 주기로 호출해주는 렌더링 메서드
  render(timestamp) {
    this.mainView.clear();
    this.spawnView.clear();

    this.mainView.draw(this.board, this.current);
    this.spawnView.draw(this.spawner);

    this.timer?.run(timestamp);

    this.mainView.render();
    this.spawnView.render();
  }
}
