// ============================================================================
//  СВЕРХМАССИВ 8: МУЗЫКА — ОБЪЕДИНЕНИЕ ВСЕХ ФРАКЦИЙ И МЕСТНОСТЕЙ
// ============================================================================

import { MUSIC_ASTRAL } from './astral.js';
// Импорты остальных фракций будут добавлены по мере создания
// import { MUSIC_HEAVEN } from './heaven.js';
// import { MUSIC_CHAOS } from './chaos.js';
// import { MUSIC_FORGE } from './forge.js';
// import { MUSIC_BASTION } from './bastion.js';
// import { MUSIC_SANSARA } from './sansara.js';
// import { MUSIC_CONFLUENCE } from './confluence.js';
// import { MUSIC_GUILD } from './guild.js';
// import { MUSIC_TEMPLE } from './temple.js';
import { MUSIC_TERRAIN } from './terrain.js';

// Модуль: Музыка фракции Империя Порядка (Heaven) — пустой, для расширения
const MUSIC_HEAVEN = {
    townTheme: [],
    battleTheme: [],
    siegeTheme: [],
    victoryTheme: []
};

// Модуль: Музыка фракции Воины Хаоса — пустой, для расширения
const MUSIC_CHAOS = {
    townTheme: [],
    battleTheme: [],
    siegeTheme: [],
    victoryTheme: []
};

// Модуль: Музыка фракции Кузня — пустой, для расширения
const MUSIC_FORGE = {
    townTheme: [],
    battleTheme: [],
    siegeTheme: [],
    victoryTheme: []
};

// Модуль: Музыка фракции Бастион — пустой, для расширения
const MUSIC_BASTION = {
    townTheme: [],
    battleTheme: [],
    siegeTheme: [],
    victoryTheme: []
};

// Модуль: Музыка фракции Сансара — пустой, для расширения
const MUSIC_SANSARA = {
    townTheme: [],
    battleTheme: [],
    siegeTheme: [],
    victoryTheme: []
};

// Модуль: Музыка фракции Сопряжение — пустой, для расширения
const MUSIC_CONFLUENCE = {
    townTheme: [],
    battleTheme: [],
    siegeTheme: [],
    victoryTheme: []
};

// Модуль: Музыка фракции Гильдия магов — пустой, для расширения
const MUSIC_GUILD = {
    townTheme: [],
    battleTheme: [],
    siegeTheme: [],
    victoryTheme: []
};

// Модуль: Музыка фракции Храм — пустой, для расширения
const MUSIC_TEMPLE = {
    townTheme: [],
    battleTheme: [],
    siegeTheme: [],
    victoryTheme: []
};

// СВЕРХМАССИВ МУЗЫКИ
const MUSIC_DB = { 
    astral: MUSIC_ASTRAL,
    heaven: MUSIC_HEAVEN,
    chaos: MUSIC_CHAOS,
    forge: MUSIC_FORGE,
    bastion: MUSIC_BASTION,
    sansara: MUSIC_SANSARA,
    confluence: MUSIC_CONFLUENCE,
    guild: MUSIC_GUILD,
    temple: MUSIC_TEMPLE,
    terrain: MUSIC_TERRAIN
};

export { 
    MUSIC_DB,
    MUSIC_ASTRAL,
    MUSIC_HEAVEN,
    MUSIC_CHAOS,
    MUSIC_FORGE,
    MUSIC_BASTION,
    MUSIC_SANSARA,
    MUSIC_CONFLUENCE,
    MUSIC_GUILD,
    MUSIC_TEMPLE,
    MUSIC_TERRAIN
};
