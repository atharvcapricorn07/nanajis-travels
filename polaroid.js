// Configuration
const imageCount = 6; 
const container = document.createElement('div');
container.className = 'polaroid-grid';

// Create the polaroid frames dynamically
for (let i = 1; i <= imageCount; i++) {
  const frame = document.createElement('div');
  frame.className = 'polaroid-frame';

  // Add a random rotation for the "scattered" look
  const randomRotation = Math.floor(Math.random() * 10) - 5; 
  frame.style.transform = `rotate(${randomRotation}deg)`;

  const img = document.createElement('img');
  
  // Since images are in the root of the 'public' folder, 
  // we just use the filename.
  img.src = `${i}.jpg`; 
  
  img.alt = `Nanaji's Travel Photo ${i}`;
  img.loading = 'lazy';

  // Error handling: Logic fixed to show the ACTUAL path it tried to load
  img.onerror = () => {
    console.error(`Failed to load image: ${img.src}`);
    frame.style.display = 'none'; 
  };

  const caption = document.createElement('p');
  caption.className = 'polaroid-caption';
  caption.innerText = `Memory #${i}`;

  frame.appendChild(img);
  frame.appendChild(caption);
  container.appendChild(frame);
}

// Append the grid to the existing div in learnmore.html
const target = document.getElementById('polaroidCanvas');
if (target) {
  target.appendChild(container);
} else {
  console.warn("Could not find element with id 'polaroidCanvas'");
}