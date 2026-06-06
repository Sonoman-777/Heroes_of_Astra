import HEROES_ASTRAL from './factions/astral.js';

const ALL_HEROES = {
    astral: HEROES_ASTRAL,
};

export function getHeroById(id) {
    for (const faction of Object.values(ALL_HEROES)) {
        if (faction[id]) return faction[id];
    }
    return null;
}

export function getHeroesByFaction(factionId) {
    return ALL_HEROES[factionId] || {};
}

export function getAllHeroes() {
    const result = {};
    for (const faction of Object.values(ALL_HEROES)) {
        Object.assign(result, faction);
    }
    return result;
}

export default ALL_HEROES;
