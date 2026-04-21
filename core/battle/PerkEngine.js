// ============================================================================
//  МОДУЛЬ 1: PERK ENGINE — ВСЕ ПРОВЕРКИ УМЕНИЙ ГЕРОЯ
// ============================================================================

import { getTotalStats } from '../hero/stats.js';
import { currentHero } from '../../js/state.js';

export class PerkEngine {
    // Получить все бонусы героя
    static getHeroBonuses(hero) {
        if (!hero) return {};
        
        const savedHero = currentHero;
        currentHero.hero = hero;
        const stats = getTotalStats();
        currentHero.hero = savedHero;
        
        const lead = hero.learnedSkills?.find(s => s.key === "leadership");
        const luck = hero.learnedSkills?.find(s => s.key === "luck");
        const attack = hero.learnedSkills?.find(s => s.key === "attack");
        const defense = hero.learnedSkills?.find(s => s.key === "defense");
        const warMachines = hero.learnedSkills?.find(s => s.key === "warMachines");
        const sorcery = hero.learnedSkills?.find(s => s.key === "sorcery");
        const logistics = hero.learnedSkills?.find(s => s.key === "logistics");
        const education = hero.learnedSkills?.find(s => s.key === "education");
        
        return {
            // Базовые статы
            attackBonus: stats.attack,
            defenseBonus: stats.defense,
            spellpowerBonus: stats.spellpower,
            knowledgeBonus: stats.knowledge,
            
            // Лидерство и Удача
            moraleBonus: lead ? lead.level : 0,
            luckBonus: luck ? luck.level : 0,
            
            // Нападение
            tactics: attack?.perks?.includes("tactics") || false,
            shooting: attack?.perks?.includes("shooting") || false,
            battleFury: attack?.perks?.includes("battleFury") || false,
            
            // Защита
            resilience: defense?.perks?.includes("resilience") || false,
            evasion: defense?.perks?.includes("evasion") || false,
            dispelMagic: defense?.perks?.includes("dispelMagic") || false,
            
            // Уровни навыков
            attackLevel: attack?.level || 0,
            defenseLevel: defense?.level || 0,
            leadershipLevel: lead?.level || 0,
            luckLevel: luck?.level || 0,
            warMachinesLevel: warMachines?.level || 0,
            sorceryLevel: sorcery?.level || 0,
            logisticsLevel: logistics?.level || 0,
            educationLevel: education?.level || 0,
            
            // Перки боевых машин
            manualBallista: warMachines?.perks?.includes("ballista") || false,
            manualFirstAid: warMachines?.perks?.includes("firstAid") || false,
            plagueTent: warMachines?.perks?.includes("plagueTent") || false,
            rapidBallista: warMachines?.perks?.includes("rapidBallista") || false,
            
            // Образование
            secretUnravel: education?.perks?.includes("secretUnravel") || false,
            scholar: education?.perks?.includes("scholar") || false,
            mentoring: education?.perks?.includes("mentoring") || false,
            
            // Колдовство
            manaReplenish: sorcery?.perks?.includes("manaReplenish") || false,
            arcaneKnowledge: sorcery?.perks?.includes("arcaneKnowledge") || false,
            wisdom: sorcery?.perks?.includes("wisdom") || false
        };
    }
    
    // Проверить наличие Тактики у героя
    static hasTactics(hero) {
        const attack = hero?.learnedSkills?.find(s => s.key === "attack");
        return attack?.perks?.includes("tactics") || false;
    }
    
    // Проверить наличие Стрельбы у героя
    static hasShooting(hero) {
        const attack = hero?.learnedSkills?.find(s => s.key === "attack");
        return attack?.perks?.includes("shooting") || false;
    }
    
    // Проверить наличие Боевого безумия у героя
    static hasBattleFury(hero) {
        const attack = hero?.learnedSkills?.find(s => s.key === "attack");
        return attack?.perks?.includes("battleFury") || false;
    }
    
    // Проверить наличие Стойкости у героя
    static hasResilience(hero) {
        const defense = hero?.learnedSkills?.find(s => s.key === "defense");
        return defense?.perks?.includes("resilience") || false;
    }
    
    // Проверить наличие Уклонения у героя
    static hasEvasion(hero) {
        const defense = hero?.learnedSkills?.find(s => s.key === "defense");
        return defense?.perks?.includes("evasion") || false;
    }
    
    // Проверить наличие Рассеивания у героя
    static hasDispelMagic(hero) {
        const defense = hero?.learnedSkills?.find(s => s.key === "defense");
        return defense?.perks?.includes("dispelMagic") || false;
    }
    
    // Получить бонус урона от навыка Нападение
    static getAttackDamageBonus(hero) {
        const attack = hero?.learnedSkills?.find(s => s.key === "attack");
        if (!attack) return 0;
        return attack.level * 5; // 5%, 10%, 15%
    }
    
    // Получить бонус защиты от навыка Защита
    static getDefenseReduction(hero) {
        const defense = hero?.learnedSkills?.find(s => s.key === "defense");
        if (!defense) return 0;
        return defense.level * 10; // 10%, 20%, 30%
    }
    
    // Получить количество выстрелов баллисты
    static getBallistaShots(hero) {
        const warMachines = hero?.learnedSkills?.find(s => s.key === "warMachines");
        if (!warMachines) return 1;
        
        const perks = warMachines.perks || [];
        const level = warMachines.level || 0;
        
        if (level >= 2 && perks.includes("rapidBallista")) return 3;
        if (perks.includes("ballista")) return 2;
        return 1;
    }
    
    // Проверить, активна ли Тактика для стороны
    static isTacticsActive(battle, side) {
        const attackerTactics = this.hasTactics(battle.attackerHero);
        const defenderTactics = this.hasTactics(battle.defenderHero);
        
        // Тактика не работает, если есть у обоих
        if (attackerTactics && defenderTactics) return false;
        
        return side === 'attacker' ? attackerTactics : defenderTactics;
    }
    
    // Получить допустимые X для размещения обычных существ
    static getPlacementXRange(battle, side) {
        const tacticsActive = this.isTacticsActive(battle, side);
        
        if (side === 'attacker') {
            return tacticsActive ? [2, 3, 4] : [2, 3];
        } else {
            return tacticsActive ? [10, 11, 12] : [12, 13];
        }
    }
    
    // Получить допустимые topX для размещения больших существ
    static getLargePlacementXRange(battle, side) {
        const tacticsActive = this.isTacticsActive(battle, side);
        
        if (side === 'attacker') {
            return tacticsActive ? [0, 1] : [0];
        } else {
            return tacticsActive ? [9, 10] : [10];
        }
    }
}
