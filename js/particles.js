// ── LIGHTWEIGHT HIGH-PERFORMANCE CANVAS PARTICLES ──
class ParticleSystem {
  constructor() {
    this.canvas = document.getElementById('particle-canvas');
    if (!this.canvas) return;
    
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: null, y: null, radius: 150 };
    this.particleCount = 50; // Keep it low for high performance and elegance
    
    this.colors = [
      'rgba(30, 58, 138, 0.18)', // var(--gold) with opacity
      'rgba(59, 130, 246, 0.14)', // var(--gold-light) with opacity
      'rgba(15, 23, 42, 0.12)'   // var(--gold-dark) with opacity
    ];
    
    this.init();
    this.events();
    this.animate();
  }
  
  init() {
    this.resizeCanvas();
    this.particles = [];
    
    // Adjust particle count based on screen size
    if (window.innerWidth < 768) {
      this.particleCount = 20;
    } else {
      this.particleCount = 60;
    }
    
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push(this.createParticle());
    }
  }
  
  createParticle() {
    return {
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      radius: Math.random() * 2.5 + 0.5,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      color: this.colors[Math.floor(Math.random() * this.colors.length)],
      alpha: Math.random() * 0.5 + 0.2
    };
  }
  
  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
  
  events() {
    window.addEventListener('resize', () => {
      this.resizeCanvas();
      this.init();
    });
    
    // Track mouse movements to push particles
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
    
    window.addEventListener('mouseleave', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });
  }
  
  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.particles.forEach((p) => {
      // Move particle
      p.x += p.vx;
      p.y += p.vy;
      
      // Wrap around bounds
      if (p.x < 0) p.x = this.canvas.width;
      if (p.x > this.canvas.width) p.x = 0;
      if (p.y < 0) p.y = this.canvas.height;
      if (p.y > this.canvas.height) p.y = 0;
      
      // Mouse interaction (repel particles slightly)
      if (this.mouse.x !== null && this.mouse.y !== null) {
        const dx = p.x - this.mouse.x;
        const dy = p.y - this.mouse.y;
        const distanceSq = dx * dx + dy * dy;
        const radiusSq = this.mouse.radius * this.mouse.radius;
        
        if (distanceSq < radiusSq) {
          const distance = Math.sqrt(distanceSq);
          const force = (this.mouse.radius - distance) / this.mouse.radius;
          const angle = Math.atan2(dy, dx);
          // Gently push particle away
          p.x += Math.cos(angle) * force * 1.5;
          p.y += Math.sin(angle) * force * 1.5;
        }
      }
      
      // Draw particle
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.fill();
    });
    
    requestAnimationFrame(() => this.animate());
  }
}

// Instantiate particle background once DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  new ParticleSystem();
});
