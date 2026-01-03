const contentDiv = document.getElementById('content');

// --- Trigger Glitch ---
function triggerGlitch() {
    contentDiv.setAttribute('data-text', contentDiv.innerText);
    contentDiv.classList.add('glitch-active');
    setTimeout(() => {
        contentDiv.classList.remove('glitch-active');
        contentDiv.removeAttribute('data-text');
    }, 400);
}

// --- Content Switching ---
let pageCleanup = null;
function switchContent(newHTML, callback) {
    if (pageCleanup) {
        try { pageCleanup(); } catch (e) { console.error(e); }
        pageCleanup = null;
    }
    triggerGlitch();
    contentDiv.classList.add('fade-out');

    setTimeout(() => {
        contentDiv.innerHTML = newHTML;
        contentDiv.classList.remove('fade-out');
        contentDiv.classList.add('fade-in');
        
        if (callback) callback();
        
        setTimeout(() => contentDiv.classList.remove('fade-in'), 500);
    }, 400); 
}

function handleNavLinkClick(event, contentFunction) {
    event.preventDefault();
    document.querySelectorAll('.nav-links-center a').forEach(a => a.classList.remove('active'));
    event.currentTarget.classList.add('active');
    contentFunction();
}

function typewriterEffect(element, text, speed) {
    let i = 0;
    element.textContent = ''; 
    element.classList.add('typing-cursor'); 
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else {
            element.classList.remove('typing-cursor');
        }
    }
    type();
}

const loadHomePage = () => {
    switchContent(`
        <div class="home-container">
            <canvas id="canvas"></canvas>
            <div class="clean-btn"></div>
            <a href="https://buymeacoffee.com/akashhh" target="_blank" style="position: relative; z-index: 2;">
                <div class="steam-container-above">
                   <div class="steam-puff"></div><div class="steam-puff"></div><div class="steam-puff"></div>
                </div>
                <img src="./assets/coffee.png" class="static-pixel-coffee-img">
            </a>
        </div>`, () => setTimeout(setupCanvas, 0));
};

const loadAboutPage = () => {
    const text = "Hello! I'm Akash, a playful developer who loves building desktop apps, web apps, and creative projects.";
    switchContent(`
        <div class="about-container">
            <h2 class="section-title">About Me</h2>
            <p id="typing" class="about-text"></p>
        </div>`, () => {
        const el = document.getElementById("typing");
        if (el) typewriterEffect(el, text, 50);
    });
};

const loadProjectsPage = () => {
    switchContent(`
        <div class="projects-wrapper">
            <h2 class="section-title">Projects</h2>
            <div class="card-container">
                <div class="glass-card">
                    <h3>Music Visualizer</h3>
                    <p>Real-time audio visualization from your speaker.</p>
                    <a href="https://github.com/Akshzz-16/music_visualizer" target="_blank" class="project-btn">view on github</a>
                </div>
                <div class="glass-card">
                    <h3>Tell Us</h3>
                    <p>Minimalistic UI for a static website.</p>
                    <a href="https://tellusproject.onrender.com/" target="_blank" class="project-btn">visit live site</a>
                </div>
            </div>
        </div>`);
};

// --- Canvas Logic ---
function setupCanvas() {
    const canvas = document.querySelector('#canvas');
    const cleanBtn = document.querySelector('.clean-btn');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;

    const colors = [
        { petal: '#ff3366', glow: '#ff00ff' },
        { petal: '#ff9900', glow: '#ffcc00' },
        { petal: '#9933ff', glow: '#6600ff' }
    ];

    const resize = () => {
        const parent = canvas.parentElement;
        if (parent) {
            width = canvas.width = parent.offsetWidth;
            height = canvas.height = parent.offsetHeight;
        }
    };

    function drawFlower(x, y) {
        const style = colors[Math.floor(Math.random() * colors.length)];
        
        ctx.shadowBlur = 0;
        ctx.globalCompositeOperation = 'source-over';
        for(let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.moveTo(x + (Math.random()*10 - 5), height);
            ctx.bezierCurveTo(
                x + (Math.random()*60 - 30), height * 0.7,
                x + (Math.random()*40 - 20), y + 100,
                x, y
            );
            ctx.strokeStyle = `rgba(60, 100, 40, ${0.3 + (i*0.2)})`;
            ctx.lineWidth = 3 - i;
            ctx.stroke();
        }

        ctx.globalCompositeOperation = 'screen'; 
        const petalCount = 6 + Math.floor(Math.random() * 4);
        const flowerSize = 25 + Math.random() * 15;

        for (let i = 0; i < petalCount; i++) {
            const angle = (i * 2 * Math.PI) / petalCount;
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(angle);
            const grad = ctx.createRadialGradient(0, -flowerSize/2, 0, 0, -flowerSize/2, flowerSize);
            grad.addColorStop(0, style.petal + '99');
            grad.addColorStop(0.8, 'transparent');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.ellipse(0, -flowerSize/2, flowerSize/2, flowerSize, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        ctx.globalCompositeOperation = 'lighter';
        ctx.shadowBlur = 15;
        ctx.shadowColor = style.glow;
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    }

    const onInteract = (e) => {
        if (e.type === 'mousedown' || e.buttons !== 0) {
            const rect = canvas.getBoundingClientRect();
            drawFlower(e.clientX - rect.left, e.clientY - rect.top);
        }
    };

    window.addEventListener('resize', resize);
    resize();

    canvas.addEventListener('mousedown', onInteract);
    canvas.addEventListener('mousemove', onInteract);
    if (cleanBtn) cleanBtn.addEventListener('click', () => ctx.clearRect(0, 0, width, height));

    pageCleanup = () => {
        window.removeEventListener('resize', resize);
    };
}

document.addEventListener('DOMContentLoaded', () => {
    loadHomePage();
    document.getElementById('home').classList.add('active');

    document.getElementById('home').addEventListener('click', (e) => handleNavLinkClick(e, loadHomePage));
    document.getElementById('about').addEventListener('click', (e) => handleNavLinkClick(e, loadAboutPage));
    document.getElementById('projects').addEventListener('click', (e) => handleNavLinkClick(e, loadProjectsPage));

    const kb = document.querySelector('.nav-keyboard-gif');
    if (kb) {
        kb.addEventListener('click', () => {
            document.querySelectorAll('.nav-links-center a').forEach(a => a.classList.remove('active'));
            document.getElementById('home').classList.add('active');
            loadHomePage();
        });
    }
});