document.addEventListener('DOMContentLoaded', () => {
    const titleElement = document.getElementById('shimmerTitle');
    const loadingScreen = document.getElementById('loadingScreen');
    const percentText = document.getElementById('percentText');
    const circularFill = document.getElementById('circularFill');
    const sideMenu = document.getElementById('sideMenu');
    const menuItems = document.querySelectorAll('.menu-item');
    const scrollHint = document.getElementById('scrollHint');
    const canvas = document.getElementById('matrixCanvas');
    
    const nextText = document.getElementById('projectTextData').innerText;
    
    const glitchChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/%=<>!&|^~?.";

    let progress = 0;
    const loadInterval = setInterval(() => {
        progress += Math.floor(Math.random() * 5) + 2; 
        if (progress >= 100) {
            progress = 100;
            clearInterval(loadInterval);
            setTimeout(finishLoading, 300);
        }
        percentText.innerText = `${progress}%`;
        circularFill.style.background = `conic-gradient(#BF953F 0%, #FCF6BA ${progress/2}%, #D4AF37 ${progress}%, transparent 0%)`;
    }, 30);

    function finishLoading() {
        loadingScreen.style.transform = "translateY(-100%)";
        loadingScreen.style.opacity = "0";
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            canvas.classList.add('visible');
            renderText("W E L C O M E", true); 
        }, 500);
    }

    function renderText(text, triggerMenu = false) {
        titleElement.innerHTML = '';
        const chars = [...text];
        
        chars.forEach((char, i) => {
            const span = document.createElement('span');
            span.innerText = char === ' ' ? '\u00A0' : char;
            span.style.setProperty('--d', i);
            titleElement.appendChild(span);

            if (char !== ' ') {
                let count = 0;
                const flicker = setInterval(() => {
                    span.innerText = glitchChars[Math.floor(Math.random() * glitchChars.length)];
                    span.style.opacity = "1";
                    if (count >= 10 + i) {
                        clearInterval(flicker);
                        span.innerText = char;
                        span.classList.add('active');
                        if (i === chars.length - 1 && triggerMenu) {
                            setTimeout(openMenu, 500);
                        }
                    }
                    count++;
                }, 30);
            } else {
                span.style.opacity = "1";
            }
        });
    }

    function openMenu() {
        sideMenu.classList.add('open');
        document.body.classList.add('menu-active');
        menuItems.forEach((item, idx) => {
            setTimeout(() => {
                item.style.opacity = "1";
                item.style.transform = "translateX(0)";
            }, idx * 60);
        });

        setTimeout(eraseAndSwap, 1000);
    }

    function eraseAndSwap() {
        const spans = titleElement.querySelectorAll('span');
        spans.forEach((span, i) => {
            setTimeout(() => {
                span.style.transition = "all 0.4s ease";
                span.style.opacity = "0";
                span.style.transform = "scale(0.6)";
                span.style.filter = "blur(8px)";
            }, i * 20);
        });

        setTimeout(() => {
            renderText(nextText, false);
            setTimeout(() => {
                scrollHint.classList.add('visible');
            }, 800);
        }, (spans.length * 20) + 300);
    }
});