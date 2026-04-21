// ============================================================================
//  СВЕРХМАССИВ 1: ГЕРОИ — ОБЪЕДИНЕНИЕ ВСЕХ ФРАКЦИЙ
// ============================================================================

import { HEROES_ASTRAL } from './astral.js';
// Импорты остальных фракций будут добавлены по мере создания
// import { HEROES_HEAVEN } from './heaven.js';
// import { HEROES_CHAOS } from './chaos.js';
// import { HEROES_FORGE } from './forge.js';
// import { HEROES_BASTION } from './bastion.js';
// import { HEROES_SANSARA } from './sansara.js';
// import { HEROES_CONFLUENCE } from './confluence.js';
// import { HEROES_GUILD } from './guild.js';
// import { HEROES_TEMPLE } from './temple.js';

// Модуль: Герои фракции Империя Порядка (Heaven) — пустой, для расширения
const HEROES_HEAVEN = {};

// Модуль: Герои фракции Воины Хаоса — пустой, для расширения
const HEROES_CHAOS = {};

// Модуль: Герои фракции Кузня — пустой, для расширения
const HEROES_FORGE = {};

// Модуль: Герои фракции Бастион — пустой, для расширения
const HEROES_BASTION = {};

// Модуль: Герои фракции Сансара — пустой, для расширения
const HEROES_SANSARA = {};

// Модуль: Герои фракции Сопряжение — пустой, для расширения
const HEROES_CONFLUENCE = {};

// Модуль: Герои фракции Гильдия магов — пустой, для расширения
const HEROES_GUILD = {};

// Модуль: Герои фракции Храм — пустой, для расширения
const HEROES_TEMPLE = {};

// СВЕРХМАССИВ ГЕРОЕВ
const HEROES_DB = { 
    ...HEROES_ASTRAL, 
    ...HEROES_HEAVEN, 
    ...HEROES_CHAOS, 
    ...HEROES_FORGE, 
    ...HEROES_BASTION, 
    ...HEROES_SANSARA, 
    ...HEROES_CONFLUENCE, 
    ...HEROES_GUILD, 
    ...HEROES_TEMPLE 
};

export { 
    HEROES_DB,
    HEROES_ASTRAL,
    HEROES_HEAVEN,
    HEROES_CHAOS,
    HEROES_FORGE,
    HEROES_BASTION,
    HEROES_SANSARA,
    HEROES_CONFLUENCE,
    HEROES_GUILD,
    HEROES_TEMPLE
};
