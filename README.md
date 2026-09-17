# Arkham Horror RPG Dice

A Foundry VTT 14 extension for Dice So Nice 6.3 and the Arkham Horror RPG system.

## Installation

In Foundry's **Add-on Modules** setup screen, choose **Install Module**, paste this manifest URL, and select **Install**:

```text
https://github.com/Fresnoth/arkham-horror-rpg-dice/releases/latest/download/module.json
```

Enable **Arkham Horror RPG Dice** in the world after installation. Dice So Nice 6.3 or newer and the Arkham Horror RPG system are required.

For a manual server installation, download `module.zip` from the latest GitHub release and extract it to `Data/modules/arkham-horror-rpg-dice`. The resulting manifest path must be `Data/modules/arkham-horror-rpg-dice/module.json`.

## Features

- Distinguishes the system's normal and horror d6 pools during 3D rolls.
- Registers customizable `Arkham Normal Die` and `Arkham Horror Die` roles in Dice So Nice.
- Organizes palettes into three families: four Investigator palettes, nine Archetype palettes, and four Horror palettes.
- Adds success, failure, and horror-die psychological trauma special-effect modes.
- Uses CSS-generated occult effects, so there are no external art or audio assets to load.

## Enable result effects

Dice So Nice controls when custom effects play. Open **Configure Settings > Dice So Nice > Special Effects**, then add:

| Formula | Special effect |
| --- | --- |
| `d6 == 6` | `Arkham: Seal the Omen` |
| `d6 == 1` | `Arkham: Omen Awakens` |
| `d6[arkham-horror] == 1` | `Arkham: Mind Fractures` |

All three rules can be enabled together. A normal 1 plays `Omen Awakens`; a horror 1 matches both failure rules and layers the much stronger `Mind Fractures` effect over it. The role-aware formula is available because this module tags the dice before Dice So Nice builds its animation notation.

`Seal the Omen` is an intricate spectral-blue ward that contracts shut. `Omen Awakens` is a collapsing crimson circle split by a jagged central rupture. `Mind Fractures` retains the full-screen eldritch eye treatment.

## How custom animations load

Dice So Nice exports its `DiceSFX` base class from `/modules/dice-so-nice/api.js`. Each effect in `scripts/sfx.mjs` extends that class, supplies a unique static `id` and localized `specialEffectName`, and implements `play()`. The module passes those classes to `dice3d.addSFXMode(...)` immediately after Dice So Nice's own `diceSoNiceReady` hook finishes initializing its effect registry. They then appear in Dice So Nice's existing Special Effects selector, where a formula decides when DSN instantiates them.

The animation itself can use DSN's `box` and `dicemesh` references. This module projects the die's 3D position through the DSN camera, places a DOM effect at the resulting screen position, and lets CSS animate and remove it.

## Customize the dice

The GM can choose the world-wide normal and horror palettes under **Configure Settings > Module Settings > Arkham Horror RPG Dice**. Normal coloring is disabled by default, so each player keeps their personal Dice So Nice appearance unless they opt in; its selected palette defaults to Investigator Standard Black. The four Investigator palettes are Aged Ivory wood, Standard Black resin, Antique Brass metal, and Porcelain Blue pristine. All nine Archetype palettes use frosted material. All four Horror palettes use resin; Horror Eldritch Green uses brighter spectral-green resin with dark green outlines and edges so it remains translucent but clearly differs from Standard Black. Horror coloring remains enabled and defaults to Horror Eldritch Green.

The selected palettes override saved DSN role colors for Arkham rolls while leaving every player's ordinary non-Arkham d6 appearance unchanged.

For deeper customization, the two Arkham roles also remain available in Dice So Nice's **Dice Roles** settings.

## Integration notes

The Arkham system currently sends horror and normal pools to Dice So Nice as separate plain `Nd6` rolls without metadata. This module wraps the system's two workflow `execute` methods to provide short-lived roll context, then uses the documented `diceSoNiceRollStart` hook and `dsnRole` option to label the displayed copy of each roll. It does not alter results, chat data, or actor data.