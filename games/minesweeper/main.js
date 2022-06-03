import { Boilerplate } from "../../lib/basicGui.js";

const bp = new Boilerplate();

bp.attachToRoot();

function specialRand() {
  const raw = Math.abs(Math.random() - Math.random()) ** 0.8 * 0.6;

  return Math.random() > 0.5 ? raw : 1 - raw;
}

/**
 * @param {HTMLDivElement[][]} grid
 * @param {number} x
 * @param {number} y
 */
function getBombs(grid, x, y) {
  let bombs = 0;
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      if (
        x + i in grid &&
        y + j in grid[x + i] &&
        grid[x + i][y + j].classList.contains("bomb")
      )
        bombs++;
    }
  }
  return bombs;
}

/**
 * @param {HTMLDivElement[][]} grid
 * @param {number} x
 * @param {number} y
 */
function revealFromCell(grid, x, y) {
  const cell = grid[x][y];
  if (cell.classList.contains("hidden") && !cell.classList.contains("flag")) {
    cell.classList.remove("hidden");
    if (cell.getAttribute("data-real-bombs") === "0") {
      for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
          if (
            x + i in grid &&
            y + j in grid[x + i] &&
            grid[x + i][y + j].classList.contains("hidden")
          )
            revealFromCell(grid, x + i, y + j);
        }
      }
    }
  }
}

/**
 * @param {HTMLDivElement[][]} grid
 * @param {number} x
 * @param {number} y
 */
function changeNeighbors(grid, x, y, n = 1, changeReal = false) {
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      if (x + i in grid && y + j in grid[x + i] && (i != 0 || j != 0)) {
        grid[x + i][y + j].setAttribute(
          "data-bombs",
          (+grid[x + i][y + j].getAttribute("data-bombs") + n).toString()
        );
        if (changeReal)
          grid[x + i][y + j].setAttribute(
            "data-real-bombs",
            (+grid[x + i][y + j].getAttribute("data-bombs")).toString()
          );

        if (!grid[x + i][y + j].classList.contains("flag"))
          grid[x + i][y + j].textContent =
            grid[x + i][y + j].getAttribute("data-bombs");
      }
    }
  }
}

/**
 * @param {HTMLDivElement[][]} grid
 */
function gameOver(grid) {
  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid[x].length; y++) {
      const cell = grid[x][y];
      cell.classList.remove("hidden");
    }
  }
}

/**
 *
 * @param {number} w
 * @param {number} h
 * @param {number} b
 * @returns {{
 *     w: number;
 *     h: number;
 *     topElement: HTMLDivElement;
 *     grid: HTMLDivElement[][];
 * }}
 */
function createHTMLBoard(flags) {
  const topElement = document.createElement("div");

  topElement.classList.add("board");
  topElement.style.display = "grid";
  topElement.style.gridTemplateColumns = `repeat(${flags.w}, 1fr)`;
  topElement.style.gridTemplateRows = `repeat(${flags.h}, 1fr)`;
  topElement.style.width = `${flags.w * 50}px`;
  topElement.style.height = `${flags.h * 50}px`;

  const grid = [];
  for (let x = 0; x < flags.w; x++) {
    grid[x] = [];
    for (let y = 0; y < flags.h; y++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.classList.add("hidden");
      cell.style.gridColumn = `${x + 1}`;
      cell.style.gridRow = `${y + 1}`;
      grid[x][y] = cell;
      topElement.appendChild(cell);

      cell.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        if (
          !cell.classList.contains("flag") &&
          !cell.classList.contains("hidden")
        )
          return;

        cell.classList.toggle("flag");
        if (cell.classList.contains("flag")) {
          if (flags.verifyFlags) cell.classList.remove("hidden");
          if (!cell.classList.contains("bomb") && flags.verifyFlags) {
            gameOver(grid);
          }
          cell.textContent = "";
          if (flags.changeBombNums)
            changeNeighbors(grid, x, y, -1, flags.verifyFlags);
        } else {
          if (flags.verifyFlags) cell.classList.add("hidden");
          cell.textContent = cell.getAttribute("data-bombs");
          if (flags.changeBombNums)
            changeNeighbors(grid, x, y, 1, flags.verifyFlags);
        }
      });

      cell.addEventListener("click", (e) => {
        if (
          cell.classList.contains("hidden") &&
          !cell.classList.contains("flag")
        ) {
          if (cell.getAttribute("data-real-bombs") === "0") {
            revealFromCell(grid, x, y);
          } else {
            cell.classList.remove("hidden");

            if (cell.classList.contains("bomb")) {
              gameOver(grid);
            }
          }
        }
      });
    }
  }

  for (let i = 0; i < flags.b; i++) {
    const x = (specialRand() * flags.w) | 0;
    const y = (specialRand() * flags.h) | 0;

    if (x in grid && y in grid[x])
      // @ts-ignore
      grid[x][y].classList.add("bomb");
  }

  for (let x = 0; x < flags.w; x++) {
    for (let y = 0; y < flags.h; y++) {
      /**
       * @type {HTMLDivElement}
       */
      const cell = grid[x][y];
      const bombs = getBombs(grid, x, y);
      cell.setAttribute("data-bombs", bombs.toString());
      cell.setAttribute("data-real-bombs", bombs.toString());
      cell.innerText = bombs.toString();
    }
  }

  return {
    w: flags.w,
    h: flags.h,
    topElement,
    grid,
  };
}

function startGame(flags) {
  const board = createHTMLBoard(flags);

  return board.topElement;
}

/**
 * @param {string} name
 * @param {{ [x: string]: { background:string; border: string; solvedBg: string; bombBg: string; hiddenBg: string; bombcount0Bg: string; bombcount0Fg: string; bombcount1Fg: string; bombcount2Fg: string; bombcount3Fg: string; bombcount4Fg: string; bombcount5Fg: string; bombcount6Fg: string; bombcount7Fg: string; bombcount8Fg: string; }; }} obj
 */
function applyStyle(name, obj) {
  const styl = obj[name];

  document.documentElement.style.backgroundColor = styl.background;
  document.documentElement.style.setProperty("--col-border:", styl.border);
  document.documentElement.style.setProperty("--col-solved-bg", styl.solvedBg);
  document.documentElement.style.setProperty("--col-bomb-bg", styl.bombBg);
  document.documentElement.style.setProperty("--col-hidden-bg", styl.hiddenBg);
  document.documentElement.style.setProperty(
    "--col-bombcount-0-bg",
    styl.bombcount0Bg
  );
  document.documentElement.style.setProperty(
    "--col-bombcount-0-fg",
    styl.bombcount0Fg
  );
  document.documentElement.style.setProperty(
    "--col-bombcount-1-fg",
    styl.bombcount1Fg
  );
  document.documentElement.style.setProperty(
    "--col-bombcount-2-fg",
    styl.bombcount2Fg
  );
  document.documentElement.style.setProperty(
    "--col-bombcount-3-fg",
    styl.bombcount3Fg
  );
  document.documentElement.style.setProperty(
    "--col-bombcount-4-fg",
    styl.bombcount4Fg
  );
  document.documentElement.style.setProperty(
    "--col-bombcount-5-fg",
    styl.bombcount5Fg
  );
  document.documentElement.style.setProperty(
    "--col-bombcount-6-fg",
    styl.bombcount6Fg
  );
  document.documentElement.style.setProperty(
    "--col-bombcount-7-fg",
    styl.bombcount7Fg
  );
  document.documentElement.style.setProperty(
    "--col-bombcount-8-fg",
    styl.bombcount8Fg
  );
}

const urlParams = new URLSearchParams(location.search);

const styles = {
  default: {
    background: "white",
    border: "rgba(0, 0, 0, 0.25)",
    solvedBg: "white",
    bombBg: "#9b404f",
    hiddenBg: "#ccc",
    bombcount0Bg: "rgb(240, 240, 240)",
    bombcount0Fg: "rgb(133, 133, 133)",
    bombcount1Fg: "rgb(95, 66, 255)",
    bombcount2Fg: "rgb(70, 163, 101)",
    bombcount3Fg: "rgb(226, 77, 77)",
    bombcount4Fg: "rgb(59, 45, 134)",
    bombcount5Fg: "rgb(122, 48, 48)",
    bombcount6Fg: "rgb(50, 101, 110)",
    bombcount7Fg: "rgb(0, 0, 0)",
    bombcount8Fg: "rgb(54, 54, 54)",
  },
  dark: {
    background: "black",
    border: "rgba(255, 255, 255, 0.25)",
    solvedBg: "black",
    bombBg: "#9b404f",
    hiddenBg: "#444",
    bombcount0Bg: "rgb(15, 15, 15)",
    bombcount0Fg: "rgb(133, 133, 133)",
    bombcount1Fg: "rgb(95, 66, 255)",
    bombcount2Fg: "rgb(70, 163, 101)",
    bombcount3Fg: "rgb(226, 77, 77)",
    bombcount4Fg: "rgb(59, 45, 134)",
    bombcount5Fg: "rgb(122, 48, 48)",
    bombcount6Fg: "rgb(50, 101, 110)",
    bombcount7Fg: "rgb(0, 0, 0)",
    bombcount8Fg: "rgb(54, 54, 54)",
  },
};

bp.checkbox.checked = true;

applyStyle("dark", styles);

const rules = {
  w: +urlParams.get("w") || (bp.content.offsetWidth / 52) | 0,
  h: +urlParams.get("h") || (bp.content.offsetHeight / 52) | 0,
  b: +urlParams.get("b"),
  changeBombNums: (urlParams.get("cbn") || "false") === "true",
  verifyFlags: (urlParams.get("vf") || "false") === "true",
};

if (!rules.b) rules.b = (rules.w * rules.h) / 5;

bp.addMenuItemOnOff(
  (ctx) => {
    ctx.fillStyle = "#00a05a";
    ctx.beginPath();
    ctx.arc(0.5, 0.5, 0.4, 0, 2 * Math.PI);
    ctx.fill();
  },
  (ctx) => {
    ctx.fillStyle = "#ff426c";
    ctx.beginPath();
    ctx.arc(0.5, 0.5, 0.4, 0, 2 * Math.PI);
    ctx.fill();
  },
  () => {
    rules.changeBombNums = true;
  },
  () => {
    rules.changeBombNums = false;
  }
);

bp.addMenuItemOnOff(
  (ctx) => {
    ctx.fillStyle = "#00a05a";
    ctx.beginPath();
    ctx.arc(0.5, 0.5, 0.4, 0, 2 * Math.PI);
    ctx.fill();
  },
  (ctx) => {
    ctx.fillStyle = "#ff426c";
    ctx.beginPath();
    ctx.arc(0.5, 0.5, 0.4, 0, 2 * Math.PI);
    ctx.fill();
  },
  () => {
    rules.verifyFlags = true;
  },
  () => {
    rules.verifyFlags = false;
  }
);

bp.content.appendChild(startGame(rules));

bp.appendContent([
  "link",
  {
    rel: "stylesheet",
    href: "./games/minesweeper/main.css",
  },
]);
