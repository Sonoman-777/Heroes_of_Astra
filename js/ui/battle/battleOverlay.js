// ============================================================================
//  ОТРИСОВКА ОКНА БИТВЫ И ОБРАБОТЧИКИ КЛИКОВ
// ============================================================================

import { 
    currentBattle, 
    setCurrentBattle, 
    windowSelectedStackForPlacement, 
    setWindowSelectedStackForPlacement,
    resizeTimeout,
    setResizeTimeout 
} from '../../state.js';
import { loadHeroForBattle } from '../../utils.js';
import { Battle } from '../../../core/battle/Battle.js';
import { AnimationEngine } from '../../../core/battle/AnimationEngine.js';
import { PerkEngine } from '../../../core/battle/PerkEngine.js';
import { DamageCalculator } from '../../../core/battle/DamageCalculator.js';
import { renderSidebar } from './battleSidebar.js';
import { renderBattleField } from './battleField.js';
import { renderInitiativeBar } from './initiativeBar.js';
import { renderBattleControls } from './battleControls.js';
import { HEROES_DB } from '../../../data/heroes/index.js';

export function renderBattleUI() { 
    renderSidebar('attacker'); 
    renderSidebar('defender'); 
    renderBattleField(); 
    renderInitiativeBar(); 
    renderBattleControls(); 
    const st = document.getElementById("battleStatus"); 
    if (st) {
        st.innerText = currentBattle.isPreparationPhase ? 
            `⚙️ Подготовка: ${currentBattle.placementPhase === 'attacker' ? 'Атакующий' : 'Защитник'}` : 
            (currentBattle.attackMode ? 
                `⚔️ Выберите позицию для атаки` : 
                (currentBattle.manualMachineMode ? 
                    `🎯 Выберите цель для ${currentBattle.manualMachineType === 'ballista' ? 'баллисты' : 'палатки'}` : 
                    `⚔️ Раунд ${currentBattle.round}`));
    }
}

export function openBattleOverlay(attackerId, defenderId) {
    const attHero = loadHeroForBattle(attackerId); 
    const defHero = loadHeroForBattle(defenderId); 
    attHero.side = 'attacker'; 
    defHero.side = 'defender';
    
    const battle = new Battle(attHero, defHero); 
    battle.attackerStacks = battle.loadStacksFromHero(attHero, 'attacker'); 
    battle.defenderStacks = battle.loadStacksFromHero(defHero, 'defender');
    
    for (let s of [...battle.attackerStacks, ...battle.defenderStacks]) { 
        s.gridX = -1; s.gridY = -1; s.bottomX = -1; s.bottomY = -1; s.x = -1; s.y = -1; 
    }
    
    setCurrentBattle(battle);
    setWindowSelectedStackForPlacement(null);
    
    renderBattleUI();
    document.getElementById("battleOverlay").style.visibility = "visible"; 
    document.getElementById("battleOverlay").style.opacity = "1"; 
    setupBattleFieldClickHandler();
}

export function closeBattleOverlay() { 
    if (resizeTimeout) { 
        clearTimeout(resizeTimeout); 
        setResizeTimeout(null); 
    } 
    AnimationEngine.isAnimating = false; 
    document.getElementById("battleOverlay").style.visibility = "hidden"; 
    document.getElementById("battleOverlay").style.opacity = "0"; 
    setCurrentBattle(null); 
    setWindowSelectedStackForPlacement(null); 
}

export function setupBattleFieldClickHandler() {
    const fc = document.getElementById("battleField"); 
    if (!fc) return; 
    const nf = fc.cloneNode(true); 
    fc.parentNode.replaceChild(nf, fc); 
    const ff = document.getElementById("battleField");
    
    ff.onclick = async (e) => {
        const cell = e.target.closest('.battle-cell'); 
        if (!cell || !currentBattle) return; 
        if (AnimationEngine.isAnimating || currentBattle.isProcessingAction) return;
        
        const x = parseInt(cell.dataset.x), y = parseInt(cell.dataset.y);
        const isPlayable = x >= 2 && x <= 13 && y >= 2 && y <= 11;
        
        if (currentBattle.isPreparationPhase) { 
            if (windowSelectedStackForPlacement && isPlayable) { 
                const { side, index } = windowSelectedStackForPlacement; 
                if (currentBattle.placeStack(index, side, x, y)) { 
                    setWindowSelectedStackForPlacement(null); 
                    renderBattleUI(); 
                } 
            } 
            return; 
        }
        if (currentBattle.battleEnded) return;
        
        if (currentBattle.manualMachineMode) {
            const machine = currentBattle.getCurrentMachine(); 
            if (!machine) return; 
            let target = null;
            for (let s of [...currentBattle.attackerStacks, ...currentBattle.defenderStacks]) {
                if (s.isAlive() && s.occupiesCell(x, y)) { target = s; break; }
            }
            if (!target) { 
                const enemy = machine.side === 'attacker' ? 
                    currentBattle.defenderWarMachines : currentBattle.attackerWarMachines; 
                for (let m of enemy || []) {
                    if (m.isAlive && m.occupiesCell(x, y)) { target = m; break; }
                } 
            }
            if (target) {
                const hero = machine.side === 'attacker' ? 
                    currentBattle.attackerHero : currentBattle.defenderHero;
                if (machine.id === 'ballista') {
                    await currentBattle.performBallistaShotSeries(machine, target);
                    await currentBattle.finishMachineTurn();
                    renderBattleUI();
                } else if (machine.id === 'firstAidTent') {
                    if (currentBattle.manualMachineType === 'plagueTent') {
                        if (target.side !== machine.side) {
                            await currentBattle.performPlagueTentAttack(machine, target, hero);
                            await currentBattle.finishMachineTurn();
                            renderBattleUI();
                        }
                    } else {
                        if (target.constructor.name === 'BattleStack' && target.side === machine.side) {
                            await currentBattle.performTentHeal(machine, target, hero);
                            await currentBattle.finishMachineTurn();
                            renderBattleUI();
                        }
                    }
                }
            }
            return;
        }
        
        if (currentBattle.attackMode) {
            if (currentBattle.isHeroTurn()) {
                const hero = currentBattle.getCurrentHero(); 
                const enemyS = hero.side === 'attacker' ? 
                    currentBattle.defenderStacks : currentBattle.attackerStacks; 
                const enemyM = hero.side === 'attacker' ? 
                    currentBattle.defenderWarMachines : currentBattle.attackerWarMachines; 
                let target = null;
                for (let s of enemyS) {
                    if (s.isAlive() && s.occupiesCell(x, y)) { target = s; break; }
                } 
                if (!target) {
                    for (let m of enemyM || []) {
                        if (m.isAlive && m.occupiesCell(x, y)) { target = m; break; }
                    }
                }
                if (target) { 
                    const r = await currentBattle.performHeroAttack(hero, target); 
                    if (r.success) { 
                        currentBattle.attackMode = false; 
                        renderBattleUI(); 
                    } 
                } 
                return;
            }
            if (currentBattle.attackPositions.some(p => p.x === x && p.y === y)) { 
                await currentBattle.executeAttackFromPosition(x, y); 
                renderBattleUI(); 
            } 
            return;
        }
        
        if (currentBattle.isHeroTurn() || currentBattle.isMachineTurn()) return;
        
        const curStack = currentBattle.getCurrentActionStack(); 
        if (!curStack || curStack.hasActed || !curStack.isAlive()) return;
        
        let target = null;
        const enemyStacks = curStack.side === 'attacker' ? 
            currentBattle.defenderStacks : currentBattle.attackerStacks;
        for (let s of enemyStacks) {
            if (s.isAlive() && s.occupiesCell(x, y)) { target = s; break; }
        }
        if (!target) {
            const enemyMachines = curStack.side === 'attacker' ? 
                currentBattle.defenderWarMachines : currentBattle.attackerWarMachines;
            for (let m of enemyMachines || []) {
                if (m.isAlive && m.occupiesCell(x, y)) { target = m; break; }
            }
        }
        
        if (target) {
            const isAdjacent = currentBattle.grid.isInAttackRange(curStack, target);
            if (isAdjacent) { 
                await currentBattle.performMeleeAttack(curStack, target); 
                renderBattleUI(); 
                return; 
            }
            
            const canRange = curStack.canRangedAttack(target, currentBattle);
            if (canRange) {
                let choice;
                if (target.constructor.name === 'BattleStack') {
                    const d = DamageCalculator.calculateDistance(
                        curStack.bottomX, curStack.bottomY, 
                        target.bottomX, target.bottomY
                    );
                    if (d > curStack.shootRange) {
                        choice = confirm('Цель вне зоны точной стрельбы. Выстрел нанесёт только 50% урона.\n\nСтрелять?');
                    } else {
                        choice = confirm(`Атаковать ${target.creature.name} стрельбой?\n\nOK — Стрелять\nОтмена — Отмена`);
                    }
                } else {
                    choice = confirm(`Атаковать ${target.name} стрельбой?`);
                }
                if (choice) { 
                    await currentBattle.performRangedAttack(curStack, target); 
                    renderBattleUI(); 
                    return; 
                }
            }
            
            if (target.constructor.name === 'BattleStack' && !curStack.hasMoved) {
                const canReach = curStack.canReachTarget(target, currentBattle);
                if (canReach && currentBattle.activateAttackMode(curStack, target)) {
                    renderBattleUI();
                }
            }
            return;
        }
        
        if (!isPlayable) return;
        const moves = currentBattle.getAvailableMovesForStack(curStack); 
        if (moves.some(m => m.displayX === x && m.displayY === y) && !curStack.hasMoved) { 
            if (await currentBattle.tryMoveStack(curStack, x, y)) { 
                await currentBattle.endStackTurn(curStack); 
                await currentBattle.nextTurn(); 
                renderBattleUI(); 
            } 
        }
    };
}

// Экспортируем в глобальную область для обратной совместимости
window.renderBattleUI = renderBattleUI;
window.openBattleOverlay = openBattleOverlay;
window.closeBattleOverlay = closeBattleOverlay;
