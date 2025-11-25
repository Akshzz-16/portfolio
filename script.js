const contentDiv = document.getElementById('content');

document.getElementById('home').addEventListener('click', () => {
  contentDiv.classList.add('fade-out');
  setTimeout(() => {
    contentDiv.innerHTML = "";
    contentDiv.classList.remove('fade-out');
  }, 500);
});

document.getElementById('about').addEventListener('click', () => {
  const text = "Hello! I'm Akash, a playful developer who loves building web apps, desktop apps and creative projects.";
  contentDiv.innerHTML = `<h2>About Me</h2><p id="typing"></p>`;
  
  let i = 0;
  function typeWriter() {
    if (i < text.length) {
      document.getElementById("typing").innerHTML += text.charAt(i);
      i++;
      setTimeout(typeWriter, 50);
    }
  }
  typeWriter();
});

document.getElementById('projects').addEventListener('click', () => {
  contentDiv.innerHTML = `
    <h2>Projects</h2>
    <div class="card-container">
      <div class="glass-card" onclick="window.open('https://github.com/yourusername/music-visualizer', '_blank')">
        <h3>🎶 Music Visualizer</h3>
        <p>A Python project turning audio into dynamic visual patterns.</p>
      </div>
      <div class="glass-card" onclick="window.open('https://yourwebsiteurl.com/tellus', '_blank')">
        <h3>🌐 Tell Us Website</h3>
        <p>A static website built and deployed for fast, accessible web content.</p>
      </div>
    </div>
  `;
});