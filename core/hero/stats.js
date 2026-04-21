// ============================================================================
//  РАСЧЁТ ХАРАКТЕРИСТИК ГЕРОЯ (БЕЗ ЦИКЛИЧЕСКИХ ИМПОРТОВ)
// ============================================================================

import { currentHero } from '../../js/state.js';
import { getRandomStatWithPriority } from '../../js/utils.js';

// Внутренние функции для работы со статами
function addStatPoint(stat) { 
    currentHero.baseStats[stat]++; 
}

function addEducationBonus(stat) { 
    currentHero.educationBonus[stat]++; 
}

function checkAndApplyEducationBonus(newLvl, oldLvl) {
    const edu = currentHero.learnedSkills.find(s => s.key === "education");
    if (!edu || edu.level === 0) return;
    const step = edu.level === 1 ? 4 : (edu.level === 2 ? 3 : 2);
    let cnt = 0;
    for (let l = oldLvl + 1; l <= newLvl; l++) if (l % step === 0) cnt++;
    for (let i = 0; i < cnt; i++) addEducationBonus(getRandomStatWithPriority());
}

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
        
        // Динамический импорт для избежания циклической зависимости
        import('../../js/ui/heroScreen.js').then(module => {
            module.updateStatsUI();
        });
        import('../../js/ui/overlays/choiceOverlay.js').then(module => {
            module.showLevelUpChoice();
        });
        import('../../js/utils.js').then(module => {
            module.saveCurrentHero();
        });
    }
    
    // Динамический импорт для обновления UI опыта
    import('../../js/ui/heroScreen.js').then(module => {
        const cur = getTotalExpRequiredForLevel(currentHero.currentLevel);
        const next = getTotalExpRequiredForLevel(currentHero.currentLevel + 1);
        const percent = Math.min(100, (currentHero.currentExp - cur) / (next - cur) * 100);
        document.getElementById("expBarFill").style.width = percent + "%";
        document.getElementById("heroLevelInfo").innerHTML = `Уровень ${currentHero.currentLevel} · Опыт: ${currentHero.currentExp} / ${next}`;
        module.updateStatsUI();
    });
}

// Экспортируем в глобальную область
window.getTotalStats = getTotalStats;
window.getTotalExpRequiredForLevel = getTotalExpRequiredForLevel;
window.updateLevelAndStatsFromExp = updateLevelAndStatsFromExp;
