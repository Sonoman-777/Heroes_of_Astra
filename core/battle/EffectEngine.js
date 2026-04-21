// ============================================================================
//  МОДУЛЬ 0: ВСПОМОГАТЕЛЬНЫЙ МОДУЛЬ ЭФФЕКТОВ
// ============================================================================

export class EffectEngine {
    static showFloatingEffect(stack, emoji, color = '#ffffff', duration = 1500) {
        const cell = document.querySelector(`.battle-cell[data-x='${stack.bottomX}'][data-y='${stack.bottomY}']`);
        if (!cell) return;
        
        const effectDiv = document.createElement('div');
        effectDiv.textContent = emoji;
        effectDiv.style.position = 'absolute';
        effectDiv.style.left = '50%';
        effectDiv.style.top = '40%';
        effectDiv.style.transform = 'translate(-50%, -50%)';
        effectDiv.style.fontSize = stack.isLarge && stack.isLarge() ? '2.5rem' : '1.8rem';
        effectDiv.style.color = color;
        effectDiv.style.zIndex = '200';
        effectDiv.style.pointerEvents = 'none';
        effectDiv.style.textShadow = '1px 1px 3px rgba(0,0,0,0.7)';
        effectDiv.style.animation = `floatUpFade ${duration}ms ease-out forwards`;
        
        cell.style.position = 'relative';
        cell.appendChild(effectDiv);
        
        setTimeout(() => effectDiv.remove(), duration);
    }
    
    static showEffectAt(x, y, emoji, color = '#ffffff', duration = 1500) {
        const cell = document.querySelector(`.battle-cell[data-x='${x}'][data-y='${y}']`);
        if (!cell) return;
        
        const effectDiv = document.createElement('div');
        effectDiv.textContent = emoji;
        effectDiv.style.position = 'absolute';
        effectDiv.style.left = '50%';
        effectDiv.style.top = '40%';
        effectDiv.style.transform = 'translate(-50%, -50%)';
        effectDiv.style.fontSize = '1.8rem';
        effectDiv.style.color = color;
        effectDiv.style.zIndex = '200';
        effectDiv.style.pointerEvents = 'none';
        effectDiv.style.textShadow = '1px 1px 3px rgba(0,0,0,0.7)';
        effectDiv.style.animation = `floatUpFade ${duration}ms ease-out forwards`;
        
        cell.style.position = 'relative';
        cell.appendChild(effectDiv);
        
        setTimeout(() => effectDiv.remove(), duration);
    }

    static showHealEffect(stack, healAmount) {
        const cell = document.querySelector(`.battle-cell[data-x='${stack.bottomX}'][data-y='${stack.bottomY}']`);
        if (!cell) return;
        
        const effectDiv = document.createElement('div');
        effectDiv.textContent = `+${healAmount}`;
        effectDiv.style.position = 'absolute';
        effectDiv.style.left = '50%';
        effectDiv.style.top = '30%';
        effectDiv.style.transform = 'translate(-50%, -50%)';
        effectDiv.style.color = '#66ff66';
        effectDiv.style.fontWeight = 'bold';
        effectDiv.style.fontSize = '1.2rem';
        effectDiv.style.textShadow = '1px 1px 0 #000';
        effectDiv.style.zIndex = '100';
        effectDiv.style.pointerEvents = 'none';
        effectDiv.style.animation = 'floatUp 1s ease-out forwards';
        
        cell.style.position = 'relative';
        cell.appendChild(effectDiv);
        
        setTimeout(() => effectDiv.remove(), 1000);
    }
}
