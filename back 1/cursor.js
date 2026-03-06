/**
 * REAL STARLIGHT CURSOR - ULTRA SHINING SILVER EDITION
 * Features: High-Mirror Chrome Silver Border, Uneven 6-Point Star, Lava Ash Flakes
 */

class StarPoint {
    constructor() {
        this.x = 0;
        this.y = 0;
    }

    draw(ctx) {
        ctx.save();
        
        // 1. SMALL DARK HALO (Deep contrast to make silver pop)
        const darkGradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, 15);
        darkGradient.addColorStop(0, 'rgba(5, 5, 10, 0.4)'); 
        darkGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = darkGradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 22, 0, Math.PI * 2);
        ctx.fill();

        // 2. THE ULTRA SHINING SILVER BORDER (Mirror Chrome Effect)
        ctx.beginPath();
        ctx.arc(this.x, this.y, 15, 0, Math.PI * 2);
        
        // Linear gradient with more white stops for a "Polished Chrome" shine
        const ultraSilver = ctx.createLinearGradient(this.x - 12, this.y - 12, this.x + 12, this.y + 12);
        ultraSilver.addColorStop(0, '#A0A0A0');   // Darker Steel
        ultraSilver.addColorStop(0.15, '#FFFFFF'); // INTENSE SHINE
        ultraSilver.addColorStop(0.3, '#D0D0D0');  // Silver
        ultraSilver.addColorStop(0.45, '#FFFFFF'); // DOUBLE SHINE
        ultraSilver.addColorStop(0.6, '#B0B0B0');  // Deep Metal
        ultraSilver.addColorStop(0.8, '#FFFFFF'); // TRIPLE SHINE
        ultraSilver.addColorStop(1, '#707070');    // Shadow edge
        
        ctx.strokeStyle = ultraSilver; 
        ctx.lineWidth = 2.4; // Slightly thicker for high-end look
        
        // Electric Silver Glow
        ctx.shadowBlur = 18;
        ctx.shadowColor = "rgba(255, 255, 255, 0.9)"; 
        
        ctx.stroke();

        // 3. UNEVEN 6-POINTED STAR CORE
        // This star uses different outer lengths for an "artistic/organic" uneven look
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#A67C00";
        
        const starGrad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, 6);
        starGrad.addColorStop(0, '#FFFFFF'); 
        starGrad.addColorStop(0.5, '#A67C00'); 
        starGrad.addColorStop(1, '#5C2A06'); 
        
        ctx.fillStyle = starGrad;
        ctx.beginPath();
        
        const points = 6;
        for (let i = 0; i < points * 2; i++) {
            let radius;
            if (i % 2 !== 0) {
                radius = 1.5; // Inner radius (The "valleys")
            } else {
                // UNEVEN LOGIC: Alternating lengths for the rays
                // rays at 0, 120, 240 degrees are longer; 60, 180, 300 are shorter
                radius = (i % 4 === 0) ? 7.5 : 5.5; 
            }
            
            const angle = (Math.PI * i) / points - (Math.PI / 2);
            ctx.lineTo(this.x + Math.cos(angle) * radius, this.y + Math.sin(angle) * radius);
        }
        
        ctx.closePath();
        ctx.fill();
        
        ctx.restore();
    }
}

// LAVA ASH FLAKES (Remains small and orange/brown)
class LavaFlake {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 1.2 + 0.4; 
        this.speedX = (Math.random() - 0.5) * 2;
        this.speedY = Math.random() * 2 + 1; 
        this.life = 1.0;
        this.decay = Math.random() * 0.02 + 0.01;
        const lavaColors = ["#FF4500", "#D2691E", "#8B4513", "#FF8C00", "#5C2A06"];
        this.color = lavaColors[Math.floor(Math.random() * lavaColors.length)];
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= this.decay;
        if (this.size > 0.1) this.size -= 0.02; 
    }
    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        if (this.color.startsWith("#F")) {
            ctx.shadowBlur = 4;
            ctx.shadowColor = this.color;
        }
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// FALLING STREAK
class FallingStreak {
    constructor(x, y, vx, vy) {
        this.x = x;
        this.y = y;
        this.vx = vx * 0.4;
        this.vy = vy * 0.4 + 2.5; 
        this.life = 1.0;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= 0.05; 
    }
    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.life;
        const lineGrad = ctx.createLinearGradient(this.x, this.y, this.x - this.vx * 3, this.y - this.vy * 3);
        lineGrad.addColorStop(0, '#FFFFFF'); 
        lineGrad.addColorStop(1, 'rgba(255, 255, 255, 0)'); 
        ctx.strokeStyle = lineGrad;
        ctx.lineWidth = 1.0; 
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x - this.vx * 3, this.y - this.vy * 3);
        ctx.stroke();
        ctx.restore();
    }
}

const initLavaCursor = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    document.body.appendChild(canvas);
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '10000';

    let mouseStar = new StarPoint();
    let streaks = [];
    let flakes = []; 
    let lastPos = {x: 0, y: 0};

    const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    window.addEventListener('mousemove', (e) => {
        mouseStar.x = e.clientX;
        mouseStar.y = e.clientY;
        const dx = e.clientX - lastPos.x;
        const dy = e.clientY - lastPos.y;
        if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
            streaks.push(new FallingStreak(e.clientX, e.clientY, dx, dy));
            for(let i=0; i<2; i++) {
                if (Math.random() > 0.4) { 
                    flakes.push(new LavaFlake(e.clientX, e.clientY));
                }
            }
        }
        lastPos.x = e.clientX;
        lastPos.y = e.clientY;
    });

    const render = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < streaks.length; i++) {
            streaks[i].update();
            streaks[i].draw(ctx);
            if (streaks[i].life <= 0) { streaks.splice(i, 1); i--; }
        }
        for (let i = 0; i < flakes.length; i++) {
            flakes[i].update();
            flakes[i].draw(ctx);
            if (flakes[i].life <= 0) { flakes.splice(i, 1); i--; }
        }
        mouseStar.draw(ctx);
        requestAnimationFrame(render);
    };
    render();
};

window.addEventListener('load', initLavaCursor);