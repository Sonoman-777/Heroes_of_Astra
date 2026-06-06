import EventBus from '../eventBus.js';
import state from '../state.js';
import SplashScreen from './SplashScreen.js';
import MainMenu from './mainMenu/MainMenu.js';

class UIManager {
    constructor(container) {
        this.container = container;
        this.currentUI = null;
        
        EventBus.on('screenChanged', (screen) => {
            this.showScreen(screen);
        });
    }

    init() {
      
        this.showSplashScreen();
    }

    showSplashScreen() {
        if (this.currentUI && typeof this.currentUI.destroy === 'function') {
            this.currentUI.destroy();
        }
        
        this.currentUI = new SplashScreen(this.container, () => {

            this.showScreen('mainMenu');
        });
    }

    showScreen(screenName) {
        this.container.innerHTML = '';
        
        if (this.currentUI && typeof this.currentUI.destroy === 'function') {
            this.currentUI.destroy();
        }

        switch (screenName) {
            case 'mainMenu':
                this.currentUI = new MainMenu(this.container);
                break;
            default:
                console.warn(`Неизвестный экран: ${screenName}`);
                this.currentUI = new MainMenu(this.container);
        }
    }
}

export default UIManager;
