/**
 * GOLD MASTER - RADIANT SHIELD & ORGANIC RISING RAIN
 * Phase 1: Heavy randomized wall marching from TOP to BOTTOM.
 * Phase 2: Top-to-bottom wipe (erasure).
 * Phase 3: Continuous Rising Rain with individual speeds and horizontal jitter.
 */
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('matrixCanvas');
    const ctx = canvas.getContext('2d');

    const katakana = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
    const letters = katakana + "0123456789";

    const goldPrimary = "#D4AF37"; 
    const goldHighlight = "#FCF6BA"; 
    const rainGold = ["#BF953F", "#FCF6BA", "#D4AF37", "#AA771C"];
    
    const wallFontSize = 22;   
    const rainFontSize = 14;   
    
    let columns = 0;
    let drops = [];
    let speeds = []; // Added to track individual column speeds
    
    let animationPhase = 'blanket'; 
    let blanketY = 0; 
    let dissolveY = 0;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        columns = Math.floor(canvas.width / rainFontSize);
        
        const startY = canvas.height / rainFontSize;
        
        // Initialize drops and unique speeds for Phase 3
        drops = new Array(columns).fill(0).map(() => startY + Math.random() * 60);
        speeds = new Array(columns).fill(0).map(() => 0.4 + Math.random() * 0.8); // Individual speed per column
        
        blanketY = 0;
        dissolveY = 0;
        animationPhase = 'blanket';
    }

    function draw() {
        ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (animationPhase === 'blanket') {
            // --- PHASE 1: THE SHIELD (TOP TO BOTTOM) ---
            ctx.font = `900 ${wallFontSize}px "Exo 2"`;
            ctx.textAlign = "center";
            const wallCols = Math.floor(canvas.width / wallFontSize);

            for (let i = 0; i < wallCols; i++) {
                for (let j = 0; j < Math.floor(blanketY); j++) {
                    const x = i * wallFontSize + wallFontSize / 2;
                    const y = j * wallFontSize + wallFontSize;
                    const text = letters.charAt(Math.floor(Math.random() * letters.length));

                    ctx.strokeStyle = "rgba(0,0,0,0.15)";
                    ctx.lineWidth = 0.5;
                    ctx.strokeText(text, x, y);

                    ctx.fillStyle = Math.random() > 0.5 ? goldHighlight : goldPrimary;
                    ctx.fillText(text, x, y);
                }
            }
            blanketY += 0.8; 

            if (blanketY * wallFontSize > canvas.height + 50) {
                animationPhase = 'dissolve';
            }

        } else if (animationPhase === 'dissolve') {
            // --- PHASE 2: TOP-TO-BOTTOM WIPE ---
            ctx.font = `900 ${wallFontSize}px "Exo 2"`;
            ctx.textAlign = "center";
            const wallCols = Math.floor(canvas.width / wallFontSize);

            for (let i = 0; i < wallCols; i++) {
                for (let j = Math.floor(dissolveY); j < Math.floor(canvas.height / wallFontSize) + 1; j++) {
                    const x = i * wallFontSize + wallFontSize / 2;
                    const y = j * wallFontSize + wallFontSize;
                    const text = letters.charAt(Math.floor(Math.random() * letters.length));
                    ctx.fillStyle = Math.random() > 0.5 ? goldHighlight : goldPrimary;
                    ctx.fillText(text, x, y);
                }
            }
            dissolveY += 1.5;

            if (dissolveY * wallFontSize > canvas.height) {
                animationPhase = 'rain';
            }

        } else {
            // --- PHASE 3: ORGANIC RISING RAIN (RANDOMIZED) ---
            ctx.font = `900 ${rainFontSize}px "Exo 2"`;
            ctx.textAlign = "left";
            
            for (let i = 0; i < drops.length; i++) {
                const text = letters.charAt(Math.floor(Math.random() * letters.length));
                ctx.fillStyle = rainGold[Math.floor(Math.random() * rainGold.length)];
                
                if (Math.random() > 0.98) ctx.fillStyle = "#FFFFFF";

                // Added Horizontal Jitter: Random +/- 1px for a shimmering rising effect
                const jitter = (Math.random() - 0.5) * 2;
                ctx.fillText(text, (i * rainFontSize) + jitter, drops[i] * rainFontSize);

                // Movement using individual column speed
                drops[i] -= speeds[i]; 

                // Continuous Reset Logic
                if (drops[i] * rainFontSize < -50) {
                    drops[i] = (canvas.height / rainFontSize) + Math.random() * 15;
                    // Re-roll speed slightly for the new "drop" to keep it varied
                    speeds[i] = 0.4 + Math.random() * 0.8;
                }
            }
        }
    }

    window.addEventListener('resize', resize);
    resize();
    setInterval(draw, 50);
});