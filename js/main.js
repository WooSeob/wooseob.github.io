import Block, { ClassicStyle } from "./graphics/block.js";
import { Colors } from "./graphics/constants.js";

const canvas = document.getElementById("main-container");
const ctx = canvas.getContext("2d");

const dpr = window.devicePixelRatio;
// 캔버스 요소의 크기 가져오기
const rect = canvas.getBoundingClientRect();

canvas.width = rect.width * dpr;
canvas.height = rect.height * dpr;

// scale() 함수를 사용하여 캔버스 유닛 크기 보정
ctx.scale(dpr, dpr);

const createStyle = (color) => new ClassicStyle(color, 60, 0.1);

const d = new Block(20, 20, 100, 100, createStyle(Colors.Red));

const b = new Block(150, 150, 100, 100, createStyle(Colors.Blue));

d.draw(ctx);
b.draw(ctx);
