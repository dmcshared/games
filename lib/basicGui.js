// Contains code for creating templates for an html style game and canvas style game with menu on the right (collapsable)

export const iconRes = 128;

export class Boilerplate {
  page;
  content;
  menu;
  checkbox;

  constructor() {
    this.page = document.createElement("div");
    this.page.className = "page";

    this.checkbox = document.createElement("input");
    this.checkbox.type = "checkbox";
    this.checkbox.id = "menu";
    this.page.appendChild(this.checkbox);

    this.content = document.createElement("div");
    this.content.className = "content";
    this.page.appendChild(this.content);

    this.menu = document.createElement("div");
    this.menu.className = "menu";
    this.page.appendChild(this.menu);
  }

  attachToRoot() {
    document.body.appendChild(this.page);
  }

  /**
   *
   * @param {(ctx:CanvasRenderingContext2D)=>void} artCB
   * @param {()=>void} callback
   */
  addMenuItem(artCB, callback) {
    const art = document.createElement("canvas");
    art.width = art.height = iconRes;
    const ctx = art.getContext("2d");

    ctx.save();
    ctx.scale(iconRes, iconRes);
    artCB(ctx);
    ctx.restore();

    art.addEventListener("click", callback);
    this.menu.appendChild(art);
  }

  addMenuItemOnOff(artCallbackOn, artCallbackOff, callbackOn, callbackOff) {
    const art = document.createElement("canvas");
    art.width = art.height = iconRes;
    const ctx = art.getContext("2d");

    art.setAttribute("data-active", "false");

    ctx.save();
    ctx.scale(iconRes, iconRes);
    artCallbackOff(ctx);
    ctx.restore();

    art.addEventListener("click", () => {
      if (art.getAttribute("data-active") === "true") {
        art.setAttribute("data-active", "false");
        ctx.save();
        ctx.scale(iconRes, iconRes);
        artCallbackOff(ctx);
        ctx.restore();
        callbackOff();
      } else {
        art.setAttribute("data-active", "true");
        ctx.save();
        ctx.scale(iconRes, iconRes);
        artCallbackOn(ctx);
        ctx.restore();
        callbackOn();
      }
    });
    this.menu.appendChild(art);
  }

  appendContent(elmDef) {
    const elm = createElm(elmDef);
    this.content.appendChild(elm);
    return elm;
  }
}

export class CanvasBP extends Boilerplate {
  canvas;
  ctx;

  constructor() {
    super();
    this.canvas = document.createElement("canvas");
    this.canvas.width = this.content.offsetWidth;
    this.canvas.height = this.content.offsetHeight;
    this.ctx = this.canvas.getContext("2d");
    this.content.appendChild(this.canvas);
  }

  attachToRoot() {
    super.attachToRoot();
    this.canvas.width = this.content.offsetWidth;
    this.canvas.height = this.content.offsetHeight;
  }
}

function deepCopy(source, target) {
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (typeof source[key] === "object") {
        target[key] = target[key] ?? {};
        deepCopy(source[key], target[key]);
      } else {
        target[key] = source[key];
      }
    }
  }
}

export function createElm(elmDesc) {
  if (typeof elmDesc === "string") {
    return document.createTextNode(elmDesc);
  } else if (Array.isArray(elmDesc)) {
    // [0]: tag name
    // [1]: attributes (deep copy)
    // [2...]: children (recurse)
    const elm = document.createElement(elmDesc[0]);
    deepCopy(elmDesc[1], elm);
    elmDesc.slice(2).map(createElm).forEach(elm.appendChild.bind(elm));
    return elm;
  }
}
