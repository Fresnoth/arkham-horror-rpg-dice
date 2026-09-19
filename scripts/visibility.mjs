const MESSAGE_MODE_ALIASES = {
  roll: "public",
  publicroll: "public",
  gmroll: "gm",
  blindroll: "blind",
  selfroll: "self",
};

export function normalizeMessageMode(mode) {
  const normalized = String(mode ?? "public").toLowerCase();
  const resolved = MESSAGE_MODE_ALIASES[normalized] ?? normalized;
  return ["public", "gm", "blind", "self"].includes(resolved) ? resolved : "public";
}

export function resolveGhostDiceVisibility({
  mode,
  authorId,
  users,
  hideSecretDice,
  ghostPolicy,
}) {
  const normalizedMode = normalizeMessageMode(mode);
  const knownUsers = Array.from(users ?? []).filter((user) => user?.id);
  const allRecipientIds = knownUsers.map((user) => user.id);

  if (normalizedMode === "public" || !hideSecretDice) {
    return {
      mode: normalizedMode,
      restricted: false,
      realRecipientIds: allRecipientIds,
      ghostRecipientIds: [],
      hiddenRecipientIds: [],
    };
  }

  const realRecipientIds = knownUsers
    .filter((user) => {
      if (normalizedMode === "self") return user.id === authorId;
      if (normalizedMode === "blind") return user.isGM;
      if (normalizedMode === "gm") return user.isGM || user.id === authorId;
      return true;
    })
    .map((user) => user.id);

  const realRecipients = new Set(realRecipientIds);
  const unauthorizedUsers = knownUsers.filter((user) => !realRecipients.has(user.id));
  const policy = String(ghostPolicy ?? "0");
  const author = knownUsers.find((user) => user.id === authorId);

  let ghostRecipientIds = [];
  if (policy === "1") {
    ghostRecipientIds = unauthorizedUsers.map((user) => user.id);
  } else if (policy === "2" && !realRecipients.has(authorId)) {
    ghostRecipientIds = unauthorizedUsers.filter((user) => user.id === authorId).map((user) => user.id);
  } else if (policy === "3" && author && !author.isGM) {
    ghostRecipientIds = unauthorizedUsers.map((user) => user.id);
  }

  const ghostRecipients = new Set(ghostRecipientIds);
  const hiddenRecipientIds = unauthorizedUsers
    .filter((user) => !ghostRecipients.has(user.id))
    .map((user) => user.id);

  return {
    mode: normalizedMode,
    restricted: true,
    realRecipientIds,
    ghostRecipientIds,
    hiddenRecipientIds,
  };
}