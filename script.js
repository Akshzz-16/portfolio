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

document.addEventListener('DOMContentLoaded', () => {
    loadAboutPage();
    document.getElementById('about').classList.add('active');

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


// --- Canvas Animation ---
let animationId;
function setupCanvas() {
    const canvas = document.querySelector('#canvas');
    const cleanBtn = document.querySelector('.clean-btn');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;

    // Define listeners as named functions for cleanup
    const resize = () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    };

    // User's Pointer Logic
    const pointer = {
        x: 0.66,
        y: 0.3,
        clicked: false,
    };

    // Timer (Disabled for blank canvas on load)
    const autoTimer = null;/* window.setTimeout(() => {
        pointer.x = 0.75;
        pointer.y = 0.5;
        pointer.clicked = true;
    }, 700); */

    // Interaction Handlers
    const updatePointer = (e) => {
        pointer.x = e.clientX / width;
        pointer.y = e.clientY / height;
        pointer.clicked = (e.buttons !== 0);
    };
    const onMouseDown = (e) => { pointer.clicked = true; updatePointer(e); };
    const onMouseUp = () => { pointer.clicked = false; };
    const onTouchStart = (e) => {
        pointer.clicked = true;
        pointer.x = e.touches[0].clientX / width;
        pointer.y = e.touches[0].clientY / height;
    };
    const onTouchEnd = () => { pointer.clicked = false; };
    const onClean = () => {
        flowers.length = 0;
        ctx.clearRect(0, 0, width, height);
    };

    // Attach Listeners
    window.addEventListener('resize', resize);
    resize();
    window.addEventListener('mousemove', updatePointer);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchstart', onTouchStart);
    window.addEventListener('touchend', onTouchEnd);
    if (cleanBtn) cleanBtn.addEventListener('click', onClean);

    // Flower System
    const flowers = [];
    const colors = ['#ea4335', '#fbbc05', '#34a853', '#4285f4', '#ff6d01', '#ff00ff'];

    class Flower {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.stemHeight = Math.random() * 50 + 30; // 30 to 80px stem
            this.maxPetalSize = Math.random() * 5 + 4;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.growth = 0;
            this.speed = Math.random() * 0.02 + 0.01;
        }

        update() {
            if (this.growth < 1) {
                this.growth += this.speed;
                if (this.growth > 1) this.growth = 1;
            }
        }

        draw(ctx) {
            const currentHeight = this.stemHeight * this.growth;
            const startY = this.y + this.stemHeight;
            const endY = startY - currentHeight;

            // Draw Stem
            ctx.beginPath();
            ctx.moveTo(this.x, startY);
            // Slight curve for realism
            ctx.quadraticCurveTo(this.x + Math.sin(this.y + currentHeight * 0.1) * 5, (startY + endY) / 2, this.x, endY);
            ctx.strokeStyle = '#34a853'; // Green stem
            ctx.lineWidth = 2;
            ctx.stroke();

            // Draw Petals if stem has grown enough
            if (this.growth > 0.5) {
                const petalGrowth = (this.growth - 0.5) * 2; // 0 to 1
                const size = this.maxPetalSize * petalGrowth;

                ctx.fillStyle = this.color;
                ctx.beginPath();
                for (let i = 0; i < 5; i++) {
                    const angle = (Math.PI * 2 / 5) * i;
                    const px = this.x + Math.cos(angle) * size;
                    const py = endY + Math.sin(angle) * size;
                    ctx.beginPath();
                    ctx.arc(px, py, size, 0, Math.PI * 2);
                    ctx.fill();
                }

                // Center
                ctx.fillStyle = '#fff';
                ctx.beginPath();
                ctx.arc(this.x, endY, size * 0.4, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    function animate() {
        // Create flowers if clicked (throttled logic here, but for now stick to simple frame check or just probability)
        if (pointer.clicked) {
            // Add randomness or spacing logic if needed
            // Random chance to not spawn every single frame to avoid clutter
            if (Math.random() > 0.5) {
                flowers.push(new Flower(pointer.x * width + (Math.random() - 0.5) * 20, pointer.y * height));
            }
        }

        // Clear and redraw all checks
        ctx.clearRect(0, 0, width, height);

        // Draw all flowers
        for (let i = 0; i < flowers.length; i++) {
            flowers[i].update();
            flowers[i].draw(ctx);
        }

        animationId = requestAnimationFrame(animate);
    }

    if (animationId) cancelAnimationFrame(animationId);
    animate();

    // Assign cleanup
    pageCleanup = () => {
        cancelAnimationFrame(animationId);
        clearTimeout(autoTimer);
        window.removeEventListener('resize', resize);
        window.removeEventListener('mousemove', updatePointer);
        window.removeEventListener('mousedown', onMouseDown);
        window.removeEventListener('mouseup', onMouseUp);
        window.removeEventListener('touchstart', onTouchStart);
        window.removeEventListener('touchend', onTouchEnd);
        if (cleanBtn) cleanBtn.removeEventListener('click', onClean);
    };
}
