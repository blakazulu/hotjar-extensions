// ===== GLOBAL SHIELD DEFENSE GAME =====
// Optimized PixiJS v8 implementation with ParticleContainer, sprite-based rendering, and performance enhancements

// ===== TEXTURE GENERATION FUNCTIONS =====
// Generate textures once and reuse them for all instances

function generateParticleTexture(size, color) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = size * 2;
  canvas.height = size * 2;

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(size, size, size, 0, Math.PI * 2);
  ctx.fill();

  return PIXI.Texture.from(canvas);
}

function generateThreatTexture(size) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const canvasSize = size * 6;
  canvas.width = canvasSize;
  canvas.height = canvasSize;

  const centerX = canvasSize / 2;
  const centerY = canvasSize / 2;

  // Draw triangle
  ctx.strokeStyle = '#ff0000';
  ctx.lineWidth = 2.5;
  ctx.fillStyle = 'rgba(239, 68, 68, 0.8)';
  ctx.beginPath();
  ctx.moveTo(centerX + Math.cos(0) * size, centerY + Math.sin(0) * size);
  ctx.lineTo(centerX + Math.cos(2.094) * size, centerY + Math.sin(2.094) * size);
  ctx.lineTo(centerX + Math.cos(4.188) * size, centerY + Math.sin(4.188) * size);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  return PIXI.Texture.from(canvas);
}

function generateStarTexture(points, outerRadius, innerRadius, color) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const size = outerRadius * 3;
  canvas.width = size;
  canvas.height = size;

  const centerX = size / 2;
  const centerY = size / 2;
  const step = Math.PI / points;

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(centerX + Math.cos(0) * outerRadius, centerY + Math.sin(0) * outerRadius);

  for (let i = 1; i <= points * 2; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = step * i;
    ctx.lineTo(centerX + Math.cos(angle) * radius, centerY + Math.sin(angle) * radius);
  }

  ctx.closePath();
  ctx.fill();

  return PIXI.Texture.from(canvas);
}

// ===== ASYNC APPLICATION INITIALIZATION (v8 PATTERN) =====
async function initGame() {
  try {
    // Create application instance
    const gameApp = new PIXI.Application();

    // Initialize with async pattern (v8 requirement)
    await gameApp.init({
      canvas: document.getElementById('gameCanvas'),
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundAlpha: 0,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    });

    console.log('PixiJS Application initialized successfully');

    // ===== TEXTURE CACHE =====
    const textures = {
      particleOrange: generateParticleTexture(2.5, '#f97316'),
      particleRed: generateParticleTexture(2.5, '#ef4444'),
      threat: generateThreatTexture(10),
      explosionStar: generateStarTexture(4, 8, 4, '#10b981'),
      greenStar: generateStarTexture(6, 15, 6, '#10b981'),
    };

    console.log('Textures generated successfully');

    // ===== SCORE SYSTEM =====
    let globalScore = 0;
    const scoreValueEl = document.getElementById('scoreValue');

    function updateScore(points = 1) {
      globalScore += points;
      scoreValueEl.textContent = globalScore;

      // Animate score increase
      const scoreDisplay = document.getElementById('scoreDisplay');
      scoreDisplay.style.transform = 'scale(1.15)';
      setTimeout(() => {
        scoreDisplay.style.transform = 'scale(1)';
      }, 150);
    }

    // ===== BACKGROUND PARTICLE NETWORK WITH PARTICLECONTAINER =====
    const particleCount = 120;

    // Create ParticleContainer for massive performance boost (150 draw calls → 1 draw call)
    const particleContainer = new PIXI.ParticleContainer(particleCount, {
      position: true,
      rotation: false,
      tint: true,
      alpha: true,
      scale: true,
    });
    gameApp.stage.addChild(particleContainer);

    // Particle data arrays for efficient updates
    const particleData = [];

    // Create sprites in ParticleContainer
    for (let i = 0; i < particleCount; i++) {
      const isOrange = Math.random() > 0.5;
      const sprite = new PIXI.Sprite(isOrange ? textures.particleOrange : textures.particleRed);

      sprite.anchor.set(0.5);
      sprite.x = Math.random() * gameApp.screen.width;
      sprite.y = Math.random() * gameApp.screen.height;

      const size = Math.random() * 2.5 + 0.8;
      sprite.scale.set(size / 2.5);
      sprite.alpha = Math.random() * 0.4 + 0.15;
      sprite.tint = isOrange ? 0xf97316 : 0xef4444;

      particleContainer.addParticle(sprite);

      // Store particle behavior data
      particleData.push({
        sprite: sprite,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: (Math.random() - 0.5) * 0.4,
        originalAlpha: sprite.alpha,
      });
    }

    console.log(`Created ${particleCount} background particles`);

    // Connection lines between nearby particles
    const connectionsGraphics = new PIXI.Graphics();
    gameApp.stage.addChild(connectionsGraphics);

    // ===== SHIELD SYSTEM =====
    const shieldGraphics = new PIXI.Graphics();
    gameApp.stage.addChild(shieldGraphics);

    let shieldX = gameApp.screen.width / 2;
    let shieldY = gameApp.screen.height / 2;
    let targetShieldX = shieldX;
    let targetShieldY = shieldY;
    let shieldPulse = 0;

    // Track mouse globally
    document.addEventListener('mousemove', (e) => {
      targetShieldX = e.clientX;
      targetShieldY = e.clientY;
    });

    // Shield trail effect
    const trailPoints = [];
    const maxTrailPoints = 20;

    // ===== THREAT SYSTEM (SPRITE-BASED) =====
    const threats = [];
    const maxThreats = 30;

    class Threat {
      constructor() {
        this.sprite = new PIXI.Sprite(textures.threat);
        this.sprite.anchor.set(0.5);
        this.explosionGraphics = new PIXI.Graphics();
        this.reset();
        gameApp.stage.addChild(this.sprite);
        gameApp.stage.addChild(this.explosionGraphics);
      }

      reset() {
        // Spawn from random edge
        const side = Math.floor(Math.random() * 4);
        const margin = 80;

        switch(side) {
          case 0: // Top
            this.x = Math.random() * gameApp.screen.width;
            this.y = -margin;
            break;
          case 1: // Right
            this.x = gameApp.screen.width + margin;
            this.y = Math.random() * gameApp.screen.height;
            break;
          case 2: // Bottom
            this.x = Math.random() * gameApp.screen.width;
            this.y = gameApp.screen.height + margin;
            break;
          case 3: // Left
            this.x = -margin;
            this.y = Math.random() * gameApp.screen.height;
            break;
        }

        // Move toward center of screen
        const centerX = gameApp.screen.width / 2;
        const centerY = gameApp.screen.height / 2;
        const angle = Math.atan2(centerY - this.y, centerX - this.x);

        const speed = Math.random() * 1.2 + 1.8;
        this.speedX = Math.cos(angle) * speed;
        this.speedY = Math.sin(angle) * speed;

        this.size = Math.random() * 4 + 6;
        this.blocked = false;
        this.blockTime = 0;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.12;
        this.wobble = Math.random() * Math.PI * 2;

        this.sprite.visible = true;
        this.sprite.scale.set(this.size / 10);
        this.explosionGraphics.clear();
      }

      update(shieldX, shieldY, deltaTime) {
        if (this.blocked) {
          // Explosion animation
          this.blockTime += deltaTime;
          this.size *= Math.pow(0.90, deltaTime);
          this.opacity = Math.max(0, 1 - this.blockTime / 30);
          this.rotation += this.rotationSpeed * 4 * deltaTime;

          // Update explosion graphics with v8 API
          this.explosionGraphics.clear();
          this.explosionGraphics.circle(this.x, this.y, this.size * 2.5);
          this.explosionGraphics.fill({ color: 0x10b981, alpha: this.opacity * 0.9 });

          this.explosionGraphics.circle(this.x, this.y, this.size * 3);
          this.explosionGraphics.stroke({ width: 2, color: 0x34d399, alpha: this.opacity * 0.6 });

          if (this.blockTime > 30) {
            this.reset();
          }
        } else {
          // Movement with delta time normalization
          this.x += this.speedX * deltaTime;
          this.y += this.speedY * deltaTime;
          this.rotation += this.rotationSpeed * deltaTime;
          this.wobble += 0.05 * deltaTime;

          // Update sprite
          this.sprite.x = this.x;
          this.sprite.y = this.y;
          this.sprite.rotation = this.rotation;

          const wobbleScale = 1 + Math.sin(this.wobble) * 0.2;
          this.sprite.scale.set((this.size / 10) * wobbleScale);

          // Check collision with shield
          const dx = this.x - shieldX;
          const dy = this.y - shieldY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 90) {
            this.blocked = true;
            this.sprite.visible = false;
            updateScore(1);
            createExplosion(this.x, this.y);
          }

          // Reset if too far from center
          const distFromCenter = Math.sqrt(
            (this.x - gameApp.screen.width / 2) ** 2 +
            (this.y - gameApp.screen.height / 2) ** 2
          );

          if (distFromCenter > Math.max(gameApp.screen.width, gameApp.screen.height) * 1.2) {
            this.reset();
          }
        }
      }

      destroy() {
        if (this.sprite) {
          this.sprite.destroy();
        }
        if (this.explosionGraphics) {
          this.explosionGraphics.destroy();
        }
      }
    }

    // Create all threats
    for (let i = 0; i < maxThreats; i++) {
      threats.push(new Threat());
    }

    console.log(`Created ${maxThreats} threat objects`);

    // ===== EXPLOSION PARTICLE SYSTEM =====
    const explosionParticles = [];

    function createExplosion(x, y) {
      const particleCount = 12;

      for (let i = 0; i < particleCount; i++) {
        const sprite = new PIXI.Sprite(textures.explosionStar);
        sprite.anchor.set(0.5);

        const particle = {
          sprite: sprite,
          x: x,
          y: y,
          angle: (Math.PI * 2 / particleCount) * i + Math.random() * 0.3,
          speed: Math.random() * 5 + 4,
          size: Math.random() * 4 + 2,
          life: 40,
          maxLife: 40,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.2,
        };

        sprite.scale.set(particle.size / 8);
        sprite.rotation = particle.rotation;
        sprite.x = x;
        sprite.y = y;

        gameApp.stage.addChild(sprite);
        explosionParticles.push(particle);
      }
    }

    function updateExplosions(deltaTime) {
      for (let i = explosionParticles.length - 1; i >= 0; i--) {
        const p = explosionParticles[i];

        // Movement with delta time
        p.x += Math.cos(p.angle) * p.speed * deltaTime;
        p.y += Math.sin(p.angle) * p.speed * deltaTime;
        p.speed *= Math.pow(0.94, deltaTime);
        p.life -= deltaTime;
        p.rotation += p.rotationSpeed * deltaTime;

        const alpha = p.life / p.maxLife;

        // Update sprite
        p.sprite.x = p.x;
        p.sprite.y = p.y;
        p.sprite.rotation = p.rotation;
        p.sprite.alpha = alpha * 0.9;

        // Remove dead particles
        if (p.life <= 0) {
          gameApp.stage.removeChild(p.sprite);
          p.sprite.destroy();
          explosionParticles.splice(i, 1);
        }
      }
    }

    // ===== MAIN ANIMATION LOOP WITH DELTA TIME =====
    gameApp.ticker.add((ticker) => {
      const deltaTime = ticker.deltaTime; // Frame-rate independent animation

      shieldPulse += 0.07 * deltaTime;

      // Smooth shield movement with easing
      const easing = 1 - Math.pow(0.82, deltaTime); // Frame-rate independent easing
      shieldX += (targetShieldX - shieldX) * easing;
      shieldY += (targetShieldY - shieldY) * easing;

      // Update background particles with delta time
      for (let i = 0; i < particleData.length; i++) {
        const p = particleData[i];
        const sprite = p.sprite;

        // Subtle attraction to mouse cursor
        const dx = shieldX - sprite.x;
        const dy = shieldY - sprite.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 350 && dist > 0) {
          sprite.x += dx * 0.0008 * deltaTime;
          sprite.y += dy * 0.0008 * deltaTime;
        }

        // Regular movement
        sprite.x += p.speedX * deltaTime;
        sprite.y += p.speedY * deltaTime;

        // Wrap around screen edges
        if (sprite.x < 0) sprite.x = gameApp.screen.width;
        if (sprite.x > gameApp.screen.width) sprite.x = 0;
        if (sprite.y < 0) sprite.y = gameApp.screen.height;
        if (sprite.y > gameApp.screen.height) sprite.y = 0;
      }

      // ===== DRAW PARTICLE CONNECTION NETWORK (v8 CORRECTED API) =====
      connectionsGraphics.clear();
      const maxConnectionDist = 160;
      const maxConnectionDistSq = maxConnectionDist * maxConnectionDist; // Avoid sqrt in loop

      for (let i = 0; i < particleData.length; i++) {
        const p1 = particleData[i].sprite;

        // Early exit: only check particles within reasonable range
        for (let j = i + 1; j < particleData.length; j++) {
          const p2 = particleData[j].sprite;

          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;

          // Early exit using squared distance (avoid sqrt)
          const distSq = dx * dx + dy * dy;
          if (distSq > maxConnectionDistSq) continue;

          const dist = Math.sqrt(distSq);
          const alpha = (1 - dist / maxConnectionDist) * 0.25;

          // v8 API: Each line needs its own context
          connectionsGraphics.moveTo(p1.x, p1.y);
          connectionsGraphics.lineTo(p2.x, p2.y);
          connectionsGraphics.stroke({ width: 1, color: 0xf97316, alpha: alpha });
        }
      }

      // Update shield trail
      trailPoints.push({ x: shieldX, y: shieldY });
      if (trailPoints.length > maxTrailPoints) trailPoints.shift();

      // ===== DRAW SHIELD WITH v8 GRAPHICS API =====
      shieldGraphics.clear();

      // Draw motion trail
      for (let i = 0; i < trailPoints.length; i++) {
        const alpha = (i / trailPoints.length) * 0.15;
        const size = (i / trailPoints.length) * 70 + 25;
        shieldGraphics.circle(trailPoints[i].x, trailPoints[i].y, size);
        shieldGraphics.stroke({ width: 3, color: 0xfbbf24, alpha: alpha });
      }

      const baseRadius = 80 + Math.sin(shieldPulse) * 10;

      // Outer glowing rings
      shieldGraphics.circle(shieldX, shieldY, baseRadius + 25);
      shieldGraphics.stroke({ width: 6, color: 0xf97316, alpha: 0.35 + Math.sin(shieldPulse) * 0.18 });

      shieldGraphics.circle(shieldX, shieldY, baseRadius);
      shieldGraphics.stroke({ width: 9, color: 0xef4444, alpha: 0.55 + Math.sin(shieldPulse + 1) * 0.25 });

      // Middle ring
      shieldGraphics.circle(shieldX, shieldY, baseRadius * 0.7);
      shieldGraphics.stroke({ width: 4, color: 0xfbbf24, alpha: 0.45 });

      // Inner shield core
      shieldGraphics.circle(shieldX, shieldY, baseRadius * 0.5);
      shieldGraphics.fill({ color: 0xf97316, alpha: 0.18 });

      // Hexagonal pattern that rotates
      shieldGraphics.poly(
        Array.from({ length: 6 }, (_, i) => {
          const angle = (Math.PI / 3) * i + shieldPulse * 0.6;
          return {
            x: shieldX + Math.cos(angle) * baseRadius * 0.8,
            y: shieldY + Math.sin(angle) * baseRadius * 0.8
          };
        }),
        true
      );
      shieldGraphics.stroke({ width: 3.5, color: 0xfbbf24, alpha: 0.65 });

      // Rotating inner hexagon
      shieldGraphics.poly(
        Array.from({ length: 6 }, (_, i) => {
          const angle = (Math.PI / 3) * i - shieldPulse * 0.4;
          return {
            x: shieldX + Math.cos(angle) * baseRadius * 0.45,
            y: shieldY + Math.sin(angle) * baseRadius * 0.45
          };
        }),
        true
      );
      shieldGraphics.stroke({ width: 2.5, color: 0xf97316, alpha: 0.5 });

      // Pulsing energy core
      const energyPulse = (shieldPulse * 2.5) % (Math.PI * 2);
      const pulseRadius = (Math.sin(energyPulse) * 0.5 + 0.5) * baseRadius * 0.35;
      shieldGraphics.circle(shieldX, shieldY, pulseRadius);
      shieldGraphics.fill({ color: 0xfbbf24, alpha: 0.4 });

      // Outer energy ring burst
      const burstPulse = (shieldPulse * 1.5) % (Math.PI * 2);
      const burstRadius = baseRadius + (Math.sin(burstPulse) * 0.5 + 0.5) * 30;
      const burstAlpha = (1 - (Math.sin(burstPulse) * 0.5 + 0.5)) * 0.3;
      shieldGraphics.circle(shieldX, shieldY, burstRadius);
      shieldGraphics.stroke({ width: 5, color: 0xf97316, alpha: burstAlpha });

      // Update all threats with delta time
      threats.forEach(t => t.update(shieldX, shieldY, deltaTime));

      // Update explosion particles
      updateExplosions(deltaTime);
    });

    console.log('Animation loop started');

    // ===== WINDOW RESIZE HANDLER =====
    window.addEventListener('resize', () => {
      gameApp.renderer.resize(window.innerWidth, window.innerHeight);

      // Reset particles on resize
      particleData.forEach(p => {
        if (p.sprite.x > gameApp.screen.width) p.sprite.x = gameApp.screen.width - 10;
        if (p.sprite.y > gameApp.screen.height) p.sprite.y = gameApp.screen.height - 10;
      });
    });

    // ===== CLEANUP ON PAGE UNLOAD =====
    window.addEventListener('beforeunload', () => {
      // Destroy all threats
      threats.forEach(t => t.destroy());

      // Destroy explosion particles
      explosionParticles.forEach(p => {
        if (p.sprite) p.sprite.destroy();
      });

      // Destroy particle container and all its children
      particleContainer.destroy({ children: true });

      // Destroy graphics
      connectionsGraphics.destroy();
      shieldGraphics.destroy();

      // Destroy textures
      Object.values(textures).forEach(texture => {
        if (texture) texture.destroy(true);
      });

      // Destroy application
      gameApp.destroy(true, { children: true, texture: true });
    });

    // ===== CONSOLE WELCOME MESSAGE =====
    console.log('%c🛡️ SHIELD DEFENSE GAME ACTIVE', 'font-size: 24px; color: #f97316; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);');
    console.log('%cMove your mouse to control the shield and block incoming threats!', 'font-size: 16px; color: #64748b;');
    console.log('%cThreats Blocked: 0', 'font-size: 18px; color: #10b981; font-weight: bold;');
    console.log('%cGame running with PixiJS v8 optimizations:', 'font-size: 14px; color: #8b5cf6;');
    console.log('%c- ParticleContainer batch rendering (120 particles → 1 draw call)', 'font-size: 12px; color: #10b981;');
    console.log('%c- Sprite-based rendering with texture caching', 'font-size: 12px; color: #10b981;');
    console.log('%c- Delta time normalization for frame-rate independence', 'font-size: 12px; color: #10b981;');
    console.log('%c- Distance culling optimization', 'font-size: 12px; color: #10b981;');

  } catch (error) {
    console.error('Failed to initialize game:', error);
    console.error('Error stack:', error.stack);

    // Display error to user
    const scoreValueEl = document.getElementById('scoreValue');
    if (scoreValueEl) {
      scoreValueEl.textContent = 'Error';
      scoreValueEl.style.fontSize = '24px';
    }
  }
}

// Wait for PixiJS to be fully loaded before initializing
if (typeof PIXI !== 'undefined') {
  console.log('PixiJS loaded, version:', PIXI.VERSION);
  initGame();
} else {
  console.error('PixiJS not loaded! Check CDN connection.');
  window.addEventListener('load', () => {
    if (typeof PIXI !== 'undefined') {
      console.log('PixiJS loaded after page load, version:', PIXI.VERSION);
      initGame();
    } else {
      console.error('PixiJS still not available after page load');
    }
  });
}
