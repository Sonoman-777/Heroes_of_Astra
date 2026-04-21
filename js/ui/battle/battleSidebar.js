// ============================================================================
//  ОТРИСОВКА БОКОВЫХ ПАНЕЛЕЙ
// ============================================================================

import { currentBattle, windowSelectedStackForPlacement, setWindowSelectedStackForPlacement } from '../../state.js';
import { renderBattleUI } from './battleOverlay.js';

export function renderSidebar(side) {
    const container = document.getElementById(side === 'attacker' ? "attackerSidebar" : "defenderSidebar");
    if (!container || !currentBattle) return;
    
    const hero = side === 'attacker' ? currentBattle.attackerHero : currentBattle.defenderHero;
    const stacks = side === 'attacker' ? currentBattle.attackerStacks : currentBattle.defenderStacks;
    const machines = side === 'attacker' ? currentBattle.attackerWarMachines : currentBattle.defenderWarMachines;
    const currentStack = currentBattle.getCurrentActionStack();
    
    let stacksHtml = '<div class="battle-army-list">';
    
    if (machines && machines.length > 0) {
        stacksHtml += '<div style="font-size:0.7rem; color:#bdae83; margin:8px 0 4px;">⚙️ Боевые машины</div>';
        for (let m of machines) {
            const isActive = (currentBattle.isMachineTurn() && currentBattle.getCurrentMachine() === m);
            const iconHtml = m.machineData.portrait ? 
                `<img src="${m.machineData.portrait}" style="width:32px;height:32px;object-fit:contain;" onerror="this.outerHTML='<div style=font-size:1.2rem>${m.machineData.icon || '🏗️'}</div>'">` : 
                `<div style="font-size:1.2rem;">${m.machineData.icon || '🏗️'}</div>`;
            stacksHtml += `<div class="battle-stack-item" style="opacity:${m.isAlive ? 1 : 0.5}; ${isActive ? 'border: 2px solid #ffdd44; box-shadow: 0 0 10px #ffdd44;' : ''}"><div class="battle-stack-icon">${iconHtml}</div><div class="battle-stack-info"><div>${m.name}</div></div></div>`;
        }
    }
    
    stacksHtml += '<div style="font-size:0.7rem; color:#bdae83; margin:8px 0 4px;">🐉 Отряды</div>';
    for (let i = 0; i < stacks.length; i++) {
        const s = stacks[i];
        const isPlaced = s.isLarge() ? (s.gridX !== -1 && s.gridY !== -1) : (s.bottomX !== -1 && s.bottomY !== -1);
        const isActive = (currentStack === s);
        const iconHtml = s.creature.portrait ? 
            `<img src="${s.creature.portrait}" style="width:32px;height:32px;object-fit:contain;" onerror="this.outerHTML='<div style=font-size:1.2rem>${s.creature.icon || "🐉"}</div>'">` : 
            `<div style="font-size:1.2rem;">${s.creature.icon || "🐉"}</div>`;
        let shotsInfo = ''; 
        if (s.isShooter) { 
            const left = s.shotsRemaining, max = s.creature.shots || 0, col = left > 0 ? '#8B4513' : '#666666'; 
            shotsInfo = `<span style="font-size:0.5rem; color:${col};">🏹${left}/${max}</span>`; 
        }
        stacksHtml += `<div class="battle-stack-item" data-stack-index="${i}" data-side="${side}" style="opacity:${isPlaced ? 0.7 : 1}; ${isActive ? 'border: 2px solid #ffdd44; box-shadow: 0 0 10px #ffdd44;' : ''}"><div class="battle-stack-icon">${iconHtml}</div><div class="battle-stack-info"><div style="display:flex; align-items:center; gap:4px;"><span>${s.creature.name}</span>${shotsInfo}</div><div class="battle-stack-count">${s.count}</div>${!isPlaced ? '<div style="font-size:0.55rem;color:#ffaa66;">⚠️ не размещён</div>' : ''}</div></div>`;
    }
    stacksHtml += '</div>';
    
    const isHeroActive = currentBattle.isHeroTurn() && currentBattle.getCurrentHero() === hero;
    container.innerHTML = `<div class="battle-hero-portrait" style="${isHeroActive ? 'border: 2px solid #ffdd44; box-shadow: 0 0 10px #ffdd44;' : ''}"><img src="${hero.portrait || ''}" onerror="this.style.display='none'; this.parentElement.innerHTML='🌀'"></div><div class="battle-hero-name" style="${isHeroActive ? 'color: #ffdd44;' : ''}">${hero.name}</div>${stacksHtml}`;
    
    document.querySelectorAll(`.battle-stack-item[data-side="${side}"]`).forEach(el => {
        el.addEventListener("click", () => {
            const idx = parseInt(el.dataset.stackIndex);
            const stack = stacks[idx];
            if (currentBattle && currentBattle.isPreparationPhase && currentBattle.placementPhase === side) {
                const isPlaced = stack.isLarge() ? (stack.gridX !== -1) : (stack.bottomX !== -1);
                if (isPlaced) { 
                    if (confirm(`Снять ${stack.creature.name}?`)) { 
                        currentBattle.removeStackFromPosition(side, idx); 
                        renderBattleUI(); 
                    } 
                } else { 
                    setWindowSelectedStackForPlacement({ side, index: idx }); 
                    const hint = stack.isLarge() ? 
                        `столбцы 2-13, строки 2-11` : 
                        `${side === 'attacker' ? 'столбцы 2-3' : 'столбцы 12-13'}, строки 2-11`; 
                    alert(`Выберите клетку для ${stack.creature.name} (${hint})`); 
                    renderBattleUI(); 
                }
            }
        });
    });
}

// Экспортируем в глобальную область для обратной совместимости
window.renderSidebar = renderSidebar;
