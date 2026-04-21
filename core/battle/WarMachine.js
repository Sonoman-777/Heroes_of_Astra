// ============================================================================
//  МОДУЛЬ 6: БОЕВЫЕ МАШИНЫ
// ============================================================================

import { DamageCalculator } from './DamageCalculator.js';
import { PerkEngine } from './PerkEngine.js';

export class WarMachine {
    constructor(machineData, side) {
        this.id = machineData.id;
        this.name = machineData.name;
        this.type = machineData.type;
        this.side = side;
        this.health = machineData.health;
        this.maxHealth = machineData.maxHealth;
        this.initiative = machineData.initiative || 10;
        this.isRanged = machineData.isRanged || false;
        this.shootRange = machineData.shootRange || 0;
        this.bottomX = 0;
        this.bottomY = 0;
        this.machineData = machineData;
        this.hasActed = false;
        this.isAlive = true;
    }
    
    isLarge() { 
        return true; 
    }
    
    getOccupiedCells() {
        return [
            { x: this.bottomX, y: this.bottomY },
            { x: this.bottomX + 1, y: this.bottomY },
            { x: this.bottomX, y: this.bottomY + 1 },
            { x: this.bottomX + 1, y: this.bottomY + 1 }
        ];
    }
    
    occupiesCell(cellX, cellY) { 
        return this.getOccupiedCells().some(cell => cell.x === cellX && cell.y === cellY); 
    }
    
    takeDamage(damage) { 
        this.health -= damage; 
        if (this.health <= 0) { 
            this.health = 0; 
            this.isAlive = false; 
        } 
        return this.isAlive; 
    }
    
    resetTurn() { 
        this.hasActed = false; 
    }
    
    selectBallistaTarget(battle, hero) {
        const enemyStacks = this.side === 'attacker' ? battle.defenderStacks : battle.attackerStacks;
        const aliveEnemies = enemyStacks.filter(s => s.isAlive());
        if (aliveEnemies.length === 0) return null;
        const heroBonuses = PerkEngine.getHeroBonuses(hero);
        const heroAttack = heroBonuses.attackBonus;
        const baseDamage = DamageCalculator.calculateBallistaDamage(heroAttack);
        let bestTarget = null, bestScore = -Infinity;
        for (let target of aliveEnemies) {
            const defense = target.creature.defense;
            const damageModifier = 1 + Math.max(0, (5 - defense) * 0.05);
            const actualDamage = Math.floor(baseDamage * damageModifier);
            const killsPossible = Math.min(target.count, Math.floor(actualDamage / target.creature.health));
            const damageScore = actualDamage * 10;
            const killScore = killsPossible * target.creature.health * 20;
            const maxPossibleHealth = target.creature.health * 100;
            const currentHealth = target.creature.health * target.count;
            const lowHPScore = maxPossibleHealth > 0 ? (1 - currentHealth / maxPossibleHealth) * 100 : 0;
            const levelScore = target.creature.level * 50;
            const shooterBonus = target.isShooter ? 200 : 0;
            const totalScore = damageScore + killScore + lowHPScore + levelScore + shooterBonus;
            if (totalScore > bestScore) { 
                bestScore = totalScore; 
                bestTarget = target; 
            }
        }
        return bestTarget;
    }
    
    selectTentTarget(battle, hero) {
        const friendlyStacks = this.side === 'attacker' ? battle.attackerStacks : battle.defenderStacks;
        const aliveFriends = friendlyStacks.filter(s => s.isAlive() && s.healthMissing > 0);
        if (aliveFriends.length === 0) return null;
        const heroBonuses = PerkEngine.getHeroBonuses(hero);
        const healAmount = DamageCalculator.calculateTentHeal(hero.currentLevel, heroBonuses.warMachinesLevel);
        let bestTarget = null, bestScore = -Infinity;
        for (let target of aliveFriends) {
            const missingHP = target.healthMissing || 0;
            if (missingHP <= 0) continue;
            const missingHPScore = missingHP * 100;
            const levelScore = target.creature.level * 50;
            const lowCountScore = (1 - target.count / 100) * 200;
            const totalScore = missingHPScore + levelScore + lowCountScore;
            if (totalScore > bestScore) { 
                bestScore = totalScore; 
                bestTarget = target; 
            }
        }
        return bestTarget;
    }
    
    selectPlagueTentTarget(battle, hero) {
        const enemyStacks = this.side === 'attacker' ? battle.defenderStacks : battle.attackerStacks;
        const aliveEnemies = enemyStacks.filter(s => s.isAlive());
        if (aliveEnemies.length === 0) return null;
        const heroBonuses = PerkEngine.getHeroBonuses(hero);
        const damage = DamageCalculator.calculateTentHeal(hero.currentLevel, heroBonuses.warMachinesLevel);
        let bestTarget = null, bestScore = -Infinity;
        for (let target of aliveEnemies) {
            const healthPercent = (target.creature.health * target.count) / (target.creature.health * 100);
            const lowHPScore = (1 - healthPercent) * 200;
            const levelScore = target.creature.level * 50;
            const shooterBonus = target.isShooter ? 150 : 0;
            const totalScore = lowHPScore + levelScore + shooterBonus;
            if (totalScore > bestScore) { 
                bestScore = totalScore; 
                bestTarget = target; 
            }
        }
        return bestTarget;
    }
}
