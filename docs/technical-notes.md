# Technical Notes

## Dice So Nice effects

Dice So Nice exports its `DiceSFX` base class from `/modules/dice-so-nice/api.js`. Each effect in `scripts/sfx.mjs` extends that class, supplies a unique static `id` and localized `specialEffectName`, and implements `play()`. The module passes those classes to `dice3d.addSFXMode(...)` immediately after Dice So Nice's own `diceSoNiceReady` hook finishes initializing its effect registry. They then appear in Dice So Nice's Special Effects selector, where a formula decides when Dice So Nice instantiates them.

The animation uses Dice So Nice's `box` and `dicemesh` references. This module projects the die's 3D position through the Dice So Nice camera, places a DOM effect at the resulting screen position, and lets CSS animate and remove it.

## Arkham system integration

The Arkham system currently sends horror and normal pools to Dice So Nice as separate plain dice rolls without metadata. This module wraps the skill-roll, skill-reroll, and injury/trauma workflow `execute` methods to provide short-lived roll context, then uses the documented `diceSoNiceRollStart` hook and `dsnRole` option to label the displayed copy of each roll.

The integration does not alter results, chat data, or actor data.

## Legacy ghost dice compatibility

Arkham system 14.1.0.1 displays workflow rolls through Dice So Nice before it creates the custom chat card. The card already respects Foundry's selected message mode, but the standalone 3D call has no message ID and is otherwise synchronized to every user with visible results.

While **Legacy ghost dice compatibility** is set to **Automatic**, this module captures the current Foundry message mode as each supported workflow executes. In `diceSoNiceRollStart`, it limits the original numbered animation to authorized users and, when Dice So Nice's settings permit it, sends a separate ghost-marked copy to eligible hidden users. The recipient groups are disjoint, and ghost copies are marked so they cannot consume another Arkham role assignment.

The compatibility path covers skill rolls, skill rerolls, and injury/trauma rolls. It bypasses any Dice So Nice roll that has a chat-message ID, allowing a future message-driven system implementation to take over automatically. It does not hook, create, or modify chat messages.

The recipient policy can be checked outside Foundry with:

```text
node --test tests/visibility.test.mjs
```