const contentDiv = document.getElementById('content');

// Global State for Key Recognition
let isKeyRecognitionActive = false;
let keyRecognitionButton;
let statusMessage;

// Helper function to fade out old content, then insert new content
function switchContent(newHTML, afterInsertCallback) {
 contentDiv.classList.add('fade-out');

 setTimeout(() => {
  // Remove .active class from all navigation links
    document.querySelectorAll('.nav-links-center a').forEach(a => {
        a.classList.remove('active');
    });

    contentDiv.innerHTML = newHTML;
  contentDiv.classList.remove('fade-out');
  
  if (afterInsertCallback) afterInsertCallback();
 }, 500); // match fade-out duration
}

// Function to handle link clicks (including updating active state)
function handleNavLinkClick(event, contentFunction) {
    event.preventDefault(); // Stop page scroll
    
    // Call the specific content function
    contentFunction();

    // Set the active class on the clicked link
    const currentLink = event.currentTarget;
    
    setTimeout(() => {
        currentLink.classList.add('active');
    }, 450); 
}

// --- Reusable Typewriter Function ---
function typewriterEffect(element, text, speed) {
    let i = 0;
    element.textContent = ''; // Clear existing content
    element.classList.add('typing-cursor'); // Add cursor class
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else {
            // REMOVE the cursor class when typing is done
            element.classList.remove('typing-cursor');
        }
    }
    type();
}
// ----------------------------------------

// --- KEYBOARD GAME LOGIC ---
let keys;

// initKeyboardGame now only sets up the keys reference
function initKeyboardGame() {
    keys = document.querySelectorAll('.key');
}
                
// ----------------------------------------

// --- KEY RECOGNITION LOGIC (User Input) ---

function initKeyRecognition() {
    keyRecognitionButton = document.getElementById('try-this-button');
    statusMessage = document.getElementById('status-message');
    
    if(keyRecognitionButton) {
        keyRecognitionButton.addEventListener('click', toggleKeyRecognition);
    }
    
    updateStatusDisplay();
}

function updateStatusDisplay() {
    if (!keyRecognitionButton) return;
    keyRecognitionButton.textContent = isKeyRecognitionActive ? 'Stop Recognition' : 'Try This';
    statusMessage.textContent = isKeyRecognitionActive ? 'Key recognition is ON! Start typing.' : 'Key recognition is OFF';
    statusMessage.style.color = isKeyRecognitionActive ? '#00ffcc' : '#ff0000';
}

function toggleKeyRecognition() {
    isKeyRecognitionActive = !isKeyRecognitionActive;
    updateStatusDisplay();

    if (isKeyRecognitionActive) {
        document.addEventListener('keydown', handlePhysicalKeydown);
        document.addEventListener('keyup', handlePhysicalKeyup);
    } else {
        document.removeEventListener('keydown', handlePhysicalKeydown);
        document.removeEventListener('keyup', handlePhysicalKeyup);
        
        // Ensure all keys are unlit when stopping
        document.querySelectorAll('.key.user-lit').forEach(key => {
            key.classList.remove('user-lit');
        });
    }
}

function findTargetKey(keyCode) {
    let targetKey;
    // Map common keys to their data-key attributes
    switch (keyCode) {
        case ' ': targetKey = document.querySelector('[data-key="Space"]'); break;
        case 'Shift': targetKey = document.querySelector('.key-shift-l') || document.querySelector('.key-shift-r'); break; 
        case 'Control': targetKey = document.querySelector('.key-ctrl-l') || document.querySelector('.key-ctrl-r'); break;
        case 'Alt': targetKey = document.querySelector('.key-alt-l') || document.querySelector('.key-alt-r'); break;
        case 'Escape': targetKey = document.querySelector('[data-key="Esc"]'); break;
        case 'Backspace': targetKey = document.querySelector('[data-key="Backspace"]'); break;
        case 'Tab': targetKey = document.querySelector('[data-key="Tab"]'); break;
        case 'CapsLock': targetKey = document.querySelector('[data-key="Caps"]'); break;
        case 'Enter': targetKey = document.querySelector('[data-key="Enter"]'); break;
        case '/': targetKey = document.querySelector('[data-key="/"]'); break;
        case '\\': targetKey = document.querySelector('[data-key="\\"]'); break;
        default: targetKey = document.querySelector(`[data-key="${keyCode.toUpperCase()}"]`) || document.querySelector(`[data-key="${keyCode}"]`);
    }
    return targetKey;
}

function handlePhysicalKeydown(event) {
    if (!isKeyRecognitionActive) return;

    // Prevent default action for most keys to stop navigation (F5/F12 are exempt)
    if (event.key !== 'F5' && event.key !== 'F12') { 
        event.preventDefault(); 
    }
    
    const targetKey = findTargetKey(event.key);

    if (targetKey) {
        targetKey.classList.add('user-lit'); 
    }
}

function handlePhysicalKeyup(event) {
    if (!isKeyRecognitionActive) return;

    const targetKey = findTargetKey(event.key);

    if (targetKey) {
        targetKey.classList.remove('user-lit');
    }
}


const loadHomePage = () => {
  const homeHTML = `
    <div class="home-container">
      <a href="https://www.buymeacoffee.com/YOUR_USERNAME" target="_blank" class="static-coffee-wrapper">
        <div class="steam-container-above">
           <div class="steam-puff puff-1"></div>
           <div class="steam-puff puff-2"></div>
           <div class="steam-puff puff-3"></div>
        </div>
        <img src="./assets/coffee.png" alt="Pixel Art Coffee Cup" class="static-pixel-coffee-img">
      </a>
    </div>
  `;
  
  switchContent(homeHTML);
};


const loadAboutPage = () => {
  const text = "Hello! I'm Akash, a playful developer who loves building desktop apps, web apps, and creative projects.";
  
  // Wrapped H2 in a span to apply animation to just the title if needed,
  // but fade-in is applied to the typing element.
  switchContent(`<h2>About Me</h2><p id="typing"></p>`, () => {
    const typingElement = document.getElementById("typing"); 
    const titleElement = document.querySelector('#content h2');

    if (typingElement && titleElement) {
        // Apply fade-in to title immediately
        titleElement.classList.add('fade-in');
        
        // Typewriter effect on paragraph
        setTimeout(() => {
            typewriterEffect(typingElement, text, 50);
        }, 100); 
    }
  });
};

const loadProjectsPage = () => {
  const projectsHTML = `
    <h2>Projects</h2>
    <div class="card-container">
      <div class="glass-card" onclick="window.open('https://github.com/Akshzz-16/music_visualizer', '_blank')">
        <h3>🎶 Music Visualizer</h3>
        <p>A Python project turning audio into dynamic visual patterns.</p>
      </div>
      <div class="glass-card" onclick="window.open('https://tellusproject.onrender.com', '_blank')">
        <h3>🌐 Tell Us Website</h3>
        <p>A static website built and deployed for fast, accessible web content.</p>
      </div>
    </div>
  `;
  switchContent(projectsHTML, () => {
    const cards = document.querySelectorAll('.glass-card');
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('fade-in');
      }, index * 200); // staggered delay
    });
  });
};


// --- DOM Ready Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Initial Load: Load ABOUT page content instead of home
    loadAboutPage();
    document.getElementById('about').classList.add('active');


    // 2. Navigation Click Handlers
    document.getElementById('home').addEventListener('click', (event) => handleNavLinkClick(event, loadHomePage));
    document.getElementById('about').addEventListener('click', (event) => handleNavLinkClick(event, loadAboutPage));
    document.getElementById('projects').addEventListener('click', (event) => handleNavLinkClick(event, loadProjectsPage));


  // 3. Glitch Effect Handler
  const keyboardGif = document.querySelector('.nav-keyboard-gif');
  const targetElement = document.getElementById('main-body');

  if (keyboardGif && targetElement) {
    keyboardGif.addEventListener('click', () => {
      // Glitch also loads Home Page
      loadHomePage(); 
      
      document.querySelectorAll('.nav-links-center a').forEach(a => {
          a.classList.remove('active');
      });
      document.getElementById('home').classList.add('active');


      targetElement.classList.add('glitch-active');
      const glitchDuration = 400; 

      setTimeout(() => {
          targetElement.classList.remove('glitch-active');
      }, glitchDuration);
    });
  }
});