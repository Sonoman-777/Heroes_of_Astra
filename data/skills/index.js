// ============================================================================
//  СВЕРХМАССИВ 3: КОЛЕСО УМЕНИЙ — ОБЪЕДИНЕНИЕ ВСЕХ КЛАССОВ
// ============================================================================

import { SKILLS_SHADOWLORD } from './shadowLord.js';
// Импорты остальных классов будут добавлены по мере создания
// import { SKILLS_CHAOSWARRIOR } from './chaosWarrior.js';
// import { SKILLS_KNIGHT } from './knight.js';
// import { SKILLS_MECHANIC } from './mechanic.js';
// import { SKILLS_BARBARIAN } from './barbarian.js';
// import { SKILLS_NECROMANCER } from './necromancer.js';
// import { SKILLS_ELEMENTALIST } from './elementalist.js';
// import { SKILLS_WIZARD } from './wizard.js';
// import { SKILLS_PRIEST } from './priest.js';

// Модуль: Колесо умений для класса Воин Хаоса (пустой)
const SKILLS_CHAOSWARRIOR = {};

// Модуль: Колесо умений для класса Рыцарь (пустой)
const SKILLS_KNIGHT = {};

// Модуль: Колесо умений для класса Механик (пустой)
const SKILLS_MECHANIC = {};

// Модуль: Колесо умений для класса Варвар (пустой)
const SKILLS_BARBARIAN = {};

// Модуль: Колесо умений для класса Некромант (пустой)
const SKILLS_NECROMANCER = {};

// Модуль: Колесо умений для класса Элементалист (пустой)
const SKILLS_ELEMENTALIST = {};

// Модуль: Колесо умений для класса Волшебник (пустой)
const SKILLS_WIZARD = {};

// Модуль: Колесо умений для класса Жрец (пустой)
const SKILLS_PRIEST = {};

// СВЕРХМАССИВ НАВЫКОВ
const SKILLS_DB = { 
    ...SKILLS_SHADOWLORD, 
    ...SKILLS_CHAOSWARRIOR,
    ...SKILLS_KNIGHT,
    ...SKILLS_MECHANIC,
    ...SKILLS_BARBARIAN,
    ...SKILLS_NECROMANCER,
    ...SKILLS_ELEMENTALIST,
    ...SKILLS_WIZARD,
    ...SKILLS_PRIEST
};

export { 
    SKILLS_DB,
    SKILLS_SHADOWLORD,
    SKILLS_CHAOSWARRIOR,
    SKILLS_KNIGHT,
    SKILLS_MECHANIC,
    SKILLS_BARBARIAN,
    SKILLS_NECROMANCER,
    SKILLS_ELEMENTALIST,
    SKILLS_WIZARD,
    SKILLS_PRIEST
};
