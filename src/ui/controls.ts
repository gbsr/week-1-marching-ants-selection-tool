import config from "../config";

export function mountControls(app: HTMLElement) {

  // create container
  const controls = document.createElement("div");
  controls.className = "controls";
  controls.setAttribute("aria-label", "Selection controls");

  controls.innerHTML = `
    <label>Dash length
      <input id="ctl-antLength" type="range" min="2" max="40" step="1" value="${config.antLength}">
      <output id="out-antLength">${config.antLength}</output>
    </label>
    <label>Dash spacing
      <input id="ctl-antSpacing" type="range" min="0" max="40" step="1" value="${config.antSpacing}">
      <output id="out-antSpacing">${config.antSpacing}</output>
    </label>
    <label>Ant speed
      <input id="ctl-antSpeed" type="range" min="10" max="400" step="5" value="${config.antSpeed}">
      <output id="out-antSpeed">${config.antSpeed}</output>
    </label>
    <label>Border width
      <input id="ctl-border" type="range" min="1" max="6" step="1" value="${config.selectionBorderWidth}">
      <output id="out-border">${config.selectionBorderWidth}</output>
    </label>
    <label>Edge tolerance
      <input id="ctl-edge" type="range" min="2" max="20" step="1" value="${config.edge}">
      <output id="out-edge">${config.edge}</output>
    </label>
  `;

  app.querySelector(".canvas-wrap")!.prepend(controls);

  // ---- wire events ----
  const withOutput = (id: string, out: string, setter: (n:number)=>void) => {
    const el = controls.querySelector(`#${id}`) as HTMLInputElement;
    const outEl = controls.querySelector(`#${out}`)!;
    el.addEventListener("input", () => {
      const v = el.valueAsNumber;
      setter(v);
      outEl.textContent = String(v);
    });
  };

  withOutput("ctl-antLength", "out-antLength", n => (config.antLength = n));
  withOutput("ctl-antSpacing", "out-antSpacing", n => (config.antSpacing = n));
  withOutput("ctl-antSpeed",   "out-antSpeed",   n => (config.antSpeed = n));
  withOutput("ctl-border",     "out-border",     n => (config.selectionBorderWidth = n));
  withOutput("ctl-edge",       "out-edge",       n => (config.edge = n));
}