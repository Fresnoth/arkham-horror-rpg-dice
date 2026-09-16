import { DiceSFX } from "/modules/dice-so-nice/api.js";

class ArkhamResultSFX extends DiceSFX {
  async play() {
    const variant = this.constructor.variant;
    const effect = document.createElement("div");
    effect.className = `ahr-dice-sfx ahr-dice-sfx--${variant}`;
    effect.setAttribute("aria-hidden", "true");
    effect.innerHTML = `
      ${variant === "trauma" ? '<span class="ahr-dice-sfx__veil"></span>' : ""}
      <span class="ahr-dice-sfx__ring"></span>
      <span class="ahr-dice-sfx__ring ahr-dice-sfx__ring--inner"></span>
      <span class="ahr-dice-sfx__mark"></span>
      ${Array.from({ length: variant === "trauma" ? 12 : 8 }, (_, index) => `<i style="--ray:${index}"></i>`).join("")}
    `;

    const { x, y } = getScreenPosition(this.box, this.dicemesh);
    effect.style.setProperty("--ahr-die-x", `${x}px`);
    effect.style.setProperty("--ahr-die-y", `${y}px`);
    if (variant !== "trauma") {
      effect.style.left = `${x}px`;
      effect.style.top = `${y}px`;
    }
    document.body.append(effect);

    const remove = () => effect.remove();
    effect.addEventListener("animationend", (event) => {
      if (event.target === effect) remove();
    });
    window.setTimeout(remove, 2400);
    return true;
  }
}

export class ArkhamSuccessSFX extends ArkhamResultSFX {
  static id = "ArkhamHorrorSuccess";
  static specialEffectName = "AHR_DICE.SFX.Success";
  static variant = "success";
}

export class ArkhamFailureSFX extends ArkhamResultSFX {
  static id = "ArkhamHorrorFailure";
  static specialEffectName = "AHR_DICE.SFX.Failure";
  static variant = "failure";
}

export class ArkhamTraumaSFX extends ArkhamResultSFX {
  static id = "ArkhamHorrorTrauma";
  static specialEffectName = "AHR_DICE.SFX.Trauma";
  static variant = "trauma";
}

function getScreenPosition(box, dicemesh) {
  const canvas = box?.renderer?.domElement ?? document.getElementById("dice-box-canvas");
  const rect = canvas?.getBoundingClientRect?.() ?? {
    left: 0,
    top: 0,
    width: window.innerWidth,
    height: window.innerHeight,
  };

  try {
    const position = dicemesh.position.clone();
    dicemesh.getWorldPosition(position);
    position.project(box.camera);
    return {
      x: rect.left + ((position.x + 1) / 2) * rect.width,
      y: rect.top + ((1 - position.y) / 2) * rect.height,
    };
  } catch (_error) {
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
  }
}