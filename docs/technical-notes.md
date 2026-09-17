# Technical Notes

## Dice So Nice effects

Dice So Nice exports its `DiceSFX` base class from `/modules/dice-so-nice/api.js`. Each effect in `scripts/sfx.mjs` extends that class, supplies a unique static `id` and localized `specialEffectName`, and implements `play()`. The module passes those classes to `dice3d.addSFXMode(...)` immediately after Dice So Nice's own `diceSoNiceReady` hook finishes initializing its effect registry. They then appear in Dice So Nice's Special Effects selector, where a formula decides when Dice So Nice instantiates them.

The animation uses Dice So Nice's `box` and `dicemesh` references. This module projects the die's 3D position through the Dice So Nice camera, places a DOM effect at the resulting screen position, and lets CSS animate and remove it.

## Arkham system integration

The Arkham system currently sends horror and normal pools to Dice So Nice as separate plain `Nd6` rolls without metadata. This module wraps the system's two workflow `execute` methods to provide short-lived roll context, then uses the documented `diceSoNiceRollStart` hook and `dsnRole` option to label the displayed copy of each roll.

The integration does not alter results, chat data, or actor data.