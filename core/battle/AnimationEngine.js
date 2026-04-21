// ============================================================================
//  МОДУЛЬ 2: АНИМАЦИОННЫЙ ДВИЖОК
// ============================================================================

export class AnimationEngine {
    static BASE_DURATION = 450;
    static ATTACK_DURATION = 280;
    static RANGED_ATTACK_DURATION = 550;
    static HERO_ATTACK_DURATION = 400;
    static BALLISTA_ATTACK_DURATION = 650;
    static HEAL_DURATION = 800;
    static PLAGUE_ATTACK_DURATION = 600;
    static PAUSE_BETWEEN_ACTIONS = 250;
    static MORALE_CHECK_PAUSE = 500;
    static LUCK_CHECK_PAUSE = 400;
    static SYNC_PAUSE = 80;
    static BALLISTA_SHOT_INTERVAL = 400;
    static isAnimating = false;

    static getMoveDuration() { 
        const isMobile = window.innerWidth <= 768; 
        return isMobile ? this.BASE_DURATION + 150 : this.BASE_DURATION; 
    }
    
    static getAttackDuration() { 
        const isMobile = window.innerWidth <= 768; 
        return isMobile ? this.ATTACK_DURATION + 100 : this.ATTACK_DURATION; 
    }
    
    static getRangedAttackDuration() { 
        const isMobile = window.innerWidth <= 768; 
        return isMobile ? this.RANGED_ATTACK_DURATION + 150 : this.RANGED_ATTACK_DURATION; 
    }
    
    static getHeroAttackDuration() { 
        const isMobile = window.innerWidth <= 768; 
        return isMobile ? this.HERO_ATTACK_DURATION + 120 : this.HERO_ATTACK_DURATION; 
    }
    
    static getBallistaAttackDuration() { 
        const isMobile = window.innerWidth <= 768; 
        return isMobile ? this.BALLISTA_ATTACK_DURATION + 180 : this.BALLISTA_ATTACK_DURATION; 
    }
    
    static findSpriteContainer(cellElement) {
        if (!cellElement) return null;
        let spriteContainer = cellElement.querySelector('.sprite-container');
        if (spriteContainer) return spriteContainer;
        if (cellElement.classList.contains('stack-content')) return cellElement;
        const stackContent = cellElement.querySelector('.stack-content');
        if (stackContent) return stackContent;
        return cellElement;
    }
    
    static sleep(ms) { 
        return new Promise(resolve => setTimeout(resolve, ms)); 
    }
    
    static getAttackDirection(fromX, fromY, toX, toY) {
        const dx = toX - fromX;
        const dy = toY - fromY;
        if (Math.abs(dx) > Math.abs(dy)) return dx > 0 ? 'right' : 'left';
        else if (Math.abs(dy) > Math.abs(dx)) return dy > 0 ? 'down' : 'up';
        if (dx < 0 && dy < 0) return 'up-left';
        if (dx > 0 && dy < 0) return 'up-right';
        if (dx < 0 && dy > 0) return 'down-left';
        if (dx > 0 && dy > 0) return 'down-right';
        return 'right';
    }
    
    static async animateMove(cellElement, fromX, fromY, toX, toY, duration = null) {
        this.isAnimating = true;
        return new Promise((resolve) => {
            if (!cellElement) { this.isAnimating = false; return resolve(); }
            const moveDuration = duration || this.getMoveDuration();
            const targetCell = document.querySelector(`.battle-cell[data-x='${toX}'][data-y='${toY}']`);
            if (!targetCell) { this.isAnimating = false; return resolve(); }
            const spriteContainer = this.findSpriteContainer(cellElement);
            if (!spriteContainer) { this.isAnimating = false; return resolve(); }
            
            const wasLarge = cellElement.classList.contains('large-cell');
            const side = cellElement.getAttribute('data-side') || (cellElement.closest('.defender-zone') ? 'defender' : 'attacker');
            const oldContent = cellElement.innerHTML;
            
            const startRect = spriteContainer.getBoundingClientRect();
            const targetSpriteContainer = this.findSpriteContainer(targetCell);
            const targetElement = targetSpriteContainer || targetCell;
            const targetWasInvisible = targetElement.style.opacity === '0';
            if (targetWasInvisible) targetElement.style.opacity = '0.01';
            const endRect = targetElement.getBoundingClientRect();
            if (targetWasInvisible) targetElement.style.opacity = '';
            const deltaX = endRect.left - startRect.left;
            const deltaY = endRect.top - startRect.top;
            
            const clone = spriteContainer.cloneNode(true);
            clone.style.position = 'fixed';
            clone.style.left = `${startRect.left}px`;
            clone.style.top = `${startRect.top}px`;
            clone.style.width = `${startRect.width}px`;
            clone.style.height = `${startRect.height}px`;
            clone.style.zIndex = '10000';
            clone.style.transition = `transform ${moveDuration}ms ease-in-out`;
            clone.style.pointerEvents = 'none';
            clone.style.margin = '0';
            clone.style.display = 'flex';
            clone.style.alignItems = 'center';
            clone.style.justifyContent = 'center';
            let initialTransform = side === 'defender' ? 'scaleX(-1)' : '';
            clone.style.transform = initialTransform;
            document.body.appendChild(clone);
            spriteContainer.style.opacity = '0';
            
            requestAnimationFrame(() => { 
                let finalTransform = `translate(${deltaX}px, ${deltaY}px)`; 
                if (side === 'defender') finalTransform += ' scaleX(-1)'; 
                clone.style.transform = finalTransform; 
            });
            
            setTimeout(() => { 
                clone.remove();
                
                const oldCell = document.querySelector(`.battle-cell[data-x='${fromX}'][data-y='${fromY}']`);
                const newCell = document.querySelector(`.battle-cell[data-x='${toX}'][data-y='${toY}']`);
                
                if (oldCell && newCell) {
                    oldCell.innerHTML = '';
                    oldCell.classList.remove('has-stack', 'large-cell');
                    oldCell.style.gridColumn = '';
                    oldCell.style.gridRow = '';
                    oldCell.style.width = '';
                    oldCell.style.height = '';
                    oldCell.removeAttribute('data-side');
                    
                    newCell.innerHTML = oldContent;
                    newCell.classList.add('has-stack');
                    newCell.setAttribute('data-side', side);
                    
                    if (wasLarge) {
                        newCell.classList.add('large-cell');
                        newCell.style.gridColumn = 'span 2';
                        newCell.style.gridRow = 'span 2';
                    }
                    
                    const newSpriteContainer = newCell.querySelector('.sprite-container');
                    if (newSpriteContainer) newSpriteContainer.style.opacity = '';
                }
                
                this.isAnimating = false; 
                resolve(); 
            }, moveDuration + this.SYNC_PAUSE);
        });
    }
    
    static async animateAttack(attackerElement, targetElement, direction, duration = null) {
        this.isAnimating = true;
        return new Promise((resolve) => {
            if (!attackerElement) { this.isAnimating = false; return resolve(); }
            const attackDuration = duration || this.getAttackDuration();
            const attackerSprite = this.findSpriteContainer(attackerElement);
            if (!attackerSprite) { this.isAnimating = false; return resolve(); }
            const targetSprite = targetElement ? this.findSpriteContainer(targetElement) : null;
            const originalTransform = attackerSprite.style.transform || '';
            const originalTransition = attackerSprite.style.transition || '';
            const attackerSide = attackerElement.getAttribute('data-side') || 
                (attackerElement.closest('.attacker-zone') ? 'attacker' : 
                 attackerElement.closest('.defender-zone') ? 'defender' : 'attacker');
            
            let dx = 0, dy = 0;
            const attackDistance = 20;
            let effectiveDirection = direction;
            
            if (attackerSide === 'defender') {
                if (direction === 'left') effectiveDirection = 'right';
                else if (direction === 'right') effectiveDirection = 'left';
                else if (direction === 'up-left') effectiveDirection = 'up-right';
                else if (direction === 'up-right') effectiveDirection = 'up-left';
                else if (direction === 'down-left') effectiveDirection = 'down-right';
                else if (direction === 'down-right') effectiveDirection = 'down-left';
            }
            
            switch (effectiveDirection) {
                case 'up': dy = -attackDistance; break;
                case 'down': dy = attackDistance; break;
                case 'left': dx = -attackDistance; break;
                case 'right': dx = attackDistance; break;
                case 'up-left': dx = -attackDistance/1.5; dy = -attackDistance/1.5; break;
                case 'up-right': dx = attackDistance/1.5; dy = -attackDistance/1.5; break;
                case 'down-left': dx = -attackDistance/1.5; dy = attackDistance/1.5; break;
                case 'down-right': dx = attackDistance/1.5; dy = attackDistance/1.5; break;
                default: dx = attackDistance; dy = 0;
            }
            
            attackerSprite.style.transition = `transform ${attackDuration}ms cubic-bezier(0.34, 1.56, 0.64, 1)`;
            let baseTransform = attackerSide === 'defender' ? 'scaleX(-1)' : '';
            const attackTransform = baseTransform ? `${baseTransform} translate(${dx}px, ${dy}px)` : `translate(${dx}px, ${dy}px)`;
            attackerSprite.style.transform = attackTransform;
            
            if (targetSprite) {
                const targetOriginalTransform = targetSprite.style.transform || '';
                const targetOriginalTransition = targetSprite.style.transition || '';
                targetSprite.style.transition = `transform 120ms ease-out`;
                const targetSide = targetElement.getAttribute('data-side') || 'attacker';
                const targetBaseTransform = targetSide === 'defender' ? 'scaleX(-1)' : '';
                targetSprite.style.transform = targetBaseTransform ? `${targetBaseTransform} scale(0.9)` : 'scale(0.9)';
                setTimeout(() => { 
                    targetSprite.style.transform = targetBaseTransform || 'none'; 
                    targetSprite.style.transition = targetOriginalTransition; 
                }, 120);
            }
            
            setTimeout(() => { 
                attackerSprite.style.transform = baseTransform || 'none'; 
                attackerSprite.style.transition = originalTransition; 
                setTimeout(() => { 
                    attackerSprite.style.transition = ''; 
                    this.isAnimating = false; 
                    resolve(); 
                }, 60); 
            }, attackDuration);
        });
    }
    
    static async animateHeroAttack(heroElement, targetElement) {
        this.isAnimating = true;
        return new Promise((resolve) => {
            if (!heroElement || !targetElement) { this.isAnimating = false; return resolve(); }
            const duration = this.getHeroAttackDuration();
            const effect = document.createElement('div');
            effect.textContent = '⚡';
            effect.style.position = 'fixed';
            effect.style.left = `${heroElement.getBoundingClientRect().left}px`;
            effect.style.top = `${heroElement.getBoundingClientRect().top}px`;
            effect.style.fontSize = '36px';
            effect.style.zIndex = '10001';
            effect.style.pointerEvents = 'none';
            effect.style.filter = 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))';
            effect.style.transition = `all ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
            document.body.appendChild(effect);
            const targetRect = targetElement.getBoundingClientRect();
            requestAnimationFrame(() => {
                effect.style.left = `${targetRect.left + targetRect.width/2}px`;
                effect.style.top = `${targetRect.top + targetRect.height/2}px`;
                effect.style.transform = 'translate(-50%, -50%) scale(1.5)';
                effect.style.opacity = '0.8';
            });
            setTimeout(() => {
                effect.remove();
                const flash = document.createElement('div');
                flash.style.position = 'absolute';
                flash.style.top = '0';
                flash.style.left = '0';
                flash.style.width = '100%';
                flash.style.height = '100%';
                flash.style.backgroundColor = '#ffdd44';
                flash.style.borderRadius = '50%';
                flash.style.opacity = '0.8';
                flash.style.zIndex = '100';
                flash.style.pointerEvents = 'none';
                flash.style.animation = 'flashFade 0.4s ease-out forwards';
                targetElement.style.position = 'relative';
                targetElement.appendChild(flash);
                setTimeout(() => flash.remove(), 400);
                this.isAnimating = false;
                resolve();
            }, duration);
        });
    }
    
    static async animateBallistaAttack(ballistaElement, targetElement) {
        this.isAnimating = true;
        return new Promise((resolve) => {
            if (!ballistaElement || !targetElement) { this.isAnimating = false; return resolve(); }
            const duration = this.getBallistaAttackDuration();
            const ballistaSprite = this.findSpriteContainer(ballistaElement);
            const targetSprite = this.findSpriteContainer(targetElement);
            if (!ballistaSprite || !targetSprite) { this.isAnimating = false; return resolve(); }
            const startRect = ballistaSprite.getBoundingClientRect();
            const endRect = targetSprite.getBoundingClientRect();
            const side = ballistaElement.getAttribute('data-side') || 'attacker';
            const originalTransform = ballistaSprite.style.transform || '';
            ballistaSprite.style.transition = `transform 120ms ease-out`;
            ballistaSprite.style.transform = side === 'defender' ? 'scaleX(-1) translateX(-12px)' : 'translateX(-12px)';
            setTimeout(() => { ballistaSprite.style.transform = originalTransform; ballistaSprite.style.transition = ''; }, 120);
            const bolt = document.createElement('div');
            bolt.textContent = '➤';
            bolt.style.position = 'fixed';
            bolt.style.left = `${startRect.left + startRect.width/2}px`;
            bolt.style.top = `${startRect.top + startRect.height/2}px`;
            bolt.style.fontSize = '32px';
            bolt.style.color = '#8B4513';
            bolt.style.zIndex = '10001';
            bolt.style.pointerEvents = 'none';
            bolt.style.filter = 'drop-shadow(0 2px 4px rgba(0,0,0,0.7))';
            bolt.style.transition = `all ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
            if (side === 'defender') bolt.style.transform = 'scaleX(-1)';
            document.body.appendChild(bolt);
            requestAnimationFrame(() => {
                const deltaX = endRect.left + endRect.width/2 - (startRect.left + startRect.width/2);
                const deltaY = endRect.top + endRect.height/2 - (startRect.top + startRect.height/2);
                let transform = `translate(${deltaX}px, ${deltaY}px)`;
                if (side === 'defender') transform += ' scaleX(-1)';
                bolt.style.transform = transform;
            });
            setTimeout(() => {
                bolt.remove();
                if (targetSprite) {
                    const flash = document.createElement('div');
                    flash.style.position = 'absolute';
                    flash.style.top = '0';
                    flash.style.left = '0';
                    flash.style.width = '100%';
                    flash.style.height = '100%';
                    flash.style.backgroundColor = '#8B4513';
                    flash.style.borderRadius = '50%';
                    flash.style.opacity = '0.8';
                    flash.style.zIndex = '100';
                    flash.style.pointerEvents = 'none';
                    flash.style.animation = 'flashFade 0.4s ease-out forwards';
                    targetElement.style.position = 'relative';
                    targetElement.appendChild(flash);
                    setTimeout(() => flash.remove(), 400);
                    const targetOriginalTransform = targetSprite.style.transform || '';
                    targetSprite.style.transition = 'transform 60ms ease-out';
                    targetSprite.style.transform += ' rotate(3deg)';
                    setTimeout(() => { targetSprite.style.transform = targetOriginalTransform; targetSprite.style.transition = ''; }, 60);
                }
                this.isAnimating = false;
                resolve();
            }, duration);
        });
    }
    
    static async animateHeal(healerElement, targetElement) {
        this.isAnimating = true;
        return new Promise((resolve) => {
            if (!healerElement || !targetElement) { this.isAnimating = false; return resolve(); }
            const duration = this.HEAL_DURATION;
            const healerSparkles = document.createElement('div');
            healerSparkles.textContent = '✨';
            healerSparkles.style.position = 'absolute';
            healerSparkles.style.top = '30%';
            healerSparkles.style.left = '50%';
            healerSparkles.style.transform = 'translate(-50%, -50%)';
            healerSparkles.style.fontSize = '28px';
            healerSparkles.style.color = '#66ff66';
            healerSparkles.style.zIndex = '150';
            healerSparkles.style.pointerEvents = 'none';
            healerSparkles.style.animation = 'floatUpFade 0.8s ease-out forwards';
            healerElement.style.position = 'relative';
            healerElement.appendChild(healerSparkles);
            setTimeout(() => healerSparkles.remove(), 800);
            setTimeout(() => {
                const targetSparkles = document.createElement('div');
                targetSparkles.textContent = '✨💚✨';
                targetSparkles.style.position = 'absolute';
                targetSparkles.style.top = '30%';
                targetSparkles.style.left = '50%';
                targetSparkles.style.transform = 'translate(-50%, -50%)';
                targetSparkles.style.fontSize = '32px';
                targetSparkles.style.color = '#66ff66';
                targetSparkles.style.zIndex = '150';
                targetSparkles.style.pointerEvents = 'none';
                targetSparkles.style.animation = 'floatUpFade 1s ease-out forwards';
                targetElement.style.position = 'relative';
                targetElement.appendChild(targetSparkles);
                setTimeout(() => targetSparkles.remove(), 1000);
            }, 400);
            setTimeout(() => { this.isAnimating = false; resolve(); }, duration);
        });
    }
    
    static async animatePlagueAttack(attackerElement, targetElement) {
        this.isAnimating = true;
        return new Promise((resolve) => {
            if (!attackerElement || !targetElement) { this.isAnimating = false; return resolve(); }
            const duration = this.PLAGUE_ATTACK_DURATION;
            const targetSprite = this.findSpriteContainer(targetElement);
            
            const sparkles = document.createElement('div');
            sparkles.textContent = '☠️';
            sparkles.style.position = 'absolute';
            sparkles.style.top = '30%';
            sparkles.style.left = '50%';
            sparkles.style.transform = 'translate(-50%, -50%)';
            sparkles.style.fontSize = '28px';
            sparkles.style.color = '#9932CC';
            sparkles.style.zIndex = '150';
            sparkles.style.pointerEvents = 'none';
            sparkles.style.animation = 'floatUpFade 0.8s ease-out forwards';
            
            attackerElement.style.position = 'relative';
            attackerElement.appendChild(sparkles);
            setTimeout(() => sparkles.remove(), 800);
            
            setTimeout(() => {
                const targetSparkles = document.createElement('div');
                targetSparkles.textContent = '💀☠️💀';
                targetSparkles.style.position = 'absolute';
                targetSparkles.style.top = '30%';
                targetSparkles.style.left = '50%';
                targetSparkles.style.transform = 'translate(-50%, -50%)';
                targetSparkles.style.fontSize = '32px';
                targetSparkles.style.color = '#9932CC';
                targetSparkles.style.zIndex = '150';
                targetSparkles.style.pointerEvents = 'none';
                targetSparkles.style.animation = 'floatUpFade 1s ease-out forwards';
                
                targetElement.style.position = 'relative';
                targetElement.appendChild(targetSparkles);
                setTimeout(() => targetSparkles.remove(), 1000);
                
                if (targetSprite) {
                    const originalTransform = targetSprite.style.transform || '';
                    targetSprite.style.transition = 'transform 80ms ease-out';
                    targetSprite.style.transform += ' rotate(4deg)';
                    setTimeout(() => {
                        targetSprite.style.transform = originalTransform;
                        targetSprite.style.transition = '';
                    }, 80);
                }
            }, 400);
            
            setTimeout(() => { this.isAnimating = false; resolve(); }, duration);
        });
    }
    
    static async animateRangedAttack(attackerElement, targetElement, projectileType = 'arrow') {
        this.isAnimating = true;
        return new Promise((resolve) => {
            if (!attackerElement || !targetElement) { this.isAnimating = false; return resolve(); }
            const duration = this.getRangedAttackDuration();
            const attackerSprite = this.findSpriteContainer(attackerElement);
            const targetSprite = this.findSpriteContainer(targetElement);
            if (!attackerSprite || !targetSprite) { this.isAnimating = false; return resolve(); }
            const startRect = attackerSprite.getBoundingClientRect();
            const endRect = targetSprite.getBoundingClientRect();
            const projectiles = {
                'arrow': { emoji: '🏹', size: '28px', color: '#8B4513' },
                'magic': { emoji: '🔮', size: '24px', color: '#9b59b6' },
                'fire': { emoji: '🔥', size: '26px', color: '#e74c3c' },
                'default': { emoji: '💫', size: '22px', color: '#f5cb7e' }
            };
            const proj = projectiles[projectileType] || projectiles['default'];
            const attackerSide = attackerElement.getAttribute('data-side') || 'attacker';
            const projectile = document.createElement('div');
            projectile.textContent = proj.emoji;
            projectile.style.position = 'fixed';
            projectile.style.left = `${startRect.left + startRect.width/2}px`;
            projectile.style.top = `${startRect.top + startRect.height/2}px`;
            projectile.style.fontSize = proj.size;
            projectile.style.zIndex = '10001';
            projectile.style.pointerEvents = 'none';
            projectile.style.filter = 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))';
            projectile.style.transition = `all ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
            if (attackerSide === 'defender') projectile.style.transform = 'scaleX(-1)';
            document.body.appendChild(projectile);
            requestAnimationFrame(() => {
                const deltaX = endRect.left + endRect.width/2 - (startRect.left + startRect.width/2);
                const deltaY = endRect.top + endRect.height/2 - (startRect.top + startRect.height/2);
                let transform = `translate(${deltaX}px, ${deltaY}px)`;
                if (attackerSide === 'defender') transform += ' scaleX(-1)';
                projectile.style.transform = transform;
            });
            setTimeout(() => {
                projectile.remove();
                if (targetSprite) {
                    const flash = document.createElement('div');
                    flash.style.position = 'absolute';
                    flash.style.top = '0';
                    flash.style.left = '0';
                    flash.style.width = '100%';
                    flash.style.height = '100%';
                    flash.style.backgroundColor = proj.color;
                    flash.style.borderRadius = '50%';
                    flash.style.opacity = '0.8';
                    flash.style.zIndex = '100';
                    flash.style.pointerEvents = 'none';
                    flash.style.animation = 'flashFade 0.4s ease-out forwards';
                    targetElement.style.position = 'relative';
                    targetElement.appendChild(flash);
                    setTimeout(() => flash.remove(), 400);
                    const targetOriginalTransform = targetSprite.style.transform || '';
                    targetSprite.style.transition = 'transform 60ms ease-out';
                    targetSprite.style.transform += ' rotate(2deg)';
                    setTimeout(() => { targetSprite.style.transform = targetOriginalTransform; targetSprite.style.transition = ''; }, 60);
                }
                this.isAnimating = false;
                resolve();
            }, duration);
        });
    }
    
    static async animateCounterAttack(attackerElement, targetElement, direction, duration = null) { 
        await this.sleep(this.PAUSE_BETWEEN_ACTIONS); 
        return this.animateAttack(attackerElement, targetElement, direction, duration); 
    }
        }
