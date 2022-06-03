import { Boilerplate } from "../../lib/basicGui.js";

const bp = new Boilerplate();

bp.attachToRoot();

const tictactoeItemStyle = {
  border: "1px solid var(--bgl)",
  width: "256px",
  height: "256px",
};

let isCircleTurn = false;

const colors = {
  circle: "#db0072",
  cross: "#0092c5",
};

const wins = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const ai = (board) => {
  const childs = [...board.children];

  for (let win of wins) {
    if (
      childs[win[0]].gameState == "circle" &&
      childs[win[1]].gameState == "circle" &&
      childs[win[2]].gameState == "circle"
    ) {
      childs[win[0]].getContext("2d").fillStyle = "#ffffff30";
      childs[win[0]].getContext("2d").fillRect(0, 0, 256, 256);
      childs[win[1]].getContext("2d").fillStyle = "#ffffff30";
      childs[win[1]].getContext("2d").fillRect(0, 0, 256, 256);
      childs[win[2]].getContext("2d").fillStyle = "#ffffff30";
      childs[win[2]].getContext("2d").fillRect(0, 0, 256, 256);
      return console.log("Circle Win");
    }

    if (
      childs[win[0]].gameState == "cross" &&
      childs[win[1]].gameState == "cross" &&
      childs[win[2]].gameState == "cross"
    ) {
      childs[win[0]].getContext("2d").fillStyle = "#ffffff30";
      childs[win[0]].getContext("2d").fillRect(0, 0, 256, 256);
      childs[win[1]].getContext("2d").fillStyle = "#ffffff30";
      childs[win[1]].getContext("2d").fillRect(0, 0, 256, 256);
      childs[win[2]].getContext("2d").fillStyle = "#ffffff30";
      childs[win[2]].getContext("2d").fillRect(0, 0, 256, 256);
      return console.log("Cross Win");
    }
  }
  (() => {
    for (let win of wins) {
      if (
        childs[win[0]].gameState == "empty" &&
        childs[win[1]].gameState == "circle" &&
        childs[win[2]].gameState == "circle"
      )
        return childs[win[0]].click();
      if (
        childs[win[0]].gameState == "circle" &&
        childs[win[1]].gameState == "empty" &&
        childs[win[2]].gameState == "circle"
      )
        return childs[win[1]].click();
      if (
        childs[win[0]].gameState == "circle" &&
        childs[win[1]].gameState == "circle" &&
        childs[win[2]].gameState == "empty"
      )
        return childs[win[2]].click();
    }

    for (let win of wins) {
      if (
        childs[win[0]].gameState == "empty" &&
        childs[win[1]].gameState == "cross" &&
        childs[win[2]].gameState == "cross"
      )
        return childs[win[0]].click();
      if (
        childs[win[0]].gameState == "cross" &&
        childs[win[1]].gameState == "empty" &&
        childs[win[2]].gameState == "cross"
      )
        return childs[win[1]].click();
      if (
        childs[win[0]].gameState == "cross" &&
        childs[win[1]].gameState == "cross" &&
        childs[win[2]].gameState == "empty"
      )
        return childs[win[2]].click();
    }

    let items = childs.filter((elm) => elm.gameState === "empty");

    if (items.length) {
      let item = items[Math.floor(Math.random() * items.length)];
      item.click();
    }
  })();

  for (let win of wins) {
    if (
      childs[win[0]].gameState == "circle" &&
      childs[win[1]].gameState == "circle" &&
      childs[win[2]].gameState == "circle"
    ) {
      childs[win[0]].getContext("2d").fillStyle = "#ffffff30";
      childs[win[0]].getContext("2d").fillRect(0, 0, 256, 256);
      childs[win[1]].getContext("2d").fillStyle = "#ffffff30";
      childs[win[1]].getContext("2d").fillRect(0, 0, 256, 256);
      childs[win[2]].getContext("2d").fillStyle = "#ffffff30";
      childs[win[2]].getContext("2d").fillRect(0, 0, 256, 256);
      return console.log("Circle Win");
    }

    if (
      childs[win[0]].gameState == "cross" &&
      childs[win[1]].gameState == "cross" &&
      childs[win[2]].gameState == "cross"
    ) {
      childs[win[0]].getContext("2d").fillStyle = "#ffffff30";
      childs[win[0]].getContext("2d").fillRect(0, 0, 256, 256);
      childs[win[1]].getContext("2d").fillStyle = "#ffffff30";
      childs[win[1]].getContext("2d").fillRect(0, 0, 256, 256);
      childs[win[2]].getContext("2d").fillStyle = "#ffffff30";
      childs[win[2]].getContext("2d").fillRect(0, 0, 256, 256);
      return console.log("Cross Win");
    }
  }
};

console.log(colors, document.documentElement.style);

const elm = bp.appendContent([
  "div",
  {
    id: "menu",
    style: {
      display: "inline-grid",
      gridTemplateColumns: "repeat(3, 256px)",
      gridTemplateRows: "repeat(3, 256px)",
      position: "relative",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    },
  },
  ...[0, 1, 2]
    .flatMap((x) => [
      [x, 0],
      [x, 1],
      [x, 2],
    ])
    .map((x) => [
      "canvas",
      {
        id: `tic-${x[0]}-${x[1]}`,
        style: tictactoeItemStyle,
        width: 256,
        height: 256,
        gameState: "empty",
        onclick: (e) => {
          const elm = e.target;
          if (elm.gameState === "empty") {
            /** @type {CanvasRenderingContext2D} */
            const ctx = elm.getContext("2d");

            ctx.lineWidth = 16;
            if (isCircleTurn) {
              ctx.strokeStyle = colors.circle;
              ctx.beginPath();
              ctx.arc(128, 128, 64 + 32, 0, 2 * Math.PI);
              ctx.stroke();
            } else {
              ctx.strokeStyle = colors.cross;
              ctx.beginPath();
              ctx.moveTo(32, 32);
              ctx.lineTo(256 - 32, 256 - 32);
              ctx.stroke();
              ctx.moveTo(256 - 32, 32);
              ctx.lineTo(32, 256 - 32);
              ctx.stroke();
            }
            elm.gameState = isCircleTurn ? "circle" : "cross";
            isCircleTurn = !isCircleTurn;

            if (isCircleTurn) {
              ai(elm.parentElement);
            }
          }
        },
      },
    ]),
]);
