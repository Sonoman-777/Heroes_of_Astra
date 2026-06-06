import { getText } from '../../data/texts/index.js';

class SplashScreen {
    constructor(container, onStart) {
        this.container = container;
        this.onStart = onStart;
        this.element = null;
        
        this.render();
    }

    render() {
        this.element = document.createElement('div');
        this.element.className = 'splash-screen';
        
        this.element.style.cssText = `
            width: 100%;
            height: 100%;
            position: relative;
            background: linear-gradient(135deg, #0c1020 0%, #1a1540 50%, #0d1b2a 100%);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            overflow: hidden;
        `;
        
        const stars = document.createElement('div');
        stars.style.cssText = `
            position: absolute;
            width: 200%;
            height: 200%;
            top: -50%;
            left: -50%;
            background-image: 
                radial-gradient(2px 2px at 20px 30px, #fff, rgba(0,0,0,0)),
                radial-gradient(2px 2px at 40px 70px, #fff, rgba(0,0,0,0)),
                radial-gradient(1px 1px at 90px 40px, #fff, rgba(0,0,0,0)),
                radial-gradient(2px 2px at 160px 120px, #fff, rgba(0,0,0,0)),
                radial-gradient(1px 1px at 230px 80px, #fff, rgba(0,0,0,0)),
                radial-gradient(2px 2px at 300px 150px, #fff, rgba(0,0,0,0)),
                radial-gradient(1px 1px at 350px 200px, #fff, rgba(0,0,0,0)),
                radial-gradient(2px 2px at 400px 50px, #fff, rgba(0,0,0,0)),
                radial-gradient(1px 1px at 500px 180px, #fff, rgba(0,0,0,0)),
                radial-gradient(2px 2px at 600px 90px, #fff, rgba(0,0,0,0)),
                radial-gradient(1px 1px at 700px 140px, #fff, rgba(0,0,0,0)),
                radial-gradient(2px 2px at 800px 200px, #fff, rgba(0,0,0,0)),
                radial-gradient(1px 1px at 900px 60px, #fff, rgba(0,0,0,0)),
                radial-gradient(2px 2px at 1000px 130px, #fff, rgba(0,0,0,0));
            background-size: 200px 200px;
            background-repeat: repeat;
            opacity: 0.3;
            animation: twinkle 4s ease-in-out infinite alternate;
        `;
        this.element.appendChild(stars);
        
        const title = document.createElement('h1');
        title.textContent = 'HEROES OF ASTRA';
        title.style.cssText = `
            font-size: 72px;
            font-weight: 800;
            letter-spacing: 8px;
            color: #e8c84a;
            text-shadow: 
                0 0 20px #ffd700,
                0 0 40px #b8860b,
                2px 2px 4px #000;
            font-family: 'Georgia', 'Times New Roman', serif;
            text-transform: uppercase;
            margin-bottom: 60px;
            z-index: 10;
            position: relative;
        `;
        this.element.appendChild(title);
        
        const button = document.createElement('button');
        button.textContent = getText('SPLASH_START');
        button.style.cssText = `
            padding: 20px 60px;
            font-size: 28px;
            font-weight: bold;
            color: #e0d0b0;
            background: rgba(10, 15, 30, 0.8);
            border: 3px solid #c8a84a;
            border-radius: 50px;
            cursor: pointer;
            backdrop-filter: blur(5px);
            box-shadow: 0 0 30px rgba(200, 168, 74, 0.3);
            transition: all 0.3s ease;
            letter-spacing: 4px;
            z-index: 10;
            position: relative;
        `;
        
        button.addEventListener('mouseenter', () => {
            button.style.background = 'rgba(30, 25, 50, 0.9)';
            button.style.boxShadow = '0 0 50px rgba(200, 168, 74, 0.6)';
            button.style.transform = 'scale(1.05)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.background = 'rgba(10, 15, 30, 0.8)';
            button.style.boxShadow = '0 0 30px rgba(200, 168, 74, 0.3)';
            button.style.transform = 'scale(1)';
        });
        
        button.addEventListener('click', () => {
            this.destroy();
            this.onStart();
        });
        
        this.element.appendChild(button);
        
        const version = document.createElement('div');
        version.textContent = getText('VERSION');
        version.style.cssText = `
            position: absolute;
            bottom: 20px;
            left: 20px;
            font-size: 14px;
            color: rgba(255, 255, 255, 0.5);
            z-index: 10;
        `;
        this.element.appendChild(version);
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes twinkle {
                0% { opacity: 0.2; }
                100% { opacity: 0.4; }
            }
        `;
        this.element.appendChild(style);
        
        this.container.appendChild(this.element);
    }

    destroy() {
        if (this.element) {
            this.element.remove();
            this.element = null;
        }
    }
}

export default SplashScreen;
