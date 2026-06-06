import CREATURES_ASTRAL from './factions/astral.js';

const ALL_CREATURES = {
    astral: CREATURES_ASTRAL,
};

export function getCreatureById(id) {
    for (const faction of Object.values(ALL_CREATURES)) {
        if (faction[id]) return faction[id];
    }
    return null;
}

export function getCreaturesByFaction(factionId) {
    return ALL_CREATURES[factionId] || {};
}

export function getCreaturesByTier(factionId, tier) {
    const faction = ALL_CREATURES[factionId] || {};
    return Object.values(faction).filter(c => c.tier === tier);
}

export function getAllCreatures() {
    const result = {};
    for (const faction of Object.values(ALL_CREATURES)) {
        Object.assign(result, faction);
    }
    return result;
}

export default ALL_CREATURES;
