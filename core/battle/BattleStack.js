// ============================================================================
//  МОДУЛЬ 5: BATTLE_STACK (С УЧЁТОМ УМЕНИЙ)
// ============================================================================

import { LargeCreatureManager } from './LargeCreatureManager.js';
import { DamageCalculator } from './DamageCalculator.js';
import { AnimationEngine } from './AnimationEngine.js';
import { EffectEngine } from './EffectEngine.js';

export class BattleStack {
    constructor(creature, count, side, gridX, gridY) { 
        this.creatureId = creature.id; 
        this.creature = creature; 
        this.count = count; 
        this.side = side; 
        this.gridX = gridX;
        this.gridY = gridY;
        this.bottomX = gridX;
        this.bottomY = gridY;
        this.x = gridX;
        this.y = gridY;
        this.initiative = creature.initiative || 10; 
        this.hasMoved = false; 
        this.hasActed = false; 
        this.hasCounterAttackedThisRound = false;
        this.isFlying = creature.abilities && creature.abilities.includes("flying");
        this.isShooter = creature.abilities && creature.abilities.includes("shooter");
        this.shootRange = creature.shootRange || 6;
        this.shotsRemaining = creature.shots || 0;
        this.healthMissing = 0;
        this.morale = creature.morale || 0;
        this.luck = creature.luck || 0;
        this.moraleCheckedThisRound = false;
        this.luckCheckedThisAttack = false;
    }
    
    isLarge() { 
        return LargeCreatureManager.isLarge(this.creature); 
    }
    
    getTotalAttack() { 
        return this.creature.attack; 
    }
    
    getTotalDefense() { 
        return this.creature.defense; 
    }
    
    isAlive() { 
        return this.count > 0; 
    }
    
    canShoot() { 
        return this.isShooter && this.shotsRemaining > 0; 
    }
    
    useShot() { 
        if (this.shotsRemaining > 0) this.shotsRemaining--; 
    }
    
    resetTurn() { 
        this.hasMoved = false; 
        this.hasActed = false; 
    }
    
    resetRound() { 
        this.moraleCheckedThisRound = false; 
        this.hasCounterAttackedThisRound = false; 
    }
    
    resetCounterForExtraTurn() { 
        this.hasCounterAttackedThisRound = false; 
    }
    
    resetCounterAttack() { 
        this.hasCounterAttackedThisRound = false; 
    }
    
    getOccupiedCells() { 
        if (this.isLarge() && window.currentBattle) {
            return window.currentBattle.grid.getBottomCellsFromTop(this.gridX, this.gridY);
        }
        return [{ x: this.bottomX, y: this.bottomY }]; 
    }
    
    occupiesCell(cellX, cellY) { 
        return this.getOccupiedCells().some(cell => cell.x === cellX && cell.y === cellY); 
    }
    
    getTotalMorale(heroBonuses = {}) {
        return this.creature.morale + (heroBonuses.moraleBonus || 0);
    }
    
    getTotalLuck(heroBonuses = {}) {
        return this.creature.luck + (heroBonuses.luckBonus || 0);
    }
    
    checkNegativeMorale(heroBonuses = {}) {
        if (this.moraleCheckedThisRound) return false;
        const totalMorale = this.getTotalMorale(heroBonuses);
        if (totalMorale >= 0) return false;
        
        this.moraleCheckedThisRound = true;
        const chance = Math.abs(totalMorale) * 10;
        if (Math.random() * 100 < chance) { 
            EffectEngine.showFloatingEffect(this, '😖', '#ff6666', 1800); 
            return true; 
        }
        return false;
    }
    
    checkPositiveMorale(heroBonuses = {}) {
        if (this.moraleCheckedThisRound) return false;
        const totalMorale = this.getTotalMorale(heroBonuses);
        if (totalMorale <= 0) return false;
        
        this.moraleCheckedThisRound = true;
        const chance = totalMorale * 10;
        if (Math.random() * 100 < chance) { 
            EffectEngine.showFloatingEffect(this, '😃', '#66ff66', 1800); 
            return true; 
        }
        return false;
    }
    
    checkLuck(heroBonuses = {}) {
        const totalLuck = this.getTotalLuck(heroBonuses);
        const chance = Math.abs(totalLuck) * 10;
        if (Math.random() * 100 < chance) {
            if (totalLuck > 0) { 
                EffectEngine.showFloatingEffect(this, '🍀', '#66ff66', 1500); 
                return { type: 'critical', multiplier: 2.0 }; 
            } else if (totalLuck < 0) { 
                EffectEngine.showFloatingEffect(this, '🗿', '#888888', 1500); 
                return { type: 'miss', multiplier: 0 }; 
            }
        }
        return { type: 'normal', multiplier: 1.0 };
    }
    
    canMeleeAttack(targetStack) {
        if (this.side === targetStack.side) return false;
        if (this.hasActed || !this.isAlive()) return false;
        
        if (targetStack.constructor.name === 'WarMachine') {
            return targetStack.isAlive;
        }
        
        if (!targetStack.isAlive()) return false;
        return window.currentBattle.grid.isInAttackRange(this, targetStack);
    }
    
    canRangedAttack(targetStack, battle) {
        if (!this.isShooter) return false;
        if (this.shotsRemaining <= 0) return false;
        if (this.side === targetStack.side) return false;
        if (this.hasActed || !this.isAlive()) return false;
        
        if (targetStack.constructor.name === 'WarMachine') {
            if (!targetStack.isAlive) return false;
            return !battle.grid.isInAttackRange(this, targetStack);
        }
        
        if (!targetStack.isAlive()) return false;
        if (battle.grid.isInAttackRange(this, targetStack)) return false;
        
        const allStacks = [...battle.attackerStacks, ...battle.defenderStacks];
        for (let s of allStacks) {
            if (s === this || !s.isAlive() || s.side === this.side) continue;
            if (battle.grid.isInAttackRange(s, this)) return false;
        }
        return true;
    }
    
    canReachTarget(targetStack, battle) {
        if (this.hasMoved) return false;
        if (this.canMeleeAttack(targetStack)) return true;
        if (targetStack.constructor.name === 'WarMachine') return false;
        const positions = battle.getAttackPositions(this, targetStack);
        return positions.length > 0;
    }
    
    async performAttack(targetStack, battle, attackerHeroBonuses, defenderHeroBonuses) { 
        const luckResult = this.checkLuck(attackerHeroBonuses);
        let damageMultiplier = luckResult.multiplier;
        const attackerCell = document.querySelector(`.battle-cell[data-x='${this.bottomX}'][data-y='${this.bottomY}']`); 
        const targetCell = document.querySelector(`.battle-cell[data-x='${targetStack.bottomX}'][data-y='${targetStack.bottomY}']`); 
        const direction = AnimationEngine.getAttackDirection(this.bottomX, this.bottomY, targetStack.bottomX, targetStack.bottomY); 
        if (attackerCell) await AnimationEngine.animateAttack(attackerCell, targetCell, direction); 
        await AnimationEngine.sleep(AnimationEngine.LUCK_CHECK_PAUSE);
        let damage = DamageCalculator.calculateDamage(this, targetStack, attackerHeroBonuses, defenderHeroBonuses, false, 0); 
        damage = Math.floor(damage * damageMultiplier);
        const { killed } = DamageCalculator.applyDamage(targetStack, damage, defenderHeroBonuses); 
        this.showDamageNumber(targetStack, damage, killed, luckResult.type); 
        let counterDamage = 0, counterKilled = 0; 
        if (targetStack.isAlive() && this.isAlive() && !targetStack.hasCounterAttackedThisRound && targetStack.constructor.name === 'BattleStack') { 
            targetStack.hasCounterAttackedThisRound = true; 
            if (targetCell) { 
                const counterDirection = AnimationEngine.getAttackDirection(targetStack.bottomX, targetStack.bottomY, this.bottomX, this.bottomY); 
                await AnimationEngine.animateCounterAttack(targetCell, attackerCell, counterDirection); 
            } 
            counterDamage = DamageCalculator.calculateDamage(targetStack, this, defenderHeroBonuses, attackerHeroBonuses, false, 0); 
            const counterResult = DamageCalculator.applyDamage(this, counterDamage, attackerHeroBonuses); 
            counterKilled = counterResult.killed; 
            if (counterDamage > 0 && this.isAlive()) this.showDamageNumber(this, counterDamage, counterKilled, 'normal'); 
        } 
        this.hasActed = true; 
        return { damage, killed, counterDamage, counterKilled, targetDied: !targetStack.isAlive(), attackerDied: !this.isAlive(), luckType: luckResult.type }; 
    }
    
    showDamageNumber(stack, damage, killed, luckType = 'normal') { 
        const cell = document.querySelector(`.battle-cell[data-x='${stack.bottomX}'][data-y='${stack.bottomY}']`); 
        if (!cell) return; 
        const damageDiv = document.createElement('div'); 
        let damageText = `-${Math.floor(damage)}`;
        let color = '#ff6666';
        if (luckType === 'critical') { damageText = `💥 ${damageText}`; color = '#ffaa00'; }
        else if (luckType === 'miss') { damageText = `❌ ПРОМАХ`; color = '#888888'; }
        damageDiv.textContent = damageText; 
        damageDiv.style.position = 'absolute'; 
        damageDiv.style.top = '30%'; 
        damageDiv.style.left = '50%'; 
        damageDiv.style.transform = 'translate(-50%, -50%)'; 
        damageDiv.style.color = color; 
        damageDiv.style.fontWeight = 'bold'; 
        damageDiv.style.fontSize = '1.2rem'; 
        damageDiv.style.textShadow = '1px 1px 0 #000'; 
        damageDiv.style.zIndex = '100'; 
        damageDiv.style.pointerEvents = 'none'; 
        damageDiv.style.animation = 'floatUp 1s ease-out forwards'; 
        cell.style.position = 'relative'; 
        cell.appendChild(damageDiv); 
        setTimeout(() => damageDiv.remove(), 1000); 
    }
                  }
