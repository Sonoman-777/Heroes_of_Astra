// ============================================================================
//  МОДУЛЬ: ГЕРОИ ФРАКЦИИ АСТРАЛ (КЛАСС SHADOWLORD)
// ============================================================================

// Модуль героя: Сономан
const Sonoman = {
    id: "Sonoman",
    name: "Сономан",
    faction: "astral",
    heroClass: "ShadowLord",
    portrait: "https://i.postimg.cc/13NPXBRF/Heroes_of_Astra_Hero_Shadow_Lord_Sonoman_icon.png",
    battleSprite: "https://i.postimg.cc/qM5L2n8H/Heroes_Of_Astra_Sonoman_Battle_Sprite.png",
    specialization: "Мастер Астральных Ветров (эффективность накопления Ветров Маны увеличивается на 2% за каждый уровень героя)",
    baseStats: { attack: 1, defense: 0, spellpower: 1, knowledge: 0 },
    educationBonus: { attack: 0, defense: 0, spellpower: 0, knowledge: 0 },
    currentLevel: 1,
    currentExp: 0,
    learnedSkills: [{ key: "sorcery", level: 1, perks: ["manaReplenish"] }],
    racialSkill: { level: 1, perks: [] },
    equipped: Array(12).fill(null),
    inventory: ["crown_of_chaos", "astral_piercer"],
    army: [],
    start_army: [
        { creatureId: "astral_familiar", min: 77, max: 117 },
        { creatureId: "astral_akuma", min: 54, max: 98 },
        { creatureId: "astral_devourer", min: 36, max: 73 },
        { creatureId: "astral_megera", min: 27, max: 50 },
        { creatureId: "astral_amalgam", min: 14, max: 28 },
        { creatureId: "astral_spawn", min: 9, max: 12 },
        { creatureId: "astral_leviathan", min: 2, max: 7 }
    ],
    warMachines: ["catapult", "ballista", "firstAidTent", "ammoCart"],
};

// Модуль героя: Ламия
const Lamia = {
    id: "Lamia",
    name: "Ламия",
    faction: "astral",
    heroClass: "ShadowLord",
    portrait: "https://i.postimg.cc/KYSbMT4z/Heroes_of_Astra_Hero_Shadow_Lord_Lamia_icon.png",
    battleSprite: "https://i.postimg.cc/qM5L2n8H/Heroes_Of_Astra_Sonoman_Battle_Sprite.png",
    specialization: "Завистливый взгляд (если Ламия изучает заклинание с помощью умения 'Разгадка тайного', то затраты на применение заклинаний уменьшаются на 1% за каждый уровень героя на время боя)",
    baseStats: { attack: 1, defense: 0, spellpower: 1, knowledge: 0 },
    educationBonus: { attack: 0, defense: 0, spellpower: 0, knowledge: 0 },
    currentLevel: 1,
    currentExp: 0,
    learnedSkills: [{ key: "education", level: 1, perks: ["secretUnravel"] }],
    racialSkill: { level: 1, perks: [] },
    equipped: Array(12).fill(null),
    inventory: ["thorn_necklace"],
    army: [],
    start_army: [
        { creatureId: "astral_familiar", min: 77, max: 117 },
        { creatureId: "astral_akuma", min: 54, max: 98 },
        { creatureId: "astral_devourer", min: 36, max: 73 },
        { creatureId: "astral_megera", min: 27, max: 50 },
        { creatureId: "astral_amalgam", min: 14, max: 28 },
        { creatureId: "astral_spawn", min: 9, max: 12 },
        { creatureId: "astral_leviathan", min: 2, max: 7 }
    ],
    warMachines: ["catapult", "ballista", "firstAidTent", "ammoCart"],
};

// Модуль героя: Азазель
const Azazel = {
    id: "Azazel",
    name: "Азазель",
    faction: "astral",
    heroClass: "ShadowLord",
    portrait: "https://i.postimg.cc/x1r1mhBJ/Heroes_of_Astra_Hero_Shadow_Lord_Azazel_icon.png",
    battleSprite: "https://i.postimg.cc/qM5L2n8H/Heroes_Of_Astra_Sonoman_Battle_Sprite.png",
    specialization: "Полководец Хаоса (легионы и пожиратели под командованием героя получают +1 к нападению и защите за каждый второй уровень героя)",
    baseStats: { attack: 1, defense: 0, spellpower: 1, knowledge: 0 },
    educationBonus: { attack: 0, defense: 0, spellpower: 0, knowledge: 0 },
    currentLevel: 1,
    currentExp: 0,
    learnedSkills: [{ key: "attack", level: 1, perks: [] }, { key: "chaosMagic", level: 1, perks: [] }],
    racialSkill: { level: 1, perks: [] },
    equipped: Array(12).fill(null),
    inventory: ["blade_of_abyss"],
    army: [],
    start_army: [
        { creatureId: "astral_imp", min: 5, max: 11 },
        { creatureId: "astral_demon", min: 12, max: 16 },
        { creatureId: "astral_legion", min: 1, max: 8 }
    ],
    warMachines: ["catapult", null, null, null],
};

// Модуль героя: Маммон
const Mammon = {
    id: "Mammon",
    name: "Маммон",
    faction: "astral",
    heroClass: "ShadowLord",
    portrait: "https://i.postimg.cc/cL8ZCh1t/Heroes_of_Astra_Hero_Shadow_Lord_Mammon_icon.png",
    battleSprite: "https://i.postimg.cc/qM5L2n8H/Heroes_Of_Astra_Sonoman_Battle_Sprite.png",
    specialization: "Тёмный казначей (ежедневно приносит в казну 50 золотых монет и +50 за каждый второй уровень героя)",
    baseStats: { attack: 1, defense: 0, spellpower: 1, knowledge: 0 },
    educationBonus: { attack: 0, defense: 0, spellpower: 0, knowledge: 0 },
    currentLevel: 1,
    currentExp: 0,
    learnedSkills: [{ key: "leadership", level: 1, perks: [] }],
    racialSkill: { level: 1, perks: [] },
    equipped: Array(12).fill(null),
    inventory: ["endless_gold"],
    army: [],
    start_army: [
        { creatureId: "astral_imp", min: 14, max: 20 },
        { creatureId: "astral_demon", min: 6, max: 9 }
    ],
    warMachines: ["catapult", null, null, null],
};

// Модуль героя: Вестас
const Vestas = {
    id: "Vestas",
    name: "Вестас",
    faction: "astral",
    heroClass: "ShadowLord",
    portrait: "https://i.postimg.cc/K8X8TwCL/Heroes_of_Astra_Hero_Shadow_Lord_Vestas_icon.png",
    battleSprite: "https://i.postimg.cc/qM5L2n8H/Heroes_Of_Astra_Sonoman_Battle_Sprite.png",
    specialization: "Дух Машин (Баллиста под контролем героя стреляет Астральным пламенем и наносит магический урон, а также получает +1 к нападению за каждый уровень героя)",
    baseStats: { attack: 1, defense: 0, spellpower: 1, knowledge: 0 },
    educationBonus: { attack: 0, defense: 0, spellpower: 0, knowledge: 0 },
    currentLevel: 1,
    currentExp: 0,
    learnedSkills: [{ key: "warMachines", level: 1, perks: ["ballista"] }],
    racialSkill: { level: 1, perks: [] },
    equipped: Array(12).fill(null),
    inventory: [],
    army: [],
    start_army: [
        { creatureId: "astral_imp", min: 12, max: 24 },
        { creatureId: "astral_demon", min: 7, max: 14 }
    ],
    warMachines: ["catapult", "ballista", null, null],
};

// Модуль героя: Векна
const Vekna = {
    id: "Vekna",
    name: "Векна",
    faction: "astral",
    heroClass: "ShadowLord",
    portrait: "https://i.postimg.cc/13x3F2bF/Heroes_of_Astra_Hero_Shadow_Lord_Vekna_icon.png",
    battleSprite: "https://i.postimg.cc/qM5L2n8H/Heroes_Of_Astra_Sonoman_Battle_Sprite.png",
    specialization: "Иллюзор (в начале боя герой создаёт подконтрольную себе точную копию случайного вражеского отряда. Отряд существует до конца сражения, и чем выше уровень героя, тем ближе численность существ в иллюзии к численности оригинального отряда и тем выше шанс скопировать более высокоуровневый отряд)",
    baseStats: { attack: 1, defense: 0, spellpower: 1, knowledge: 0 },
    educationBonus: { attack: 0, defense: 0, spellpower: 0, knowledge: 0 },
    currentLevel: 1,
    currentExp: 0,
    learnedSkills: [{ key: "darkMagic", level: 1, perks: [] }, { key: "summonMagic", level: 1, perks: [] }],
    racialSkill: { level: 1, perks: [] },
    equipped: Array(12).fill(null),
    inventory: ["stuff_of_shadows", "mantle_of_dreams"],
    army: [],
    start_army: [
        { creatureId: "astral_imp", min: 1, max: 33 },
        { creatureId: "astral_demon", min: 3, max: 15 }
    ],
    warMachines: ["catapult", null, null, null],
};

// Экспорт всех героев Астрала
export const HEROES_ASTRAL = {
    Sonoman,
    Lamia,
    Azazel,
    Mammon,
    Vestas,
    Vekna
};
