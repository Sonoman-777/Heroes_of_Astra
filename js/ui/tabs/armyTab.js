// ============================================================================
//  ОТРИСОВКА ВКЛАДКИ АРМИИ
// ============================================================================

import { currentHero } from '../../state.js';
import { CREATURES_DB } from '../../../data/creatures/index.js';
import { openCreaturePanel } from '../overlays/creatureOverlay.js';

export function renderArmySlots() {
    const container = document.getElementById("armySlotsGrid");
    if (!container) return;
    container.innerHTML = "";
    const army = currentHero.army || [];
    for (let i = 0; i < 7; i++) {
        const slotData = army[i] || null;
        const slotCard = document.createElement("div");
        slotCard.className = "army-slot-card";
        if (slotData && slotData.creatureId && CREATURES_DB[slotData.creatureId]) {
            const creature = CREATURES_DB[slotData.creatureId];
            const iconHtml = creature.portrait ? 
                `<img src="${creature.portrait}" style="width:40px;height:40px;object-fit:contain;" onerror="this.outerHTML='<div style=font-size:2rem>${creature.icon || "🐉"}</div>'">` : 
                `<div style="font-size:2rem;">${creature.icon || "🐉"}</div>`;
            slotCard.innerHTML = `<div class="army-slot-icon">${iconHtml}</div><div class="army-slot-name">${creature.name}</div><div class="army-slot-count">${slotData.count}</div>`;
            slotCard.onclick = () => openCreaturePanel(slotData.creatureId, slotData.count, null);
        } else {
            slotCard.innerHTML = `<div class="army-slot-empty">⚫</div><div class="army-slot-name">Пустой слот</div><div class="army-slot-count">—</div>`;
        }
        container.appendChild(slotCard);
    }
}

export function renderWarMachines() {
    const container = document.getElementById("warMachinesGrid");
    if (!container) return;
    const machines = currentHero.warMachines || ["catapult", null, null, null];
    const icons = { catapult: "🏗️", ballista: "🏹", firstAidTent: "⛑️", ammoCart: "🧨" };
    const names = { catapult: "Катапульта", ballista: "Баллиста", firstAidTent: "Палатка", ammoCart: "Тележка" };
    container.innerHTML = "";
    for (let i = 0; i < 4; i++) {
        const m = machines[i];
        const slotCard = document.createElement("div");
        slotCard.className = "war-machine-slot-card";
        if (m && icons[m]) {
            slotCard.innerHTML = `<div class="war-machine-icon">${icons[m]}</div><div class="war-machine-label">${names[m]}</div>`;
        } else {
            slotCard.innerHTML = `<div class="war-machine-icon">🔲</div><div class="war-machine-label">Пустой слот</div>`;
        }
        container.appendChild(slotCard);
    }
}

// Экспортируем в глобальную область для обратной совместимости
window.renderArmySlots = renderArmySlots;
window.renderWarMachines = renderWarMachines;
