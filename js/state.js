import EventBus from './eventBus.js';

class GameState {
    constructor() {
        this.settings = {
            musicVolume: 0.7,
            soundVolume: 0.8,
            animationSpeed: 0.5,
            language: 'ru'
        };

        this.loadSettings();
        
        this.currentScreen = 'mainMenu';
        this.session = null;
    }

    loadSettings() {
        try {
            const saved = localStorage.getItem('heroesOfAstra_settings');
            if (saved) {
                const parsed = JSON.parse(saved);
                this.settings = { ...this.settings, ...parsed };
            }
        } catch (e) {
            console.warn('Failed to load settings:', e);
        }
    }

    saveSettings() {
        try {
            localStorage.setItem('heroesOfAstra_settings', JSON.stringify(this.settings));
            EventBus.emit('settingsChanged', this.settings);
        } catch (e) {
            console.warn('Failed to save settings:', e);
        }
    }

    setMusicVolume(value) {
        this.settings.musicVolume = Math.max(0, Math.min(1, value));
        this.saveSettings();
    }

    setSoundVolume(value) {
        this.settings.soundVolume = Math.max(0, Math.min(1, value));
        this.saveSettings();
    }

    setAnimationSpeed(value) {
        this.settings.animationSpeed = Math.max(0, Math.min(1, value));
        this.saveSettings();
    }

    setLanguage(lang) {
        this.settings.language = lang;
        this.saveSettings();
        EventBus.emit('languageChanged', lang);
    }

    setCurrentScreen(screen) {
        this.currentScreen = screen;
        EventBus.emit('screenChanged', screen);
    }
}

export default new GameState();
