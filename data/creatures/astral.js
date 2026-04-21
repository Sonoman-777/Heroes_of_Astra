// ============================================================================
//  МОДУЛЬ: СУЩЕСТВА ФРАКЦИИ АСТРАЛ (С ПОРТРЕТАМИ И СПРАЙТАМИ)
// ============================================================================

export const CREATURES_ASTRAL = {
    // Тир 1
    astral_imp: {
        id: "astral_imp", name: "Бес", faction: "astral", level: 1,
        attack: 1, defense: 1, health: 5, damage_min: 2, damage_max: 3,
        speed: 7, initiative: 11, shots: 0, mana: 0, spells: [],
        abilities: ["shadow"], cost: { gold: 30 }, growth: 17,
        portrait: "https://i.postimg.cc/pLX347JQ/Portrait_Creature_Astral_Imp.png",
        sprite: "https://i.postimg.cc/sfLzY3Y0/Sprite_Creature_Astral_Imp.png",
        morale: 0, luck: 0, shootRange: 0
    },
    astral_familiar: {
        id: "astral_familiar", name: "Фамильяр", faction: "astral", level: 1,
        attack: 2, defense: 1, health: 7, damage_min: 3, damage_max: 3,
        speed: 7, initiative: 10, shots: 0, mana: 0, spells: [],
        abilities: ["shadow", "hitAndReturn"], cost: { gold: 50 }, growth: 17,
        portrait: "https://i.postimg.cc/kg1LmcTt/Portrait_Creature_Astral_Familiar.png",
        sprite: "https://i.postimg.cc/y6GKm7hq/Sprite_Creature_Astral_Familiar.png",
        morale: 0, luck: 0, shootRange: 0
    },
    // Тир 2
    astral_demon: {
        id: "astral_demon", name: "Демон", faction: "astral", level: 2,
        attack: 3, defense: 3, health: 11, damage_min: 2, damage_max: 5,
        speed: 4, initiative: 9, shots: 2, mana: 0, spells: [],
        abilities: ["shadow", "shooter"], cost: { gold: 70 }, growth: 12,
        portrait: "https://i.postimg.cc/RZs2BRgt/Portrait_Creature_Astral_Demon.png",
        sprite: "https://i.postimg.cc/8kYGRTR3/Sprite_Creature_Astral_Demon.png",
        morale: 0, luck: 0, shootRange: 5
    },
    astral_akuma: {
        id: "astral_akuma", name: "Акума", faction: "astral", level: 2,
        attack: 4, defense: 3, health: 13, damage_min: 3, damage_max: 7,
        speed: 4, initiative: 10, shots: 3, mana: 10, spells: ["weakness"],
        abilities: ["shadow", "shooter", "caster"], cost: { gold: 100 }, growth: 12,
        portrait: "https://i.postimg.cc/fR21NK89/Portrait_Creature_Astral_Akuma.png",
        sprite: "https://i.postimg.cc/L4WStmtr/Sprite_Creature_Astral_Akuma.png",
        morale: 0, luck: 0, shootRange: 6
    },
    // Тир 3
    astral_legion: {
        id: "astral_legion", name: "Легион", faction: "astral", level: 3,
        attack: 5, defense: 3, health: 16, damage_min: 3, damage_max: 9,
        speed: 4, initiative: 8, shots: 0, mana: 0, spells: [],
        abilities: ["shadow", "magicResist25", "bravery"], cost: { gold: 120 }, growth: 9,
        portrait: "https://i.postimg.cc/dVHgYB58/Portrait_Creature_Astral_Legion.png",
        sprite: "https://i.postimg.cc/1RdSGyGk/Sprite_Creature_Astral_Legion.png",
        morale: 0, luck: 0, shootRange: 0
    },
    astral_devourer: {
        id: "astral_devourer", name: "Пожиратель", faction: "astral", level: 3,
        attack: 7, defense: 4, health: 20, damage_min: 5, damage_max: 11,
        speed: 4, initiative: 9, shots: 0, mana: 0, spells: [],
        abilities: ["shadow", "magicResist50", "doubleStrike"], cost: { gold: 170 }, growth: 9,
        portrait: "https://i.postimg.cc/XYHtb8sg/Portrait_Creature_Astral_Devourer.png",
        sprite: "https://i.postimg.cc/dtTYng6H/Sprite_Creature_Astral_Devourer.png",
        morale: 0, luck: 0, shootRange: 0
    },
    // Тир 4
    astral_tenebrissa: {
        id: "astral_tenebrissa", name: "Тенебрисса", faction: "astral", level: 4,
        attack: 9, defense: 9, health: 17, damage_min: 15, damage_max: 15,
        speed: 4, initiative: 8, shots: 5, mana: 0, spells: [],
        abilities: ["shadow", "shooter"], cost: { gold: 200 }, growth: 7,
        portrait: "https://i.postimg.cc/wjfnpVwV/Portrait_Creature_Astral_Tenebrissa.png",
        sprite: "https://i.postimg.cc/ncQJTN2w/Sprite_Creature_Astral_Tenebrissa.png",
        morale: 0, luck: 0, shootRange: 6
    },
    astral_megera: {
        id: "astral_megera", name: "Мегера", faction: "astral", level: 4,
        attack: 12, defense: 9, health: 22, damage_min: 12, damage_max: 18,
        speed: 4, initiative: 9, shots: 5, mana: 20, spells: ["fury"],
        abilities: ["shadow", "shooter", "caster"],
        cost: { gold: 260 }, growth: 7,
        portrait: "https://i.postimg.cc/Gm76CQXq/Portrait_Creature_Astral_Megera.png",
        sprite: "https://i.postimg.cc/vH6sXChN/Sprite_Creature_Astral_Megera.png",
        morale: 0, luck: 0, shootRange: 7
    },
    // Тир 5
    astral_beholder: {
        id: "astral_beholder", name: "Бехолдер", faction: "astral", level: 5,
        attack: 12, defense: 10, health: 45, damage_min: 11, damage_max: 22,
        speed: 3, initiative: 8, shots: 7, mana: 30,
        spells: ["slow", "weakness", "dreadfulHowl"],
        abilities: ["shadow", "shooter", "caster", "flying", "large"],
        cost: { gold: 570 }, growth: 4,
        portrait: "https://i.postimg.cc/W1Wxvn5S/Portrait_Creature_Astral_Beholder.png",
        sprite: "https://i.postimg.cc/RVnBG2dp/Sprite_Creature_Astral_Beholder.png",
        morale: 0, luck: 0, shootRange: 6
    },
    astral_amalgam: {
        id: "astral_amalgam", name: "Амальгама", faction: "astral", level: 5,
        attack: 12, defense: 12, health: 50, damage_min: 10, damage_max: 20,
        speed: 3, initiative: 8, shots: 0, mana: 30,
        spells: ["phantom", "paralysis", "confusion"],
        abilities: ["shadow", "caster", "astralBody", "chainShot", "large", "flying"],
        cost: { gold: 700 }, growth: 4,
        portrait: "https://i.postimg.cc/htyNBr2H/Portrait_Creature_Astral_Amalgam.png",
        sprite: "https://i.postimg.cc/kg3dHwhG/Sprite_Creature_Astral_Amalgam.png",
        morale: 0, luck: 0, shootRange: 0
    },
    // Тир 6
    astral_monstrosity: {
        id: "astral_monstrosity", name: "Чудище", faction: "astral", level: 6,
        attack: 17, defense: 15, health: 50, damage_min: 20, damage_max: 40,
        speed: 6, initiative: 10, shots: 0, mana: 0, spells: [],
        abilities: ["shadow", "large", "sweepingStrike"],
        cost: { gold: 1200 }, growth: 2,
        portrait: "https://i.postimg.cc/RZs2BRgY/Portrait_Creature_Astral_Monstrosity.png",
        sprite: "https://i.postimg.cc/XYS0PxDr/Sprite_Creature_Astral_Monstrosity.png",
        morale: 0, luck: 0, shootRange: 0
    },
    astral_spawn: {
        id: "astral_spawn", name: "Отродье", faction: "astral", level: 6,
        attack: 17, defense: 17, health: 59, damage_min: 25, damage_max: 42,
        speed: 6, initiative: 10, shots: 0, mana: 0, spells: [],
        abilities: ["shadow", "large", "livingRam", "sweepingStrike"],
        cost: { gold: 1700 }, growth: 2,
        portrait: "https://i.postimg.cc/zGt4rjx6/Portrait_Creature_Astral_Spawn.png",
        sprite: "https://i.postimg.cc/8zQVYwns/Sprite_Creature_Astral_Spawn.png",
        morale: 0, luck: 0, shootRange: 0
    },
    // Тир 7
    astral_ouroboros: {
        id: "astral_ouroboros", name: "Уроборос", faction: "astral", level: 7,
        attack: 27, defense: 20, health: 120, damage_min: 45, damage_max: 60,
        speed: 5, initiative: 11, shots: 0, mana: 0, spells: [],
        abilities: ["shadow", "large", "fear"],
        cost: { gold: 2700 }, growth: 1,
        portrait: "https://i.postimg.cc/jSgBbXMB/Portrait_Creature_Astral_Uroboros.png",
        sprite: "https://i.postimg.cc/0yRq4ZH6/Sprite_Creature_Astral_Uroboros.png",
        morale: 0, luck: 0, shootRange: 0
    },
    astral_leviathan: {
        id: "astral_leviathan", name: "Левиафан", faction: "astral", level: 7,
        attack: 30, defense: 23, health: 170, damage_min: 50, damage_max: 70,
        speed: 5, initiative: 11, shots: 0, mana: 0, spells: [],
        abilities: ["shadow", "large", "teleport", "roar"],
        cost: { gold: 3600 }, growth: 1,
        portrait: "https://i.postimg.cc/Qd4v3b6G/Portrait_Creature_Astral_Leviathan.png",
        sprite: "https://i.postimg.cc/fRnhP5g9/Sprite_Creature_Astral_Leviathan.png",
        morale: 0, luck: 0, shootRange: 0
    }
};
