// Three.js 3D Animation for LoanShield Landing Page

let scene, camera, renderer, particles, geometryShapes;
let mouseX = 0, mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

function initThreeJS() {
    const canvas = document.getElementById('three-canvas');
    if (!canvas) return;

    // Scene setup
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0f172a, 1, 1000);

    // Camera setup
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        1,
        1000
    );
    camera.position.z = 400;

    // Renderer setup
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Create particle system
    createParticles();

    // Create floating 3D shapes
    createFloatingShapes();

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x10b981, 1, 1000);
    pointLight.position.set(0, 0, 400);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0x38bdf8, 0.8, 1000);
    pointLight2.position.set(-200, -200, 200);
    scene.add(pointLight2);

    // Event listeners
    document.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', onWindowResize);

    // Start animation
    animate();
}

function createParticles() {
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const colors = [];

    const particleCount = 2000;

    for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * 2000 - 1000;
        const y = Math.random() * 2000 - 1000;
        const z = Math.random() * 2000 - 1000;

        vertices.push(x, y, z);

        // Color variation between primary colors
        const color = new THREE.Color();
        const colorChoice = Math.random();

        if (colorChoice < 0.33) {
            color.setHex(0x10b981); // Green
        } else if (colorChoice < 0.66) {
            color.setHex(0x38bdf8); // Blue
        } else {
            color.setHex(0x8b5cf6); // Purple
        }

        colors.push(color.r, color.g, color.b);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 5,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);
}

function createFloatingShapes() {
    geometryShapes = [];

    // Torus (Ring shape)
    const torusGeometry = new THREE.TorusGeometry(60, 15, 16, 100);
    const torusMaterial = new THREE.MeshPhongMaterial({
        color: 0x10b981,
        transparent: true,
        opacity: 0.6,
        wireframe: true
    });
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);
    torus.position.set(-250, 150, -100);
    scene.add(torus);
    geometryShapes.push({ mesh: torus, speed: 0.005, axis: 'xy' });

    // Icosahedron (Diamond shape)
    const icosaGeometry = new THREE.IcosahedronGeometry(50, 0);
    const icosaMaterial = new THREE.MeshPhongMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.5,
        wireframe: true
    });
    const icosahedron = new THREE.Mesh(icosaGeometry, icosaMaterial);
    icosahedron.position.set(300, -200, -50);
    scene.add(icosahedron);
    geometryShapes.push({ mesh: icosahedron, speed: 0.008, axis: 'xyz' });

    // Octahedron
    const octaGeometry = new THREE.OctahedronGeometry(40, 0);
    const octaMaterial = new THREE.MeshPhongMaterial({
        color: 0x8b5cf6,
        transparent: true,
        opacity: 0.4,
        wireframe: true
    });
    const octahedron = new THREE.Mesh(octaGeometry, octaMaterial);
    octahedron.position.set(200, 250, -150);
    scene.add(octahedron);
    geometryShapes.push({ mesh: octahedron, speed: 0.006, axis: 'xz' });

    // Tetrahedron
    const tetraGeometry = new THREE.TetrahedronGeometry(45, 0);
    const tetraMaterial = new THREE.MeshPhongMaterial({
        color: 0xf59e0b,
        transparent: true,
        opacity: 0.5,
        wireframe: true
    });
    const tetrahedron = new THREE.Mesh(tetraGeometry, tetraMaterial);
    tetrahedron.position.set(-300, -150, 0);
    scene.add(tetrahedron);
    geometryShapes.push({ mesh: tetrahedron, speed: 0.007, axis: 'yz' });

    // Box with edges
    const boxGeometry = new THREE.BoxGeometry(70, 70, 70);
    const boxMaterial = new THREE.MeshPhongMaterial({
        color: 0xec4899,
        transparent: true,
        opacity: 0.3,
        wireframe: true
    });
    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    box.position.set(100, -100, -200);
    scene.add(box);
    geometryShapes.push({ mesh: box, speed: 0.004, axis: 'xyz' });
}

function onMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) * 0.5;
    mouseY = (event.clientY - windowHalfY) * 0.5;
}

function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);

    // Rotate particle system
    if (particles) {
        particles.rotation.x += 0.0002;
        particles.rotation.y += 0.0003;
    }

    // Animate geometric shapes
    geometryShapes.forEach(shape => {
        const { mesh, speed, axis } = shape;

        if (axis.includes('x')) mesh.rotation.x += speed;
        if (axis.includes('y')) mesh.rotation.y += speed;
        if (axis.includes('z')) mesh.rotation.z += speed;

        // Floating animation
        mesh.position.y += Math.sin(Date.now() * 0.001 + mesh.position.x) * 0.05;
    });

    // Camera follows mouse with smooth interpolation
    camera.position.x += (mouseX - camera.position.x) * 0.02;
    camera.position.y += (-mouseY - camera.position.y) * 0.02;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
}

// Enhanced scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe all animatable elements
    document.querySelectorAll('.feature-card, .stat-item, .glass-card').forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
}

// Parallax effect on scroll
function initParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;

        if (particles) {
            particles.rotation.z = scrolled * 0.0001;
        }

        geometryShapes.forEach((shape, index) => {
            const speed = 0.1 + (index * 0.05);
            shape.mesh.position.y = shape.mesh.position.y + (scrolled * 0.0001 * speed);
        });
    });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initThreeJS();
    initScrollAnimations();
    initParallax();

    // Add loading effect
    setTimeout(() => {
        document.querySelector('.hero-content')?.classList.add('loaded');
    }, 500);
});

// Handle page visibility change (pause animation when tab is hidden)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations if needed
    } else {
        // Resume animations
        if (renderer) animate();
    }
});
