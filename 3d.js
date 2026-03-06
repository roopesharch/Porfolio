/**
 * 3D MICRO SWARM - FULL SCREEN DARK MODE
 * Optimized for performance while maintaining 100% original physics and logic.
 */
document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('bgToggle');
    const matrixCanvas = document.getElementById('matrixCanvas');
    const scene3D = document.getElementById('scene3D');
    const toggleLabel = document.getElementById('toggleLabel');

    const swarmSettings = {
        count: 140,         
        baseSize: 7.0,      
        speedLimit: 15,     
        icon: '%'           
    };

    const spaceCanvas = document.createElement('canvas');
    // Optimization: alpha: false is significantly faster for full-screen fills
    const sCtx = spaceCanvas.getContext('2d', { alpha: false });
    scene3D.appendChild(spaceCanvas);

    let logos = [];
    let animationId;
    let w, h; // Cached dimensions

    class MicroMarble {
        constructor() {
            this.radius = Math.random() * 2 + swarmSettings.baseSize; 
            this.x = Math.random() * window.innerWidth;
            this.y = Math.random() * window.innerHeight;
            this.speedX = (Math.random() - 0.5) * swarmSettings.speedLimit;
            this.speedY = (Math.random() - 0.5) * swarmSettings.speedLimit;
            this.rot = Math.random() * 360;
            this.rotSpeed = (Math.random() - 0.5) * 10;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.rot += this.rotSpeed;

            // Bounce logic (Original functionality preserved)
            if (this.x < this.radius) {
                this.x = this.radius;
                this.speedX *= -1;
            } else if (this.x > w - this.radius) {
                this.x = w - this.radius;
                this.speedX *= -1;
            }

            if (this.y < this.radius) {
                this.y = this.radius;
                this.speedY *= -1;
            } else if (this.y > h - this.radius) {
                this.y = h - this.radius;
                this.speedY *= -1;
            }
        }

        draw() {
            sCtx.save();
            sCtx.translate(this.x, this.y);
            
            // Draw Chrome Shell
            const silverGrad = sCtx.createRadialGradient(-2, -2, 0, 0, 0, this.radius);
            silverGrad.addColorStop(0, '#FFFFFF'); 
            silverGrad.addColorStop(1, '#505050');
            
            sCtx.fillStyle = silverGrad;
            sCtx.beginPath();
            sCtx.arc(0, 0, this.radius, 0, Math.PI * 2);
            sCtx.fill();

            // '%' ICON
            sCtx.rotate((this.rot * Math.PI) / 180);
            sCtx.font = `900 ${this.radius * 1.3}px "Exo 2"`;
            sCtx.textAlign = 'center';
            sCtx.textBaseline = 'middle';
            sCtx.fillStyle = '#B38728';
            sCtx.fillText(swarmSettings.icon, 0, 0);
            sCtx.restore();
        }
    }

    function animate() {
        // Use cached width/height for physics to avoid layout thrashing
        sCtx.fillStyle = '#000000';
        sCtx.fillRect(0, 0, w, h);

        for (let i = 0; i < logos.length; i++) {
            const marble = logos[i];
            marble.update();

            // Collision Check (Original Logic)
            for (let j = i + 1; j < logos.length; j++) {
                const other = logos[j];
                const dx = marble.x - other.x;
                const dy = marble.y - other.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const minEdge = marble.radius + other.radius;

                if (dist < minEdge) {
                    // Simple Swap Physics (as per your original code)
                    let tempX = marble.speedX;
                    let tempY = marble.speedY;
                    marble.speedX = other.speedX;
                    marble.speedY = other.speedY;
                    other.speedX = tempX;
                    other.speedY = tempY;

                    // Prevent sticking
                    const overlap = (minEdge - dist) / 2;
                    const nx = dx / (dist || 1);
                    const ny = dy / (dist || 1);
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

    const setCanvasSize = () => {
        w = window.innerWidth;
        h = window.innerHeight;
        spaceCanvas.width = w;
        spaceCanvas.height = h;
    };

    toggleBtn.addEventListener('change', () => {
        if (toggleBtn.checked) {
            setCanvasSize();
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

    window.addEventListener('resize', setCanvasSize);
});