// ============================================================================
//  ТОЧКА ВХОДА — ИНИЦИАЛИЗАЦИЯ ПРИЛОЖЕНИЯ
// ============================================================================

import { currentHero, setCurrentHero } from './state.js';
import { HEROES_DB } from '../data/heroes/index.js';
import { loadHero, saveCurrentHero } from '../core/hero/heroManager.js';
import { refreshAllUI } from './ui/heroScreen.js';
import { updateLevelAndStatsFromExp } from '../core/hero/stats.js';
import { openBattleOverlay, closeBattleOverlay, setupBattleFieldClickHandler } from './ui/battle/battleOverlay.js';
import { closeCreaturePanel } from './ui/overlays/creatureOverlay.js';
import { renderGearTab } from './ui/tabs/gearTab.js';
import { renderSkillsTab, renderRacialSkill, renderSpecialization, renderCentralPerk } from './ui/tabs/skillsTab.js';
import { renderArmySlots, renderWarMachines } from './ui/tabs/armyTab.js';

// Инициализация выпадающего списка героев
function initHeroSelect() {
    const select = document.getElementById("heroSelect");
    if (!select) return;
    select.innerHTML = "";
    for (let id in HEROES_DB) { 
        const option = document.createElement("option"); 
        option.value = id; 
        option.textContent = HEROES_DB[id].name; 
        select.appendChild(option); 
    }
    if (Object.keys(HEROES_DB).length) select.value = Object.keys(HEROES_DB)[0];
    select.addEventListener("change", (e) => { 
        if (currentHero) saveCurrentHero(); 
        loadHero(e.target.value); 
    });
}

// Инициализация вкладок
function initTabs() {
    document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const tab = btn.dataset.tab;
            document.querySelectorAll(".tab-btn").forEach(t => t.classList.remove("active"));
            document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
            btn.classList.add("active");
            document.getElementById(`tab-${tab}`).classList.add("active");
            if (tab === "gear") renderGearTab();
            if (tab === "skills") { 
                renderSkillsTab(); 
                renderRacialSkill(); 
                renderSpecialization(); 
                renderCentralPerk(); 
            }
            if (tab === "army") { 
                renderArmySlots(); 
                renderWarMachines(); 
            }
        });
    });
}

// Кнопка тестового боя
function addTestBattleButton() {
    const menu = document.querySelector(".main-menu"); 
    if (menu && !document.getElementById("testBattleBtn")) { 
        const b = document.createElement("button"); 
        b.id = "testBattleBtn"; 
        b.className = "main-btn"; 
        b.innerHTML = "⚔️ Тест боя"; 
        b.style.background = "#6b4e2e"; 
        b.onclick = () => { 
            const h = Object.keys(HEROES_DB); 
            if (h.length >= 2) openBattleOverlay(h[0], h[1]); 
            else if (h.length === 1) openBattleOverlay(h[0], h[0]); 
            else alert("Нет героев!"); 
        }; 
        menu.insertBefore(b, menu.children[2]); 
    }
}

// Основная инициализация
function init() {
    initHeroSelect();
    initTabs();
    if (Object.keys(HEROES_DB).length) loadHero(Object.keys(HEROES_DB)[0]);
    
    document.getElementById("addExp500").addEventListener("click", () => { 
        if (currentHero) { 
            currentHero.currentExp += 500; 
            updateLevelAndStatsFromExp(); 
            saveCurrentHero(); 
            refreshAllUI(); 
        } 
    });
    
    document.getElementById("addExp1000").addEventListener("click", () => { 
        if (currentHero) { 
            currentHero.currentExp += 1000; 
            updateLevelAndStatsFromExp(); 
            saveCurrentHero(); 
            refreshAllUI(); 
        } 
    });
    
    document.getElementById("creatureOverlay").addEventListener("click", (e) => { 
        if (e.target === document.getElementById("creatureOverlay")) closeCreaturePanel(); 
    });
    
    document.getElementById("closeBattleBtn")?.addEventListener("click", closeBattleOverlay);
    document.getElementById("battleOverlay")?.addEventListener("click", e => { 
        if (e.target === document.getElementById("battleOverlay")) closeBattleOverlay(); 
    });
    
    window.addEventListener('resize', () => { 
        if (window.resizeTimeout) clearTimeout(window.resizeTimeout); 
        window.resizeTimeout = setTimeout(() => { 
            if (window.currentBattle && document.getElementById("battleOverlay").style.visibility === "visible") {
                window.renderBattleUI(); 
            }
        }, 200); 
    });
    
    addTestBattleButton();
    setupBattleFieldClickHandler();
}

// Запуск при загрузке DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Экспорт для возможного использования
export { init, initHeroSelect, initTabs, addTestBattleButton };
