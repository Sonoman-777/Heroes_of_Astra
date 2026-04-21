// ============================================================================
//  ОТРИСОВКА КНОПОК УПРАВЛЕНИЯ БОЕМ
// ============================================================================

import { currentBattle } from '../../state.js';
import { closeBattleOverlay, renderBattleUI } from './battleOverlay.js';
import { AnimationEngine } from '../../../core/battle/AnimationEngine.js';
import { PerkEngine } from '../../../core/battle/PerkEngine.js';

export function renderBattleControls() {
    const container = document.getElementById("battleControls"); 
    if (!container) return;
    
    if (currentBattle && currentBattle.isPreparationPhase) {
        const placer = currentBattle.placementPhase === 'attacker' ? "Атакующий" : "Защитник";
        container.innerHTML = `<button class="battle-btn" id="finishPreparationBtn">✅ Завершить подготовку (${placer})</button><button class="battle-btn" id="surrenderBattleBtn">🏳️ Сдаться</button>`;
        
        document.getElementById("finishPreparationBtn").onclick = () => { 
            if (!currentBattle.areAllStacksPlaced(currentBattle.placementPhase)) { 
                alert("Разместите все отряды!"); 
                return; 
            } 
            if (currentBattle.placementPhase === 'attacker') { 
                currentBattle.placementPhase = 'defender'; 
            } else { 
                currentBattle.finishPreparation(); 
            } 
            renderBattleUI(); 
        };
        document.getElementById("surrenderBattleBtn").onclick = () => { 
            if (confirm("Сдаться?")) closeBattleOverlay(); 
        };
        
    } else if (currentBattle && !currentBattle.isPreparationPhase && !currentBattle.battleEnded) {
        const curStack = currentBattle.getCurrentActionStack();
        const curHero = currentBattle.getCurrentHero();
        const curMachine = currentBattle.getCurrentMachine();
        const isAnim = AnimationEngine.isAnimating || currentBattle.isProcessingAction;
        const isAttack = currentBattle.attackMode;
        const isManual = currentBattle.manualMachineMode;
        
        let turnText = ''; 
        if (isAttack) {
            turnText = `⚔️ Выберите позицию для атаки ${currentBattle.targetStack?.creature?.name || currentBattle.targetStack?.name || 'цели'}`; 
        } else if (isManual) {
            let modeText = '';
            if (currentBattle.manualMachineType === 'ballista') {
                const hero = currentBattle.getCurrentMachine()?.side === 'attacker' ? 
                    currentBattle.attackerHero : currentBattle.defenderHero;
                const shots = PerkEngine.getBallistaShots(hero);
                modeText = `баллисты (${shots} выстрела)`;
            } else if (currentBattle.manualMachineType === 'plagueTent') {
                modeText = 'чумной палатки (атака)';
            } else {
                modeText = 'палатки (лечение)';
            }
            turnText = `🎯 Выберите цель для ${modeText}`;
        } else if (curStack) {
            turnText = `Ход: ${curStack.creature.name} (${curStack.count})`; 
        } else if (curHero) {
            turnText = `🧙 Ход героя: ${curHero.name}`; 
        } else if (curMachine) {
            turnText = `⚙️ Ход машины: ${curMachine.name}`; 
        } else {
            turnText = "Ход: ...";
        }
        
        if (isAttack) {
            container.innerHTML = `<div style="flex:1; text-align:center; color: #ffa500;">${turnText}</div><button class="battle-btn" id="cancelAttackModeBtn" style="background: #8B4513;">❌ Отмена</button>`;
            document.getElementById("cancelAttackModeBtn").onclick = () => { 
                currentBattle.attackMode = false; 
                currentBattle.attackingStack = null; 
                currentBattle.targetStack = null; 
                currentBattle.attackPositions = []; 
                renderBattleUI(); 
            };
        } else if (isManual) {
            container.innerHTML = `<div style="flex:1; text-align:center; color: #ffa500;">${turnText}</div><button class="battle-btn" id="cancelMachineModeBtn" style="background: #8B4513;">❌ Пропустить</button>`;
            document.getElementById("cancelMachineModeBtn").onclick = async () => { 
                await currentBattle.finishMachineTurn(); 
            };
        } else {
            let btns = ''; 
            if (curStack) {
                btns = `<button class="battle-btn" id="defendTurnBtn" ${isAnim ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ''}>🛡️ Пропустить ход</button>`; 
            } else if (curHero) {
                btns = `<button class="battle-btn" id="heroAttackBtn" ${isAnim || currentBattle.heroHasAttackedThisTurn ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ''}>⚔️ Атака</button><button class="battle-btn" id="defendTurnBtn" ${isAnim ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ''}>🛡️ Пропустить ход</button>`; 
            } else if (curMachine) {
                btns = `<button class="battle-btn" id="machineActionBtn" ${isAnim ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ''}>🎯 Выбрать цель</button><button class="battle-btn" id="defendTurnBtn" ${isAnim ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ''}>🛡️ Пропустить ход</button>`;
            }
            container.innerHTML = `<div style="flex:1; text-align:center;">${turnText}</div>${btns}<button class="battle-btn" id="surrenderBattleBtn2">🏳️ Сдаться</button>`;
            
            if (curMachine) {
                document.getElementById("machineActionBtn").onclick = () => { 
                    currentBattle.manualMachineMode = true; 
                    currentBattle.manualMachineType = curMachine.id === 'ballista' ? 'ballista' : 'tent'; 
                    renderBattleUI(); 
                };
            }
            
            if (curHero) {
                document.getElementById("heroAttackBtn").onclick = () => { 
                    currentBattle.attackMode = true; 
                    currentBattle.attackingStack = null; 
                    currentBattle.targetStack = null; 
                    const enemyStacks = curHero.side === 'attacker' ? 
                        currentBattle.defenderStacks : currentBattle.attackerStacks; 
                    const enemyMachines = curHero.side === 'attacker' ? 
                        currentBattle.defenderWarMachines : currentBattle.attackerWarMachines; 
                    currentBattle.attackPositions = [
                        ...enemyStacks.filter(s => s.isAlive()).map(s => ({ x: s.bottomX, y: s.bottomY })), 
                        ...(enemyMachines || []).filter(m => m.isAlive).map(m => ({ x: m.bottomX, y: m.bottomY }))
                    ]; 
                    renderBattleUI(); 
                };
            }
            
            const defBtn = document.getElementById("defendTurnBtn"); 
            if (defBtn && !isAnim) {
                defBtn.onclick = async () => { 
                    if (AnimationEngine.isAnimating || currentBattle.isProcessingAction) { 
                        alert("Подождите завершения анимации"); 
                        return; 
                    } 
                    if (curStack) { 
                        curStack.hasActed = true; 
                        await currentBattle.endStackTurn(curStack); 
                        await currentBattle.nextTurn(); 
                    } else if (curHero) { 
                        await currentBattle.finishHeroTurn(); 
                    } else if (curMachine) { 
                        await currentBattle.finishMachineTurn(); 
                    } 
                    renderBattleUI(); 
                    if (!currentBattle.battleEnded && !currentBattle.isPreparationPhase) {
                        await currentBattle.processTurn(); 
                    }
                };
            }
            
            document.getElementById("surrenderBattleBtn2").onclick = () => { 
                if (confirm("Сдаться?")) closeBattleOverlay(); 
            };
        }
        
    } else if (currentBattle && currentBattle.battleEnded) {
        const winner = currentBattle.winner === 'attacker' ? 
            currentBattle.attackerHero.name : currentBattle.defenderHero.name;
        container.innerHTML = `<div style="text-align:center;">🏆 ПОБЕДА! ${winner} 🏆<br><button class="battle-btn" id="closeBattleAfterWin">Закрыть</button></div>`;
        document.getElementById("closeBattleAfterWin").onclick = () => closeBattleOverlay();
    }
}

// Экспортируем в глобальную область для обратной совместимости
window.renderBattleControls = renderBattleControls;
