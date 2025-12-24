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
function switchContent(newHTML, callback) {
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
            <a href="https://buymeacoffee.com/akashhh" target="_blank">
                <div class="steam-container-above">
                   <div class="steam-puff"></div><div class="steam-puff"></div><div class="steam-puff"></div>
                </div>
                <img src="./assets/coffee.png" class="static-pixel-coffee-img">
            </a>
        </div>`);
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