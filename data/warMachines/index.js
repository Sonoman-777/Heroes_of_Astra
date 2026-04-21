// ============================================================================
//  СВЕРХМАССИВ 9: БОЕВЫЕ МАШИНЫ
// ============================================================================

export const WAR_MACHINES_DB = {
    ballista: {
        id: "ballista", 
        name: "Баллиста", 
        type: "war_machine",
        health: 250, 
        maxHealth: 250, 
        attack: 5, 
        defense: 5, 
        initiative: 10,
        isRanged: true, 
        shootRange: 999, 
        unlimitedShots: true,
        sprite: "https://i.postimg.cc/zGHk7BjJ/Ballista_Test_Sprite.png",
        portrait: "https://i.postimg.cc/zGHk7BjJ/Ballista_Test_Sprite.png",
        icon: "🏹", 
        abilities: ["war_machine", "unlimited_shots"],
        calculateDamage: function(heroAttack) { 
            return 250 + (heroAttack * 20); 
        },
        selectTarget: function(battle, side) {
            const enemyStacks = side === 'attacker' ? battle.defenderStacks : battle.attackerStacks;
            const aliveEnemies = enemyStacks.filter(s => s.isAlive());
            if (aliveEnemies.length === 0) return null;
            const hero = side === 'attacker' ? battle.attackerHero : battle.defenderHero;
            const heroBonuses = PerkEngine.getHeroBonuses(hero);
            const heroAttack = heroBonuses.attackBonus;
            const baseDamage = this.calculateDamage(heroAttack);
            let bestTarget = null, bestScore = -Infinity;
            for (let target of aliveEnemies) {
                const defense = target.creature.defense;
                const damageModifier = 1 + Math.max(0, (5 - defense) * 0.05);
                const actualDamage = Math.floor(baseDamage * damageModifier);
                const killsPossible = Math.min(target.count, Math.floor(actualDamage / target.creature.health));
                const overkill = actualDamage - (killsPossible * target.creature.health);
                const damageScore = actualDamage * 10;
                const killScore = killsPossible * target.creature.health * 20;
                const lowHPScore = (1 - (target.creature.health * target.count) / (target.creature.health * 100)) * 100;
                const levelScore = target.creature.level * 50;
                const shooterBonus = target.isShooter ? 200 : 0;
                const totalScore = damageScore + killScore + lowHPScore + levelScore + shooterBonus - overkill;
                if (totalScore > bestScore) { 
                    bestScore = totalScore; 
                    bestTarget = target; 
                }
            }
            return bestTarget;
        }
    },
    
    firstAidTent: {
        id: "firstAidTent", 
        name: "Палатка первой помощи", 
        type: "war_machine",
        health: 100, 
        maxHealth: 100, 
        initiative: 10,
        sprite: "https://i.postimg.cc/x1NP5CRn/Tent_Test_Sprite.png",
        portrait: "https://i.postimg.cc/x1NP5CRn/Tent_Test_Sprite.png",
        icon: "⛑️", 
        abilities: ["war_machine", "healer"],
        calculateHeal: function(heroLevel, skillLevel) {
            const multipliers = { 0: 10, 1: 10, 2: 20, 3: 30 };
            const multiplier = multipliers[skillLevel] || 10;
            return (heroLevel + 1) * multiplier;
        },
        selectTarget: function(battle, side) {
            const friendlyStacks = side === 'attacker' ? battle.attackerStacks : battle.defenderStacks;
            const aliveFriends = friendlyStacks.filter(s => s.isAlive() && s.creature.health > 0);
            if (aliveFriends.length === 0) return null;
            const hero = side === 'attacker' ? battle.attackerHero : battle.defenderHero;
            const heroBonuses = PerkEngine.getHeroBonuses(hero);
            const skillLevel = heroBonuses.warMachinesLevel;
            const healAmount = this.calculateHeal(hero.currentLevel, skillLevel);
            let bestTarget = null, bestScore = -Infinity;
            for (let target of aliveFriends) {
                const topCreatureMissingHP = target.creature.health - (target.healthMissing || 0);
                const missingHP = Math.min(healAmount, topCreatureMissingHP);
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
    },
    
    ammoCart: {
        id: "ammoCart", 
        name: "Тележка с боеприпасами", 
        type: "war_machine",
        health: 100, 
        maxHealth: 100, 
        initiative: 0,
        sprite: "https://i.postimg.cc/fLStntVX/Cart-Test-Sprite.webp",
        portrait: "https://i.postimg.cc/fLStntVX/Cart-Test-Sprite.webp",
        icon: "🧨", 
        abilities: ["war_machine", "ammo_supplier"],
        resupplyAmmo: function(battle, side) {
            const friendlyStacks = side === 'attacker' ? battle.attackerStacks : battle.defenderStacks;
            for (let stack of friendlyStacks) {
                if (stack.isShooter && stack.isAlive()) {
                    const maxShots = stack.creature.shots || 0;
                    stack.shotsRemaining = maxShots;
                }
            }
        }
    },
    
    catapult: {
        id: "catapult", 
        name: "Катапульта", 
        type: "war_machine",
        health: 300, 
        maxHealth: 300, 
        initiative: 0,
        sprite: "https://i.postimg.cc/xxxx/catapult.png",
        portrait: "https://i.postimg.cc/xxxx/catapult_portrait.png",
        icon: "🎯", 
        abilities: ["war_machine", "siege"], 
        siegeOnly: true
    }
};
