const contentDiv = document.getElementById('content');

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

    // Set the active class on the clicked link (for the red underline)
    const currentLink = event.currentTarget; // The 'a' tag
    
    // The active class is removed inside switchContent, so we apply it after the timeout.
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


// --- Content Functions ---

const loadHomePage = () => {
    const homeHTML = ``;
    switchContent(homeHTML);
};

const loadAboutPage = () => {
  const text = "Hello! I'm Akash, a playful developer who loves building desktop apps, web apps, and creative projects.";
  
  // Insert the content with the placeholder for the typing element
  switchContent(`<h2>About Me</h2><p id="typing"></p>`, () => {
    const typingElement = document.getElementById("typing"); 
    if (typingElement) {
        // NEW: Apply the fade-in class to the element
        typingElement.classList.add('fade-in'); 
        
        // Start typing after a small delay (100ms) to ensure the fade animation begins first
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
    // 1. Initial Load: Load the ABOUT page content and set the active class
    loadAboutPage();
    document.getElementById('about').classList.add('active');


    // 2. Navigation Click Handlers (using the new unified handler)
    document.getElementById('home').addEventListener('click', (event) => handleNavLinkClick(event, loadHomePage));
    document.getElementById('about').addEventListener('click', (event) => handleNavLinkClick(event, loadAboutPage));
    document.getElementById('projects').addEventListener('click', (event) => handleNavLinkClick(event, loadProjectsPage));


    // 3. Glitch Effect Handler (for keyboard GIF)
    const keyboardGif = document.querySelector('.nav-keyboard-gif');
    const targetElement = document.getElementById('main-body');

    if (keyboardGif && targetElement) {
        keyboardGif.addEventListener('click', () => {
            // 1. Load the Home Page content
            loadHomePage(); 
            
            // 2. Update the active link visual
            document.querySelectorAll('.nav-links-center a').forEach(a => {
                a.classList.remove('active');
            });
            document.getElementById('home').classList.add('active');


            // 3. Apply the glitch effect
            targetElement.classList.add('glitch-active');
            const glitchDuration = 400; 

            setTimeout(() => {
                targetElement.classList.remove('glitch-active');
            }, glitchDuration);
        });
    }

    // 4. Typing Effect for GitHub and LinkedIn has been removed.
});