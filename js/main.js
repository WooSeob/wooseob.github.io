import GameManager from "./game.js";
import { Actions } from "./tetris/constants.js";
import Spawner from "./tetris/spawner.js";

function initCanvasDpr(canvas) {
  const dpr = window.devicePixelRatio;
  // 캔버스 요소의 크기 가져오기
  const rect = canvas.getBoundingClientRect();

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;

  // scale() 함수를 사용하여 캔버스 유닛 크기 보정
  canvas.getContext("2d").scale(dpr, dpr);
}

const KeyCode = {
  UP: 38,
  LEFT: 37,
  RIGHT: 39,
  DOWN: 40,
  SPACE: 32,
};

const UserInputActionsMapping = new Map([
  [KeyCode.UP, Actions.Rotate],
  [KeyCode.LEFT, Actions.Left],
  [KeyCode.RIGHT, Actions.Right],
  [KeyCode.DOWN, Actions.Down],
  [KeyCode.SPACE, Actions.Drop],
]);

const mainCanvas = document.getElementById("main-container");
const spawnCanvas = document.getElementById("next-container");

// 캔버스 DPR 설정
initCanvasDpr(mainCanvas);
initCanvasDpr(spawnCanvas);

function init() {
  const onScoreChangeListener = (score) => {
    document.getElementById("score").innerHTML = "현재 점수: " + score + "점";
  };

  const onGameOverListener = (result) => {
    document.getElementById("start").innerHTML = "재시작";
    alert(
      `game over! 점수: ${result.score}, 삭제한 라인 수: ${result.clearedLines}, 버틴 시간: ${
        result.elapsed / 1000
      }초`
    );
  };

  // 게임 인스턴스 생성
  const game = new GameManager(
    20,
    10,
    mainCanvas,
    spawnCanvas,
    onScoreChangeListener,
    onGameOverListener
  );

  const keyDownEventListener = (event) => {
    const action = UserInputActionsMapping.get(event.keyCode);
    if (action) {
      game.eventBus.emit(action);
    }
  };

  // 키보드 입력 리스너 설정
  document.removeEventListener("keydown", keyDownEventListener);
  document.addEventListener("keydown", keyDownEventListener);

  // 시작 버튼 리스너 설정
  document.getElementById("start").addEventListener("click", (e) => {
    game.start();
    document.getElementById("start").blur();
    document.getElementById("score").innerHTML = "현재 점수: 0점";
  });

  // 화면 입력 버튼 리스너 설정
  document.getElementById("left").addEventListener("click", (e) => {
    game.eventBus.emit(Actions.Left);
  });
  document.getElementById("right").addEventListener("click", (e) => {
    game.eventBus.emit(Actions.Right);
  });
  document.getElementById("rotate").addEventListener("click", (e) => {
    game.eventBus.emit(Actions.Rotate);
  });

  document.getElementById("opt-showGuide").addEventListener("click", (e) => {
    game.config.spawningType = document.getElementById("opt-showGuide")?.checked
      ? Spawner.TetrominoType.Guided
      : Spawner.TetrominoType.Default;
    document.getElementById("opt-showGuide").blur();
    alert("다음 블럭부터 적용됩니다.");
  });

  document.getElementById("opt-dev-showBound").addEventListener("click", (e) => {
    game.config.dev.showBound = document.getElementById("opt-dev-showBound")?.checked;
    document.getElementById("opt-dev-showBound").blur();
    alert("다음 블럭부터 적용됩니다.");
  });

  // 화면 렌더링 핸들러 설정
  const rederHandler = (timestamp) => {
    game.render(timestamp);
    requestAnimationFrame(rederHandler);
  };

  requestAnimationFrame(rederHandler);
}

init();
