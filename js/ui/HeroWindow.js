import { getSpecialization } from '../../data/specializations/index.js';
import { getCreatureById } from '../../data/creatures/index.js';
import { openCreatureWindow } from './CreatureWindow.js';

let activeOverlay = null;

export function openHeroWindow(hero, mode) {
    if (activeOverlay) closeHeroWindow();

    const data = mode === 'duel' ? hero.duel : hero.base;
    if (!data) return;

    const h = {
        id: hero.id,
        names: hero.names,
        faction: hero.faction,
        heroClass: hero.heroClass,
        portrait: hero.portrait,
        specializationId: hero.specializationId,
        battleSprite: hero.battleSprite,
        biography: hero.biography || null,
        mode: mode,
        stats: { ...data.stats },
        level: data.level,
        exp: data.exp || 0,
        skills: data.skills ? [...data.skills] : [],
        army: data.army ? [...data.army] : [],
        warMachines: data.warMachines ? [...data.warMachines] : [],
        artifacts: data.artifacts ? [...data.artifacts] : [],
        captain: data.captain || null,
        spells: data.spells ? [...data.spells] : [],
        racialSkill: hero.racialSkill || { level: 1, perks: [] },
        equipped: hero.equipped || Array(12).fill(null),
        inventory: hero.inventory || []
    };

    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed; top: 0; left: 0;
        width: 100vw; height: 100vh;
        background: rgba(0,0,0,0.94);
        backdrop-filter: blur(12px);
        z-index: 2000;
        display: flex; align-items: center; justify-content: center;
    `;

    const panel = document.createElement('div');
    panel.style.cssText = `
        width: 96%; max-width: 1300px; max-height: 94vh;
        background: linear-gradient(145deg, #0a0f1e 0%, #0c1222 100%);
        border-radius: 40px;
        border: 2px solid rgba(210,180,110,0.6);
        padding: 24px 28px;
        overflow-y: auto;
        overflow-x: hidden;
        position: relative;
        color: #f0e6d0;
    `;

    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✖';
    closeBtn.style.cssText = `
        position: sticky; top: 0; float: right;
        background: none; border: none;
        color: #e9bf77; font-size: 28px;
        cursor: pointer; z-index: 10;
        margin-bottom: -40px;
    `;
    closeBtn.addEventListener('click', closeHeroWindow);
    panel.appendChild(closeBtn);

    panel.appendChild(buildHeroProfile(h));
    panel.appendChild(buildTabs());
    panel.appendChild(buildTabContents(h));

    overlay.appendChild(panel);
    document.body.appendChild(overlay);

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeHeroWindow();
    });

    activeOverlay = overlay;

    const firstBtn = panel.querySelector('.tab-btn');
    if (firstBtn) firstBtn.click();
}

export function closeHeroWindow() {
    if (activeOverlay) {
        activeOverlay.remove();
        activeOverlay = null;
    }
}

function buildHeroProfile(h) {
    const profile = document.createElement('div');
    profile.style.cssText = `
        display: flex; flex-wrap: wrap; gap: 28px;
        margin-bottom: 28px;
        background: rgba(0,0,0,0.35);
        border-radius: 40px; padding: 22px;
    `;

    const portraitDiv = document.createElement('div');
    portraitDiv.style.cssText = `
        width: 140px; height: 140px; flex-shrink: 0;
        background: #2a2a3e; border-radius: 32px;
        display: flex; align-items: center; justify-content: center;
        overflow: hidden; border: 2px solid #e9b45e;
    `;
    const img = document.createElement('img');
    img.src = h.portrait;
    img.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;';
    img.onerror = () => { img.outerHTML = '<div style="font-size:50px;">👤</div>'; };
    portraitDiv.appendChild(img);
    profile.appendChild(portraitDiv);

    const infoDiv = document.createElement('div');
    infoDiv.style.cssText = 'flex:1; min-width: 200px;';

    const nameEl = document.createElement('div');
    nameEl.textContent = h.names.ru;
    nameEl.style.cssText = `
        font-size: 1.8rem; font-weight: 800;
        background: linear-gradient(135deg, #e6d5aa, #c7a56b);
        -webkit-background-clip: text; background-clip: text;
        color: transparent; margin-bottom: 6px;
    `;
    infoDiv.appendChild(nameEl);

    const classEl = document.createElement('div');
    classEl.style.cssText = `
        font-size: 0.9rem; color: #e9cf9e;
        background: rgba(30,31,46,0.8); display: inline-block;
        padding: 4px 14px; border-radius: 30px; margin-bottom: 14px;
    `;
    classEl.textContent = `${h.heroClass} · Уровень ${h.level}`;
    infoDiv.appendChild(classEl);

    const statsGrid = document.createElement('div');
    statsGrid.style.cssText = 'display: flex; flex-wrap: wrap; gap: 10px; margin: 12px 0;';
    [
        { label: '⚔️ Нападение', val: h.stats.attack },
        { label: '🛡️ Защита', val: h.stats.defense },
        { label: '🔮 Колдовство', val: h.stats.spellpower },
        { label: '📚 Знание', val: h.stats.knowledge }
    ].forEach(s => {
        const card = document.createElement('div');
        card.style.cssText = `
            background: rgba(11,15,26,0.8); border-radius: 20px;
            padding: 8px 14px; border-left: 3px solid #e9b45e;
            text-align: center; min-width: 70px;
        `;
        card.innerHTML = `<div style="font-size:0.65rem;color:#bdae83;">${s.label}</div><div style="font-size:1.3rem;font-weight:bold;color:#f5e2b0;">${s.val}</div>`;
        statsGrid.appendChild(card);
    });
    infoDiv.appendChild(statsGrid);

    const morale = h.skills.find(s => s.key === 'leadership');
    const luck = h.skills.find(s => s.key === 'luck');
    const secondary = document.createElement('div');
    secondary.style.cssText = 'display: flex; flex-wrap: wrap; gap: 10px; margin-top: 6px;';
    [
        { label: '✨ Боевой дух', val: morale ? 1 + morale.level : 1 },
        { label: '🍀 Удача', val: luck ? 1 + luck.level : 1 },
        { label: '💧 Мана', val: 30 + h.stats.knowledge * 10 }
    ].forEach(s => {
        const el = document.createElement('div');
        el.style.cssText = `
            background: rgba(11,15,26,0.6); border-radius: 20px;
            padding: 5px 12px; display: inline-flex; align-items: center; gap: 6px;
        `;
        el.innerHTML = `<span style="color:#cbbd91;font-size:0.75rem;">${s.label}</span><span style="color:#f5cb7e;font-size:1rem;font-weight:bold;">${s.val}</span>`;
        secondary.appendChild(el);
    });
    infoDiv.appendChild(secondary);

    profile.appendChild(infoDiv);
    return profile;
}

function buildTabs() {
    const tabsBar = document.createElement('div');
    tabsBar.className = 'hero-tabs';
    tabsBar.style.cssText = `
        display: flex; flex-wrap: wrap;
        background: rgba(0,0,0,0.35);
        border-radius: 24px 24px 0 0;
        border-bottom: 1px solid rgba(210,180,110,0.3);
        padding: 4px 12px; gap: 2px;
    `;

    [
        { key: 'army', label: '⚔️ Армия' },
        { key: 'skills', label: '📖 Навыки' },
        { key: 'gear', label: '💍 Экипировка' },
        { key: 'bio', label: '📜 Биография' }
    ].forEach(t => {
        const btn = document.createElement('button');
        btn.className = 'tab-btn';
        btn.textContent = t.label;
        btn.dataset.tab = t.key;
        btn.style.cssText = `
            background: transparent; border: none;
            padding: 14px 20px; font-size: 1rem; font-weight: 600;
            color: #bdae83; cursor: pointer;
            border-bottom: 3px solid transparent;
            transition: 0.2s; border-radius: 16px 16px 0 0;
        `;
        btn.addEventListener('click', () => switchTab(t.key));
        tabsBar.appendChild(btn);
    });

    return tabsBar;
}

function buildTabContents(h) {
    const container = document.createElement('div');
    container.style.cssText = `
        background: rgba(0,0,0,0.2);
        border-radius: 0 0 24px 24px;
        padding: 24px; min-height: 300px;
    `;

    const tabs = {
        army: buildArmyTab(h),
        skills: buildSkillsTab(h),
        gear: buildGearTab(h),
        bio: buildBioTab(h)
    };

    for (const [key, el] of Object.entries(tabs)) {
        el.className = 'tab-content';
        el.id = `tab-${key}`;
        el.style.display = 'none';
        container.appendChild(el);
    }

    return container;
}

function buildArmyTab(h) {
    const div = document.createElement('div');

    const armyTitle = document.createElement('div');
    armyTitle.style.cssText = 'font-size:1.1rem;color:#e9cf9e;margin-bottom:14px;border-left:3px solid #e9b45e;padding-left:14px;';
    armyTitle.textContent = '⚔️ АРМИЯ';
    div.appendChild(armyTitle);

    const slotsGrid = document.createElement('div');
    slotsGrid.style.cssText = 'display: flex; gap: 8px; justify-content: center; flex-wrap: nowrap;';

    const capSlot = document.createElement('div');
    capSlot.style.cssText = `
        width: 70px; height: 85px; flex-shrink: 0;
        background: rgba(0,0,0,0.5); border-radius: 16px;
        border: 2px solid #FFD700;
        box-shadow: 0 0 14px rgba(255,215,0,0.4), inset 0 0 8px rgba(255,215,0,0.1);
        display: flex; flex-direction: column;
        align-items: center; justify-content: center;
    `;
    capSlot.innerHTML = `
        <div style="font-size:1.5rem;">👤</div>
        <div style="font-size:0.6rem;color:#FFD700;margin-top:3px;">Капитан</div>
        <div style="font-size:0.65rem;color:#FFD700;font-weight:bold;">${h.captain ? '1' : '—'}</div>
    `;
    slotsGrid.appendChild(capSlot);

    for (let i = 0; i < 7; i++) {
        const slot = h.army[i];
        const card = document.createElement('div');
        card.style.cssText = `
            width: 70px; height: 85px; flex-shrink: 0;
            background: rgba(0,0,0,0.5); border-radius: 16px;
            border: 1px solid rgba(210,180,110,0.4);
            display: flex; flex-direction: column;
            align-items: center; justify-content: center;
            overflow: hidden;
            ${slot && slot.creatureId ? 'cursor:pointer;' : ''}
        `;

        if (slot && slot.creatureId) {
            const creature = getCreatureById(slot.creatureId);
            const displayName = creature ? creature.names.ru : slot.creatureId;
            const portraitPath = creature ? creature.portrait : null;

            if (portraitPath) {
                const img = document.createElement('img');
                img.src = portraitPath;
                img.style.cssText = 'width:45px;height:45px;object-fit:contain;display:block;';
                img.onerror = () => { img.style.display = 'none'; };
                card.appendChild(img);

                const nameEl = document.createElement('div');
                nameEl.style.cssText = 'font-size:0.5rem;color:#f5e2b0;text-align:center;margin-top:2px;line-height:1.1;';
                nameEl.textContent = displayName;
                card.appendChild(nameEl);

                const countEl = document.createElement('div');
                countEl.style.cssText = 'font-size:0.65rem;color:#f5cb7e;font-weight:bold;';
                countEl.textContent = slot.count;
                card.appendChild(countEl);
            } else {
                card.innerHTML = `
                    <div style="font-size:1.5rem;">🐉</div>
                    <div style="font-size:0.55rem;color:#f5e2b0;text-align:center;">${displayName}</div>
                    <div style="font-size:0.7rem;color:#f5cb7e;font-weight:bold;">${slot.count}</div>
                `;
            }

            card.addEventListener('click', (e) => {
                e.stopPropagation();
                if (creature) openCreatureWindow(creature, slot.count, h);
            });
        } else {
            card.innerHTML = `
                <div style="font-size:1.2rem;opacity:0.4;">⬛</div>
                <div style="font-size:0.55rem;color:#555;">Пусто</div>
                <div style="font-size:0.6rem;color:#555;">—</div>
            `;
        }
        slotsGrid.appendChild(card);
    }
    div.appendChild(slotsGrid);

    const warTitle = document.createElement('div');
    warTitle.style.cssText = 'font-size:1.1rem;color:#e9cf9e;margin:24px 0 14px;border-left:3px solid #e9b45e;padding-left:14px;';
    warTitle.textContent = '🦾 БОЕВЫЕ МАШИНЫ';
    div.appendChild(warTitle);

    const warGrid = document.createElement('div');
    warGrid.style.cssText = 'display: flex; gap: 10px; justify-content: center;';
    const icons = { catapult: '🏗️', ballista: '🏹', firstAidTent: '⛑️', ammoCart: '🧨' };
    const names = { catapult: 'Катапульта', ballista: 'Баллиста', firstAidTent: 'Палатка', ammoCart: 'Тележка' };

    for (let i = 0; i < 4; i++) {
        const m = h.warMachines[i];
        const card = document.createElement('div');
        card.style.cssText = `
            width: 80px; height: 75px; flex-shrink: 0;
            background: rgba(0,0,0,0.4); border-radius: 16px;
            border: 1px solid rgba(210,180,110,0.35);
            display: flex; flex-direction: column;
            align-items: center; justify-content: center;
        `;
        card.innerHTML = (m && icons[m])
            ? `<div style="font-size:1.8rem;">${icons[m]}</div><div style="font-size:0.6rem;color:#f5e2b0;">${names[m]}</div>`
            : `<div style="font-size:1.5rem;opacity:0.4;">🔲</div><div style="font-size:0.55rem;color:#555;">Пусто</div>`;
        warGrid.appendChild(card);
    }
    div.appendChild(warGrid);

    return div;
}

function buildSkillsTab(h) {
    const div = document.createElement('div');

    const title = document.createElement('div');
    title.style.cssText = 'font-size:1.1rem;color:#e9cf9e;margin-bottom:16px;border-left:3px solid #e9b45e;padding-left:14px;';
    title.textContent = '📖 НАВЫКИ И УМЕНИЯ';
    div.appendChild(title);

    const skillsContainer = document.createElement('div');
    skillsContainer.style.cssText = 'background:rgba(0,0,0,0.3);border-radius:32px;padding:16px;margin-bottom:20px;';

    for (let i = 0; i < 5; i++) {
        const skill = h.skills[i];
        const row = document.createElement('div');
        row.style.cssText = 'display:flex;align-items:center;gap:12px;margin-bottom:12px;flex-wrap:wrap;background:rgba(0,0,0,0.25);border-radius:24px;padding:10px 14px;';

        const skillSlot = document.createElement('div');
        skillSlot.style.cssText = 'background:#1e1f2e;border-radius:20px;padding:8px 14px;min-width:110px;text-align:center;border-left:3px solid #e9b45e;';
        skillSlot.innerHTML = skill
            ? `<div style="color:#f5e2b0;font-weight:bold;font-size:0.9rem;">${skill.key}</div><div style="color:#cbbd91;font-size:0.65rem;">Ур. ${skill.level}</div>`
            : `<div style="opacity:0.5;font-size:0.9rem;">⬜ Пусто</div><div style="color:#cbbd91;font-size:0.65rem;">—</div>`;
        row.appendChild(skillSlot);

        const arrow = document.createElement('div');
        arrow.style.cssText = 'font-size:1.2rem;color:#e9b45e;';
        arrow.textContent = '→';
        row.appendChild(arrow);

        const perksDiv = document.createElement('div');
        perksDiv.style.cssText = 'display:flex;gap:8px;flex:1;flex-wrap:wrap;';
        for (let p = 0; p < 3; p++) {
            const perkSlot = document.createElement('div');
            perkSlot.style.cssText = 'background:rgba(11,15,26,0.8);border-radius:16px;padding:6px 10px;min-width:60px;text-align:center;border:1px solid rgba(210,180,110,0.3);font-size:0.7rem;';
            perkSlot.innerHTML = (skill?.perks?.[p])
                ? `<span style="color:#f5e2b0;">✨ ${skill.perks[p]}</span>`
                : `<span style="opacity:0.4;color:#7a6a44;">◻️</span>`;
            perksDiv.appendChild(perkSlot);
        }
        row.appendChild(perksDiv);
        skillsContainer.appendChild(row);
    }
    div.appendChild(skillsContainer);

    const lvlNames = ['Не изучен', 'Начальная', 'Развитая', 'Сильная', 'Искусная'];
    const rLvl = h.racialSkill.level || 1;
    const racialDiv = document.createElement('div');
    racialDiv.style.cssText = 'background:rgba(0,0,0,0.3);border-radius:32px;padding:14px;margin-bottom:20px;border:1px solid rgba(233,180,94,0.3);';
    racialDiv.innerHTML = `
        <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;background:linear-gradient(135deg,rgba(233,180,94,0.15),rgba(233,180,94,0.05));border-radius:24px;padding:10px 14px;border-left:3px solid #e9b45e;">
            <div style="background:#2a2a3e;border-radius:20px;padding:8px 14px;min-width:110px;text-align:center;border-left:3px solid #e9b45e;">
                <div style="color:#f5e2b0;font-weight:bold;font-size:0.9rem;">🌀 Астральная магия</div>
                <div style="color:#cbbd91;font-size:0.65rem;">${lvlNames[rLvl]} · Ур. ${rLvl}/4</div>
            </div>
            <div style="font-size:1.2rem;color:#e9b45e;">→</div>
            <div style="display:flex;gap:8px;flex:1;flex-wrap:wrap;">
                ${[0,1,2].map(p => `<div style="background:#2a2a3e;border-radius:16px;padding:6px 10px;border:1px solid #e9b45e;font-size:0.7rem;color:#f5e2b0;">✨ ${h.racialSkill.perks[p]||'—'}</div>`).join('')}
            </div>
        </div>
    `;
    div.appendChild(racialDiv);

    const spec = getSpecialization(h.specializationId);
    const specDiv = document.createElement('div');
    specDiv.style.cssText = 'background:rgba(0,0,0,0.3);border-radius:32px;padding:14px 18px;border:1px solid rgba(233,180,94,0.3);cursor:pointer;';
    specDiv.innerHTML = `
        <div style="font-size:0.85rem;color:#e9cf9e;margin-bottom:4px;border-left:3px solid #e9b45e;padding-left:12px;">🌟 СПЕЦИАЛИЗАЦИЯ</div>
        <div style="font-size:1rem;font-weight:bold;color:#f5cb7e;">${spec?.name || h.specializationId}</div>
        <div style="font-size:0.75rem;color:#a090b0;margin-top:4px;">${spec?.desc || ''}</div>
    `;
    specDiv.addEventListener('click', () => alert(`📖 ${spec?.name || h.specializationId}\n\n${spec?.desc || ''}`));
    div.appendChild(specDiv);

    return div;
}

function buildGearTab(h) {
    const div = document.createElement('div');

    const cfg = [
        { i:0, l:'Кольцо', e:'💍' },{ i:1, l:'Голова', e:'⛑️' },{ i:2, l:'Шея', e:'📿' },
        { i:3, l:'Книга закл.', e:'📖', s:true },{ i:4, l:'Кольцо', e:'💍' },
        { i:5, l:'Торс', e:'🛡️' },{ i:6, l:'Левая рука', e:'🛡️' },{ i:7, l:'Карман', e:'🔮' },
        { i:8, l:'Правая рука', e:'⚔️' },{ i:9, l:'Ноги', e:'👢' },{ i:10, l:'Плащ', e:'🧥' },{ i:11, l:'Карман', e:'🔮' }
    ];

    const grid = document.createElement('div');
    grid.style.cssText = 'display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:24px;';
    cfg.forEach(c => {
        const art = h.equipped?.[c.i];
        const el = document.createElement('div');
        el.style.cssText = `
            background:${c.s?'linear-gradient(135deg,#3a3a55,#2a2a40)':'rgba(11,15,26,0.8)'};
            border-radius:16px;aspect-ratio:1/1;
            border:${c.s?'2px solid #e9b45e':art?'2px solid #e9bc6e':'1px solid rgba(210,180,110,0.3)'};
            display:flex;flex-direction:column;align-items:center;justify-content:center;
            padding:6px;text-align:center;
        `;
        if (c.s) el.innerHTML = '<div style="font-size:1.8rem;">📖</div><div style="color:#f5e2b0;font-size:0.65rem;">Книга закл.</div>';
        else if (art && typeof art === 'object') el.innerHTML = `<div style="font-size:1.8rem;">${art.emoji||'📦'}</div><div style="color:#f5e2b0;font-size:0.65rem;">${art.name||'Арт.'}</div>`;
        else if (art) el.innerHTML = `<div style="font-size:1.8rem;">📦</div><div style="color:#f5e2b0;font-size:0.65rem;">${art}</div>`;
        else el.innerHTML = `<div style="font-size:1.8rem;opacity:0.4;">${c.e}</div><div style="color:#7a6a44;font-size:0.65rem;">${c.l}</div>`;
        grid.appendChild(el);
    });
    div.appendChild(grid);

    const invT = document.createElement('div');
    invT.style.cssText = 'font-size:1.1rem;color:#e9cf9e;margin-bottom:12px;border-left:3px solid #e9b45e;padding-left:14px;';
    invT.textContent = '🎒 ИНВЕНТАРЬ';
    div.appendChild(invT);

    const invGrid = document.createElement('div');
    invGrid.style.cssText = 'display:flex;flex-wrap:wrap;gap:10px;max-height:200px;overflow-y:auto;padding:10px;background:rgba(0,0,0,0.3);border-radius:24px;';
    if (h.inventory?.length) {
        h.inventory.forEach(item => {
            const name = typeof item === 'string' ? item : (item.name||'Артефакт');
            const emoji = typeof item === 'object' ? (item.emoji||'📦') : '📦';
            const iEl = document.createElement('div');
            iEl.style.cssText = 'background:#1e1f2e;border-radius:16px;padding:5px 10px;display:inline-flex;align-items:center;gap:6px;border:1px solid rgba(210,180,110,0.25);';
            iEl.innerHTML = `<span style="font-size:1rem;">${emoji}</span><span style="color:#f5e2b0;font-size:0.7rem;">${name}</span>`;
            invGrid.appendChild(iEl);
        });
    } else {
        invGrid.innerHTML = '<div style="color:#7a6a44;padding:14px;">Инвентарь пуст</div>';
    }
    div.appendChild(invGrid);

    return div;
}

function buildBioTab(h) {
    const div = document.createElement('div');
    div.style.cssText = 'padding:20px 10px;max-width:800px;margin:0 auto;';

    const title = document.createElement('div');
    title.style.cssText = 'font-size:1.2rem;color:#e9cf9e;text-align:center;margin-bottom:16px;';
    title.textContent = '📜 БИОГРАФИЯ';
    div.appendChild(title);

    const text = document.createElement('div');
    text.style.cssText = `
        color:#cbbd91; font-size:0.95rem; line-height:1.8;
        text-align:justify; font-family:'Georgia',serif;
        text-indent:2em;
        background:rgba(0,0,0,0.2); padding:20px 24px;
        border-radius:20px; border-left:3px solid #e9b45e;
    `;

    const bio = h.biography?.ru || h.biography?.en || 'Биография этого героя пока не написана.';
    text.textContent = bio;
    div.appendChild(text);

    return div;
}

function switchTab(key) {
    const panel = document.querySelector('.hero-tabs')?.closest('[style*="linear-gradient"]');
    if (!panel) return;

    const tabsBar = panel.querySelector('.hero-tabs');
    if (tabsBar) {
        tabsBar.querySelectorAll('.tab-btn').forEach(btn => {
            const isActive = btn.dataset.tab === key;
            btn.style.color = isActive ? '#f5e2b0' : '#bdae83';
            btn.style.borderBottomColor = isActive ? '#e9b45e' : 'transparent';
            btn.style.background = isActive ? 'rgba(255,255,255,0.05)' : 'transparent';
        });
    }

    const allContents = panel.querySelectorAll('.tab-content');
    allContents.forEach(c => c.style.display = 'none');
    const active = document.getElementById(`tab-${key}`);
    if (active) active.style.display = 'block';
      }
