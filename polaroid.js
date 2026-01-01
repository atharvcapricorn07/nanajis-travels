const imageCount = 6; // Number of images to display
const container = document.createElement('div');
container.className = 'polaroid-grid';

for (let i = 1; i <= imageCount; i++) {
  const frame = document.createElement('div');
  frame.className = 'polaroid-frame';

  const img = document.createElement('img');
  img.src = `../../assets/images/${i}.jpg`; // Adjust path if needed
  img.alt = `Photo ${i}`;
  img.loading = 'lazy';

  frame.appendChild(img);
  container.appendChild(frame);
}

// Append to the canvas element
document.getElementById('polaroidCanvas')?.appendChild(container);
