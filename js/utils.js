// ============================================================================
//  ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================================================================

import { ARTIFACTS_DB } from '../data/artifacts/index.js';
import { CREATURES_DB } from '../data/creatures/index.js';
import { HEROES_DB } from '../data/heroes/index.js';
import { currentHero, savedHeroes } from './state.js';

// Глубокое клонирование объекта
export function deepClone(obj) {
    return typeof structuredClone === 'function' ? structuredClone(obj) : JSON.parse(JSON.stringify(obj));
}

// Загрузка артефактов из массива ID
export function loadArtifactsFromIds(inventoryIds) {
    if (!inventoryIds || !Array.isArray(inventoryIds)) return [];
    return inventoryIds.map(id => ARTIFACTS_DB[id] ? { ...ARTIFACTS_DB[id] } : null).filter(a => a !== null);
}

// Сохранение инвентаря как массива ID
export function saveInventoryAsIds(inventoryObjects) {
    if (!inventoryObjects || !Array.isArray(inventoryObjects)) return [];
    return inventoryObjects.map(item => item.id);
}

// Генерация стартовой армии
export function generateStartArmy(startArmyConfig) {
    if (!startArmyConfig || !Array.isArray(startArmyConfig)) return [];
    const army = [];
    for (let config of startArmyConfig) {
        if (army.length >= 7) break;
        const min = config.min || 0;
        const max = config.max || 0;
        let count = max > 0 ? Math.floor(Math.random() * (max - min + 1)) + min : 0;
        if (count > 0) army.push({ creatureId: config.creatureId, count: count });
    }
    while (army.length < 7) army.push(null);
    return army;
}

// Загрузка героя для битвы
export function loadHeroForBattle(heroId) {
    if (savedHeroes[heroId]) {
        const savedHero = deepClone(savedHeroes[heroId]);
        if (!savedHero.army || savedHero.army.length === 0 || savedHero.army.every(slot => !slot)) {
            savedHero.army = generateStartArmy(savedHero.start_army || HEROES_DB[heroId].start_army);
        }
        return savedHero;
    }
    const baseHero = deepClone(HEROES_DB[heroId]);
    if (!baseHero.army || baseHero.army.length === 0 || baseHero.army.every(slot => !slot)) {
        baseHero.army = generateStartArmy(baseHero.start_army);
    }
    return baseHero;
}

// Получить название фракции
export function getFactionName(factionId) {
    const factions = { 
        astral: "Астрал",
        chaos: "Воины Хаоса",
        heaven: "Империя Порядка",
        forge: "Кузня",
        bastion: "Бастион",
        sansara: "Сансара",
        confluence: "Сопряжение",
        guild: "Гильдия магов",
        temple: "Храм"
    };
    return factions[factionId] || factionId || "Неизвестно";
}

// Сохранить текущего героя
export function saveCurrentHero() {
    if (currentHero) {
        const heroToSave = deepClone(currentHero);
        if (heroToSave.inventory && Array.isArray(heroToSave.inventory)) {
            heroToSave.inventory = saveInventoryAsIds(heroToSave.inventory);
        }
        savedHeroes[currentHero.id] = heroToSave;
    }
}

// Получить случайную характеристику с приоритетом
export function getRandomStatWithPriority() {
    const r = Math.random() * 100;
    if (r < 30) return 'attack';
    if (r < 60) return 'spellpower';
    if (r < 80) return 'defense';
    return 'knowledge';
}

// Добавить очко характеристики
export function addStatPoint(stat) { 
    currentHero.baseStats[stat]++; 
}

// Добавить бонус образования
export function addEducationBonus(stat) { 
    currentHero.educationBonus[stat]++; 
}

// Получить суммарный опыт, необходимый для уровня
export function getTotalExpRequiredForLevel(lvl) {
    if (lvl <= 1) return 0;
    let t = 0;
    for (let i = 1; i < lvl; i++) t += 500 * (i + 1);
    return t;
}

// Проверить и применить бонус образования
export function checkAndApplyEducationBonus(newLvl, oldLvl) {
    const edu = currentHero.learnedSkills.find(s => s.key === "education");
    if (!edu || edu.level === 0) return;
    const step = edu.level === 1 ? 4 : (edu.level === 2 ? 3 : 2);
    let cnt = 0;
    for (let l = oldLvl + 1; l <= newLvl; l++) if (l % step === 0) cnt++;
    for (let i = 0; i < cnt; i++) addEducationBonus(getRandomStatWithPriority());
}

// Получить суммарные характеристики героя
export function getTotalStats() {
    return {
        attack: currentHero.baseStats.attack + currentHero.educationBonus.attack,
        defense: currentHero.baseStats.defense + currentHero.educationBonus.defense,
        spellpower: currentHero.baseStats.spellpower + currentHero.educationBonus.spellpower,
        knowledge: currentHero.baseStats.knowledge + currentHero.educationBonus.knowledge
    };
}
