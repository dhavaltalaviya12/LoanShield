# LoanShield 3D Animated Landing Page

## 🎨 Features Implemented

### 3D Animations
- **Three.js 3D Background**: Fully interactive 3D particle system with 2000+ animated particles
- **Floating Geometric Shapes**: Multiple 3D shapes (torus, icosahedron, octahedron, tetrahedron, box) floating and rotating
- **Mouse-following Camera**: Camera smoothly follows mouse movement for interactive depth
- **Scroll-based Parallax**: 3D elements respond to page scroll
- **Color-coded Particles**: Green, blue, and purple particles with additive blending

### Visual Effects
- **Glassmorphism Design**: Modern frosted glass effect with backdrop blur
- **Gradient Text Animation**: Animated gradient flowing through hero title
- **Card Hover Effects**: 3D rotation and elevation on hover
- **Scroll Animations**: Elements fade and slide in as you scroll
- **Staggered Loading**: Cards animate in sequence for visual flow
- **Button Ripple Effect**: Interactive ripple animation on button hover
- **Icon Rotation**: Feature icons rotate 360° on card hover
- **Badge Glow**: Pulsing glow effect on section badges

### Responsive Design
- Fully responsive across all device sizes
- Touch-optimized for mobile devices
- Reduced motion support for accessibility
- Light/Dark mode with smooth transitions

## 🚀 How It Works

### Three.js Components

1. **Particle System** (`createParticles`)
   - 2000 particles distributed in 3D space
   - Multi-color system (green, blue, purple)
   - Continuous rotation animation

2. **Geometric Shapes** (`createFloatingShapes`)
   - Torus (ring) - green wireframe
   - Icosahedron (diamond) - blue wireframe
   - Octahedron - purple wireframe
   - Tetrahedron - orange wireframe
   - Box - pink wireframe
   - Each shape floats and rotates independently

3. **Interactive Camera**
   - Follows mouse movement with smooth interpolation
   - Creates depth perception
   - Responds to scroll position

4. **Lighting**
   - Ambient light for overall illumination
   - Point light (green) for primary lighting
   - Point light (blue) for accent lighting

### Animation System

- **Loading Animation**: Hero content fades in with scale effect
- **Scroll Triggers**: IntersectionObserver detects elements entering viewport
- **Parallax**: Background elements move at different speeds
- **Hover States**: Cards transform with 3D rotation
- **Navbar Effect**: Navbar becomes more opaque on scroll

## 🎯 Performance

- Efficient rendering with requestAnimationFrame
- Pixel ratio capped at 2x for performance
- Scene fog reduces distant rendering overhead
- Pause animation when tab is hidden
- Optimized particle count for smooth 60fps

## 🌐 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📁 Files Modified

1. **home.html** - Added Three.js library and canvas element
2. **three-animation.js** - Main 3D animation logic (NEW)
3. **style.css** - Added 3D canvas styles and animation effects
4. **app.js** - Added navbar scroll effect

## 🎮 User Interactions

- **Mouse Move**: Camera follows cursor creating parallax depth
- **Scroll**: Triggers element animations and parallax effects
- **Hover Cards**: 3D rotation and elevation effects
- **Button Click**: Ripple animation effect
- **Theme Toggle**: Adjusts 3D canvas opacity

## 🔧 Customization

### Adjust Particle Count
```javascript
const particleCount = 2000; // Line 48 in three-animation.js
```

### Change Colors
```javascript
// Line 66-74 in three-animation.js
if (colorChoice < 0.33) {
    color.setHex(0x10b981); // Green
}
```

### Modify Camera Follow Speed
```javascript
// Line 189 in three-animation.js
camera.position.x += (mouseX - camera.position.x) * 0.02; // Adjust 0.02
```

## 💡 Tips

- The animation automatically pauses when the browser tab is not visible
- Reduced motion preference is respected for accessibility
- Light mode reduces 3D canvas opacity for better readability
- Performance is optimized for 60fps on modern devices

---

**Created for LoanShield AI - Premium 3D Animated Landing Page**
