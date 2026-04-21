// ============================================================================
//  ПРОВЕРКИ И РАБОТА С ПЕРКАМИ ГЕРОЯ
// ============================================================================

import { currentHero } from '../../js/state.js';
import { SKILLS_DB } from '../../data/skills/index.js';

export function getAllPerksForSkill(skillKey) {
    if (!SKILLS_DB[skillKey]) return [];
    const s = SKILLS_DB[skillKey];
    let all = [];
    if (s.perks[1]) all.push(...s.perks[1]);
    if (s.perks[2]) all.push(...s.perks[2]);
    if (s.perks[3]) all.push(...s.perks[3]);
    if (s.perks[4]) all.push(...s.perks[4]);
    return all;
}

export function canLearnPerk(skillKey, perkId) {
    if (!SKILLS_DB[skillKey]) return false;
    const learned = currentHero.learnedSkills.find(s => s.key === skillKey);
    if (!learned) return false;
    const perk = getAllPerksForSkill(skillKey).find(p => p.id === perkId);
    if (!perk) return false;
    if (learned.perks.includes(perkId)) return false;
    if (learned.perks.length >= learned.level) return false;
    if (perk.requiresPerk && !learned.perks.includes(perk.requiresPerk)) return false;
    if (perk.requiresPerk2 && !learned.perks.includes(perk.requiresPerk2)) return false;
    if (perk.levelRequired === 4 && learned.level < 4) return false;
    return true;
}

export function canLearnRacialPerk(perkId) {
    if (currentHero.racialSkill.perks.includes(perkId)) return false;
    if (currentHero.racialSkill.perks.length >= currentHero.racialSkill.level) return false;
    return true;
}

// Экспортируем в глобальную область для обратной совместимости
window.getAllPerksForSkill = getAllPerksForSkill;
window.canLearnPerk = canLearnPerk;
window.canLearnRacialPerk = canLearnRacialPerk;
