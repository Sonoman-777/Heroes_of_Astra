// ============================================================================
//  РАСЧЁТ ХАРАКТЕРИСТИК ГЕРОЯ
// ============================================================================

import { currentHero } from '../../js/state.js';
import { getRandomStatWithPriority, addStatPoint, addEducationBonus, checkAndApplyEducationBonus } from '../../js/utils.js';
import { showLevelUpChoice } from '../../js/ui/overlays/choiceOverlay.js';
import { updateStatsUI, updateExpBarUI } from '../../js/ui/heroScreen.js';
import { saveCurrentHero } from '../../js/utils.js';

export function getTotalStats() {
    return {
        attack: currentHero.baseStats.attack + currentHero.educationBonus.attack,
        defense: currentHero.baseStats.defense + currentHero.educationBonus.defense,
        spellpower: currentHero.baseStats.spellpower + currentHero.educationBonus.spellpower,
        knowledge: currentHero.baseStats.knowledge + currentHero.educationBonus.knowledge
    };
}

export function getTotalExpRequiredForLevel(lvl) {
    if (lvl <= 1) return 0;
    let t = 0;
    for (let i = 1; i < lvl; i++) t += 500 * (i + 1);
    return t;
}

export function updateLevelAndStatsFromExp() {
    let newLvl = currentHero.currentLevel;
    while (newLvl < 40 && currentHero.currentExp >= getTotalExpRequiredForLevel(newLvl + 1)) newLvl++;
    if (newLvl !== currentHero.currentLevel) {
        const old = currentHero.currentLevel;
        for (let i = 0; i < newLvl - old; i++) addStatPoint(getRandomStatWithPriority());
        currentHero.currentLevel = newLvl;
        checkAndApplyEducationBonus(newLvl, old);
        updateStatsUI();
        showLevelUpChoice();
        saveCurrentHero();
    }
    updateExpBarUI();
}

// Экспортируем в глобальную область для обратной совместимости
window.getTotalStats = getTotalStats;
window.getTotalExpRequiredForLevel = getTotalExpRequiredForLevel;
window.updateLevelAndStatsFromExp = updateLevelAndStatsFromExp;
