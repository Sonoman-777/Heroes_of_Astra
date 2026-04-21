// ============================================================================
//  ОТРИСОВКА ШКАЛЫ ИНИЦИАТИВЫ
// ============================================================================

import { currentBattle } from '../../state.js';

export function renderInitiativeBar() {
    const container = document.getElementById("initiativeBar");
    if (!container || !currentBattle || currentBattle.isPreparationPhase) { 
        if (container) container.innerHTML = '<div style="text-align:center; padding:8px;">⚔️ Фаза подготовки</div>'; 
        return; 
    }
    
    const slotsHtml = currentBattle.initiativeQueue.map((entry, idx) => {
        const isCurrent = idx === currentBattle.currentTurnIndex;
        let sideClass = entry.side === 'attacker' ? 'attacker-initiative' : 'defender-initiative';
        let icon = '', shotsInfo = '';
        
        if (entry.type === 'hero') { 
            const h = entry.hero; 
            icon = h.portrait ? 
                `<img src="${h.portrait}" style="width:40px;height:40px;object-fit:cover;border-radius:50%;" onerror="this.outerHTML='<div style=font-size:1.5rem>🌀</div>'">` : 
                `<div style="font-size:1.5rem;">🌀</div>`; 
        } else if (entry.type === 'machine') { 
            const m = entry.machine; 
            icon = m.machineData.portrait ? 
                `<img src="${m.machineData.portrait}" style="width:40px;height:40px;object-fit:contain;border-radius:50%;" onerror="this.outerHTML='<div style=font-size:1.5rem>${m.machineData.icon || '🏗️'}</div>'">` : 
                `<div style="font-size:1.5rem;">${m.machineData.icon || '🏗️'}</div>`; 
        } else { 
            const s = entry.stack; 
            icon = s.creature.portrait ? 
                `<img src="${s.creature.portrait}" style="width:40px;height:40px;object-fit:contain;border-radius:50%;" onerror="this.outerHTML='<div style=font-size:1.5rem>${s.creature.icon || "🐉"}</div>'">` : 
                `<div style="font-size:1.5rem;">${s.creature.icon || "🐉"}</div>`; 
            if (s.isShooter) { 
                const left = s.shotsRemaining, max = s.creature.shots || 0, col = left > 0 ? '#8B4513' : '#666666'; 
                shotsInfo = `<div style="font-size:0.5rem; color: ${col}; margin-top:4px;">🏹${left}</div>`; 
            } 
        }
        
        return `<div class="initiative-slot ${isCurrent ? 'current' : ''} ${sideClass}" style="width:55px;height:55px;padding:4px;">${icon}${shotsInfo}</div>`;
    }).join('');
    
    container.innerHTML = `<div class="initiative-slots" style="display: flex; gap: 8px; overflow-x: auto; padding: 6px;">${slotsHtml}</div>`;
}

// Экспортируем в глобальную область для обратной совместимости
window.renderInitiativeBar = renderInitiativeBar;
