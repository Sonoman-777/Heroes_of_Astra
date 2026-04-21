// ============================================================================
//  УПРАВЛЕНИЕ ГЕРОЯМИ: ЗАГРУЗКА, СОХРАНЕНИЕ, ГЕНЕРАЦИЯ АРМИИ
// ============================================================================

import { currentHero, savedHeroes, setCurrentHero } from '../../js/state.js';
import { HEROES_DB } from '../../data/heroes/index.js';
import { ARTIFACTS_DB } from '../../data/artifacts/index.js';
import { deepClone, loadArtifactsFromIds, saveInventoryAsIds, generateStartArmy } from '../../js/utils.js';
import { refreshAllUI } from '../../js/ui/heroScreen.js';

export function saveCurrentHero() {
    if (currentHero) {
        const heroToSave = deepClone(currentHero);
        if (heroToSave.inventory && Array.isArray(heroToSave.inventory)) {
            heroToSave.inventory = saveInventoryAsIds(heroToSave.inventory);
        }
        savedHeroes[currentHero.id] = heroToSave;
    }
}

export function loadHero(heroId) {
    if (!HEROES_DB[heroId]) return false;

    if (currentHero) saveCurrentHero();

    if (savedHeroes[heroId]) {
        setCurrentHero(deepClone(savedHeroes[heroId]));
    } else {
        const baseHero = deepClone(HEROES_DB[heroId]);
        if (!baseHero.army || baseHero.army.length === 0) {
            baseHero.army = generateStartArmy(baseHero.start_army);
        }
        setCurrentHero(baseHero);

        const heroToSave = deepClone(currentHero);
        if (heroToSave.inventory && Array.isArray(heroToSave.inventory)) {
            heroToSave.inventory = saveInventoryAsIds(heroToSave.inventory);
        }
        savedHeroes[heroId] = heroToSave;
    }

    if (currentHero.inventory && currentHero.inventory.length > 0 && typeof currentHero.inventory[0] === 'string') {
        currentHero.inventory = loadArtifactsFromIds(currentHero.inventory);
    }

    refreshAllUI();
    return true;
}

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

// Экспортируем в глобальную область для обратной совместимости
window.saveCurrentHero = saveCurrentHero;
window.loadHero = loadHero;
window.loadHeroForBattle = loadHeroForBattle;
