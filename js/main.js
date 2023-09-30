import GameManager from "./game.js";
import CanvasBoard from "./graphics/canvas.js";
import { Actions } from "./tetris/constants.js";

const canvas = document.getElementById("main-container");
const ctx = canvas.getContext("2d");

// let d = new Block(20, 20, 100, 100, createStyle(Colors.Red));

// const b = new Block(150, 150, 100, 100, createStyle(Colors.Gray));

// d.draw(ctx);
// b.draw(ctx);

// setInterval(() => {
//   d.clear(ctx);
//   d = d.ofMove(10, 0);
//   d.draw(ctx);
// }, 1000);

function d() {
  const dpr = window.devicePixelRatio;
  // 캔버스 요소의 크기 가져오기
  const rect = canvas.getBoundingClientRect();

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;

  // scale() 함수를 사용하여 캔버스 유닛 크기 보정
  ctx.scale(dpr, dpr);
}

d();

const aa = new GameManager(20, 10, new CanvasBoard(canvas));

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
