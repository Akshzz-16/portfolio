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
    let flowers = []; // Array to store growing flowers

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

    function createFlower(x, y) {
        flowers.push({
            targetX: x,
            targetY: y,
            currentHeight: 0, // Growth progress (0 to 1)
            bloomProgress: 0, // Petal progress (0 to 1)
            style: colors[Math.floor(Math.random() * colors.length)],
            stemControlX: x + (Math.random() * 60 - 30),
            groundX: x + (Math.random() * 40 - 20),
            petalCount: 6 + Math.floor(Math.random() * 3)
        });
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        flowers.forEach(f => {
            // 1. Grow Stem
            if (f.currentHeight < 1) f.currentHeight += 0.05; // Stem speed
            else if (f.bloomProgress < 1) f.bloomProgress += 0.06; // Bloom speed

            // Draw Stem using progress
            ctx.globalCompositeOperation = 'source-over';
            ctx.beginPath();
            ctx.moveTo(f.groundX, height);
            
            // Calculate current tip of the stem based on progress
            const currentY = height - (height - f.targetY) * f.currentHeight;
            ctx.bezierCurveTo(
                f.groundX, height - (height - currentY) * 0.5,
                f.stemControlX, currentY + 50,
                f.targetX, currentY
            );
            ctx.strokeStyle = 'rgba(60, 100, 40, 0.7)';
            ctx.lineWidth = 2;
            ctx.stroke();

            // 2. Draw Petals if stem is done
            if (f.currentHeight >= 0.9) {
                ctx.globalCompositeOperation = 'screen';
                const size = 30 * f.bloomProgress;
                
                for (let i = 0; i < f.petalCount; i++) {
                    const angle = (i * 2 * Math.PI) / f.petalCount;
                    ctx.save();
                    ctx.translate(f.targetX, f.targetY);
                    ctx.rotate(angle);
                    
                    const grad = ctx.createRadialGradient(0, -size/2, 0, 0, -size/2, size);
                    grad.addColorStop(0, f.style.petal + '99');
                    grad.addColorStop(1, 'transparent');
                    
                    ctx.fillStyle = grad;
                    ctx.beginPath();
                    ctx.ellipse(0, -size/2, size/2, size, 0, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                }

                // 3. Core Glow
                ctx.globalCompositeOperation = 'lighter';
                ctx.fillStyle = `rgba(255, 255, 255, ${f.bloomProgress})`;
                ctx.beginPath();
                ctx.arc(f.targetX, f.targetY, 4 * f.bloomProgress, 0, Math.PI * 2);
                ctx.fill();
            }
        });

        requestAnimationFrame(animate);
    }

    const onInteract = (e) => {
        if (e.type === 'mousedown' || (e.type === 'mousemove' && e.buttons !== 0)) {
            const rect = canvas.getBoundingClientRect();
            createFlower(e.clientX - rect.left, e.clientY - rect.top);
        }
    };

    window.addEventListener('resize', resize);
    resize();
    animate(); // Start loop

    canvas.addEventListener('mousedown', onInteract);
    canvas.addEventListener('mousemove', onInteract);
    if (cleanBtn) cleanBtn.addEventListener('click', () => flowers = []);

    pageCleanup = () => {
        window.removeEventListener('resize', resize);
        flowers = [];
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