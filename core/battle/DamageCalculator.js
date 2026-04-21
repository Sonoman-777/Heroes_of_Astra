// ============================================================================
//  МОДУЛЬ 4: РАСЧЁТ УРОНА (С УЧЁТОМ УМЕНИЙ)
//  ВНИМАНИЕ: Этот модуль спроектирован как расширяемый.
//  Все модификаторы урона могут быть дополнены через внешние модули механик.
// ============================================================================

export class DamageCalculator {
    // Таблица урона героя (зависит от уровня существа)
    static HERO_DAMAGE_TABLE = {
        1: { killed1: 2.0, killed30: 12.0 },
        2: { killed1: 1.0, killed30: 9.0 },
        3: { killed1: 0.8, killed30: 6.5 },
        4: { killed1: 0.5, killed30: 4.5 },
        5: { killed1: 0.3, killed30: 3.0 },
        6: { killed1: 0.2, killed30: 2.0 },
        7: { killed1: 0.1, killed30: 1.5 },
        8: { killed1: 0.01, killed30: 0.15 }
    };
    
    // =========================================================================
    //  БАЗОВЫЕ МЕТОДЫ РАСЧЁТА (МОГУТ БЫТЬ РАСШИРЕНЫ ВНЕШНИМИ МОДУЛЯМИ)
    // =========================================================================
    
    static calculateDamage(attackerStack, defenderStack, attackerHeroBonuses = {}, defenderHeroBonuses = {}, isRanged = false, distance = 0) { 
        const baseDamage = this.getRandomDamage(attackerStack, attackerHeroBonuses); 
        let totalAttack = attackerStack.getTotalAttack() + (attackerHeroBonuses.attackBonus || 0); 
        let totalDefense = defenderStack.getTotalDefense() + (defenderHeroBonuses.defenseBonus || 0); 
        const damageModifier = this.getDamageModifier(totalAttack, totalDefense); 
        let finalDamage = Math.floor(baseDamage * damageModifier); 
        
        // Бонус от умения "Стрельба" (+20% к урону стрельбой)
        if (isRanged && attackerHeroBonuses.shooting) {
            finalDamage = Math.floor(finalDamage * 1.2);
        }
        
        // Штраф за дальний выстрел
        if (isRanged && distance > attackerStack.shootRange) {
            finalDamage = Math.floor(finalDamage * 0.5);
        }
        
        // Бонус от Тени (существа Астрала)
        if (defenderStack.creature && defenderStack.creature.abilities && defenderStack.creature.abilities.includes("shadow")) {
            finalDamage = Math.floor(finalDamage * 0.8);
        }
        
        // Уклонение защитника (-20% урона от стрельбы)
        if (isRanged && defenderHeroBonuses.evasion) {
            finalDamage = Math.floor(finalDamage * 0.8);
        }
        
        // Рассеивание защитника (-15% урона от магии)
        if (!isRanged && defenderHeroBonuses.dispelMagic) {
            finalDamage = Math.floor(finalDamage * 0.85);
        }
        
        // Точка расширения: здесь могут быть применены дополнительные модификаторы
        // от специализаций героев, артефактов, заклинаний и других механик
        
        return Math.max(1, finalDamage); 
    }
    
    static calculateHeroDamage(hero, targetStack) {
        const heroLevel = Math.min(hero.currentLevel || 1, 40);
        const creatureLevel = targetStack.creature ? targetStack.creature.level : 3;
        const creatureHP = targetStack.creature ? targetStack.creature.health : 100;
        const tableData = this.HERO_DAMAGE_TABLE[creatureLevel] || this.HERO_DAMAGE_TABLE[1];
        const killed1 = tableData.killed1;
        const killed30 = tableData.killed30;
        const killedCount = killed1 + (heroLevel - 1) * (killed30 - killed1) / 30;
        let damage = Math.floor(creatureHP * killedCount);
        
        // Точка расширения: модификаторы урона героя
        // (специализации, артефакты, заклинания)
        
        return Math.max(1, damage);
    }
    
    static calculateBallistaDamage(heroAttack) { 
        let damage = 250 + (heroAttack * 20);
        
        // Точка расширения: модификаторы урона баллисты
        // (специализация Вестаса, артефакты, заклинания)
        
        return damage;
    }
    
    static calculateTentHeal(heroLevel, skillLevel) {
        const multipliers = { 0: 10, 1: 10, 2: 20, 3: 30 };
        const multiplier = multipliers[skillLevel] || 10;
        let heal = (heroLevel + 1) * multiplier;
        
        // Точка расширения: модификаторы лечения палатки
        
        return heal;
    }
    
    static getRandomDamage(stack, heroBonuses = {}) { 
        let min = stack.creature.damage_min * stack.count; 
        let max = stack.creature.damage_max * stack.count;
        
        // Боевое безумие: +1 к минимальному и максимальному урону за каждое существо
        if (heroBonuses.battleFury) {
            min += stack.count;
            max += stack.count;
        }
        
        // Точка расширения: другие модификаторы мин/макс урона
        
        return min === max ? min : Math.floor(Math.random() * (max - min + 1)) + min; 
    }
    
    static getDamageModifier(attack, defense) { 
        const diff = attack - defense; 
        if (diff > 0) return 1 + (diff * 0.05); 
        if (diff < 0) return 1 - Math.min(0.7, (-diff) * 0.025); 
        return 1; 
    }
    
    static applyDamage(defenderStack, damage, heroBonuses = {}) { 
        let creatureHealth = defenderStack.creature.health;
        
        // Стойкость: +2 к здоровью каждого существа
        if (heroBonuses.resilience) {
            creatureHealth += 2;
        }
        
        // Точка расширения: другие модификаторы здоровья существ
        
        let remainingDamage = damage, killed = 0; 
        while (remainingDamage >= creatureHealth && defenderStack.count > 0) { 
            remainingDamage -= creatureHealth; 
            defenderStack.count--; 
            killed++; 
        } 
        defenderStack.healthMissing = remainingDamage;
        return { killed, remainingDamage }; 
    }
    
    static applyHeal(targetStack, healAmount) {
        const creatureHealth = targetStack.creature.health;
        const missingHP = targetStack.healthMissing || 0;
        if (missingHP <= 0) return { healed: 0 };
        const actualHeal = Math.min(healAmount, missingHP);
        targetStack.healthMissing = missingHP - actualHeal;
        return { healed: actualHeal };
    }
    
    static calculateDistance(x1, y1, x2, y2) { 
        const dx = Math.abs(x2 - x1); 
        const dy = Math.abs(y2 - y1); 
        return Math.max(dx, dy) + Math.min(dx, dy) * 0.5; 
    }
}

// ============================================================================
//  РЕЕСТР ВНЕШНИХ МОДИФИКАТОРОВ (ДЛЯ БУДУЩЕГО РАСШИРЕНИЯ)
// ============================================================================

// Реестр для регистрации внешних модификаторов урона
DamageCalculator._modifiers = {
    // Модификаторы базового урона (вызываются в calculateDamage)
    damageModifiers: [],
    
    // Модификаторы урона героя
    heroDamageModifiers: [],
    
    // Модификаторы урона баллисты
    ballistaDamageModifiers: [],
    
    // Модификаторы лечения палатки
    tentHealModifiers: [],
    
    // Модификаторы мин/макс урона
    damageRangeModifiers: [],
    
    // Модификаторы здоровья существ
    healthModifiers: []
};

// Метод для регистрации внешнего модификатора
DamageCalculator.registerModifier = function(type, modifierFn) {
    if (this._modifiers[type]) {
        this._modifiers[type].push(modifierFn);
    }
};

// Метод для применения зарегистрированных модификаторов
DamageCalculator.applyModifiers = function(type, value, context) {
    if (!this._modifiers[type]) return value;
    let modifiedValue = value;
    for (let modifier of this._modifiers[type]) {
        modifiedValue = modifier(modifiedValue, context);
    }
    return modifiedValue;
};
