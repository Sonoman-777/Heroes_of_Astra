import { getText } from '../../../data/texts/index.js';

class CreditsMenu {
    constructor(container, onBack) {
        this.container = container;
        this.onBack = onBack;
        this.panel = null;
        
        this.render();
    }

    render() {
        this.panel = document.createElement('div');
        this.panel.className = 'credits-panel';
        
        const title = document.createElement('div');
        title.className = 'credits-title';
        title.textContent = getText('CREDITS_TITLE');
        this.panel.appendChild(title);
        
        const content = document.createElement('div');
        content.className = 'credits-content';
        content.innerHTML = `
            <p>🎮 <strong>Heroes of Astra</strong></p>
            <p>${getText('CREDITS_TEXT')}</p>
            <p>━━━━━━━━━━━━━━━━━━</p>
            <p>👤 ${getText('CREDITS_DEV')}</p>
            <p>━━━━━━━━━━━━━━━━━━</p>
            <p>📅 2024-2026</p>
            <p>${getText('CREDITS_VERSION')}</p>
        `;
        this.panel.appendChild(content);
        
        const closeBtn = document.createElement('button');
        closeBtn.className = 'credits-close';
        closeBtn.textContent = getText('CREDITS_CLOSE');
        closeBtn.addEventListener('click', () => {
            this.destroy();
            this.onBack();
        });
        this.panel.appendChild(closeBtn);
        
        this.container.appendChild(this.panel);
    }

    destroy() {
        if (this.panel) {
            this.panel.remove();
        }
    }
}

export default CreditsMenu;
