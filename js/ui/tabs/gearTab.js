// ============================================================================
//  ОТРИСОВКА ВКЛАДКИ СНАРЯЖЕНИЯ
// ============================================================================

import { currentHero } from '../../state.js';
import { saveCurrentHero } from '../../utils.js';

export function renderGearTab() {
    const slotConfigs = [
        { idx: 0, label: "Кольцо", emoji: "💍" }, 
        { idx: 1, label: "Голова", emoji: "⛑️" }, 
        { idx: 2, label: "Шея", emoji: "📿" },
        { idx: 3, label: "Книга заклинаний", emoji: "📖", isSpellbook: true }, 
        { idx: 4, label: "Кольцо", emoji: "💍" },
        { idx: 5, label: "Торс", emoji: "🛡️" }, 
        { idx: 6, label: "Левая рука", emoji: "🛡️" }, 
        { idx: 7, label: "Карман", emoji: "🔮" },
        { idx: 8, label: "Правая рука", emoji: "⚔️" }, 
        { idx: 9, label: "Ноги", emoji: "👢" }, 
        { idx: 10, label: "Плащ", emoji: "🧥" },
        { idx: 11, label: "Карман", emoji: "🔮" }
    ];
    
    const container = document.getElementById("artifactSlotsGrid");
    if (container) {
        container.innerHTML = "";
        for (let cfg of slotConfigs) {
            const art = currentHero.equipped?.[cfg.idx];
            const div = document.createElement("div");
            div.className = `artifact-slot ${art ? 'occupied' : ''} ${cfg.isSpellbook ? 'spellbook-slot' : ''}`;
            if (cfg.isSpellbook) {
                div.innerHTML = `<div class="slot-emoji">📖</div><div class="slot-label">Книга заклинаний</div>`;
            } else if (art) {
                div.innerHTML = `<div class="slot-emoji">${art.emoji}</div><div class="slot-label">${art.name}</div>`;
            } else {
                div.innerHTML = `<div class="slot-emoji">${cfg.emoji}</div><div class="slot-label">${cfg.label}</div>`;
            }
            if (!cfg.isSpellbook && art) {
                div.onclick = () => { 
                    currentHero.inventory.push(art); 
                    currentHero.equipped[cfg.idx] = null; 
                    renderGearTab(); 
                    renderInventory(); 
                    saveCurrentHero(); 
                };
            } else if (!cfg.isSpellbook) {
                div.onclick = () => alert("Слот пуст");
            } else {
                div.onclick = () => alert("Книга заклинаний (в разработке)");
            }
            container.appendChild(div);
        }
    }
    renderInventory();
}

export function renderInventory() {
    const cont = document.getElementById("inventoryContainer");
    if (!cont) return;
    
    if (!currentHero.inventory || currentHero.inventory.length === 0) {
        cont.innerHTML = '<div style="color:#7a6a44;padding:16px;">Инвентарь пуст</div>';
    } else {
        cont.innerHTML = currentHero.inventory.map((item, idx) => 
            `<div class="inventory-item" data-idx="${idx}">
                <span class="inv-emoji">${item.emoji || "📦"}</span>
                <span class="inv-name">${item.name || "Артефакт"}</span>
                <button class="inv-info-btn" data-name="${(item.name || "").replace(/"/g, '&quot;')}" data-desc="${(item.description || "").replace(/"/g, '&quot;')}">i</button>
            </div>`
        ).join("");
    }
    
    document.querySelectorAll(".inv-info-btn").forEach(btn => btn.addEventListener("click", (e) => { 
        e.stopPropagation(); 
        alert(`📖 ${btn.dataset.name}\n\n${btn.dataset.desc}`); 
    }));
    
    document.querySelectorAll(".inventory-item").forEach(el => {
        el.addEventListener("click", (e) => {
            if (e.target.classList.contains("inv-info-btn")) return;
            const idx = parseInt(el.dataset.idx);
            const item = currentHero.inventory[idx];
            const slotMap = [
                { idx: 0, type: "кольцо" }, { idx: 1, type: "голова" }, { idx: 2, type: "шея" }, 
                { idx: 4, type: "кольцо" }, { idx: 5, type: "торс" }, { idx: 6, type: "левая_рука" }, 
                { idx: 7, type: "карман" }, { idx: 8, type: "правая_рука" }, { idx: 9, type: "ноги" }, 
                { idx: 10, type: "плащ" }, { idx: 11, type: "карман" }
            ];
            let targetSlot = -1;
            for (let slot of slotMap) {
                if (slot.type === item.slotType && !currentHero.equipped[slot.idx]) { 
                    targetSlot = slot.idx; 
                    break; 
                }
            }
            if (targetSlot !== -1) { 
                currentHero.equipped[targetSlot] = item; 
                currentHero.inventory.splice(idx, 1); 
                renderGearTab(); 
                renderInventory(); 
                saveCurrentHero(); 
            } else {
                alert(`Нет свободного слота для артефакта типа "${item.slotType}"`);
            }
        });
    });
}

// Экспортируем в глобальную область для обратной совместимости
window.renderGearTab = renderGearTab;
window.renderInventory = renderInventory;
