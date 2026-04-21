// ============================================================================
//  ОТРИСОВКА ВКЛАДКИ НАВЫКОВ И УМЕНИЙ
// ============================================================================

import { currentHero } from '../../state.js';
import { SKILLS_DB } from '../../../data/skills/index.js';
import { getAllPerksForSkill } from '../../../core/hero/perks.js';

export function renderSkillsTab() {
    const container = document.getElementById("skillsContainer");
    if (!container) return;
    container.innerHTML = "";
    for (let i = 0; i < 5; i++) {
        const skill = currentHero.learnedSkills[i] || null;
        const row = document.createElement("div"); 
        row.className = "skill-row";
        
        const skillDiv = document.createElement("div"); 
        skillDiv.className = "skill-slot";
        if (skill) {
            const cfg = SKILLS_DB[skill.key];
            const levelNames = ["", "Основы", "Развитый", "Эксперт"];
            skillDiv.innerHTML = `<div class="skill-name">${cfg?.name || skill.key}</div><div class="skill-level">${levelNames[skill.level] || "Основы"}<br><span style="font-size:0.6rem;">${cfg?.levelDesc[skill.level - 1] || ""}</span></div>`;
            skillDiv.onclick = () => alert(`📖 ${cfg?.name}\n${cfg?.levelDesc[skill.level - 1] || ""}`);
        } else {
            skillDiv.innerHTML = `<div class="skill-name" style="opacity:0.6;">⬜ Пустой слот</div><div class="skill-level">—</div>`;
        }
        
        const arrow = document.createElement("div"); 
        arrow.className = "skill-arrow"; 
        arrow.innerHTML = "→";
        
        const perksDiv = document.createElement("div"); 
        perksDiv.className = "perks-container";
        for (let p = 0; p < 3; p++) {
            const perkSlot = document.createElement("div"); 
            perkSlot.className = "perk-slot";
            const hasPerk = skill && skill.perks && skill.perks[p];
            if (hasPerk) {
                const perkConfig = getAllPerksForSkill(skill.key).find(pc => pc.id === skill.perks[p]);
                perkSlot.innerHTML = `<div class="perk-name">✨ ${perkConfig?.name || skill.perks[p]}</div>`;
                perkSlot.onclick = () => alert(`📖 ${perkConfig?.name}\n${perkConfig?.desc}`);
            } else {
                perkSlot.innerHTML = `<div class="perk-name perk-empty">◻️ Пусто</div>`;
            }
            perksDiv.appendChild(perkSlot);
        }
        row.appendChild(skillDiv); 
        row.appendChild(arrow); 
        row.appendChild(perksDiv);
        container.appendChild(row);
    }
}

export function renderRacialSkill() {
    const racialContainer = document.getElementById("racialSkillContainer");
    if (!racialContainer || !SKILLS_DB.class_skill) return;
    
    const classSkill = SKILLS_DB.class_skill;
    const levelNames = ["Не изучен", "Начальная", "Развитая", "Сильная", "Искусная"];
    const currentRacialLevel = currentHero.racialSkill.level;
    const racialLevelName = levelNames[currentRacialLevel] || "Не изучен";
    const racialPerks = classSkill.perks[1] || [];
    
    racialContainer.innerHTML = `<div class="racial-skill-row"><div class="racial-skill-slot" onclick='alert("📖 ${classSkill.name}\n${classSkill.levelDesc[currentRacialLevel - 1] || ""}")'><div class="skill-name">${classSkill.name}</div><div class="skill-level">${racialLevelName}<br><span style="font-size:0.6rem;">Уровень ${currentRacialLevel}/4</span></div></div><div class="skill-arrow">→</div><div class="racial-perks-container" id="racialPerksContainer"></div></div>`;
    
    const perksContainer = document.getElementById("racialPerksContainer");
    if (perksContainer) {
        perksContainer.innerHTML = "";
        for (let p = 0; p < 3; p++) {
            const perk = racialPerks[p];
            const isLearned = perk && currentHero.racialSkill.perks.includes(perk.id);
            const perkSlot = document.createElement("div"); 
            perkSlot.className = "racial-perk-slot";
            if (perk && isLearned) {
                perkSlot.innerHTML = `<div class="perk-name">✨ ${perk.name}</div>`;
            } else if (perk) {
                perkSlot.innerHTML = `<div class="perk-name perk-empty">◻️ ${perk.name}</div>`;
            } else {
                perkSlot.innerHTML = `<div class="perk-name perk-empty">◻️ Пусто</div>`;
            }
            perkSlot.onclick = () => perk && alert(`📖 ${perk.name}\n${perk.desc}`);
            perksContainer.appendChild(perkSlot);
        }
    }
}

export function renderSpecialization() {
    const specContainer = document.getElementById("specializationContainer");
    if (!specContainer) return;
    const specText = currentHero.specialization || "Специализация не указана";
    specContainer.innerHTML = `<div class="specialization-title">🌟 СПЕЦИАЛИЗАЦИЯ ГЕРОЯ</div><div class="specialization-name">${specText.length > 80 ? specText.substring(0, 77) + "..." : specText}</div>`;
    specContainer.onclick = () => alert(`📖 Специализация\n\n${specText}`);
}

export function renderCentralPerk() {
    const centralContainer = document.getElementById("centralPerkContainer");
    if (!centralContainer || !SKILLS_DB.class_skill) return;
    
    const centralPerk = SKILLS_DB.class_skill.perks[4]?.[0];
    const isAvailable = currentHero.racialSkill.level >= 4;
    const isLearned = centralPerk && currentHero.racialSkill.perks.includes(centralPerk.id);
    
    if (centralPerk) {
        if (isAvailable && !isLearned) {
            centralContainer.innerHTML = `<div class="central-perk-title">⭐ ЦЕНТРАЛЬНОЕ УМЕНИЕ (требует 4 уровень)</div><div class="central-perk-name">${centralPerk.name}</div><div style="font-size:0.8rem; margin-top:8px;">${centralPerk.desc}</div><div style="margin-top:12px;"><span style="color:#f5cb7e;">⚡ Можно изучить!</span></div>`;
            centralContainer.onclick = () => alert(`📖 ${centralPerk.name}\n\n${centralPerk.desc}\n\n✅ Доступно для изучения.`);
            centralContainer.classList.remove("central-perk-locked");
        } else if (isLearned) {
            centralContainer.innerHTML = `<div class="central-perk-title">⭐ ЦЕНТРАЛЬНОЕ УМЕНИЕ (ИЗУЧЕНО)</div><div class="central-perk-name">✨ ${centralPerk.name}</div><div style="font-size:0.8rem; margin-top:8px;">${centralPerk.desc}</div>`;
            centralContainer.onclick = () => alert(`📖 ${centralPerk.name}\n\n${centralPerk.desc}`);
            centralContainer.classList.remove("central-perk-locked");
        } else {
            centralContainer.classList.add("central-perk-locked");
            centralContainer.innerHTML = `<div class="central-perk-title">⭐ ЦЕНТРАЛЬНОЕ УМЕНИЕ (ЗАБЛОКИРОВАНО)</div><div class="central-perk-name">🔒 ${centralPerk.name}</div><div style="font-size:0.8rem; margin-top:8px;">Требуется: 4 уровень классового навыка</div>`;
            centralContainer.onclick = () => alert(`📖 ${centralPerk.name}\n\n${centralPerk.desc}\n\n❌ Требуется 4 уровень.`);
        }
    } else {
        centralContainer.innerHTML = `<div class="central-perk-title">⭐ Центральное умение в разработке</div>`;
    }
}

// Экспортируем в глобальную область для обратной совместимости
window.renderSkillsTab = renderSkillsTab;
window.renderRacialSkill = renderRacialSkill;
window.renderSpecialization = renderSpecialization;
window.renderCentralPerk = renderCentralPerk;
