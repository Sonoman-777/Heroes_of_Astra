import { getAllHeroes } from '../../../data/heroes/index.js';
import { openHeroWindow } from '../HeroWindow.js';

const BATTLEFIELDS = [
    "Цветущие равнины", "Зеленые холмы", "Лесная поляна",
    "Ручей в роще", "Болотная топь", "Гнилой лес",
    "Темный лес", "Пустошь", "Песчаные дюны",
    "Горная тропа", "Ущелье", "Снежные поля",
    "Ледяные холмы", "Обсидиановые поля", "Скверна",
    "Астральные врата", "Подземелье", "Подземный храм",
    "Стигийская библиотека", "Морская дуэль"
];

const NAMELESS_PORTRAIT = 'assets/images/portraits/heroes/Nameless.png';

class DuelSetup {
    constructor(container, onBack) {
        this.container = container;
        this.onBack = onBack;
        this.element = null;
        this.allHeroes = getAllHeroes();
        this.heroList = Object.values(this.allHeroes);
        this.hero1 = null;
        this.hero2 = null;
        this.battlefield = BATTLEFIELDS[0];
        this.select1 = null;
        this.select2 = null;
        this.render();
    }

    render() {
        this.element = document.createElement('div');
        Object.assign(this.element.style, {
            width: '100%', height: '100%',
            position: 'absolute', top: '0', left: '0',
            background: 'linear-gradient(135deg, #0c1020 0%, #1a1540 50%, #0d1b2a 100%)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            zIndex: '30', overflow: 'auto', padding: '20px',
            boxSizing: 'border-box'
        });

        const title = document.createElement('h2');
        title.textContent = '⚔️ DUEL SETUP';
        Object.assign(title.style, {
            color: '#e8c84a', fontSize: '36px', marginBottom: '40px',
            textShadow: '0 0 15px #b8860b', letterSpacing: '4px'
        });
        this.element.appendChild(title);

        const heroesContainer = document.createElement('div');
        Object.assign(heroesContainer.style, {
            display: 'flex', gap: '20px', justifyContent: 'center',
            alignItems: 'stretch', flexWrap: 'wrap', marginBottom: '30px'
        });

        heroesContainer.appendChild(this.createPlayerPanel('Игрок 1', '#cc3333', 1));

        const vs = document.createElement('div');
        vs.textContent = '⚔️';
        Object.assign(vs.style, {
            color: '#ffd700', fontSize: '48px',
            display: 'flex', alignItems: 'center',
            textShadow: '0 0 20px #ffd700'
        });
        heroesContainer.appendChild(vs);

        heroesContainer.appendChild(this.createPlayerPanel('Игрок 2', '#3366cc', 2));

        this.element.appendChild(heroesContainer);
        this.element.appendChild(this.createBattlefieldSelector());

        const buttonRow = document.createElement('div');
        Object.assign(buttonRow.style, { display: 'flex', gap: '20px', marginTop: '30px' });

        const backBtn = this.createButton('← НАЗАД', '#2a2a4a', '#6a6a8a', () => { this.destroy(); this.onBack(); });
        const startBtn = this.createButton('⚔️ НАЧАТЬ БИТВУ', '#3a1a0a', '#c8a84a', () => this.startBattle());

        buttonRow.appendChild(backBtn);
        buttonRow.appendChild(startBtn);
        this.element.appendChild(buttonRow);

        this.container.appendChild(this.element);
    }

    createPlayerPanel(playerName, color, playerNum) {
        const panel = document.createElement('div');
        Object.assign(panel.style, {
            background: 'rgba(10, 15, 30, 0.9)',
            border: `2px solid ${color}`, borderRadius: '12px',
            padding: '25px', minWidth: '280px',
            textAlign: 'center', boxShadow: `0 0 20px ${color}33`,
            display: 'flex', flexDirection: 'column', alignItems: 'center'
        });

        const header = document.createElement('h3');
        header.textContent = playerName;
        Object.assign(header.style, {
            color: color, marginBottom: '20px',
            fontSize: '22px', textShadow: `0 0 10px ${color}`
        });
        panel.appendChild(header);

        // Портрет
        const portraitContainer = document.createElement('div');
        portraitContainer.id = `pc-${playerNum}`;
        Object.assign(portraitContainer.style, {
            width: '100px', height: '100px',
            borderRadius: '12px', margin: '0 auto 15px',
            background: 'rgba(0,0,0,0.5)',
            border: `2px solid ${color}44`,
            overflow: 'hidden',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
        });

        const portraitImg = document.createElement('img');
        portraitImg.id = `pi-${playerNum}`;
        portraitImg.src = NAMELESS_PORTRAIT;
        Object.assign(portraitImg.style, {
            width: '100%', height: '100%',
            objectFit: 'contain', display: 'block'
        });
        portraitImg.onerror = () => {
            portraitImg.style.display = 'none';
            portraitContainer.innerHTML = '<div style="font-size:40px;color:#888;">👤</div>';
        };
        portraitContainer.appendChild(portraitImg);
        panel.appendChild(portraitContainer);

        // Кнопка "i"
        const infoBtn = document.createElement('button');
        infoBtn.id = `ib-${playerNum}`;
        infoBtn.textContent = 'ℹ️';
        Object.assign(infoBtn.style, {
            marginBottom: '12px', padding: '6px 16px', fontSize: '16px',
            background: '#2a2a4a', border: '1px solid #4a3a5a',
            borderRadius: '6px', color: '#a090b0', cursor: 'pointer',
            display: 'none', transition: 'all 0.2s'
        });
        infoBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const hero = playerNum === 1 ? this.hero1 : this.hero2;
            if (hero) openHeroWindow(hero, 'duel');
        });
        panel.appendChild(infoBtn);

        // Карточка
        const card = document.createElement('div');
        card.id = `hc-${playerNum}`;
        Object.assign(card.style, {
            minHeight: '80px', marginBottom: '15px',
            color: '#a090b0', fontSize: '13px', lineHeight: '1.6',
            textAlign: 'center'
        });
        card.innerHTML = '<p style="color:#6a6050;">Герой не выбран</p>';
        panel.appendChild(card);

        // Селект
        const select = document.createElement('select');
        Object.assign(select.style, {
            width: '100%', padding: '10px', fontSize: '16px',
            background: '#1a1a3a', color: '#e0d0b0',
            border: `1px solid ${color}44`, borderRadius: '6px',
            cursor: 'pointer'
        });

        const randomOption = document.createElement('option');
        randomOption.value = 'random';
        randomOption.textContent = 'Случайный герой';
        select.appendChild(randomOption);

        this.heroList.forEach(hero => {
            const option = document.createElement('option');
            option.value = hero.id;
            option.textContent = hero.names.ru;
            select.appendChild(option);
        });

        select.value = 'random';

        select.addEventListener('change', () => {
            const hero = this.heroList.find(h => h.id === select.value) || null;
            if (playerNum === 1) this.hero1 = hero;
            else this.hero2 = hero;
            this.updateHeroCard(playerNum, hero);
            this.updateDisabledOptions();
        });

        panel.appendChild(select);

        if (playerNum === 1) this.select1 = select;
        else this.select2 = select;

        return panel;
    }

    updateHeroCard(playerNum, hero) {
        const card = document.getElementById(`hc-${playerNum}`);
        const portraitImg = document.getElementById(`pi-${playerNum}`);
        const infoBtn = document.getElementById(`ib-${playerNum}`);
        const portraitContainer = document.getElementById(`pc-${playerNum}`);

        // Обновляем портрет
        if (portraitImg && portraitContainer) {
            if (hero && hero.portrait) {
                portraitImg.src = hero.portrait;
                portraitImg.style.display = 'block';
                portraitImg.onerror = () => {
                    portraitImg.style.display = 'none';
                    portraitContainer.innerHTML = '<div style="font-size:40px;">👤</div>';
                };
            } else {
                // Сбрасываем на Nameless
                portraitContainer.innerHTML = '';
                const newImg = document.createElement('img');
                newImg.id = `pi-${playerNum}`;
                newImg.src = NAMELESS_PORTRAIT;
                Object.assign(newImg.style, {
                    width: '100%', height: '100%',
                    objectFit: 'contain', display: 'block'
                });
                newImg.onerror = () => {
                    newImg.style.display = 'none';
                    portraitContainer.innerHTML = '<div style="font-size:40px;color:#888;">👤</div>';
                };
                portraitContainer.appendChild(newImg);
            }
        }

        // Кнопка "i"
        if (infoBtn) {
            infoBtn.style.display = hero ? 'inline-block' : 'none';
        }

        // Карточка
        if (!card) return;
        if (!hero) {
            card.innerHTML = '<p style="color:#6a6050;">Герой не выбран</p>';
            return;
        }

        const d = hero.duel;
        card.innerHTML = `
            <p style="color:#ffd700;font-size:16px;font-weight:bold;margin-bottom:8px;">${hero.names.ru}</p>
            <p style="color:#a090b0;font-size:12px;margin-bottom:8px;">${hero.heroClass} · lvl ${d.level}</p>
            <hr style="border-color:#3a3a5a;margin:8px 0;">
            <p>⚔️ ${d.stats.attack} 🛡️ ${d.stats.defense} 🔮 ${d.stats.spellpower} 📚 ${d.stats.knowledge}</p>
            <p style="font-size:11px;color:#7a7a9a;">Машины: ${d.warMachines.filter(m=>m).length}/4 · Армия: ${d.army.length}/7</p>
        `;
    }

    createBattlefieldSelector() {
        const container = document.createElement('div');
        Object.assign(container.style, {
            background: 'rgba(10, 15, 30, 0.9)',
            border: '2px solid #4a3a5a', borderRadius: '12px',
            padding: '18px 30px', textAlign: 'center'
        });

        const label = document.createElement('span');
        label.textContent = '🏞️ Поле битвы: ';
        Object.assign(label.style, { color: '#c8a84a', fontSize: '16px', marginRight: '12px' });
        container.appendChild(label);

        const select = document.createElement('select');
        Object.assign(select.style, {
            padding: '10px 15px', fontSize: '15px',
            background: '#1a1a3a', color: '#e0d0b0',
            border: '1px solid #4a3a5a', borderRadius: '6px',
            minWidth: '220px', cursor: 'pointer'
        });

        BATTLEFIELDS.forEach(field => {
            const option = document.createElement('option');
            option.value = field;
            option.textContent = field;
            select.appendChild(option);
        });

        select.addEventListener('change', () => { this.battlefield = select.value; });
        container.appendChild(select);
        return container;
    }

    updateDisabledOptions() {
        if (!this.select1 || !this.select2) return;
        const b1 = this.hero2?.id, b2 = this.hero1?.id;
        const c1 = this.select1.value, c2 = this.select2.value;

        Array.from(this.select1.options).forEach(o => {
            o.disabled = (o.value !== 'random' && o.value === b1);
            o.style.color = o.disabled ? '#555' : '';
        });
        Array.from(this.select2.options).forEach(o => {
            o.disabled = (o.value !== 'random' && o.value === b2);
            o.style.color = o.disabled ? '#555' : '';
        });

        if (this.select1.querySelector(`option[value="${c1}"]`)?.disabled) {
            this.select1.value = 'random';
            this.hero1 = null;
            this.updateHeroCard(1, null);
        }
        if (this.select2.querySelector(`option[value="${c2}"]`)?.disabled) {
            this.select2.value = 'random';
            this.hero2 = null;
            this.updateHeroCard(2, null);
        }
    }

    createButton(text, bgColor, borderColor, onClick) {
        const btn = document.createElement('button');
        btn.textContent = text;
        Object.assign(btn.style, {
            padding: '15px 40px', fontSize: '20px', fontWeight: 'bold',
            background: `linear-gradient(to bottom, ${bgColor}, #1a1a2a)`,
            border: `2px solid ${borderColor}`, borderRadius: '8px',
            color: '#e0d0b0', cursor: 'pointer', letterSpacing: '1px',
            transition: 'all 0.2s'
        });
        btn.addEventListener('mouseenter', () => btn.style.filter = 'brightness(1.3)');
        btn.addEventListener('mouseleave', () => btn.style.filter = 'brightness(1)');
        btn.addEventListener('click', onClick);
        return btn;
    }

    startBattle() {
        console.log('═══ DUEL START ═══');
        console.log('P1:', this.hero1?.names.ru || 'Random');
        console.log('P2:', this.hero2?.names.ru || 'Random');
        alert(`⚔️ Дуэль!\n\n🔴 ${this.hero1?.names.ru||'Случайный'}\n🔵 ${this.hero2?.names.ru||'Случайный'}\n🏞️ ${this.battlefield}\n\n(Бой позже)`);
    }

    destroy() {
        if (this.element) { this.element.remove(); this.element = null; }
    }
}

export default DuelSetup;
