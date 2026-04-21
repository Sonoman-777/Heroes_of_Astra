// ============================================================================
//  МОДУЛЬ 8: BATTLE (ОСНОВНОЙ КОНТРОЛЛЕР БОЯ) - С УЧЁТОМ ВСЕХ УМЕНИЙ
// ============================================================================

import { BATTLEFIELD_CONFIG } from './config.js';
import { DualLayerGrid } from './DualLayerGrid.js';
import { BattleStack } from './BattleStack.js';
import { WarMachine } from './WarMachine.js';
import { PerkEngine } from './PerkEngine.js';
import { DamageCalculator } from './DamageCalculator.js';
import { AnimationEngine } from './AnimationEngine.js';
import { EffectEngine } from './EffectEngine.js';
import { CREATURES_DB } from '../../data/creatures/index.js';
import { WAR_MACHINES_DB } from '../../data/warMachines/index.js';

export class Battle {
    constructor(attackerHero, defenderHero) { 
        this.attackerHero = attackerHero; 
        this.defenderHero = defenderHero; 
        this.attackerStacks = []; 
        this.defenderStacks = []; 
        this.initiativeQueue = []; 
        this.currentTurnIndex = 0; 
        this.round = 1; 
        this.isPreparationPhase = true; 
        this.placementPhase = 'attacker'; 
        this.battleEnded = false; 
        this.winner = null; 
        this.isProcessingAction = false;
        this.attackMode = false;
        this.attackingStack = null;
        this.targetStack = null;
        this.attackPositions = [];
        this.grid = new DualLayerGrid(this);
        this.extraTurnPending = null;
        this.heroHasAttackedThisTurn = false;
        this.waitingForHeroAction = false;
        this.attackerWarMachines = [];
        this.defenderWarMachines = [];
        this.manualMachineMode = false;
        this.manualMachineType = null;
        
        this.ballistaShotsRemaining = 0;
        this.ballistaTarget = null;
        this.ballistaShotInProgress = false;
        
        this.initializeWarMachines();
        
        // Кэшируем бонусы героев
        this.attackerBonuses = PerkEngine.getHeroBonuses(this.attackerHero);
        this.defenderBonuses = PerkEngine.getHeroBonuses(this.defenderHero);
    }
    
    initializeWarMachines() {
        this.attackerWarMachines = [];
        const attackerMachines = this.attackerHero.warMachines || [];
        for (let machineId of attackerMachines) {
            if (machineId && WAR_MACHINES_DB[machineId] && !WAR_MACHINES_DB[machineId].siegeOnly) {
                const machine = new WarMachine(WAR_MACHINES_DB[machineId], 'attacker');
                const config = BATTLEFIELD_CONFIG.attacker[machineId];
                if (config) { 
                    machine.bottomX = config.x; 
                    machine.bottomY = config.y; 
                    this.attackerWarMachines.push(machine); 
                }
            }
        }
        this.defenderWarMachines = [];
        const defenderMachines = this.defenderHero.warMachines || [];
        for (let machineId of defenderMachines) {
            if (machineId && WAR_MACHINES_DB[machineId] && !WAR_MACHINES_DB[machineId].siegeOnly) {
                const machine = new WarMachine(WAR_MACHINES_DB[machineId], 'defender');
                const config = BATTLEFIELD_CONFIG.defender[machineId];
                if (config) { 
                    machine.bottomX = config.x; 
                    machine.bottomY = config.y; 
                    this.defenderWarMachines.push(machine); 
                }
            }
        }
    }
    
    calculateHeroInitiative(hero, side) {
        const stacks = side === 'attacker' ? this.attackerStacks : this.defenderStacks;
        if (stacks.length === 0) return 10;
        let total = 0, count = 0;
        for (let s of stacks) {
            if (s.isAlive()) { 
                total += s.initiative; 
                count++; 
            }
        }
        return count > 0 ? Math.floor(total / count) : 10;
    }
    
    loadStacksFromHero(hero, side) { 
        const stacks = []; 
        const army = hero.army || []; 
        for (let slot of army) {
            if (slot && slot.creatureId && slot.count > 0 && CREATURES_DB[slot.creatureId]) {
                stacks.push(new BattleStack(CREATURES_DB[slot.creatureId], slot.count, side, -1, -1));
            }
        }
        return stacks; 
    }
    
    buildInitiativeQueue() { 
        const entries = [];
        for (let s of this.attackerStacks) {
            if (s.isAlive()) entries.push({ type: 'stack', stack: s, side: 'attacker', initiative: s.initiative });
        }
        for (let s of this.defenderStacks) {
            if (s.isAlive()) entries.push({ type: 'stack', stack: s, side: 'defender', initiative: s.initiative });
        }
        for (let m of this.attackerWarMachines) {
            if (m.isAlive && m.initiative > 0) entries.push({ type: 'machine', machine: m, side: 'attacker', initiative: m.initiative });
        }
        for (let m of this.defenderWarMachines) {
            if (m.isAlive && m.initiative > 0) entries.push({ type: 'machine', machine: m, side: 'defender', initiative: m.initiative });
        }
        const attInit = this.calculateHeroInitiative(this.attackerHero, 'attacker');
        const defInit = this.calculateHeroInitiative(this.defenderHero, 'defender');
        entries.push({ type: 'hero', hero: this.attackerHero, side: 'attacker', initiative: attInit });
        entries.push({ type: 'hero', hero: this.defenderHero, side: 'defender', initiative: defInit });
        entries.sort((a, b) => a.initiative !== b.initiative ? b.initiative - a.initiative : Math.random() - 0.5);
        this.initiativeQueue = entries;
        this.currentTurnIndex = 0;
        for (let e of entries) {
            if (e.type === 'stack' && e.stack) { 
                e.stack.hasMoved = false; 
                e.stack.hasActed = false; 
                e.stack.resetRound(); 
            }
            if (e.type === 'machine' && e.machine) e.machine.resetTurn();
        }
        this.heroHasAttackedThisTurn = false;
        this.waitingForHeroAction = false;
    }
    
    getCurrentTurn() { 
        return this.currentTurnIndex >= this.initiativeQueue.length ? null : this.initiativeQueue[this.currentTurnIndex]; 
    }
    
    getCurrentActionStack() { 
        if (this.battleEnded || this.isPreparationPhase) return null; 
        if (this.waitingForHeroAction) return null;
        if (this.manualMachineMode) return null;
        while (this.currentTurnIndex < this.initiativeQueue.length) {
            const turn = this.initiativeQueue[this.currentTurnIndex];
            if (turn.type === 'stack' && turn.stack && turn.stack.isAlive() && !turn.stack.hasActed) {
                return turn.stack;
            }
            this.currentTurnIndex++;
        }
        if (this.currentTurnIndex >= this.initiativeQueue.length) {
            this.round++;
            this.startRound();
            this.buildInitiativeQueue();
            if (this.initiativeQueue.length === 0) { 
                this.checkBattleEnd(); 
                return null; 
            }
            const hasAnyStack = this.initiativeQueue.some(e => e.type === 'stack' && e.stack && e.stack.isAlive());
            if (!hasAnyStack) { 
                this.checkBattleEnd(); 
                return null; 
            }
            return this.getCurrentActionStack();
        }
        return null;
    }
    
    isHeroTurn() { 
        return !this.battleEnded && !this.isPreparationPhase && 
               this.currentTurnIndex < this.initiativeQueue.length && 
               this.initiativeQueue[this.currentTurnIndex]?.type === 'hero'; 
    }
    
    isMachineTurn() { 
        return !this.battleEnded && !this.isPreparationPhase && 
               this.currentTurnIndex < this.initiativeQueue.length && 
               this.initiativeQueue[this.currentTurnIndex]?.type === 'machine'; 
    }
    
    getCurrentMachine() { 
        const t = this.getCurrentTurn(); 
        return t?.type === 'machine' ? t.machine : null; 
    }
    
    getCurrentHero() { 
        const t = this.getCurrentTurn(); 
        return t?.type === 'hero' ? t.hero : null; 
    }
    
    startRound() {
        for (let m of this.attackerWarMachines) {
            if (m.id === 'ammoCart' && m.isAlive) {
                for (let s of this.attackerStacks) {
                    if (s.isShooter && s.isAlive()) s.shotsRemaining = s.creature.shots || 0;
                }
            }
        }
        for (let m of this.defenderWarMachines) {
            if (m.id === 'ammoCart' && m.isAlive) {
                for (let s of this.defenderStacks) {
                    if (s.isShooter && s.isAlive()) s.shotsRemaining = s.creature.shots || 0;
                }
            }
        }
    }
    
    async processTurn() {
        if (this.battleEnded || this.isPreparationPhase) return;
        if (this.manualMachineMode) { 
            if (typeof window.renderBattleUI === 'function') window.renderBattleUI(); 
            return; 
        }
        
        const turn = this.getCurrentTurn();
        if (!turn) return;
        
        if (turn.type === 'stack') {
            const stack = turn.stack;
            if (!stack || !stack.isAlive()) { 
                await this.nextTurn(); 
                await this.processTurn(); 
                return; 
            }
            
            const heroBonuses = turn.side === 'attacker' ? this.attackerBonuses : this.defenderBonuses;
            if (stack.checkNegativeMorale(heroBonuses)) { 
                await AnimationEngine.sleep(AnimationEngine.MORALE_CHECK_PAUSE); 
                stack.hasActed = true; 
                await this.nextTurn(); 
                if (typeof window.renderBattleUI === 'function') window.renderBattleUI(); 
                await this.processTurn(); 
                return; 
            }
            if (typeof window.renderBattleUI === 'function') window.renderBattleUI();
            
        } else if (turn.type === 'machine') {
            const machine = turn.machine;
            if (!machine || !machine.isAlive) { 
                await this.nextTurn(); 
                await this.processTurn(); 
                return; 
            }
            const hero = turn.side === 'attacker' ? this.attackerHero : this.defenderHero;
            const heroBonuses = turn.side === 'attacker' ? this.attackerBonuses : this.defenderBonuses;
            
            if (machine.id === 'ballista') {
                if (heroBonuses.manualBallista) {
                    this.manualMachineMode = true;
                    this.manualMachineType = 'ballista';
                    if (typeof window.renderBattleUI === 'function') window.renderBattleUI();
                    return;
                } else {
                    const target = machine.selectBallistaTarget(this, hero);
                    if (target) await this.performSingleBallistaShot(machine, target);
                    machine.hasActed = true;
                    await this.nextTurn();
                    if (typeof window.renderBattleUI === 'function') window.renderBattleUI();
                    await this.processTurn();
                    return;
                }
            }
            
            if (machine.id === 'firstAidTent') {
                if (heroBonuses.manualFirstAid) {
                    this.manualMachineMode = true;
                    this.manualMachineType = heroBonuses.plagueTent ? 'plagueTent' : 'tent';
                    if (typeof window.renderBattleUI === 'function') window.renderBattleUI();
                    return;
                } else {
                    if (heroBonuses.plagueTent) {
                        const target = machine.selectPlagueTentTarget(this, hero);
                        if (target) await this.performPlagueTentAttack(machine, target, hero);
                    } else {
                        const target = machine.selectTentTarget(this, hero);
                        if (target) await this.performTentHeal(machine, target, hero);
                    }
                    machine.hasActed = true;
                    await this.nextTurn();
                    if (typeof window.renderBattleUI === 'function') window.renderBattleUI();
                    await this.processTurn();
                    return;
                }
            }
            
            machine.hasActed = true;
            await this.nextTurn();
            if (typeof window.renderBattleUI === 'function') window.renderBattleUI();
            await this.processTurn();
            
        } else if (turn.type === 'hero') {
            this.waitingForHeroAction = true;
            this.heroHasAttackedThisTurn = false;
            if (typeof window.renderBattleUI === 'function') window.renderBattleUI();
            return;
        }
    }
    
    async performBallistaShotSeries(machine, target) {
        if (this.ballistaShotInProgress) return;
        this.ballistaShotInProgress = true;
        
        const hero = machine.side === 'attacker' ? this.attackerHero : this.defenderHero;
        const totalShots = PerkEngine.getBallistaShots(hero);
        
        this.ballistaShotsRemaining = totalShots;
        this.ballistaTarget = target;
        
        while (this.ballistaShotsRemaining > 0 && this.ballistaTarget) {
            const currentTarget = this.ballistaTarget;
            const isTargetAlive = (currentTarget instanceof BattleStack && currentTarget.isAlive()) ||
                                  (currentTarget instanceof WarMachine && currentTarget.isAlive);
            if (!isTargetAlive) break;
            
            await this.performSingleBallistaShot(machine, currentTarget);
            this.ballistaShotsRemaining--;
            
            if (this.ballistaShotsRemaining > 0) {
                await AnimationEngine.sleep(AnimationEngine.BALLISTA_SHOT_INTERVAL);
            }
        }
        
        this.ballistaShotInProgress = false;
        this.ballistaTarget = null;
        machine.hasActed = true;
    }
    
    async performSingleBallistaShot(machine, target) {
        if ((target instanceof BattleStack && !target.isAlive()) || 
            (target instanceof WarMachine && !target.isAlive)) {
            return { success: false, reason: "Цель уничтожена" };
        }
        
        const hero = machine.side === 'attacker' ? this.attackerHero : this.defenderHero;
        const heroBonuses = machine.side === 'attacker' ? this.attackerBonuses : this.defenderBonuses;
        const heroAttack = heroBonuses.attackBonus;
        
        const ballistaCell = document.querySelector(`.battle-cell[data-x='${machine.bottomX}'][data-y='${machine.bottomY}']`);
        const targetCell = document.querySelector(`.battle-cell[data-x='${target.bottomX}'][data-y='${target.bottomY}']`);
        if (ballistaCell && targetCell) await AnimationEngine.animateBallistaAttack(ballistaCell, targetCell);
        
        const baseDamage = DamageCalculator.calculateBallistaDamage(heroAttack);
        let actualDamage = baseDamage;
        if (target instanceof BattleStack) {
            const defense = target.creature.defense;
            actualDamage = Math.floor(baseDamage * (1 + Math.max(0, (5 - defense) * 0.05)));
        }
        
        let killed = 0;
        if (target instanceof BattleStack) {
            const r = DamageCalculator.applyDamage(target, actualDamage);
            killed = r.killed;
            this.showDamageNumber(target, actualDamage, killed, 'normal');
            if (!target.isAlive()) this.removeDeadStack(target);
        } else if (target instanceof WarMachine) {
            target.takeDamage(actualDamage);
            this.showMachineDamageNumber(target, actualDamage);
            if (!target.isAlive) this.removeDeadMachine(target);
        }
        
        this.grid.synchronize();
        this.checkBattleEnd();
        await AnimationEngine.sleep(AnimationEngine.SYNC_PAUSE);
        return { success: true, damage: actualDamage, killed };
    }
    
    async performPlagueTentAttack(machine, target, hero) {
        if (this.isProcessingAction || AnimationEngine.isAnimating) {
            return { success: false, reason: "Идёт анимация" };
        }
        if (!target.isAlive()) return { success: false, reason: "Цель уничтожена" };
        
        this.isProcessingAction = true;
        const heroBonuses = machine.side === 'attacker' ? this.attackerBonuses : this.defenderBonuses;
        const damage = DamageCalculator.calculateTentHeal(hero.currentLevel, heroBonuses.warMachinesLevel);
        
        const tentCell = document.querySelector(`.battle-cell[data-x='${machine.bottomX}'][data-y='${machine.bottomY}']`);
        const targetCell = document.querySelector(`.battle-cell[data-x='${target.bottomX}'][data-y='${target.bottomY}']`);
        if (tentCell && targetCell) await AnimationEngine.animatePlagueAttack(tentCell, targetCell);
        
        const result = DamageCalculator.applyDamage(target, damage);
        if (result.killed > 0 || damage > 0) {
            this.showDamageNumber(target, damage, result.killed, 'normal');
            EffectEngine.showFloatingEffect(target, '☠️', '#9932CC', 1500);
        }
        if (!target.isAlive()) this.removeDeadStack(target);
        
        this.grid.synchronize();
        this.checkBattleEnd();
        await AnimationEngine.sleep(AnimationEngine.SYNC_PAUSE);
        this.isProcessingAction = false;
        return { success: true, damage, killed: result.killed };
    }
    
    async performTentHeal(machine, target, hero) {
        if (this.isProcessingAction || AnimationEngine.isAnimating) {
            return { success: false, reason: "Идёт анимация" };
        }
        if (!target.isAlive()) return { success: false, reason: "Цель уничтожена" };
        if ((target.healthMissing || 0) <= 0) return { success: false, reason: "Отряд полностью здоров" };
        
        this.isProcessingAction = true;
        const heroBonuses = machine.side === 'attacker' ? this.attackerBonuses : this.defenderBonuses;
        const healAmount = DamageCalculator.calculateTentHeal(hero.currentLevel, heroBonuses.warMachinesLevel);
        
        const tentCell = document.querySelector(`.battle-cell[data-x='${machine.bottomX}'][data-y='${machine.bottomY}']`);
        const targetCell = document.querySelector(`.battle-cell[data-x='${target.bottomX}'][data-y='${target.bottomY}']`);
        if (tentCell && targetCell) await AnimationEngine.animateHeal(tentCell, targetCell);
        
        const result = DamageCalculator.applyHeal(target, healAmount);
        if (result.healed > 0) EffectEngine.showHealEffect(target, result.healed);
        
        await AnimationEngine.sleep(AnimationEngine.SYNC_PAUSE);
        this.isProcessingAction = false;
        return { success: true, healed: result.healed };
    }
    
    async nextTurn() { 
        if (this.battleEnded) return; 
        this.waitingForHeroAction = false;
        this.manualMachineMode = false;
        this.manualMachineType = null;
        if (this.extraTurnPending) {
            const stack = this.extraTurnPending;
            this.extraTurnPending = null;
            if (stack.isAlive()) {
                stack.hasActed = false;
                this.initiativeQueue.splice(this.currentTurnIndex, 0, { 
                    type: 'stack', stack, side: stack.side, initiative: stack.initiative 
                });
            }
            if (typeof window.renderBattleUI === 'function') window.renderBattleUI();
            await this.processTurn();
            return;
        }
        this.attackMode = false;
        this.attackingStack = null;
        this.targetStack = null;
        this.attackPositions = [];
        this.currentTurnIndex++; 
        if (this.currentTurnIndex >= this.initiativeQueue.length) { 
            this.round++; 
            this.startRound(); 
            this.buildInitiativeQueue(); 
        }
        this.grid.synchronize();
        this.checkBattleEnd();
        if (!this.battleEnded && !this.isPreparationPhase) await this.processTurn();
    }
    
    async finishHeroTurn() { 
        if (!this.waitingForHeroAction) return; 
        this.waitingForHeroAction = false; 
        await this.nextTurn(); 
        if (typeof window.renderBattleUI === 'function') window.renderBattleUI(); 
        if (!this.battleEnded && !this.isPreparationPhase) await this.processTurn(); 
    }
    
    async finishMachineTurn() {
        if (!this.manualMachineMode) return;
        this.manualMachineMode = false;
        this.manualMachineType = null;
        const m = this.getCurrentMachine();
        if (m) m.hasActed = true;
        await this.nextTurn();
        if (typeof window.renderBattleUI === 'function') window.renderBattleUI();
        if (!this.battleEnded && !this.isPreparationPhase) await this.processTurn();
    }
    
    async endStackTurn(stack) {
        if (!stack || !stack.isAlive()) return;
        const heroBonuses = stack.side === 'attacker' ? this.attackerBonuses : this.defenderBonuses;
        if (stack.checkPositiveMorale(heroBonuses)) { 
            await AnimationEngine.sleep(AnimationEngine.MORALE_CHECK_PAUSE); 
            if (stack.isAlive()) { 
                stack.resetCounterForExtraTurn(); 
                this.extraTurnPending = stack; 
            } 
        }
    }
    
    async performHeroAttack(hero, targetStack) {
        if (this.isProcessingAction || AnimationEngine.isAnimating) {
            return { success: false, reason: "Идёт анимация" };
        }
        if (!this.waitingForHeroAction) return { success: false, reason: "Сейчас не ход героя" };
        if (this.heroHasAttackedThisTurn) return { success: false, reason: "Герой уже атаковал" };
        
        const enemyStacks = hero.side === 'attacker' ? this.defenderStacks : this.attackerStacks;
        const enemyMachines = hero.side === 'attacker' ? this.defenderWarMachines : this.attackerWarMachines;
        if (!enemyStacks.some(s => s === targetStack) && 
            !(targetStack instanceof WarMachine && enemyMachines.some(m => m === targetStack))) {
            return { success: false, reason: "Нельзя атаковать союзников" };
        }
        
        this.isProcessingAction = true;
        const heroConfig = BATTLEFIELD_CONFIG[hero.side].hero;
        const heroCell = document.querySelector(`.battle-cell[data-x='${heroConfig.x}'][data-y='${heroConfig.y}']`);
        const targetCell = document.querySelector(`.battle-cell[data-x='${targetStack.bottomX}'][data-y='${targetStack.bottomY}']`);
        if (heroCell && targetCell) await AnimationEngine.animateHeroAttack(heroCell, targetCell);
        
        let damage, killed = 0;
        if (targetStack instanceof BattleStack) { 
            damage = DamageCalculator.calculateHeroDamage(hero, targetStack); 
            const r = DamageCalculator.applyDamage(targetStack, damage); 
            killed = r.killed; 
            this.showDamageNumber(targetStack, damage, killed, 'normal'); 
            if (!targetStack.isAlive()) this.removeDeadStack(targetStack); 
        } else if (targetStack instanceof WarMachine) { 
            damage = Math.floor(DamageCalculator.calculateHeroDamage(hero, { 
                creature: { level: 3, health: 100 } 
            }) * 0.5); 
            targetStack.takeDamage(damage); 
            this.showMachineDamageNumber(targetStack, damage); 
            if (!targetStack.isAlive) this.removeDeadMachine(targetStack); 
        }
        
        this.heroHasAttackedThisTurn = true;
        this.grid.synchronize();
        this.checkBattleEnd();
        await AnimationEngine.sleep(AnimationEngine.SYNC_PAUSE);
        this.isProcessingAction = false;
        this.attackMode = false;
        await this.finishHeroTurn();
        return { success: true, damage, killed };
    }
    
    showDamageNumber(stack, damage, killed, luckType = 'normal') { 
        const cell = document.querySelector(`.battle-cell[data-x='${stack.bottomX}'][data-y='${stack.bottomY}']`); 
        if (!cell) return; 
        const d = document.createElement('div'); 
        let txt = `-${Math.floor(damage)}`, col = '#ff6666';
        if (luckType === 'critical') { txt = `💥 ${txt}`; col = '#ffaa00'; }
        else if (luckType === 'miss') { txt = `❌ ПРОМАХ`; col = '#888888'; }
        d.textContent = txt; 
        d.style.position = 'absolute'; 
        d.style.top = '30%'; 
        d.style.left = '50%'; 
        d.style.transform = 'translate(-50%, -50%)'; 
        d.style.color = col; 
        d.style.fontWeight = 'bold'; 
        d.style.fontSize = '1.2rem'; 
        d.style.textShadow = '1px 1px 0 #000'; 
        d.style.zIndex = '100'; 
        d.style.pointerEvents = 'none'; 
        d.style.animation = 'floatUp 1s ease-out forwards'; 
        cell.style.position = 'relative'; 
        cell.appendChild(d); 
        setTimeout(() => d.remove(), 1000); 
    }
    
    showMachineDamageNumber(machine, damage) {
        const cell = document.querySelector(`.battle-cell[data-x='${machine.bottomX}'][data-y='${machine.bottomY}']`); 
        if (!cell) return;
        const d = document.createElement('div'); 
        d.textContent = `-${Math.floor(damage)}`; 
        d.style.position = 'absolute'; 
        d.style.top = '30%'; 
        d.style.left = '50%'; 
        d.style.transform = 'translate(-50%, -50%)'; 
        d.style.color = '#ff6666'; 
        d.style.fontWeight = 'bold'; 
        d.style.fontSize = '1.2rem'; 
        d.style.textShadow = '1px 1px 0 #000'; 
        d.style.zIndex = '100'; 
        d.style.pointerEvents = 'none'; 
        d.style.animation = 'floatUp 1s ease-out forwards';
        cell.style.position = 'relative'; 
        cell.appendChild(d); 
        setTimeout(() => d.remove(), 1000);
    }
    
    checkBattleEnd() { 
        const a = this.attackerStacks.some(s => s.isAlive()); 
        const d = this.defenderStacks.some(s => s.isAlive()); 
        if (!a) { 
            this.battleEnded = true; 
            this.winner = 'defender'; 
            return true; 
        } 
        if (!d) { 
            this.battleEnded = true; 
            this.winner = 'attacker'; 
            return true; 
        } 
        return false; 
    }
    
    placeStack(stackIndex, side, x, y) { 
        if (!this.isPreparationPhase) return false; 
        const stacks = side === 'attacker' ? this.attackerStacks : this.defenderStacks; 
        if (stackIndex >= stacks.length) return false; 
        const stack = stacks[stackIndex]; 
        if (!stack) return false; 
        
        let success = false;
        if (stack.isLarge()) {
            const topX = x - this.grid.topOffsetX, topY = y - this.grid.topOffsetY;
            const validTopX = PerkEngine.getLargePlacementXRange(this, side);
            if (validTopX.includes(topX) && topY >= 0 && topY < 9 && 
                this.grid.canPlaceLarge(topX, topY, stack)) { 
                stack.gridX = topX; 
                stack.gridY = topY; 
                success = true; 
            }
        } else {
            const validX = PerkEngine.getPlacementXRange(this, side);
            if (validX.includes(x) && y >= 2 && y <= 11 && 
                this.grid.canPlaceNormal(x, y, stack)) { 
                stack.bottomX = x; 
                stack.bottomY = y; 
                success = true; 
            }
        }
        if (success) this.grid.synchronize();
        return success;
    }
    
    removeStackFromPosition(side, stackIndex) { 
        const stacks = side === 'attacker' ? this.attackerStacks : this.defenderStacks; 
        if (stackIndex >= stacks.length) return; 
        stacks[stackIndex].gridX = -1; 
        stacks[stackIndex].gridY = -1; 
        stacks[stackIndex].bottomX = -1; 
        stacks[stackIndex].bottomY = -1;
        this.grid.synchronize();
    }
    
    areAllStacksPlaced(side) { 
        const stacks = side === 'attacker' ? this.attackerStacks : this.defenderStacks; 
        return stacks.every(s => (s.isLarge() ? s.gridX !== -1 : s.bottomX !== -1)); 
    }
    
    finishPreparation() { 
        if (!this.isPreparationPhase) return false; 
        if (this.placementPhase === 'attacker') { 
            this.placementPhase = 'defender'; 
            return false; 
        } 
        this.isPreparationPhase = false; 
        this.grid.synchronize();
        this.buildInitiativeQueue();
        setTimeout(() => this.processTurn(), 100);
        return true; 
    }
    
    getAvailableMovesForStack(stack) { 
        if (stack.hasMoved) return []; 
        if (stack.isLarge()) {
            const moves = this.grid.getAvailableMovesForLarge(stack);
            return moves.map(m => ({ 
                displayX: m.x + this.grid.topOffsetX, 
                displayY: m.y + this.grid.topOffsetY, 
                topX: m.x, 
                topY: m.y 
            }));
        }
        const moves = this.grid.getAvailableMovesForNormal(stack);
        return moves.map(m => ({ 
            displayX: m.x, 
            displayY: m.y, 
            topX: m.x, 
            topY: m.y 
        }));
    }
    
    getAttackPositions(attacker, target) {
        const raw = this.grid.getAttackPositions(attacker, target);
        if (attacker.isLarge()) {
            return raw.map(p => ({ 
                x: p.x + this.grid.topOffsetX, 
                y: p.y + this.grid.topOffsetY 
            }));
        }
        return raw;
    }
    
    async tryMoveStack(stack, newX, newY) { 
        if (this.isProcessingAction || AnimationEngine.isAnimating) return false;
        const available = this.getAvailableMovesForStack(stack);
        const moveInfo = available.find(m => m.displayX === newX && m.displayY === newY);
        if (!moveInfo || stack.hasMoved) return false;
        this.isProcessingAction = true;
        const fromX = stack.bottomX, fromY = stack.bottomY;
        const cellElement = document.querySelector(`.battle-cell[data-x='${fromX}'][data-y='${fromY}']`); 
        if (cellElement) await AnimationEngine.animateMove(cellElement, fromX, fromY, newX, newY, 350);
        const success = stack.isLarge() ? 
            this.grid.moveStack(stack, moveInfo.topX, moveInfo.topY) : 
            this.grid.moveStack(stack, newX, newY);
        await AnimationEngine.sleep(AnimationEngine.SYNC_PAUSE);
        this.isProcessingAction = false;
        return success; 
    }
    
    activateAttackMode(attacker, target) { 
        this.attackMode = true; 
        this.attackingStack = attacker; 
        this.targetStack = target; 
        this.attackPositions = this.getAttackPositions(attacker, target); 
        return this.attackPositions.length > 0; 
    }
    
    async executeAttackFromPosition(x, y) {
        if (!this.attackMode || !this.attackingStack || !this.targetStack) return false;
        if (!this.attackPositions.some(p => p.x === x && p.y === y)) return false;
        if (!await this.tryMoveStack(this.attackingStack, x, y)) return false;
        if (typeof window.renderBattleField === 'function') window.renderBattleField();
        await AnimationEngine.sleep(150);
        await this.performMeleeAttack(this.attackingStack, this.targetStack);
        this.attackMode = false; 
        this.attackingStack = null; 
        this.targetStack = null; 
        this.attackPositions = [];
        return true;
    }
    
    async performRangedAttack(attackerStack, targetStack) { 
        if (attackerStack.side === targetStack.side) {
            return { success: false, reason: "Нельзя атаковать союзников" };
        }
        if (!attackerStack.canShoot()) return { success: false, reason: "Нет выстрелов" };
        
        const aBon = attackerStack.side === 'attacker' ? this.attackerBonuses : this.defenderBonuses;
        const dBon = targetStack instanceof BattleStack ? 
            (targetStack.side === 'attacker' ? this.attackerBonuses : this.defenderBonuses) : {};
        
        const aCell = document.querySelector(`.battle-cell[data-x='${attackerStack.bottomX}'][data-y='${attackerStack.bottomY}']`);
        const tCell = document.querySelector(`.battle-cell[data-x='${targetStack.bottomX}'][data-y='${targetStack.bottomY}']`); 
        const luck = attackerStack.checkLuck(aBon); 
        let mult = luck.multiplier;
        if (aCell && tCell) await AnimationEngine.animateRangedAttack(aCell, tCell, 'arrow'); 
        await AnimationEngine.sleep(AnimationEngine.LUCK_CHECK_PAUSE);
        
        let dmg, killed = 0;
        if (targetStack instanceof BattleStack) {
            const dist = DamageCalculator.calculateDistance(
                attackerStack.bottomX, attackerStack.bottomY, 
                targetStack.bottomX, targetStack.bottomY
            );
            dmg = DamageCalculator.calculateDamage(attackerStack, targetStack, aBon, dBon, true, dist); 
            dmg = Math.floor(dmg * mult);
            const r = DamageCalculator.applyDamage(targetStack, dmg, dBon); 
            killed = r.killed;
            attackerStack.showDamageNumber(targetStack, dmg, killed, luck.type);
            if (!targetStack.isAlive()) this.removeDeadStack(targetStack);
        } else if (targetStack instanceof WarMachine) {
            dmg = DamageCalculator.calculateDamage(attackerStack, { 
                creature: targetStack.machineData 
            }, aBon, {}, true, 0); 
            dmg = Math.floor(dmg * mult);
            targetStack.takeDamage(dmg); 
            this.showMachineDamageNumber(targetStack, dmg);
            if (!targetStack.isAlive) this.removeDeadMachine(targetStack);
        }
        
        attackerStack.useShot(); 
        attackerStack.hasActed = true; 
        if (!attackerStack.isAlive()) this.removeDeadStack(attackerStack); 
        this.grid.synchronize(); 
        this.checkBattleEnd();
        await this.endStackTurn(attackerStack); 
        await this.nextTurn(); 
        if (typeof window.renderBattleUI === 'function') window.renderBattleUI(); 
        return { damage: dmg, killed }; 
    }
    
    async performMeleeAttack(attackerStack, targetStack) { 
        if (attackerStack.side === targetStack.side) {
            return { success: false, reason: "Нельзя атаковать союзников" };
        }
        if (targetStack instanceof WarMachine) {
            const aBon = attackerStack.side === 'attacker' ? this.attackerBonuses : this.defenderBonuses;
            const dmg = DamageCalculator.calculateDamage(attackerStack, { 
                creature: targetStack.machineData 
            }, aBon, {}, false, 0);
            const aCell = document.querySelector(`.battle-cell[data-x='${attackerStack.bottomX}'][data-y='${attackerStack.bottomY}']`);
            const tCell = document.querySelector(`.battle-cell[data-x='${targetStack.bottomX}'][data-y='${targetStack.bottomY}']`);
            if (aCell) {
                await AnimationEngine.animateAttack(aCell, tCell, 
                    AnimationEngine.getAttackDirection(
                        attackerStack.bottomX, attackerStack.bottomY, 
                        targetStack.bottomX, targetStack.bottomY
                    )
                );
            }
            targetStack.takeDamage(dmg); 
            this.showMachineDamageNumber(targetStack, dmg); 
            attackerStack.hasActed = true;
            if (!targetStack.isAlive) this.removeDeadMachine(targetStack);
            this.grid.synchronize(); 
            this.checkBattleEnd();
            await this.endStackTurn(attackerStack); 
            await this.nextTurn(); 
            if (typeof window.renderBattleUI === 'function') window.renderBattleUI();
            return { success: true, damage: dmg };
        }
        
        const aBon = attackerStack.side === 'attacker' ? this.attackerBonuses : this.defenderBonuses;
        const dBon = targetStack.side === 'attacker' ? this.attackerBonuses : this.defenderBonuses;
        const result = await attackerStack.performAttack(targetStack, this, aBon, dBon); 
        if (!targetStack.isAlive()) this.removeDeadStack(targetStack); 
        if (!attackerStack.isAlive()) this.removeDeadStack(attackerStack); 
        this.grid.synchronize(); 
        this.checkBattleEnd(); 
        attackerStack.hasActed = true;
        await this.endStackTurn(attackerStack); 
        await this.nextTurn(); 
        if (typeof window.renderBattleUI === 'function') window.renderBattleUI(); 
        return result; 
    }
    
    removeDeadStack(deadStack) { 
        if (deadStack.side === 'attacker') { 
            const i = this.attackerStacks.findIndex(s => s === deadStack); 
            if (i !== -1) this.attackerStacks.splice(i, 1); 
        } else { 
            const i = this.defenderStacks.findIndex(s => s === deadStack); 
            if (i !== -1) this.defenderStacks.splice(i, 1); 
        }
        const qi = this.initiativeQueue.findIndex(e => e.type === 'stack' && e.stack === deadStack);
        if (qi !== -1) { 
            this.initiativeQueue.splice(qi, 1); 
            if (qi < this.currentTurnIndex) this.currentTurnIndex--; 
        }
        this.grid.synchronize();
    }
    
    removeDeadMachine(deadMachine) {
        const machines = deadMachine.side === 'attacker' ? this.attackerWarMachines : this.defenderWarMachines;
        const i = machines.findIndex(m => m === deadMachine); 
        if (i !== -1) machines.splice(i, 1);
        const qi = this.initiativeQueue.findIndex(e => e.type === 'machine' && e.machine === deadMachine);
        if (qi !== -1) { 
            this.initiativeQueue.splice(qi, 1); 
            if (qi < this.currentTurnIndex) this.currentTurnIndex--; 
        }
        this.grid.synchronize();
    }
              }
