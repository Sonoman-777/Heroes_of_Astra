// ============================================================================
//  ОТРИСОВКА ПОЛЯ БОЯ (16×14) - С НЕВИДИМОЙ СЕТКОЙ
// ============================================================================

import { currentBattle } from '../../state.js';
import { BATTLEFIELD_CONFIG } from '../../../core/battle/config.js';
import { PerkEngine } from '../../../core/battle/PerkEngine.js';
import { renderBattleUI } from './battleOverlay.js';

export function renderBattleField() {
    const container = document.getElementById("battleField");
    if (!container || !currentBattle) return;
    container.innerHTML = "";
    const fieldWrapper = document.createElement("div");
    fieldWrapper.style.display = "flex"; 
    fieldWrapper.style.justifyContent = "center"; 
    fieldWrapper.style.alignItems = "center";
    fieldWrapper.style.width = "100%"; 
    fieldWrapper.style.minHeight = "100%";
    
    const grid = document.createElement("div"); 
    grid.className = "battle-grid";
    const isMobile = window.innerWidth <= 700, isTablet = window.innerWidth <= 1024 && window.innerWidth > 700;
    let cellSize = isMobile ? 24 : (isTablet ? 30 : 36);
    grid.style.display = 'grid'; 
    grid.style.gridTemplateColumns = `repeat(16, ${cellSize}px)`; 
    grid.style.gridTemplateRows = `repeat(14, ${cellSize}px)`;
    grid.style.margin = '0 auto';
    
    const currentStack = currentBattle.getCurrentActionStack();
    const isHeroTurn = currentBattle.isHeroTurn(), 
          isMachineTurn = currentBattle.isMachineTurn(), 
          currentMachine = currentBattle.getCurrentMachine();
    let availableMoves = [], availableAttacks = [], attackPositionCells = [];
    
    if (currentBattle.attackMode) attackPositionCells = currentBattle.attackPositions;
    if (currentBattle.manualMachineMode && currentMachine) {
        attackPositionCells = currentBattle.grid.getTargetsInPlayableZone(currentMachine.side).map(t => ({ x: t.bottomX, y: t.bottomY }));
    }
    
    if (currentStack && !currentBattle.isPreparationPhase && !currentBattle.battleEnded && !currentStack.hasActed && currentStack.isAlive()) {
        availableMoves = currentBattle.getAvailableMovesForStack(currentStack);
        
        if (currentStack.isLarge()) {
            const expandedMoves = [];
            for (let move of availableMoves) {
                const baseX = move.displayX, baseY = move.displayY;
                expandedMoves.push({ displayX: baseX, displayY: baseY });
                expandedMoves.push({ displayX: baseX + 1, displayY: baseY });
                expandedMoves.push({ displayX: baseX, displayY: baseY + 1 });
                expandedMoves.push({ displayX: baseX + 1, displayY: baseY + 1 });
            }
            availableMoves = expandedMoves;
        }
        
        const allTargets = currentBattle.grid.getTargetsInPlayableZone(currentStack.side);
        for (let t of allTargets) {
            if (t !== currentStack && currentBattle.grid.isInAttackRange(currentStack, t)) {
                for (let c of t.getOccupiedCells()) {
                    if (!availableAttacks.some(a => a.x === c.x && a.y === c.y)) {
                        availableAttacks.push({ x: c.x, y: c.y, targetStack: t });
                    }
                }
            }
        }
    }
    
    const renderedCells = new Set();
    for (let y = 0; y < 14; y++) {
        for (let x = 0; x < 16; x++) {
            const cellKey = `${x},${y}`; 
            if (renderedCells.has(cellKey)) continue;
            const cell = document.createElement("div"); 
            cell.className = "battle-cell";
            cell.setAttribute('data-x', x); 
            cell.setAttribute('data-y', y);
            cell.style.display = 'flex'; 
            cell.style.alignItems = 'center'; 
            cell.style.justifyContent = 'center'; 
            cell.style.position = 'relative';
            cell.style.width = `${cellSize}px`; 
            cell.style.height = `${cellSize}px`;
            const isPlayableZone = x >= 2 && x <= 13 && y >= 2 && y <= 11;
            
            if (!isPlayableZone) { cell.style.cursor = 'default'; }
            
            if (currentBattle.isPreparationPhase) {
                if (currentBattle.placementPhase === 'attacker' && isPlayableZone) {
                    const validX = PerkEngine.getPlacementXRange(currentBattle, 'attacker');
                    if (validX.includes(x)) { cell.classList.add("attacker-zone"); }
                } else if (currentBattle.placementPhase === 'defender' && isPlayableZone) {
                    const validX = PerkEngine.getPlacementXRange(currentBattle, 'defender');
                    if (validX.includes(x)) { cell.classList.add("defender-zone"); }
                }
            }
            
            const isAttackPosition = attackPositionCells.some(p => p.x === x && p.y === y);
            if (isAttackPosition && isPlayableZone) { 
                cell.classList.add("attack-position");
                cell.style.cursor = 'pointer'; 
            }
            
            let machineHere = null;
            for (let m of [...(currentBattle.attackerWarMachines || []), ...(currentBattle.defenderWarMachines || [])]) {
                if (m.isAlive && m.bottomX === x && m.bottomY === y) { machineHere = m; break; }
            }
            if (machineHere) {
                for (let dy = 0; dy < 2; dy++) for (let dx = 0; dx < 2; dx++) renderedCells.add(`${x + dx},${y + dy}`);
                cell.classList.add("large-cell"); 
                cell.style.gridColumn = `span 2`; 
                cell.style.gridRow = `span 2`; 
                cell.style.width = `${cellSize * 2}px`; 
                cell.style.height = `${cellSize * 2}px`;
                cell.style.position = 'relative'; 
                cell.style.overflow = 'visible'; 
                cell.style.zIndex = '5'; 
                cell.style.cursor = 'pointer';
                if (isMachineTurn && currentMachine === machineHere) { 
                    cell.style.boxShadow = 'inset 0 0 0 3px #ffdd44, 0 0 15px #ffdd44'; 
                    cell.style.animation = 'pulseYellow 1s infinite'; 
                    cell.style.zIndex = '20'; 
                }
                const side = machineHere.side; 
                const imgSrc = machineHere.machineData.sprite || '';
                const imgHtml = imgSrc ? `<img src="${imgSrc}" style="width:85%;height:85%;object-fit:contain;display:block;margin:auto;" onerror="this.outerHTML='<div style=\'font-size:${cellSize * 0.8}px;display:flex;align-items:center;justify-content:center;width:100%;height:100%;\'>${machineHere.machineData.icon || '🏗️'}</div>'">` : `<div style="font-size:${cellSize * 0.8}px;display:flex;align-items:center;justify-content:center;width:100%;height:100%;">${machineHere.machineData.icon || '🏗️'}</div>`;
                const imgTransformStyle = side === 'defender' ? 'transform: scaleX(-1);' : ''; 
                cell.setAttribute('data-side', side);
                cell.innerHTML = `<div style="position: relative; width: 100%; height: 100%;"><div class="sprite-container" style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; height: 100%; ${imgTransformStyle}">${imgHtml}</div></div>`;
                cell.classList.add("has-stack"); 
                grid.appendChild(cell); 
                continue;
            }
            
            let heroHere = null;
            const aCfg = BATTLEFIELD_CONFIG.attacker.hero, dCfg = BATTLEFIELD_CONFIG.defender.hero;
            if (x >= aCfg.x && x < aCfg.x + 2 && y >= aCfg.y && y < aCfg.y + 2) heroHere = { side: 'attacker', hero: currentBattle.attackerHero };
            else if (x >= dCfg.x && x < dCfg.x + 2 && y >= dCfg.y && y < dCfg.y + 2) heroHere = { side: 'defender', hero: currentBattle.defenderHero };
            if (heroHere && x === (heroHere.side === 'attacker' ? aCfg.x : dCfg.x) && y === (heroHere.side === 'attacker' ? aCfg.y : dCfg.y)) {
                for (let dy = 0; dy < 2; dy++) for (let dx = 0; dx < 2; dx++) renderedCells.add(`${x + dx},${y + dy}`);
                cell.classList.add("large-cell"); 
                cell.style.gridColumn = `span 2`; 
                cell.style.gridRow = `span 2`; 
                cell.style.width = `${cellSize * 2}px`; 
                cell.style.height = `${cellSize * 2}px`;
                cell.style.position = 'relative'; 
                cell.style.overflow = 'visible'; 
                cell.style.zIndex = '5'; 
                cell.style.cursor = 'default';
                if (isHeroTurn && currentBattle.getCurrentHero() === heroHere.hero) { 
                    cell.style.boxShadow = 'inset 0 0 0 3px #ffdd44, 0 0 15px #ffdd44'; 
                    cell.style.animation = 'pulseYellow 1s infinite'; 
                    cell.style.zIndex = '20'; 
                }
                const hero = heroHere.hero, side = heroHere.side; 
                const imgSrc = hero.battleSprite || hero.portrait || '';
                const imgHtml = imgSrc ? `<img src="${imgSrc}" style="width:85%;height:85%;object-fit:contain;display:block;margin:auto;" onerror="this.outerHTML='<div style=\'font-size:${cellSize * 0.8}px;display:flex;align-items:center;justify-content:center;width:100%;height:100%;\'>🌀</div>'">` : `<div style="font-size:${cellSize * 0.8}px;display:flex;align-items:center;justify-content:center;width:100%;height:100%;">🌀</div>`;
                const imgTransformStyle = side === 'defender' ? 'transform: scaleX(-1);' : ''; 
                cell.setAttribute('data-side', side);
                cell.innerHTML = `<div style="position: relative; width: 100%; height: 100%;"><div class="sprite-container" style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; height: 100%; ${imgTransformStyle}">${imgHtml}</div></div>`;
                cell.classList.add("has-stack"); 
                grid.appendChild(cell); 
                continue;
            }
            
            let largeStackHere = null;
            for (let s of [...currentBattle.attackerStacks, ...currentBattle.defenderStacks]) {
                if (s.isLarge() && s.isAlive() && s.gridX >= 0 && s.gridY >= 0) {
                    const bx = s.gridX + currentBattle.grid.topOffsetX, by = s.gridY + currentBattle.grid.topOffsetY;
                    if (bx === x && by === y) { largeStackHere = s; break; }
                }
            }
            if (largeStackHere && isPlayableZone) {
                for (let dy = 0; dy < 2; dy++) for (let dx = 0; dx < 2; dx++) renderedCells.add(`${x + dx},${y + dy}`);
                cell.classList.add("large-cell"); 
                cell.style.gridColumn = `span 2`; 
                cell.style.gridRow = `span 2`; 
                cell.style.width = `${cellSize * 2}px`; 
                cell.style.height = `${cellSize * 2}px`;
                cell.style.position = 'relative'; 
                cell.style.overflow = 'visible'; 
                cell.style.zIndex = '5'; 
                cell.style.cursor = 'pointer';
                if (currentStack === largeStackHere) { 
                    cell.style.boxShadow = 'inset 0 0 0 3px #ffdd44, 0 0 15px #ffdd44'; 
                    cell.style.animation = 'pulseYellow 1s infinite'; 
                    cell.style.zIndex = '20'; 
                }
                const creature = largeStackHere.creature, side = largeStackHere.side; 
                const imgSrc = creature.sprite || creature.portrait || '';
                const imgHtml = imgSrc ? `<img src="${imgSrc}" style="width:85%;height:85%;object-fit:contain;display:block;margin:auto;" onerror="this.outerHTML='<div style=\'font-size:${cellSize * 0.8}px;display:flex;align-items:center;justify-content:center;width:100%;height:100%;\'>${creature.icon || '🐉'}</div>'">` : `<div style="font-size:${cellSize * 0.8}px;display:flex;align-items:center;justify-content:center;width:100%;height:100%;">${creature.icon || '🐉'}</div>`;
                const imgTransformStyle = side === 'defender' ? 'transform: scaleX(-1);' : ''; 
                cell.setAttribute('data-side', side);
                cell.innerHTML = `<div style="position: relative; width: 100%; height: 100%;"><div class="sprite-container" style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; height: 100%; ${imgTransformStyle}">${imgHtml}</div><div class="stack-count" style="position: absolute; bottom: 4px; right: 4px; font-size: ${isMobile ? '0.5rem' : '0.65rem'}; font-weight: bold; background: rgba(20, 20, 30, 0.9); color: #f5cb7e; padding: 2px 6px; border-radius: 12px; border: 1px solid #e9b45e; z-index: 10; line-height: 1.2; pointer-events: none;">${largeStackHere.count}</div></div>`;
                cell.classList.add("has-stack"); 
                grid.appendChild(cell); 
                continue;
            }
            
            let stackHere = null;
            for (let s of [...currentBattle.attackerStacks, ...currentBattle.defenderStacks]) {
                if (!s.isLarge() && s.isAlive() && s.bottomX === x && s.bottomY === y) { stackHere = s; break; }
            }
            let isOccupied = stackHere !== null;
            const isMoveAvailable = availableMoves.some(m => m.displayX === x && m.displayY === y);
            const isAttackAvailable = availableAttacks.some(a => a.x === x && a.y === y);
            
            if (!isAttackPosition && isPlayableZone) {
                if (isOccupied) { 
                    cell.style.cursor = 'pointer'; 
                    cell.style.opacity = '0.7'; 
                } else if (isMoveAvailable) { 
                    cell.classList.add("move-available"); 
                } else if (isAttackAvailable) { 
                    cell.classList.add("attack-available"); 
                }
            }
            
            if (stackHere && isPlayableZone) {
                cell.classList.add("has-stack"); 
                cell.style.cursor = 'pointer';
                if (currentStack === stackHere && !isAttackPosition) { 
                    cell.style.boxShadow = 'inset 0 0 0 3px #ffdd44, 0 0 15px #ffdd44'; 
                    cell.style.animation = 'pulseYellow 1s infinite'; 
                    cell.style.zIndex = '20'; 
                }
                const creature = stackHere.creature, side = stackHere.side; 
                const imgSrc = creature.sprite || creature.portrait || '';
                const imgHtml = imgSrc ? `<img src="${imgSrc}" style="width:90%;height:90%;object-fit:contain;display:block;margin:auto;" onerror="this.outerHTML='<div style=\'font-size:${cellSize * 0.6}px;display:flex;align-items:center;justify-content:center;width:100%;height:100%;\'>${creature.icon || '🐉'}</div>'">` : `<div style="font-size:${cellSize * 0.6}px;display:flex;align-items:center;justify-content:center;width:100%;height:100%;">${creature.icon || '🐉'}</div>`;
                const imgTransformStyle = side === 'defender' ? 'transform: scaleX(-1);' : ''; 
                cell.setAttribute('data-side', side);
                cell.innerHTML = `<div style="position: relative; width: 100%; height: 100%;"><div class="sprite-container" style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; ${imgTransformStyle}">${imgHtml}</div><div class="stack-count" style="position: absolute; bottom: 2px; right: 2px; font-size: ${isMobile ? '0.45rem' : '0.55rem'}; font-weight: bold; background: rgba(20, 20, 30, 0.9); color: #f5cb7e; padding: 1px 5px; border-radius: 10px; border: 1px solid #e9b45e; z-index: 10; line-height: 1.2; pointer-events: none;">${stackHere.count}</div></div>`;
            } else if (isPlayableZone) { 
                cell.innerHTML = ""; 
            } else { 
                cell.innerHTML = ""; 
            }
            grid.appendChild(cell);
        }
    }
    fieldWrapper.appendChild(grid); 
    container.appendChild(fieldWrapper);
}

// Экспортируем в глобальную область для обратной совместимости
window.renderBattleField = renderBattleField;
