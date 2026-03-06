/**
 * GOLD MASTER - RADIANT SHIELD & ORGANIC RISING RAIN (Optimized)
 */
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('matrixCanvas');
    const ctx = canvas.getContext('2d');

    const katakana = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
    const letters = (katakana + "0123456789").split(""); // Pre-split for performance

    const goldPrimary = "#D4AF37"; 
    const goldHighlight = "#FCF6BA"; 
    const rainGold = ["#BF953F", "#FCF6BA", "#D4AF37", "#AA771C"];
    
    const wallFontSize = 22;   
    const rainFontSize = 14;   
    
    let columns = 0;
    let drops = [];
    let speeds = [];
    let animationPhase = 'blanket'; 
    let blanketY = 0; 
    let dissolveY = 0;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        columns = Math.floor(canvas.width / rainFontSize);
        const startY = canvas.height / rainFontSize;
        drops = new Array(columns).fill(0).map(() => startY + Math.random() * 60);
        speeds = new Array(columns).fill(0).map(() => 0.4 + Math.random() * 0.8);
        blanketY = 0;
        dissolveY = 0;
        animationPhase = 'blanket';
    }

    function draw() {
        ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (animationPhase === 'blanket') {
            ctx.font = `900 ${wallFontSize}px "Exo 2"`;
            ctx.textAlign = "center";
            const wallCols = Math.floor(canvas.width / wallFontSize);

            for (let i = 0; i < wallCols; i++) {
                const x = i * wallFontSize + wallFontSize / 2;
                for (let j = 0; j < Math.floor(blanketY); j++) {
                    const y = j * wallFontSize + wallFontSize;
                    const text = letters[Math.floor(Math.random() * letters.length)];
                    
                    // PERFORMANCE: Grouped operations
                    ctx.fillStyle = Math.random() > 0.5 ? goldHighlight : goldPrimary;
                    ctx.fillText(text, x, y);
                }
            }
            blanketY += 0.8; 
            if (blanketY * wallFontSize > canvas.height + 50) animationPhase = 'dissolve';

        } else if (animationPhase === 'dissolve') {
            ctx.font = `900 ${wallFontSize}px "Exo 2"`;
            ctx.textAlign = "center";
            const wallCols = Math.floor(canvas.width / wallFontSize);

            for (let i = 0; i < wallCols; i++) {
                const x = i * wallFontSize + wallFontSize / 2;
                for (let j = Math.floor(dissolveY); j < Math.floor(canvas.height / wallFontSize) + 1; j++) {
                    const y = j * wallFontSize + wallFontSize;
                    const text = letters[Math.floor(Math.random() * letters.length)];
                    ctx.fillStyle = Math.random() > 0.5 ? goldHighlight : goldPrimary;
                    ctx.fillText(text, x, y);
                }
            }
            dissolveY += 1.5;
            if (dissolveY * wallFontSize > canvas.height) animationPhase = 'rain';

        } else {
            ctx.font = `900 ${rainFontSize}px "Exo 2"`;
            ctx.textAlign = "left";
            
            for (let i = 0; i < drops.length; i++) {
                const text = letters[Math.floor(Math.random() * letters.length)];
                ctx.fillStyle = (Math.random() > 0.98) ? "#FFFFFF" : rainGold[Math.floor(Math.random() * rainGold.length)];
                
                const jitter = (Math.random() - 0.5) * 2;
                ctx.fillText(text, (i * rainFontSize) + jitter, drops[i] * rainFontSize);

                drops[i] -= speeds[i]; 
                if (drops[i] * rainFontSize < -50) {
                    drops[i] = (canvas.height / rainFontSize) + Math.random() * 15;
                    speeds[i] = 0.4 + Math.random() * 0.8;
                }
            }
        }
    }

    window.addEventListener('resize', resize);
    resize();
    // Using requestAnimationFrame for better battery life and sync
    function loop() {
        draw();
        setTimeout(() => requestAnimationFrame(loop), 50);
    }
    loop();
});