# Arkham Horror RPG Dice

Arkham Horror RPG Dice connects the Arkham Horror RPG system to Dice So Nice. It identifies normal and horror dice during system rolls, gives each type its own configurable appearance, and adds three result-driven visual effects.

The module changes only the presentation of a roll. It does not alter dice results, chat messages, actors, or game rules.

## Requirements

- Foundry Virtual Tabletop 14
- Arkham Horror RPG system 14.1.0 or newer
- Dice So Nice 6.3.0 or newer

## Installation

In Foundry's **Add-on Modules** setup screen, choose **Install Module**, paste this manifest URL, and select **Install**:

```text
https://github.com/Fresnoth/arkham-horror-rpg-dice/releases/latest/download/module.json
```

Enable **Arkham Horror RPG Dice** and **Dice So Nice** in the world after installation.

For a manual server installation, download `module.zip` from the latest GitHub release and extract it to `Data/modules/arkham-horror-rpg-dice`. The resulting manifest path must be `Data/modules/arkham-horror-rpg-dice/module.json`.

## What the module adds

- Distinguishes the system's normal and horror d6 pools during 3D rolls.
- Registers customizable `Arkham Normal Die` and `Arkham Horror Die` roles in Dice So Nice.
- Organizes palettes into three families: four Investigator palettes, nine Archetype palettes, and four Horror palettes.
- Adds success, failure, and horror-die psychological trauma special-effect modes.
- Uses CSS-generated occult effects, so there are no external art or audio assets to load.

## Configure dice appearance

Open **Configure Settings > Module Settings > Arkham Horror RPG Dice** as the GM.

- **Color normal dice** applies the selected normal palette to Arkham normal dice. It is disabled by default so players retain their personal Dice So Nice appearance.
- **Normal dice palette** selects the world-wide normal-die appearance used when normal coloring is enabled.
- **Color horror dice** applies the horror-die role and is enabled by default.
- **Horror dice palette** selects the world-wide horror-die appearance.

The module also registers both roles in Dice So Nice's **Dice Roles** settings for deeper customization. See the official [Dice So Nice Dice Roles documentation](https://riccisi.gitlab.io/foundryvtt-dice-so-nice/guide/preferences/#dice-roles).

## Configure special effects

Dice So Nice controls which results trigger each effect. Open **3D Dice Settings > Special Effects** and add these three rules:

| Trigger | Mode | Special effect |
| --- | --- | --- |
| `d6 == 6` | Basic or Advanced | `Arkham: Seal the Omen` |
| `d6 == 1` | Basic or Advanced | `Arkham: Omen Awakens` |
| `d6[arkham-horror] == 1` | Advanced | `Arkham: Mind Fractures` |

For the first two rules, choose `d6` and result `6` or `1` in Basic mode. For the horror-specific rule, add a row, use the code/list toggle to switch it to Advanced mode, and enter `d6[arkham-horror] == 1`.

Select the matching Arkham effect in each row and save the main **3D Dice Settings** window. Clicking **OK** in a row's gear dialog alone does not save the overall configuration.

All three rules can be enabled together. A normal 1 plays `Omen Awakens`; a horror 1 matches both failure rules and layers the much stronger `Mind Fractures` effect over it. The role-aware formula is available because this module tags the dice before Dice So Nice builds its animation notation.

`Seal the Omen` is an intricate spectral-blue ward that contracts shut. `Omen Awakens` is a collapsing crimson circle split by a jagged central rupture. `Mind Fractures` retains the full-screen eldritch eye treatment.

For trigger syntax and Dice So Nice's full SFX behavior, see the official [Dice So Nice Special Effects guide](https://riccisi.gitlab.io/foundryvtt-dice-so-nice/guide/special-effects/).

## Make effects available to players

To give every player their own copy of the configured rules, push the GM's SFX configuration:

1. Configure and save the three rules as the GM.
2. Open **3D Dice Settings > Profiles & Data**.
3. Select **Push my config to players**.
4. Select **Special effects**. Leave the other categories unchecked unless they should also be replaced.
5. Confirm **Push**.

This writes the GM's complete SFX list to every non-GM player, including disconnected players, and overwrites their previous SFX list. Dice So Nice documents this tool in its official [Profiles & Data: GM Tools guide](https://riccisi.gitlab.io/foundryvtt-dice-so-nice/guide/save-files/#gm-tools).

The per-effect **(GM Only) Enable this SFX for all players** option is not a configuration-distribution tool. It makes the GM's own matching SFX visible to other players; it does not enable or copy that rule into every player's configuration. Do not mark pushed rules as global, because players can otherwise see both their copied rule and the GM's matching effect.

## Troubleshooting

- **An effect appears only for the GM:** Enable **Show other players' special effects** for the viewing player, or use the push method.
- **An effect plays twice:** Remove the copied player rule or disable the GM rule's global option.
- **Mind Fractures never plays:** Confirm the row is in Advanced mode and uses exactly `d6[arkham-horror] == 1`.
- **The Arkham effects are missing from the selector:** Confirm both required modules are enabled, then reload the world.
- **Changes do not persist:** Save the main **3D Dice Settings** window after closing any row options dialog.

## How custom animations load

Dice So Nice exports its `DiceSFX` base class from `/modules/dice-so-nice/api.js`. Each effect in `scripts/sfx.mjs` extends that class, supplies a unique static `id` and localized `specialEffectName`, and implements `play()`. The module passes those classes to `dice3d.addSFXMode(...)` immediately after Dice So Nice's own `diceSoNiceReady` hook finishes initializing its effect registry. They then appear in Dice So Nice's existing Special Effects selector, where a formula decides when DSN instantiates them.

The animation itself can use DSN's `box` and `dicemesh` references. This module projects the die's 3D position through the DSN camera, places a DOM effect at the resulting screen position, and lets CSS animate and remove it.

## Integration notes

The Arkham system currently sends horror and normal pools to Dice So Nice as separate plain `Nd6` rolls without metadata. This module wraps the system's two workflow `execute` methods to provide short-lived roll context, then uses the documented `diceSoNiceRollStart` hook and `dsnRole` option to label the displayed copy of each roll. It does not alter results, chat data, or actor data.

## Documentation images

Repository-owned screenshots used by this README belong in [`docs/images`](docs/images/README.md). Use relative links such as `docs/images/special-effects-setup.webp` so images render both on GitHub and in local Markdown previews.