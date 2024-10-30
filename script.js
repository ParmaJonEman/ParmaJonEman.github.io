

// Select the canvas
const canvas = document.getElementById('background');
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Create a new scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000); // Black background

// Set up a camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 50;

// Handle window resize
window.addEventListener('resize', () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});

// Create particle geometry
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 2000; // Adjust as needed for performance

// Create positions for particles
const positions = new Float32Array(particlesCount * 3);
for (let i = 0; i < particlesCount * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 200; // Spread particles in a 200x200x200 cube
}
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

// Create a material for particles
const particlesMaterial = new THREE.PointsMaterial({
  color: 0x00ffff, // Cyan color for visibility
  size: 1.0,
  transparent: true,
  opacity: 0.7,
  depthWrite: false, // Improve rendering performance
  blending: THREE.AdditiveBlending // Better visual effect
});

// Create the Points object
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

// Variables to track mouse state
let isMouseDown = false;
const mouse = {
  x: 0,
  y: 0
};

// Rotation speed variable
let rotationSpeed = 0.001; // Initial rotation speed

// Define rotation speed limits
const MIN_SPEED = 0.001;
const MAX_SPEED = 0.5;
const SPEED_STEP = 0.005;

// Event listeners to track mouse button state
window.addEventListener('mousedown', (event) => {
  if (event.button === 0) { // Left mouse button
    isMouseDown = true;
  }
});

window.addEventListener('mouseup', (event) => {
  if (event.button === 0) { // Left mouse button
    isMouseDown = false;
  }
});

// Event listener to track mouse movement
window.addEventListener('mousemove', (event) => {
  if (isMouseDown) { // Only update mouse position if left button is pressed
    // Normalize mouse coordinates between -1 and 1
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }
});

// Event listener for keyboard controls
window.addEventListener('keydown', (event) => {
  switch(event.key) {
    case 'ArrowUp':
      // Increase rotation speed
      rotationSpeed += SPEED_STEP;
      rotationSpeed = Math.min(rotationSpeed, MAX_SPEED);
      updateSpeedDisplay();
      break;
    case 'ArrowDown':
      // Decrease rotation speed
      rotationSpeed -= SPEED_STEP;
      rotationSpeed = Math.max(rotationSpeed, MIN_SPEED);
      updateSpeedDisplay();
      break;
    default:
      break;
  }
});

// Optional: Create a DOM element to display the current rotation speed
const speedDisplay = document.createElement('div');
speedDisplay.style.position = 'fixed';
speedDisplay.style.top = '20px';
speedDisplay.style.left = '20px';
speedDisplay.style.padding = '10px 15px';
speedDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
speedDisplay.style.color = '#00ffff';
speedDisplay.style.fontFamily = 'Arial, sans-serif';
speedDisplay.style.fontSize = '1em';
speedDisplay.style.borderRadius = '5px';
speedDisplay.style.zIndex = '10';
speedDisplay.innerHTML = `Rotation Speed: ${rotationSpeed.toFixed(3)}`;
document.body.appendChild(speedDisplay);

// Function to update the speed display
function updateSpeedDisplay() {
  speedDisplay.innerHTML = `Rotation Speed: ${rotationSpeed.toFixed(3)}`;
}

// Animation loop
const clock = new THREE.Clock();

const animate = () => {
  requestAnimationFrame(animate);

  const elapsed = clock.getElapsedTime();

  // Conditional camera movement based on mouse input
  if (isMouseDown) {
    // Calculate target positions based on mouse coordinates
    const targetX = mouse.x * 10; // Adjust the multiplier for desired effect
    const targetY = mouse.y * 10;

    // Optional: Clamp the target positions to prevent excessive camera movement
    const maxOffset = 20; // Maximum camera offset
    const clampedX = THREE.MathUtils.clamp(targetX, -maxOffset, maxOffset);
    const clampedY = THREE.MathUtils.clamp(targetY, -maxOffset, maxOffset);

    // Smoothly interpolate camera position towards target
    camera.position.x += (clampedX - camera.position.x) * 0.05;
    camera.position.y += (clampedY - camera.position.y) * 0.05;
    camera.lookAt(scene.position);
  } else {
    // Smoothly reset camera position when mouse is not pressed
    camera.position.x += (-camera.position.x) * 0.05;
    camera.position.y += (-camera.position.y) * 0.05;
    camera.lookAt(scene.position);
  }

  // Rotate particles based on rotationSpeed
  particles.rotation.y += rotationSpeed;
  particles.rotation.x += rotationSpeed * 0.4; // Slightly different speed for x-axis

  renderer.render(scene, camera);
};

animate();
