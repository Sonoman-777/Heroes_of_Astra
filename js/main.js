import UIManager from './ui/UIManager.js';
import state from './state.js';
import { setLanguage } from '../data/texts/index.js';

class Game {
    constructor() {
        this.container = document.getElementById('game-container');
        this.uiManager = null;
    }

    init() {
        console.log('🎮 Heroes of Astra v0.0.1');
        
        // Устанавливаем язык из сохранённых настроек
        setLanguage(state.settings.language);
        
        this.uiManager = new UIManager(this.container);
        this.uiManager.init();
        
        console.log('✅ Game ready');
    }
}

const game = new Game();
game.init();
