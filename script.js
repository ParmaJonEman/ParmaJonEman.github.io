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

// Rotation speed variable
let rotationSpeed = 0.001; // Initial rotation speed

// Define rotation speed limits
const MIN_SPEED = 0.001;
const MAX_SPEED = 0.5;
const SPEED_STEP = 0.005;

// Rotation direction variable
let rotationDirection = 0; // -1 for left, 1 for right

// Rotation speed acceleration
let targetRotationSpeed = rotationSpeed; // Desired rotation speed
const ACCELERATION = 0.0005; // Adjust for desired smoothness

// Event listener for keyboard controls
window.addEventListener('keydown', (event) => {
  switch (event.key.toLowerCase()) {
    case 'w':
      // Increase target rotation speed
      targetRotationSpeed += SPEED_STEP;
      targetRotationSpeed = Math.min(targetRotationSpeed, MAX_SPEED);
      break;
    case 's':
      // Decrease target rotation speed
      targetRotationSpeed -= SPEED_STEP;
      targetRotationSpeed = Math.max(targetRotationSpeed, MIN_SPEED);
      break;
    case 'a':
      // Rotate left
      rotationDirection = -1;
      break;
    case 'd':
      // Rotate right
      rotationDirection = 1;
      break;
    default:
      break;
  }
});

// Event listener to stop rotation when keys are released
window.addEventListener('keyup', (event) => {
  switch (event.key.toLowerCase()) {
    case 'a':
      if (rotationDirection === -1) rotationDirection = 0;
      break;
    case 'd':
      if (rotationDirection === 1) rotationDirection = 0;
      break;
    default:
      break;
  }
});



// Animation loop
const clock = new THREE.Clock();

const animate = () => {
  requestAnimationFrame(animate);

  const elapsed = clock.getElapsedTime();

  // Smoothly interpolate rotationSpeed towards targetRotationSpeed
  if (rotationSpeed < targetRotationSpeed) {
    rotationSpeed += ACCELERATION;
    rotationSpeed = Math.min(rotationSpeed, targetRotationSpeed);
  } else if (rotationSpeed > targetRotationSpeed) {
    rotationSpeed -= ACCELERATION;
    rotationSpeed = Math.max(rotationSpeed, targetRotationSpeed);
  }

  // Rotate particles based on rotationSpeed and rotationDirection
  particles.rotation.y += rotationSpeed * rotationDirection;
  particles.rotation.x += rotationSpeed * 0.4; // Slightly different speed for x-axis

  renderer.render(scene, camera);
};

animate();
