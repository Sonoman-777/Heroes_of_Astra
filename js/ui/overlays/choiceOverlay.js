// ============================================================================
//  ОКНО ВЫБОРА ПРИ ПОВЫШЕНИИ УРОВНЯ
// ============================================================================

import { currentHero } from '../../state.js';
import { SKILLS_DB } from '../../../data/skills/index.js';
import { saveCurrentHero } from '../../utils.js';
import { canLearnPerk, canLearnRacialPerk, getAllPerksForSkill } from '../../../core/hero/perks.js';
import { refreshHeroStatsUI } from '../heroScreen.js';
import { renderSkillsTab, renderRacialSkill, renderSpecialization, renderCentralPerk } from '../tabs/skillsTab.js';

export function showLevelUpChoice() {
    const overlay = document.getElementById("choiceOverlay");
    const panel = document.getElementById("choicePanel");
    
    let upgradeOptions = [], otherSkillOptions = [], allPossiblePerks = [];
    const canAddNewSkill = currentHero.learnedSkills.length < 5;
    
    for (let skill of currentHero.learnedSkills) {
        const maxLevel = SKILLS_DB[skill.key]?.levels?.length || 3;
        if (skill.level < maxLevel) {
            upgradeOptions.push({ 
                type: "upgrade_skill", 
                key: skill.key, 
                name: SKILLS_DB[skill.key]?.name, 
                desc: SKILLS_DB[skill.key]?.levelDesc[skill.level] || "Улучшение навыка" 
            });
        }
    }
    
    for (let key in SKILLS_DB) {
        if (key === "class_skill") continue;
        const ex = currentHero.learnedSkills.find(s => s.key === key);
        if (ex && ex.level < (SKILLS_DB[key]?.levels?.length || 3) && !upgradeOptions.some(o => o.key === key)) {
            otherSkillOptions.push({ 
                type: "upgrade_skill", 
                key, 
                name: SKILLS_DB[key].name, 
                desc: SKILLS_DB[key]?.levelDesc[ex.level] || "Улучшение навыка" 
            });
        } else if (!ex && canAddNewSkill) {
            otherSkillOptions.push({ 
                type: "new_skill", 
                key, 
                name: SKILLS_DB[key].name, 
                desc: SKILLS_DB[key]?.levelDesc[0] || "Новый навык" 
            });
        }
    }
    
    if (currentHero.racialSkill.level < 4) {
        otherSkillOptions.push({ 
            type: "racial_upgrade", 
            name: "Астральная магия", 
            desc: "Повышение уровня классового навыка" 
        });
    }
    
    otherSkillOptions.sort(() => Math.random() - 0.5);
    const selectedUpgrade = upgradeOptions.length > 0 ? 
        upgradeOptions[Math.floor(Math.random() * upgradeOptions.length)] : null;
    let selectedOther = otherSkillOptions[0] || null;
    
    for (let skill of currentHero.learnedSkills) {
        for (let perk of getAllPerksForSkill(skill.key)) {
            if (canLearnPerk(skill.key, perk.id)) {
                allPossiblePerks.push({ 
                    type: "perk", 
                    skillKey: skill.key, 
                    perkId: perk.id, 
                    name: perk.name, 
                    desc: perk.desc 
                });
            }
        }
    }
    
    const racialPerks = SKILLS_DB.class_skill?.perks[1] || [];
    for (let perk of racialPerks) {
        if (canLearnRacialPerk(perk.id)) {
            allPossiblePerks.push({ 
                type: "racial_perk", 
                perkId: perk.id, 
                name: perk.name, 
                desc: perk.desc 
            });
        }
    }
    
    const centralPerk = SKILLS_DB.class_skill?.perks[4]?.[0];
    if (centralPerk && currentHero.racialSkill.level >= 4 && 
        !currentHero.racialSkill.perks.includes(centralPerk.id)) {
        allPossiblePerks.push({ 
            type: "racial_perk", 
            perkId: centralPerk.id, 
            name: centralPerk.name, 
            desc: centralPerk.desc 
        });
    }
    
    allPossiblePerks.sort(() => Math.random() - 0.5);
    const selectedPerks = allPossiblePerks.slice(0, 2);
    while (selectedPerks.length < 2) selectedPerks.push(null);
    
    function createChoiceItem(opt) {
        if (!opt) return `<div class="choice-item disabled" style="text-align:center;">❌ Нет доступных</div>`;
        return `<div class="choice-item" data-type="${opt.type}" data-key="${opt.key || ''}" data-perk="${opt.perkId || ''}" data-skill="${opt.skillKey || ''}"><button class="choice-btn">${opt.type === "perk" ? "✨ " : (opt.type === "racial_perk" ? "⭐ " : "📖 ")}${opt.name}</button><button class="info-btn" data-name="${(opt.name || "").replace(/"/g, '&quot;')}" data-desc="${(opt.desc || "").replace(/"/g, '&quot;')}">i</button></div>`;
    }
    
    panel.innerHTML = `
        <div class="choice-title">🎉 ПОВЫШЕНИЕ УРОВНЯ!</div>
        <div class="choice-subtitle">Выберите развитие:</div>
        <div class="choice-buttons-grid">
            ${createChoiceItem(selectedUpgrade)}
            ${createChoiceItem(selectedOther)}
            ${createChoiceItem(selectedPerks[0])}
            ${createChoiceItem(selectedPerks[1])}
        </div>
        <button id="confirmChoiceBtn" class="confirm-btn">✅ Подтвердить</button>
    `;
    
    document.querySelectorAll("#choicePanel .info-btn").forEach(btn => btn.addEventListener("click", (e) => { 
        e.stopPropagation(); 
        alert(`📖 ${btn.dataset.name}\n\n${btn.dataset.desc}`); 
    }));
    
    document.querySelectorAll("#choicePanel .choice-item:not(.disabled)").forEach(item => {
        item.addEventListener("click", () => { 
            document.querySelectorAll("#choicePanel .choice-item").forEach(i => i.classList.remove("selected")); 
            item.classList.add("selected"); 
        });
    });
    
    overlay.style.visibility = "visible"; 
    overlay.style.opacity = "1";
    
    document.getElementById("confirmChoiceBtn").onclick = () => {
        const selected = document.querySelector("#choicePanel .choice-item.selected");
        if (!selected) { alert("Выберите вариант!"); return; }
        const type = selected.dataset.type;
        
        if (type === "new_skill") { 
            const key = selected.dataset.key; 
            if (!currentHero.learnedSkills.some(s => s.key === key) && currentHero.learnedSkills.length < 5) {
                currentHero.learnedSkills.push({ key, name: SKILLS_DB[key].name, level: 1, perks: [] }); 
            }
        } else if (type === "upgrade_skill") { 
            const key = selected.dataset.key; 
            const sk = currentHero.learnedSkills.find(s => s.key === key); 
            if (sk && sk.level < (SKILLS_DB[key]?.levels?.length || 3)) sk.level++; 
        } else if (type === "racial_upgrade") { 
            if (currentHero.racialSkill.level < 4) currentHero.racialSkill.level++; 
        } else if (type === "perk") { 
            const skKey = selected.dataset.skill, perkId = selected.dataset.perk; 
            const sk = currentHero.learnedSkills.find(s => s.key === skKey); 
            if (sk && canLearnPerk(skKey, perkId)) sk.perks.push(perkId); 
        } else if (type === "racial_perk") { 
            const perkId = selected.dataset.perk; 
            if (canLearnRacialPerk(perkId)) currentHero.racialSkill.perks.push(perkId); 
        }
        
        renderSkillsTab(); 
        renderRacialSkill(); 
        renderSpecialization(); 
        renderCentralPerk(); 
        refreshHeroStatsUI(); 
        saveCurrentHero();
        overlay.style.visibility = "hidden"; 
        overlay.style.opacity = "0";
    };
}

// Экспортируем в глобальную область для обратной совместимости
window.showLevelUpChoice = showLevelUpChoice;
