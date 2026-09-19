import { ArkhamFailureSFX, ArkhamSuccessSFX, ArkhamTraumaSFX } from "./sfx.mjs";
import { resolveGhostDiceVisibility } from "./visibility.mjs";

const MODULE_ID = "arkham-horror-rpg-dice";
const SYSTEM_ID = "arkham-horror-rpg-fvtt";
const NORMAL_ROLE = "arkham-normal";
const HORROR_ROLE = "arkham-horror";
const NORMAL_COLORSET = "arkham-investigator-standard-black";
const HORROR_COLORSET = "arkham-eldritch-horror";
const NORMAL_PALETTES = {
  "arkham-aged-ivory": {
    description: "AHR_DICE.Palettes.Normal.AgedIvory",
    foreground: "#17201b",
    background: "#d8cba5",
    outline: "#775442",
    edge: "#9d8a64",
    material: "wood",
  },
  "arkham-investigator-antique-brass": {
    description: "AHR_DICE.Palettes.Normal.InvestigatorAntiqueBrass",
    foreground: "#fff3cf",
    background: "#796231",
    outline: "#241b0a",
    edge: "#4d3b18",
    material: "metal",
  },
  "arkham-investigator-porcelain-blue": {
    description: "AHR_DICE.Palettes.Normal.InvestigatorPorcelainBlue",
    foreground: "#142833",
    background: "#a9c3c7",
    outline: "#edf5f2",
    edge: "#667f84",
    material: "pristine",
  },
  "arkham-investigator-standard-black": {
    description: "AHR_DICE.Palettes.Normal.InvestigatorStandardBlack",
    foreground: "#eeeae0",
    background: ["#222829", "#3d4546", "#15191a"],
    outline: "#080b0c",
    edge: "#151a1b",
    material: "resin",
  },
  "arkham-archetype-hunter": {
    description: "AHR_DICE.Palettes.Normal.ArchetypeHunter",
    foreground: "#f3ecdc",
    background: "#628d82",
    outline: "#102a25",
    edge: "#3f665d",
    material: "frosted",
  },
  "arkham-archetype-adventurer": {
    description: "AHR_DICE.Palettes.Normal.ArchetypeAdventurer",
    foreground: "#f6eddf",
    background: "#a47c56",
    outline: "#2e1d10",
    edge: "#704e32",
    material: "frosted",
  },
  "arkham-archetype-rogue": {
    description: "AHR_DICE.Palettes.Normal.ArchetypeRogue",
    foreground: "#f3ead8",
    background: "#46684d",
    outline: "#16261a",
    edge: "#29402e",
    material: "frosted",
  },
  "arkham-archetype-believer": {
    description: "AHR_DICE.Palettes.Normal.ArchetypeBeliever",
    foreground: "#f3eadf",
    background: "#5d6163",
    outline: "#222628",
    edge: "#393d3f",
    material: "frosted",
  },
  "arkham-archetype-survivor": {
    description: "AHR_DICE.Palettes.Normal.ArchetypeSurvivor",
    foreground: "#f5e7dc",
    background: "#773b38",
    outline: "#321212",
    edge: "#4c211f",
    material: "frosted",
  },
  "arkham-archetype-seeker": {
    description: "AHR_DICE.Palettes.Normal.ArchetypeSeeker",
    foreground: "#fff8dc",
    background: "#a19859",
    outline: "#211f0d",
    edge: "#6f6839",
    material: "frosted",
  },
  "arkham-archetype-mystic": {
    description: "AHR_DICE.Palettes.Normal.ArchetypeMystic",
    foreground: "#f1e5f4",
    background: "#50315e",
    outline: "#1d0e24",
    edge: "#321e3a",
    material: "frosted",
  },
  "arkham-archetype-guardian": {
    description: "AHR_DICE.Palettes.Normal.ArchetypeGuardian",
    foreground: "#ecf0f4",
    background: "#3c4e6a",
    outline: "#121a29",
    edge: "#26334a",
    material: "frosted",
  },
  "arkham-archetype-dreamer": {
    description: "AHR_DICE.Palettes.Normal.ArchetypeDreamer",
    foreground: "#fff0f7",
    background: "#b25d84",
    outline: "#3a1027",
    edge: "#783653",
    material: "frosted",
  },
};
const HORROR_PALETTES = {
  "arkham-eldritch-horror": {
    description: "AHR_DICE.Palettes.Horror.EldritchGreen",
    foreground: "#f8ffe9",
    background: "#579a80",
    outline: "#102a24",
    edge: "#214f42",
    material: "resin",
  },
  "arkham-abyssal-black": {
    description: "AHR_DICE.Palettes.Horror.AbyssalBlack",
    foreground: "#9ee6d0",
    background: ["#020505", "#0b1010", "#101717"],
    outline: "#000000",
    edge: "#000000",
    material: "resin",
  },
  "arkham-bruised-violet": {
    description: "AHR_DICE.Palettes.Horror.BruisedViolet",
    foreground: "#d8c9e7",
    background: ["#211128", "#35173d", "#100914"],
    outline: "#08030a",
    edge: "#160a1a",
    material: "resin",
  },
  "arkham-unnatural-crimson": {
    description: "AHR_DICE.Palettes.Horror.UnnaturalCrimson",
    foreground: "#f0c8bb",
    background: ["#35070b", "#5a1018", "#170305"],
    outline: "#090000",
    edge: "#240306",
    material: "resin",
  },
};
const PATCHED = Symbol(`${MODULE_ID}.patched`);
const rollContexts = [];
let runtimeRegistered = false;

Hooks.once("init", () => {
  game.settings.register(MODULE_ID, "colorNormalDice", {
    name: "AHR_DICE.Settings.ColorNormalDice.Name",
    hint: "AHR_DICE.Settings.ColorNormalDice.Hint",
    scope: "client",
    config: true,
    type: Boolean,
    default: false,
  });

  game.settings.register(MODULE_ID, "colorHorrorDice", {
    name: "AHR_DICE.Settings.ColorHorrorDice.Name",
    hint: "AHR_DICE.Settings.ColorHorrorDice.Hint",
    scope: "client",
    config: true,
    type: Boolean,
    default: true,
  });

  game.settings.register(MODULE_ID, "ghostDiceCompatibility", {
    name: "AHR_DICE.Settings.GhostDiceCompatibility.Name",
    hint: "AHR_DICE.Settings.GhostDiceCompatibility.Hint",
    scope: "world",
    config: true,
    type: String,
    choices: {
      auto: "AHR_DICE.Settings.GhostDiceCompatibility.Auto",
      off: "AHR_DICE.Settings.GhostDiceCompatibility.Off",
    },
    default: "auto",
  });

  game.settings.register(MODULE_ID, "normalDicePalette", {
    name: "AHR_DICE.Settings.NormalDicePalette.Name",
    hint: "AHR_DICE.Settings.NormalDicePalette.Hint",
    scope: "world",
    config: true,
    type: String,
    choices: Object.fromEntries(Object.entries(NORMAL_PALETTES).map(([id, palette]) => [id, palette.description])),
    default: NORMAL_COLORSET,
  });

  game.settings.register(MODULE_ID, "horrorDicePalette", {
    name: "AHR_DICE.Settings.HorrorDicePalette.Name",
    hint: "AHR_DICE.Settings.HorrorDicePalette.Hint",
    scope: "world",
    config: true,
    type: String,
    choices: Object.fromEntries(Object.entries(HORROR_PALETTES).map(([id, palette]) => [id, palette.description])),
    default: HORROR_COLORSET,
  });
});

Hooks.on("renderSettingsConfig", (_app, element) => {
  const root = element instanceof HTMLElement ? element : element?.[0];
  if (!root) return;

  addPalettePreview(root, "normalDicePalette", NORMAL_PALETTES);
  addPalettePreview(root, "horrorDicePalette", HORROR_PALETTES);
});

Hooks.once("diceSoNiceReady", async (dice3d) => {
  await registerColorsets(dice3d);
  registerRoles(dice3d);
  queueMicrotask(() => void registerRuntime(dice3d));
});

function addPalettePreview(root, setting, palettes) {
  const select = root.querySelector(`[name="${MODULE_ID}.${setting}"]`);
  if (!select || select.parentElement.querySelector(`[data-ahr-palette-preview="${setting}"]`)) return;

  const preview = document.createElement("span");
  preview.className = "ahr-dice-palette-preview";
  preview.dataset.ahrPalettePreview = setting;
  preview.setAttribute("aria-hidden", "true");
  preview.innerHTML = '<span class="ahr-dice-palette-preview__face">6</span>';
  select.insertAdjacentElement("afterend", preview);

  const updatePreview = () => {
    const palette = palettes[select.value];
    if (!palette) return;

    const backgrounds = Array.isArray(palette.background) ? palette.background : [palette.background];
    preview.style.setProperty("--ahr-palette-background", `linear-gradient(135deg, ${backgrounds.join(", ")})`);
    preview.style.setProperty("--ahr-palette-foreground", palette.foreground);
    preview.style.setProperty("--ahr-palette-outline", palette.outline);
    preview.style.setProperty("--ahr-palette-edge", palette.edge);
    preview.title = select.selectedOptions[0]?.textContent?.trim() ?? "";
  };

  select.addEventListener("change", updatePreview);
  updatePreview();
}

async function registerRuntime(dice3d) {
  if (runtimeRegistered) return;
  runtimeRegistered = true;

  dice3d.addSFXMode(ArkhamSuccessSFX);
  dice3d.addSFXMode(ArkhamFailureSFX);
  dice3d.addSFXMode(ArkhamTraumaSFX);
  Hooks.on("diceSoNiceRollStart", tagArkhamRoll);

  if (game.system.id === SYSTEM_ID) {
    await patchArkhamWorkflows();
  }
}

async function registerColorsets(dice3d) {
  for (const [name, palette] of Object.entries({ ...NORMAL_PALETTES, ...HORROR_PALETTES })) {
    await dice3d.addColorset({
      name,
      category: "AHR_DICE.Category",
      texture: "none",
      material: "plastic",
      ...palette,
    });
  }
}

function registerRoles(dice3d) {
  dice3d.addRole({
    id: NORMAL_ROLE,
    label: "AHR_DICE.Roles.Normal",
    group: "AHR_DICE.Category",
    customizable: true,
    optional: false,
    dieTypes: ["d6"],
    defaults: { global: { colorset: NORMAL_COLORSET } },
  }, { package: MODULE_ID });

  dice3d.addRole({
    id: HORROR_ROLE,
    label: "AHR_DICE.Roles.Horror",
    group: "AHR_DICE.Category",
    customizable: true,
    optional: false,
    dieTypes: ["d6"],
    defaults: { global: { colorset: HORROR_COLORSET } },
  }, { package: MODULE_ID });
}

async function patchArkhamWorkflows() {
  try {
    const workflowBase = "/systems/arkham-horror-rpg-fvtt/module/rolls";
    const [{ SkillRollWorkflow }, { SkillRerollWorkflow }, { InjuryTraumaWorkflow }] = await Promise.all([
      import(`${workflowBase}/skill-roll-workflow.mjs`),
      import(`${workflowBase}/skill-reroll-workflow.mjs`),
      import(`${workflowBase}/injury-trauma-workflow.mjs`),
    ]);

    wrapExecute(SkillRollWorkflow, ({ plan }) => {
      const kinds = [];
      if (plan.horrorDiceToRoll > 0) kinds.push(HORROR_ROLE);
      kinds.push(NORMAL_ROLE);
      return kinds;
    });

    wrapExecute(SkillRerollWorkflow, ({ plan }) => {
      const kinds = [];
      if (plan.normalIndices.length > 0) kinds.push(NORMAL_ROLE);
      if (plan.horrorIndices.length > 0) kinds.push(HORROR_ROLE);
      return kinds;
    });

    wrapExecute(InjuryTraumaWorkflow, () => [NORMAL_ROLE]);
  } catch (error) {
    console.error(`${MODULE_ID} | Unable to patch Arkham dice workflows`, error);
  }
}

function wrapExecute(WorkflowClass, getRollKinds) {
  const original = WorkflowClass?.prototype?.execute;
  if (!original || original[PATCHED]) return;

  async function wrappedExecute(args) {
    const context = {
      kinds: getRollKinds(args),
      messageMode: getCurrentMessageMode(),
    };
    if (rollContexts.length > 0) {
      console.warn(`${MODULE_ID} | Overlapping Arkham roll workflows may prevent accurate dice role matching`);
    }
    rollContexts.push(context);
    try {
      return await original.call(this, args);
    } finally {
      const index = rollContexts.lastIndexOf(context);
      if (index >= 0) rollContexts.splice(index, 1);
    }
  }

  Object.defineProperty(wrappedExecute, PATCHED, { value: true });
  WorkflowClass.prototype.execute = wrappedExecute;
}

function tagArkhamRoll(messageId, context) {
  if (isGhostReplay(context.roll)) return;

  const activeContext = rollContexts.at(-1);
  const role = activeContext?.kinds.shift();
  if (!role) return;

  try {
    const taggedRoll = Roll.fromJSON(JSON.stringify(context.roll));
    if (shouldColorRole(role)) {
      for (const die of taggedRoll.dice) {
        die.options.dsnRole = role;
        die.options.dsnRoleManaged = true;
        die.options.appearance = {
          ...die.options.appearance,
          colorset: getRoleColorset(role),
        };
      }
    }
    context.dsnRoll = taggedRoll;

    if (messageId || game.settings.get(MODULE_ID, "ghostDiceCompatibility") !== "auto") return;

    const visibility = resolveGhostDiceVisibility({
      mode: activeContext.messageMode,
      authorId: context.user?.id ?? game.user.id,
      users: game.users,
      hideSecretDice: game.settings.get("dice-so-nice", "hide3dDiceOnSecretRolls"),
      ghostPolicy: game.settings.get("dice-so-nice", "showGhostDice"),
    });

    if (!visibility.restricted) return;

    taggedRoll.secret = true;
    context.users = visibility.realRecipientIds;
    context.blind = !visibility.realRecipientIds.includes(game.user.id);
    queueGhostRoll(taggedRoll, context, visibility.ghostRecipientIds);
  } catch (error) {
    console.warn(`${MODULE_ID} | Unable to prepare a Dice So Nice roll`, error);
  }
}

function getCurrentMessageMode() {
  try {
    return game.settings.get("core", "messageMode");
  } catch (_error) {
    return game.settings.get("core", "rollMode");
  }
}

function isGhostReplay(roll) {
  return roll?.dice?.some((die) => die.options?.ahrGhostReplay) ?? false;
}

function queueGhostRoll(displayRoll, context, recipientIds) {
  if (recipientIds.length === 0) return;

  const ghostRoll = Roll.fromJSON(JSON.stringify(displayRoll));
  for (const die of ghostRoll.dice) {
    die.options.ahrGhostReplay = true;
  }

  queueMicrotask(() => {
    const showGhostRoll = game.dice3d?.showForRoll(
      ghostRoll,
      context.user,
      true,
      recipientIds,
      !recipientIds.includes(game.user.id),
      null,
      null,
      { ghost: true },
    );
    Promise.resolve(showGhostRoll).catch((error) => {
      console.warn(`${MODULE_ID} | Unable to show ghost dice`, error);
    });
  });
}

function shouldColorRole(role) {
  const setting = role === HORROR_ROLE ? "colorHorrorDice" : "colorNormalDice";
  return game.settings.get(MODULE_ID, setting);
}

function getRoleColorset(role) {
  const setting = role === HORROR_ROLE ? "horrorDicePalette" : "normalDicePalette";
  const palettes = role === HORROR_ROLE ? HORROR_PALETTES : NORMAL_PALETTES;
  const colorset = game.settings.get(MODULE_ID, setting);
  return colorset in palettes ? colorset : role === HORROR_ROLE ? HORROR_COLORSET : NORMAL_COLORSET;
}