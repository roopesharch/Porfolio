/* title.js */
document.addEventListener('DOMContentLoaded', () => {
    const titleElement = document.getElementById('shimmerTitle');
    const loadingScreen = document.getElementById('loadingScreen');
    const percentText = document.getElementById('percentText');
    const progressFill = document.getElementById('progressFill');
    const canvas = document.getElementById('matrixCanvas');
    
    const originalText = titleElement.innerText;
    const glitchChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/%=<>!&|^~?.";
    titleElement.innerText = '';

    let progress = 0;
    
    // 1. Loading Phase
    const loadInterval = setInterval(() => {
        progress += Math.floor(Math.random() * 4) + 1;
        if (progress >= 100) {
            progress = 100;
            clearInterval(loadInterval);
            finishLoading();
        }
        percentText.innerText = `${progress}%`;
        progressFill.style.width = `${progress}%`;
    }, 50);

    function finishLoading() {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            canvas.classList.add('visible');
            initDecipher();
        }, 800);
    }

    // 2. Decipher Phase (Avengers Style)
    function initDecipher() {
        const spans = [...originalText].map((char, index) => {
            const span = document.createElement('span');
            span.innerText = char === ' ' ? '\u00A0' : char;
            span.style.setProperty('--d', index + 1);
            titleElement.appendChild(span);
            return {
                el: span,
                final: char === ' ' ? '\u00A0' : char,
                isSpace: char === ' '
            };
        });

        spans.forEach((obj, i) => {
            if (obj.isSpace) {
                obj.el.classList.add('active');
                return;
            }

            let count = 0;
            const maxFlicker = 10 + (i * 1.5); // Slightly faster for mobile performance

            const flicker = setInterval(() => {
                obj.el.innerText = glitchChars[Math.floor(Math.random() * glitchChars.length)];
                obj.el.style.opacity = "1";
                
                if (count >= maxFlicker) {
                    clearInterval(flicker);
                    obj.el.innerText = obj.final;
                    obj.el.setAttribute('data-text', obj.final);
                    obj.el.classList.add('active');
                }
                count++;
            }, 45);
        });
    }
});