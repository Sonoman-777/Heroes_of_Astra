// ============================================================================
//  ОСНОВНОЙ ЭКРАН ГЕРОЯ — ОБНОВЛЕНИЕ ИНТЕРФЕЙСА
// ============================================================================

import { currentHero } from '../state.js';
import { getTotalStats, getTotalExpRequiredForLevel, updateLevelAndStatsFromExp } from '../../core/hero/stats.js';
import { renderArmySlots, renderWarMachines } from './tabs/armyTab.js';
import { renderSkillsTab, renderRacialSkill, renderSpecialization, renderCentralPerk } from './tabs/skillsTab.js';
import { renderGearTab } from './tabs/gearTab.js';

export function updateStatsUI() {
    const total = getTotalStats();
    document.getElementById("statAttack").innerText = total.attack;
    document.getElementById("statDefense").innerText = total.defense;
    document.getElementById("statSpellpower").innerText = total.spellpower;
    document.getElementById("statKnowledge").innerText = total.knowledge;
    
    const lead = currentHero.learnedSkills.find(s => s.key === "leadership");
    document.getElementById("statMorale").innerText = lead ? 1 + lead.level : 1;
    
    const luck = currentHero.learnedSkills.find(s => s.key === "luck");
    document.getElementById("statLuck").innerText = luck ? 1 + luck.level : 1;
    
    document.getElementById("statMana").innerText = 30 + total.knowledge * 10;
}

export function refreshHeroStatsUI() { 
    updateStatsUI(); 
    updateLevelAndStatsFromExp(); 
}

export function refreshAllUI() {
    if (!currentHero) return;
    document.getElementById("heroName").innerText = currentHero.name;
    document.getElementById("heroClass").innerText = currentHero.class === "ShadowLord" ? "Лорд Теней" : (currentHero.class || "Лорд Теней");
    if (currentHero.portrait) document.getElementById("heroPortraitImg").src = currentHero.portrait;
    refreshHeroStatsUI();
    renderArmySlots();
    renderWarMachines();
    renderSkillsTab();
    renderRacialSkill();
    renderSpecialization();
    renderCentralPerk();
    renderGearTab();
}

// Обновление отображения опыта и уровня (вызывается из stats.js)
export function updateExpBarUI() {
    const cur = getTotalExpRequiredForLevel(currentHero.currentLevel);
    const next = getTotalExpRequiredForLevel(currentHero.currentLevel + 1);
    const percent = Math.min(100, (currentHero.currentExp - cur) / (next - cur) * 100);
    document.getElementById("expBarFill").style.width = percent + "%";
    document.getElementById("heroLevelInfo").innerHTML = `Уровень ${currentHero.currentLevel} · Опыт: ${currentHero.currentExp} / ${next}`;
    updateStatsUI();
}

// Экспортируем в глобальную область для обратной совместимости
window.updateStatsUI = updateStatsUI;
window.refreshHeroStatsUI = refreshHeroStatsUI;
window.refreshAllUI = refreshAllUI;
window.updateExpBarUI = updateExpBarUI;
