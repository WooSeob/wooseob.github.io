import GameManager from "./game.js";
import { Actions } from "./tetris/constants.js";
import Spawner from "./tetris/spawner.js";

const mainCanvas = document.getElementById("main-container");
const spawnCanvas = document.getElementById("next-container");

function d(canvas) {
  const dpr = window.devicePixelRatio;
  // 캔버스 요소의 크기 가져오기
  const rect = canvas.getBoundingClientRect();

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;

  // scale() 함수를 사용하여 캔버스 유닛 크기 보정
  canvas.getContext("2d").scale(dpr, dpr);
}

d(mainCanvas);
d(spawnCanvas);

const game = new GameManager(
  20,
  10,
  mainCanvas,
  spawnCanvas,
  (score) => {
    document.getElementById("score").innerHTML = "현재 점수: " + score + "점";
  },
  (result) => {
    document.getElementById("start").innerHTML = "재시작";
    alert(
      `game over! 점수: ${result.score}, 삭제한 라인 수: ${result.clearedLines}, 버틴 시간: ${
        result.elapsed / 1000
      }초`
    );
  }
);

function addEventListener() {
  document.removeEventListener("keydown", handleKeyPress);
  document.addEventListener("keydown", handleKeyPress);
}

addEventListener();

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

function handleKeyPress(event) {
  const action = UserInputActionsMapping.get(event.keyCode);
  if (action) {
    game.eventBus.emit(action);
  }
}

document.getElementById("start").addEventListener("click", (e) => {
  game.start();
  document.getElementById("start").blur();
});

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

function render() {
  game.render();
  requestAnimationFrame(render);
}

render();
