/**
 * 3D MICRO SWARM - FULL SCREEN DARK MODE
 * Changes: Bounces only off screen edges (ignores menu), icon is now '%'.
 */
document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('bgToggle');
    const matrixCanvas = document.getElementById('matrixCanvas');
    const scene3D = document.getElementById('scene3D');
    const toggleLabel = document.getElementById('toggleLabel');

    // --- GOLD MASTER PERFORMANCE CONFIG ---
    const swarmSettings = {
        count: 140,         // High density
        baseSize: 7.0,      // Visible size
        speedLimit: 15,     // Fast pace
        icon: '%'           // New Icon
    };

    const spaceCanvas = document.createElement('canvas');
    // PERFORMANCE: Disable alpha for faster black background rendering
    const sCtx = spaceCanvas.getContext('2d', { alpha: false });
    scene3D.appendChild(spaceCanvas);

    let logos = [];
    let animationId;

    class MicroMarble {
        constructor() {
            this.radius = Math.random() * 2 + swarmSettings.baseSize; 
            
            // Start anywhere on the screen (since they can go behind menu)
            this.x = Math.random() * window.innerWidth;
            this.y = Math.random() * window.innerHeight;
            
            this.speedX = (Math.random() - 0.5) * swarmSettings.speedLimit;
            this.speedY = (Math.random() - 0.5) * swarmSettings.speedLimit;
            
            this.rot = Math.random() * 360;
            this.rotSpeed = (Math.random() - 0.5) * 10;
        }

        update(w, h) {
            this.x += this.speedX;
            this.y += this.speedY;
            this.rot += this.rotSpeed;

            // --- FULL SCREEN EDGE BOUNCE ---
            // Left Wall
            if (this.x - this.radius <= 0) {
                this.x = this.radius;
                this.speedX = Math.abs(this.speedX);
            } 
            // Right Wall
            else if (this.x + this.radius >= w) {
                this.x = w - this.radius;
                this.speedX = -Math.abs(this.speedX);
            }

            // Top Wall
            if (this.y - this.radius <= 0) {
                this.y = this.radius;
                this.speedY = Math.abs(this.speedY);
            } 
            // Bottom Wall
            else if (this.y + this.radius >= h) {
                this.y = h - this.radius;
                this.speedY = -Math.abs(this.speedY);
            }
        }

        draw() {
            sCtx.save();
            sCtx.translate(this.x, this.y);
            
            // 1. SOFT GOLD GLOW (Radial Gradient is faster than shadows)
            const glow = sCtx.createRadialGradient(0, 0, 0, 0, 0, this.radius * 2);
            glow.addColorStop(0, 'rgba(212, 175, 55, 0.3)'); 
            glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
            sCtx.fillStyle = glow;
            sCtx.beginPath();
            sCtx.arc(0, 0, this.radius * 2, 0, Math.PI * 2);
            sCtx.fill();

            // 2. CHROME SILVER SHELL
            const silverGrad = sCtx.createRadialGradient(-this.radius/3, -this.radius/3, 0, 0, 0, this.radius);
            silverGrad.addColorStop(0, '#FFFFFF'); 
            silverGrad.addColorStop(1, '#505050');
            sCtx.fillStyle = silverGrad;
            sCtx.beginPath();
            sCtx.arc(0, 0, this.radius, 0, Math.PI * 2);
            sCtx.fill();

            // 3. '%' ICON
            sCtx.rotate((this.rot * Math.PI) / 180);
            sCtx.font = `900 ${this.radius * 1.3}px "Exo 2"`;
            sCtx.textAlign = 'center';
            sCtx.textBaseline = 'middle';
            sCtx.fillStyle = '#B38728'; // Deep Gold
            sCtx.fillText(swarmSettings.icon, 0, 0);
            
            sCtx.restore();
        }
    }

    function animate() {
        // Auto-detect screen size every frame for perfect responsiveness
        const w = document.documentElement.clientWidth || window.innerWidth;
        const h = window.innerHeight;

        // Solid Black Clear
        sCtx.fillStyle = '#000000';
        sCtx.fillRect(0, 0, spaceCanvas.width, spaceCanvas.height);
        
        // Motion Blur Trail
        sCtx.fillStyle = 'rgba(0, 0, 0, 0.35)';
        sCtx.fillRect(0, 0, spaceCanvas.width, spaceCanvas.height);

        for (let i = 0; i < logos.length; i++) {
            const marble = logos[i];
            marble.update(w, h);

            // Optimized Ball-to-Ball Physics
            for (let j = i + 1; j < logos.length; j++) {
                const other = logos[j];
                const dx = marble.x - other.x;
                const dy = marble.y - other.y;
                const distSq = dx * dx + dy * dy;
                const minEdge = marble.radius + other.radius;
                
                if (distSq < minEdge * minEdge) {
                    [marble.speedX, other.speedX] = [other.speedX, marble.speedX];
                    [marble.speedY, other.speedY] = [other.speedY, marble.speedY];
                    
                    const dist = Math.sqrt(distSq) || 1;
                    const overlap = (minEdge - dist) / 2;
                    const nx = dx / dist;
                    const ny = dy / dist;
                    marble.x += nx * overlap;
                    marble.y += ny * overlap;
                    other.x -= nx * overlap;
                    other.y -= ny * overlap;
                }
            }
            marble.draw();
        }
        animationId = requestAnimationFrame(animate);
    }

    toggleBtn.addEventListener('change', () => {
        if (toggleBtn.checked) {
            spaceCanvas.width = window.innerWidth;
            spaceCanvas.height = window.innerHeight;
            logos = Array.from({ length: swarmSettings.count }, () => new MicroMarble());
            
            matrixCanvas.style.opacity = '0';
            scene3D.style.display = 'flex';
            scene3D.style.background = '#000000';
            animate();
            setTimeout(() => scene3D.style.opacity = '1', 50);
            toggleLabel.innerText = "DARK MODE";
        } else {
            cancelAnimationFrame(animationId);
            scene3D.style.opacity = '0';
            setTimeout(() => {
                scene3D.style.display = 'none';
                matrixCanvas.style.opacity = '0.6';
            }, 600);
            toggleLabel.innerText = "MATRIX";
        }
    });

    window.addEventListener('resize', () => {
        spaceCanvas.width = window.innerWidth;
        spaceCanvas.height = window.innerHeight;
    });
});