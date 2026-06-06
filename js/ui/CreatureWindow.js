import { getAbility } from '../../data/abilities/index.js';

let activeCreatureOverlay = null;

export function openCreatureWindow(creature, count, heroStats) {
    if (activeCreatureOverlay) closeCreatureWindow();

    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed; top: 50%; left: 50%;
        transform: translate(-50%, -50%);
        width: 90%; max-width: 700px; max-height: 85vh;
        background: linear-gradient(145deg, #0a0f1e 0%, #0c1222 100%);
        border-radius: 32px;
        border: 2px solid rgba(210,180,110,0.6);
        padding: 24px;
        overflow-y: auto;
        color: #f0e6d0;
        box-shadow: 0 0 60px rgba(0,0,0,0.9);
        z-index: 3000;
    `;

    // Крестик
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✖';
    closeBtn.style.cssText = `
        position: sticky; top: 0; float: right;
        background: none; border: none;
        color: #e9bf77; font-size: 24px;
        cursor: pointer;
        margin-bottom: -30px;
    `;
    closeBtn.addEventListener('click', closeCreatureWindow);
    overlay.appendChild(closeBtn);

    // Портрет
    if (creature.portrait) {
        const portraitDiv = document.createElement('div');
        portraitDiv.style.cssText = 'text-align:center;margin-bottom:16px;';
        const img = document.createElement('img');
        img.src = creature.portrait;
        img.style.cssText = 'width:100px;height:100px;object-fit:contain;display:inline-block;';
        img.onerror = () => { img.outerHTML = '<div style="font-size:50px;">👤</div>'; };
        portraitDiv.appendChild(img);
        overlay.appendChild(portraitDiv);
    }

    // Заголовок
    const header = document.createElement('div');
    header.style.cssText = 'text-align:center;margin-bottom:20px;';
    header.innerHTML = `
        <div style="font-size:1.6rem;font-weight:bold;color:#f5e2b0;">${creature.names.ru}</div>
        <div style="font-size:0.85rem;color:#bdae83;">${creature.names.en}</div>
        <div style="font-size:0.8rem;color:#888;">Тир ${creature.tier} · В отряде: ${count}</div>
    `;
    overlay.appendChild(header);

    // Лор
    if (creature.lore) {
        const loreDiv = document.createElement('div');
        loreDiv.style.cssText = `
            color:#cbbd91; font-size:0.9rem; line-height:1.7;
            text-align:justify; font-family:'Georgia',serif;
            text-indent:1.5em;
            background:rgba(0,0,0,0.2); padding:14px 18px;
            border-radius:16px; border-left:3px solid #e9b45e;
            margin-bottom:20px;
        `;
        loreDiv.textContent = creature.lore.ru || creature.lore.en || '';
        overlay.appendChild(loreDiv);
    }

    // Характеристики
    const statsTitle = document.createElement('div');
    statsTitle.style.cssText = 'font-size:1rem;color:#e9cf9e;margin-bottom:12px;border-left:3px solid #e9b45e;padding-left:12px;';
    statsTitle.textContent = 'ХАРАКТЕРИСТИКИ';
    overlay.appendChild(statsTitle);

    const statsGrid = document.createElement('div');
    statsGrid.style.cssText = 'display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:20px;';

    const statDefs = [
        { label: '⚔️ Атака', val: creature.stats.attack },
        { label: '🛡️ Защита', val: creature.stats.defense },
        { label: '❤️ Здоровье', val: creature.stats.health },
        { label: '💥 Урон', val: `${creature.stats.damageMin}-${creature.stats.damageMax}` },
        { label: '🏃 Скорость', val: creature.stats.speed },
        { label: '⏱ Инициатива', val: creature.stats.initiative }
    ];

    if (creature.stats.shots > 0) statDefs.push({ label: '🏹 Выстрелы', val: creature.stats.shots });
    if (creature.stats.mana > 0) statDefs.push({ label: '💧 Мана', val: creature.stats.mana });

    statDefs.forEach(s => {
        const card = document.createElement('div');
        card.style.cssText = `
            background: rgba(11,15,26,0.8); border-radius: 12px;
            padding: 8px 10px; border-left: 2px solid #e9b45e;
            text-align: center;
        `;
        card.innerHTML = `<div style="font-size:0.6rem;color:#bdae83;">${s.label}</div><div style="font-size:1rem;font-weight:bold;color:#f5e2b0;">${s.val}</div>`;
        statsGrid.appendChild(card);
    });
    overlay.appendChild(statsGrid);

    // Отряд
    if (heroStats) {
        const totalTitle = document.createElement('div');
        totalTitle.style.cssText = 'font-size:1rem;color:#e9cf9e;margin-bottom:12px;border-left:3px solid #e9b45e;padding-left:12px;';
        totalTitle.textContent = 'ОТРЯД (с учётом героя)';
        overlay.appendChild(totalTitle);

        const totalGrid = document.createElement('div');
        totalGrid.style.cssText = 'display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:20px;';

        const heroAtk = heroStats.stats.attack;
        const heroDef = heroStats.stats.defense;
        const totalAtk = creature.stats.attack + heroAtk;
        const totalDef = creature.stats.defense + heroDef;
        const totalHp = creature.stats.health * count;
        const totalDmgMin = creature.stats.damageMin * count;
        const totalDmgMax = creature.stats.damageMax * count;

        [
            { label: '⚔️ Атака', val: `${creature.stats.attack} → ${totalAtk}` },
            { label: '🛡️ Защита', val: `${creature.stats.defense} → ${totalDef}` },
            { label: '❤️ Здоровье', val: totalHp },
            { label: '💥 Урон мин', val: totalDmgMin },
            { label: '💥 Урон макс', val: totalDmgMax },
            { label: '📦 Численность', val: count }
        ].forEach(s => {
            const card = document.createElement('div');
            card.style.cssText = `
                background: rgba(11,15,26,0.6); border-radius: 12px;
                padding: 8px 10px; border-left: 2px solid #e9b45e;
                text-align: center;
            `;
            card.innerHTML = `<div style="font-size:0.6rem;color:#bdae83;">${s.label}</div><div style="font-size:1rem;font-weight:bold;color:#6fcf97;">${s.val}</div>`;
            totalGrid.appendChild(card);
        });
        overlay.appendChild(totalGrid);
    }

    // Способности
    if (creature.abilities && creature.abilities.length > 0) {
        const abTitle = document.createElement('div');
        abTitle.style.cssText = 'font-size:1rem;color:#e9cf9e;margin-bottom:12px;border-left:3px solid #e9b45e;padding-left:12px;';
        abTitle.textContent = 'СПОСОБНОСТИ';
        overlay.appendChild(abTitle);

        creature.abilities.forEach(abId => {
            const ab = getAbility(abId);
            if (ab) {
                const abBlock = document.createElement('div');
                abBlock.style.cssText = `
                    background: rgba(0,0,0,0.25); border-radius: 12px;
                    padding: 10px 14px; margin-bottom: 8px;
                    border-left: 2px solid #e9b45e;
                `;
                abBlock.innerHTML = `
                    <div style="color:#f5cb7e;font-weight:bold;font-size:0.85rem;margin-bottom:4px;">${ab.name.ru}</div>
                    <div style="color:#a090b0;font-size:0.75rem;">${ab.desc.ru}</div>
                `;
                overlay.appendChild(abBlock);
            }
        });
    }

    // Улучшения
    if (creature.upgradeTo || creature.upgradeFrom) {
        const upgTitle = document.createElement('div');
        upgTitle.style.cssText = 'font-size:1rem;color:#e9cf9e;margin:16px 0 12px;border-left:3px solid #e9b45e;padding-left:12px;';
        upgTitle.textContent = 'УЛУЧШЕНИЯ';
        overlay.appendChild(upgTitle);

        const upgDiv = document.createElement('div');
        upgDiv.style.cssText = 'display:flex;gap:20px;justify-content:center;color:#bdae83;font-size:0.85rem;';

        if (creature.upgradeFrom) {
            const fromName = creature.upgradeFrom;
            upgDiv.innerHTML += `<span>← Из: <span style="color:#f5e2b0;">${fromName}</span></span>`;
        }
        if (creature.upgradeTo) {
            const toName = creature.upgradeTo;
            upgDiv.innerHTML += `<span>В: <span style="color:#f5e2b0;">${toName}</span> →</span>`;
        }
        overlay.appendChild(upgDiv);
    }

    document.body.appendChild(overlay);
    activeCreatureOverlay = overlay;
}

export function closeCreatureWindow() {
    if (activeCreatureOverlay) {
        activeCreatureOverlay.remove();
        activeCreatureOverlay = null;
    }
}
