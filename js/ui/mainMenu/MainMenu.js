import EventBus from '../../eventBus.js';
import state from '../../state.js';
import { getText } from '../../../data/texts/index.js';
import CreditsMenu from './CreditsMenu.js';
import DuelSetup from './DuelSetup.js';

class MainMenu {
    constructor(container) {
        this.container = container;
        this.menuElement = null;
        this.audioElement = null;
        this.duelSetup = null;
        this.submenus = {
            singleplayer: false,
            multiplayer: false,
            hotseat: false,
            settings: false
        };
        
        this.languageHandler = () => this.rerender();
        EventBus.on('languageChanged', this.languageHandler);
        
        this.render();
        this.initAudio();
    }

    render() {
        this.menuElement = document.createElement('div');
        this.menuElement.className = 'main-menu';
        
        const title = document.createElement('h1');
        title.className = 'game-title';
        title.textContent = 'HEROES OF ASTRA';
        this.menuElement.appendChild(title);
        
        const version = document.createElement('div');
        version.className = 'game-version';
        version.textContent = 'v0.0.1';
        this.menuElement.appendChild(version);
        
        this.panel = document.createElement('div');
        this.panel.className = 'menu-panel';
        this.menuElement.appendChild(this.panel);
        
        this.renderMenuContent();
        this.container.appendChild(this.menuElement);
    }

    renderMenuContent() {
        this.panel.innerHTML = '';
        
        // ─── Одиночная игра ───
        this.panel.appendChild(this.createButton(getText('MENU_SINGLEPLAYER'), () => this.toggleSubmenu('singleplayer')));
        this.panel.appendChild(this.createSubmenu('singleplayer', [
            { text: getText('MENU_CAMPAIGN'), action: () => this.stub('Campaign') },
            { text: getText('MENU_SCENARIOS'), action: () => this.stub('Scenarios') },
            { text: getText('MENU_LOAD_GAME'), action: () => this.stub('Load Game') }
        ]));
        
        // ─── Сетевая игра ───
        this.panel.appendChild(this.createButton(getText('MENU_MULTIPLAYER'), () => this.toggleSubmenu('multiplayer')));
        
        const multiSub = document.createElement('div');
        multiSub.className = 'submenu';
        multiSub.id = 'submenu-multiplayer';
        
        // Одно устройство
        const hotseatBtn = this.createButton(getText('MENU_HOT_SEAT'), () => this.toggleSubmenu('hotseat'));
        multiSub.appendChild(hotseatBtn);
        
        const hotseatSub = document.createElement('div');
        hotseatSub.className = 'submenu';
        hotseatSub.id = 'submenu-hotseat';
        hotseatSub.appendChild(this.createButton('Обычный режим', () => this.stub('Hot Seat - Normal')));
        hotseatSub.appendChild(this.createButton('⚔️ Дуэль', () => this.startDuel()));
        multiSub.appendChild(hotseatSub);
        
        // Локальная сеть (недоступно)
        const localBtn = this.createButton('Локальная сеть', null);
        localBtn.classList.add('disabled');
        localBtn.disabled = true;
        multiSub.appendChild(localBtn);
        
        // Загрузить игру
        multiSub.appendChild(this.createButton(getText('MENU_LOAD_GAME'), () => this.stub('Load Multiplayer')));
        
        this.panel.appendChild(multiSub);
        
        // ─── Разделитель ───
        const divider1 = document.createElement('div');
        divider1.className = 'menu-divider';
        this.panel.appendChild(divider1);
        
        // ─── Настройки ───
        this.panel.appendChild(this.createButton(getText('MENU_SETTINGS'), () => this.toggleSubmenu('settings')));
        this.panel.appendChild(this.createSettingsSubmenu());
        
        // ─── Разделитель ───
        const divider2 = document.createElement('div');
        divider2.className = 'menu-divider';
        this.panel.appendChild(divider2);
        
        // ─── Авторы ───
        this.panel.appendChild(this.createButton(getText('MENU_CREDITS'), () => this.showCredits()));
    }

    createSettingsSubmenu() {
        const submenu = document.createElement('div');
        submenu.className = 'submenu';
        submenu.id = 'submenu-settings';
        submenu.style.paddingLeft = '0';
        
        submenu.appendChild(this.createSliderItem(
            getText('SETTINGS_MUSIC'),
            state.settings.musicVolume,
            (v) => state.setMusicVolume(v)
        ));
        
        submenu.appendChild(this.createSliderItem(
            getText('SETTINGS_SOUND'),
            state.settings.soundVolume,
            (v) => state.setSoundVolume(v)
        ));
        
        submenu.appendChild(this.createSliderItem(
            getText('SETTINGS_ANIMATION'),
            state.settings.animationSpeed,
            (v) => state.setAnimationSpeed(v)
        ));
        
        submenu.appendChild(this.createLanguageSelector());
        
        return submenu;
    }

    createSliderItem(labelText, value, onChange) {
        const item = document.createElement('div');
        item.style.cssText = 'padding: 8px 25px;';
        
        const labelWrapper = document.createElement('div');
        labelWrapper.style.cssText = 'display: flex; justify-content: space-between; margin-bottom: 5px;';
        
        const label = document.createElement('span');
        label.textContent = labelText;
        label.style.cssText = 'color: #b0a890; font-size: 14px;';
        
        const valueSpan = document.createElement('span');
        valueSpan.textContent = Math.round(value * 100) + '%';
        valueSpan.style.cssText = 'color: #c8a84a; font-size: 14px;';
        
        labelWrapper.appendChild(label);
        labelWrapper.appendChild(valueSpan);
        item.appendChild(labelWrapper);
        
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = 0;
        slider.max = 1;
        slider.step = 0.01;
        slider.value = value;
        slider.style.cssText = 'width: 100%; height: 4px; background: #2a2a4a; border-radius: 2px;';
        
        slider.addEventListener('input', (e) => {
            const val = parseFloat(e.target.value);
            valueSpan.textContent = Math.round(val * 100) + '%';
            onChange(val);
        });
        
        item.appendChild(slider);
        return item;
    }

    createLanguageSelector() {
        const item = document.createElement('div');
        item.style.cssText = 'padding: 12px 25px;';
        
        const label = document.createElement('div');
        label.textContent = getText('SETTINGS_LANGUAGE');
        label.style.cssText = 'color: #b0a890; font-size: 14px; margin-bottom: 8px;';
        item.appendChild(label);
        
        const wrapper = document.createElement('div');
        wrapper.style.cssText = 'display: flex; gap: 10px;';
        
        ['ru', 'en'].forEach(lang => {
            const btn = document.createElement('button');
            btn.textContent = lang === 'ru' ? 'Русский' : 'English';
            const active = state.settings.language === lang;
            btn.style.cssText = `
                padding: 6px 16px;
                background: ${active ? '#5a4a3a' : '#2a2a4a'};
                border: 1px solid ${active ? '#c8a84a' : '#4a3a5a'};
                border-radius: 4px;
                color: ${active ? '#fff0d0' : '#a09080'};
                cursor: pointer;
                font-size: 14px;
            `;
            btn.addEventListener('click', () => state.setLanguage(lang));
            wrapper.appendChild(btn);
        });
        
        item.appendChild(wrapper);
        return item;
    }

    createButton(text, onClick) {
        const btn = document.createElement('button');
        btn.className = 'menu-button';
        btn.textContent = text;
        if (onClick) btn.addEventListener('click', onClick);
        return btn;
    }

    createSubmenu(name, items) {
        const submenu = document.createElement('div');
        submenu.className = 'submenu';
        submenu.id = `submenu-${name}`;
        
        items.forEach(item => {
            const btn = this.createButton(item.text, item.action);
            if (item.disabled) {
                btn.classList.add('disabled');
                btn.disabled = true;
            }
            submenu.appendChild(btn);
        });
        
        return submenu;
    }

    toggleSubmenu(name) {
        const submenu = document.getElementById(`submenu-${name}`);
        if (!submenu) return;
        
        // Определяем родительское подменю (если есть)
        const parentName = this.getParentSubmenu(name);
        
        // Закрываем другие подменю, но не родительское
        Object.keys(this.submenus).forEach(key => {
            if (key !== name && key !== parentName) {
                this.submenus[key] = false;
                const other = document.getElementById(`submenu-${key}`);
                if (other) other.classList.remove('open');
            }
        });
        
        // Переключаем текущее
        this.submenus[name] = !this.submenus[name];
        
        if (this.submenus[name]) {
            submenu.classList.add('open');
            // Убеждаемся что родительское открыто
            if (parentName && !this.submenus[parentName]) {
                this.submenus[parentName] = true;
                const parentSub = document.getElementById(`submenu-${parentName}`);
                if (parentSub) parentSub.classList.add('open');
            }
        } else {
            submenu.classList.remove('open');
        }
    }

    getParentSubmenu(name) {
        // hotseat находится внутри multiplayer
        if (name === 'hotseat') return 'multiplayer';
        return null;
    }

    stub(name) {
        console.log(`[Main Menu] Selected: ${name}`);
    }

    startDuel() {
        this.menuElement.style.display = 'none';
        this.duelSetup = new DuelSetup(this.container, () => {
            this.duelSetup = null;
            this.menuElement.style.display = 'block';
        });
    }

    showCredits() {
        this.panel.style.display = 'none';
        new CreditsMenu(this.menuElement, () => {
            this.panel.style.display = 'block';
        });
    }

    rerender() {
        this.renderMenuContent();
        Object.keys(this.submenus).forEach(key => {
            if (this.submenus[key]) {
                const submenu = document.getElementById(`submenu-${key}`);
                if (submenu) submenu.classList.add('open');
            }
        });
    }

    initAudio() {
        const audioPath = 'assets/audio/music/Main_Menu.mp3';
        this.audioElement = new Audio(audioPath);
        this.audioElement.loop = true;
        this.audioElement.volume = state.settings.musicVolume;
        
        this.audioElement.play().catch(e => console.warn('Music play failed:', e.message));
        
        this.volumeHandler = (settings) => {
            if (this.audioElement) this.audioElement.volume = settings.musicVolume;
        };
        EventBus.on('settingsChanged', this.volumeHandler);
    }

    destroy() {
        if (this.audioElement) {
            this.audioElement.pause();
            this.audioElement.src = '';
            this.audioElement = null;
        }
        EventBus.off('settingsChanged', this.volumeHandler);
        EventBus.off('languageChanged', this.languageHandler);
        if (this.duelSetup) this.duelSetup.destroy();
        if (this.menuElement) this.menuElement.remove();
    }
}

export default MainMenu;
