// ============================================================================
//  СВЕРХМАССИВ 5: ЗДАНИЯ ГОРОДА — ОБЪЕДИНЕНИЕ ВСЕХ ФРАКЦИЙ
// ============================================================================

import { BUILDINGS_ASTRAL } from './astral.js';
// Импорты остальных фракций будут добавлены по мере создания
// import { BUILDINGS_HEAVEN } from './heaven.js';
// import { BUILDINGS_CHAOS } from './chaos.js';
// import { BUILDINGS_FORGE } from './forge.js';
// import { BUILDINGS_BASTION } from './bastion.js';
// import { BUILDINGS_SANSARA } from './sansara.js';
// import { BUILDINGS_CONFLUENCE } from './confluence.js';
// import { BUILDINGS_GUILD } from './guild.js';
// import { BUILDINGS_TEMPLE } from './temple.js';

// Модуль: Здания фракции Империя Порядка (Heaven) — пустой, для расширения
const BUILDINGS_HEAVEN = [];

// Модуль: Здания фракции Воины Хаоса — пустой, для расширения
const BUILDINGS_CHAOS = [];

// Модуль: Здания фракции Кузня — пустой, для расширения
const BUILDINGS_FORGE = [];

// Модуль: Здания фракции Бастион — пустой, для расширения
const BUILDINGS_BASTION = [];

// Модуль: Здания фракции Сансара — пустой, для расширения
const BUILDINGS_SANSARA = [];

// Модуль: Здания фракции Сопряжение — пустой, для расширения
const BUILDINGS_CONFLUENCE = [];

// Модуль: Здания фракции Гильдия магов — пустой, для расширения
const BUILDINGS_GUILD = [];

// Модуль: Здания фракции Храм — пустой, для расширения
const BUILDINGS_TEMPLE = [];

// СВЕРХМАССИВ ЗДАНИЙ
const BUILDINGS_DB = { 
    astral: BUILDINGS_ASTRAL,
    heaven: BUILDINGS_HEAVEN,
    chaos: BUILDINGS_CHAOS,
    forge: BUILDINGS_FORGE,
    bastion: BUILDINGS_BASTION,
    sansara: BUILDINGS_SANSARA,
    confluence: BUILDINGS_CONFLUENCE,
    guild: BUILDINGS_GUILD,
    temple: BUILDINGS_TEMPLE
};

export { 
    BUILDINGS_DB,
    BUILDINGS_ASTRAL,
    BUILDINGS_HEAVEN,
    BUILDINGS_CHAOS,
    BUILDINGS_FORGE,
    BUILDINGS_BASTION,
    BUILDINGS_SANSARA,
    BUILDINGS_CONFLUENCE,
    BUILDINGS_GUILD,
    BUILDINGS_TEMPLE
};
