// ============================================================================
//  СВЕРХМАССИВ 2: СУЩЕСТВА — ОБЪЕДИНЕНИЕ ВСЕХ ФРАКЦИЙ
// ============================================================================

import { CREATURES_ASTRAL } from './astral.js';
// Импорты остальных фракций будут добавлены по мере создания
// import { CREATURES_HEAVEN } from './heaven.js';
// import { CREATURES_CHAOS } from './chaos.js';
// import { CREATURES_FORGE } from './forge.js';
// import { CREATURES_BASTION } from './bastion.js';
// import { CREATURES_SANSARA } from './sansara.js';
// import { CREATURES_CONFLUENCE } from './confluence.js';
// import { CREATURES_GUILD } from './guild.js';
// import { CREATURES_TEMPLE } from './temple.js';

// Модуль: Существа фракции Империя Порядка (Heaven) — пустой, для расширения
const CREATURES_HEAVEN = {};

// Модуль: Существа фракции Воины Хаоса — пустой, для расширения
const CREATURES_CHAOS = {};

// Модуль: Существа фракции Кузня — пустой, для расширения
const CREATURES_FORGE = {};

// Модуль: Существа фракции Бастион — пустой, для расширения
const CREATURES_BASTION = {};

// Модуль: Существа фракции Сансара — пустой, для расширения
const CREATURES_SANSARA = {};

// Модуль: Существа фракции Сопряжение — пустой, для расширения
const CREATURES_CONFLUENCE = {};

// Модуль: Существа фракции Гильдия магов — пустой, для расширения
const CREATURES_GUILD = {};

// Модуль: Существа фракции Храм — пустой, для расширения
const CREATURES_TEMPLE = {};

// СВЕРХМАССИВ СУЩЕСТВ
const CREATURES_DB = { 
    ...CREATURES_ASTRAL, 
    ...CREATURES_HEAVEN, 
    ...CREATURES_CHAOS, 
    ...CREATURES_FORGE, 
    ...CREATURES_BASTION, 
    ...CREATURES_SANSARA, 
    ...CREATURES_CONFLUENCE, 
    ...CREATURES_GUILD, 
    ...CREATURES_TEMPLE 
};

export { 
    CREATURES_DB,
    CREATURES_ASTRAL,
    CREATURES_HEAVEN,
    CREATURES_CHAOS,
    CREATURES_FORGE,
    CREATURES_BASTION,
    CREATURES_SANSARA,
    CREATURES_CONFLUENCE,
    CREATURES_GUILD,
    CREATURES_TEMPLE
};
