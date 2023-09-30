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

const aa = new GameManager(20, 10, new CanvasBoard(canvas), new CanvasBoard(canvasNext));

function addEventListener() {
  document.removeEventListener("keydown", handleKeyPress);
  document.addEventListener("keydown", handleKeyPress);
}

function handleKeyPress(event) {
  console.log(event.keyCode);
  if (event.keyCode === 38) {
    aa.eventBus.emit(Actions.Rotate);
  }
  if (event.keyCode === 37) {
    // left
    aa.eventBus.emit(Actions.Left);
  }
  if (event.keyCode === 39) {
    // right
    aa.eventBus.emit(Actions.Right);
  }
  if (event.keyCode === 40) {
    // down
    aa.eventBus.emit(Actions.Down);
  }
  if (event.keyCode === 32) {
    // drop - space
    aa.eventBus.emit(Actions.Drop);
  }
}
addEventListener();

function render() {
  aa.render();
  requestAnimationFrame(render);
}

render();
