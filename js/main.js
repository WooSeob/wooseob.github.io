import GameManager from "./game.js";
import CanvasBoard from "./graphics/canvas.js";
import { Actions } from "./tetris/constants.js";

const canvas = document.getElementById("main-container");
const canvasNext = document.getElementById("next-container");

function d(canvas) {
  const dpr = window.devicePixelRatio;
  // 캔버스 요소의 크기 가져오기
  const rect = canvas.getBoundingClientRect();

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;

  // scale() 함수를 사용하여 캔버스 유닛 크기 보정
  canvas.getContext("2d").scale(dpr, dpr);
}

d(canvas);
d(canvasNext);

const game = new GameManager(
  20,
  10,
  new CanvasBoard(canvas),
  new CanvasBoard(canvasNext),
  (score) => {
    document.getElementById("score").innerHTML = "현재 점수: " + score + "점";
  },
  (score) => {
    document.getElementById("start").innerHTML = "재시작";
    alert("game over! score: " + score);
  }
);

function addEventListener() {
  document.removeEventListener("keydown", handleKeyPress);
  document.addEventListener("keydown", handleKeyPress);
}

addEventListener();

function handleKeyPress(event) {
  if (event.keyCode === 38) {
    game.eventBus.emit(Actions.Rotate);
  }
  if (event.keyCode === 37) {
    // left
    game.eventBus.emit(Actions.Left);
  }
  if (event.keyCode === 39) {
    // right
    game.eventBus.emit(Actions.Right);
  }
  if (event.keyCode === 40) {
    // down
    game.eventBus.emit(Actions.Down);
  }
  if (event.keyCode === 32) {
    // drop - space
    game.eventBus.emit(Actions.Drop);
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

function render() {
  game.render();
  requestAnimationFrame(render);
}

render();
