// ============================================================================
//  ОКНО ИНФОРМАЦИИ О СУЩЕСТВЕ
// ============================================================================

import { currentHero } from '../../state.js';
import { CREATURES_DB } from '../../../data/creatures/index.js';
import { ABILITIES_DB } from '../../../data/abilities/index.js';
import { getTotalStats } from '../../../core/hero/stats.js';
import { getFactionName } from '../../utils.js';

export function openCreaturePanel(creatureId, count, stack = null) {
    if (!CREATURES_DB[creatureId]) { 
        alert("Данные о существе не найдены"); 
        return; 
    }

    const creature = CREATURES_DB[creatureId];
    const totalStats = getTotalStats();
    const leadSkill = currentHero.learnedSkills.find(s => s.key === "leadership");
    const heroMorale = leadSkill ? 1 + leadSkill.level : 1;
    const luckSkill = currentHero.learnedSkills.find(s => s.key === "luck");
    const heroLuck = luckSkill ? 1 + luckSkill.level : 1;

    const totalAttack = creature.attack + totalStats.attack;
    const totalDefense = creature.defense + totalStats.defense;
    const totalHealth = creature.health * count;
    const totalDamageMin = creature.damage_min * count;
    const totalDamageMax = creature.damage_max * count;

    const hasShooter = creature.abilities && creature.abilities.includes("shooter");
    const shootRange = creature.shootRange || 6;

    let shotsRemaining = creature.shots || 0;
    let shotsDisplay = '';

    if (hasShooter) {
        if (stack) {
            shotsRemaining = stack.shotsRemaining;
            shotsDisplay = `<div class="creature-stat-row">
                <span class="creature-stat-label">🏹 Выстрелов осталось</span>
                <span class="creature-stat-value">${shotsRemaining} / ${creature.shots || 0}</span>
            </div>`;
        } else {
            shotsDisplay = `<div class="creature-stat-row">
                <span class="creature-stat-label">🏹 Выстрелов</span>
                <span class="creature-stat-value">${shotsRemaining}</span>
            </div>`;
        }
    }

    const abilitiesList = creature.abilities || [];
    let abilitiesHtml = '';
    for (let abilityId of abilitiesList) {
        const ability = ABILITIES_DB[abilityId];
        abilitiesHtml += `<div class="ability-block">
            <div class="ability-name">${ability?.name || abilityId}</div>
            <div class="ability-desc">${ability?.desc || "Описание отсутствует"}</div>
        </div>`;
    }
    if (abilitiesHtml === '') {
        abilitiesHtml = '<div class="ability-block"><div class="ability-name">Нет особых способностей</div></div>';
    }

    const panel = document.getElementById("creaturePanel");
    const portraitHtml = creature.portrait 
        ? `<img src="${creature.portrait}" style="width:80px;height:80px;object-fit:contain;" onerror="this.outerHTML='<div style=font-size:4rem>${creature.icon || "🐉"}</div>'">` 
        : `<div style="font-size:4rem;">${creature.icon || "🐉"}</div>`;

    panel.innerHTML = `
        <button class="panel-close" id="closeCreatureBtn">✖</button>
        <div class="creature-portrait">${portraitHtml}</div>
        <div class="creature-name">${creature.name || creatureId}</div>
        <div class="creature-count">🐉 В отряде: ${count}</div>
        <div class="creature-faction">🏰 Фракция: ${getFactionName(creature.faction)}</div>
        <div class="creature-stats">
            <div class="creature-stat-row">
                <span class="creature-stat-label">⚔️ Нападение</span>
                <span class="creature-stat-value"><span class="stat-base">${creature.attack}</span> <span class="stat-total">→ ${totalAttack}</span></span>
            </div>
            <div class="creature-stat-row">
                <span class="creature-stat-label">🛡️ Защита</span>
                <span class="creature-stat-value"><span class="stat-base">${creature.defense}</span> <span class="stat-total">→ ${totalDefense}</span></span>
            </div>
            <div class="creature-stat-row">
                <span class="creature-stat-label">❤️ Здоровье</span>
                <span class="creature-stat-value"><span class="stat-base">${creature.health}</span> <span class="stat-ghost">| отряд: ${totalHealth}</span></span>
            </div>
            <div class="creature-stat-row">
                <span class="creature-stat-label">💥 Урон</span>
                <span class="creature-stat-value"><span class="stat-base">${creature.damage_min}-${creature.damage_max}</span> <span class="stat-ghost">| отряд: ${totalDamageMin}-${totalDamageMax}</span></span>
            </div>
            ${hasShooter ? `<div class="creature-stat-row"><span class="creature-stat-label">📏 Дальность стрельбы</span><span class="creature-stat-value">${shootRange} клеток</span></div>` : ''}
            ${shotsDisplay}
        </div>
        <div class="creature-stats">
            <div class="creature-stat-row"><span class="creature-stat-label">✨ Боевой дух</span><span class="creature-stat-value">${heroMorale >= 0 ? '+' : ''}${heroMorale}</span></div>
            <div class="creature-stat-row"><span class="creature-stat-label">🍀 Удача</span><span class="creature-stat-value">${heroLuck >= 0 ? '+' : ''}${heroLuck}</span></div>
            <div class="creature-stat-row"><span class="creature-stat-label">🏃 Скорость</span><span class="creature-stat-value">${creature.speed}</span></div>
            <div class="creature-stat-row"><span class="creature-stat-label">⏱️ Инициатива</span><span class="creature-stat-value">${creature.initiative}</span></div>
        </div>
        <div class="abilities-title">🌀 СПОСОБНОСТИ</div>
        ${abilitiesHtml}
    `;

    document.getElementById("creatureOverlay").style.visibility = "visible";
    document.getElementById("creatureOverlay").style.opacity = "1";
    document.getElementById("closeCreatureBtn").addEventListener("click", () => closeCreaturePanel());
}

export function closeCreaturePanel() {
    const overlay = document.getElementById("creatureOverlay");
    overlay.style.visibility = "hidden";
    overlay.style.opacity = "0";
}

// Экспортируем в глобальную область для обратной совместимости
window.openCreaturePanel = openCreaturePanel;
window.closeCreaturePanel = closeCreaturePanel;
