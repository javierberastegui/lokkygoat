class PetPhysics {
  constructor() {
    this.vx = 0.25;
    this.vy = 0.0;
    this.targetVx = 0.25;
    this.targetVy = 0.0;

    this.behaviorState = "idle_grounded";
    this.behaviorTicks = 100;
    this.lastWarpTime = Date.now();
    this.wanderAngle = 0.0;
    this.speedBase = 0.25;

    // Physics constants
    this.gravity = 0.18; 
    this.yVelocity = 0.0; 
  }

  update(bounds, screenArea, skillCount, movementMode, lastActivity) {
    const actions = [];
    
    if (Date.now() - lastActivity < 1000) {
      return { newBounds: bounds, stepPayload: { vx: this.vx, vy: this.vy, behaviorState: this.behaviorState }, actions };
    }

    if (movementMode === "pause") {
      return { newBounds: bounds, stepPayload: { vx: this.vx, vy: this.vy, behaviorState: this.behaviorState }, actions };
    }

    let nx = bounds.x;
    let ny = bounds.y;
    const b = bounds;
    const a = screenArea;
    const groundY = a.y + a.height - b.height;

    if (movementMode !== "suave") {
      if (this.behaviorTicks <= 0) {
        const rand = Math.random();
        
        // Behaviors: grounded_walk (40%), idle_grounded (30%), hop (15%), fly (10%), warp (5%)
        if (rand < 0.40) {
          this.behaviorState = "grounded_walk";
          this.behaviorTicks = Math.floor(Math.random() * 200) + 150; 
          const speedScale = skillCount <= 2 ? 0.95 : (skillCount <= 5 ? 1.3 : 1.7);
          this.speedBase = (0.05 + Math.random() * 0.05) * speedScale;
          this.targetVx = (Math.random() > 0.5 ? 1 : -1) * this.speedBase;
          this.targetVy = 0;
        } else if (rand < 0.70) {
          this.behaviorState = "idle_grounded";
          this.behaviorTicks = Math.floor(Math.random() * 300) + 200; 
          this.targetVx = 0;
          this.targetVy = 0;
          this.speedBase = 0;
        } else if (rand < 0.85) {
          this.behaviorState = "hop";
          this.behaviorTicks = Math.floor(Math.random() * 60) + 40; 
          const speedScale = skillCount <= 2 ? 1.0 : (skillCount <= 5 ? 1.3 : 1.6);
          this.speedBase = (0.06 + Math.random() * 0.06) * speedScale;
          this.targetVx = (Math.random() > 0.5 ? 1 : -1) * this.speedBase;
          this.yVelocity = -4.5 - Math.random() * 2.0; 
        } else if (rand < 0.95) {
          this.behaviorState = "fly";
          this.behaviorTicks = Math.floor(Math.random() * 250) + 150; 
          const speedScale = skillCount <= 2 ? 0.8 : (skillCount <= 5 ? 1.1 : 1.4);
          this.speedBase = (0.08 + Math.random() * 0.06) * speedScale;
          this.wanderAngle = Math.random() * Math.PI * 2;
        } else {
          if (Date.now() - this.lastWarpTime > 15000) {
            this.behaviorState = "warp";
            this.lastWarpTime = Date.now();
          } else {
            this.behaviorState = "grounded_walk";
            this.behaviorTicks = 120;
            this.speedBase = 0.05;
            this.targetVx = (Math.random() > 0.5 ? 1 : -1) * this.speedBase;
            this.targetVy = 0;
          }
        }
      }
      
      this.behaviorTicks--;
    } else {
      // Quiet mode ("suave")
      if (this.behaviorTicks <= 0) {
        if (Math.random() < 0.7) {
          this.behaviorState = "idle_grounded";
          this.behaviorTicks = 200;
          this.targetVx = 0;
          this.targetVy = 0;
        } else {
          this.behaviorState = "grounded_walk";
          this.behaviorTicks = 150;
          this.speedBase = 0.04;
          this.targetVx = (Math.random() > 0.5 ? 1 : -1) * this.speedBase;
          this.targetVy = 0;
        }
      }
      this.behaviorTicks--;
    }

    if (this.behaviorState === "warp") {
      actions.push("warp-start");
      this.behaviorState = "warping-transition";
      this.behaviorTicks = 999;
      
      this.vx = 0;
      this.vy = 0;
      this.targetVx = 0;
      this.targetVy = 0;
      
      actions.push("warp-teleport");
      return {
        newBounds: bounds,
        stepPayload: { vx: this.vx, vy: this.vy, behaviorState: this.behaviorState },
        actions
      };
    }

    if (this.behaviorState === "warping-transition") {
      return {
        newBounds: bounds,
        stepPayload: { vx: this.vx, vy: this.vy, behaviorState: this.behaviorState },
        actions
      };
    }

    // Apply movement according to category (flying vs. grounded/falling)
    if (this.behaviorState === "fly") {
      this.wanderAngle += (Math.random() - 0.5) * 0.12;
      this.targetVx = Math.cos(this.wanderAngle) * this.speedBase;
      this.targetVy = Math.sin(this.wanderAngle) * this.speedBase;

      this.vx = this.vx + (this.targetVx - this.vx) * 0.03;
      this.vy = this.vy + (this.targetVy - this.vy) * 0.03;

      let speedMultiplier = 1.0;
      if (movementMode === "suave") speedMultiplier = 0.35;
      else if (movementMode === "vivo") speedMultiplier = 1.6;

      nx = b.x + this.vx * speedMultiplier;
      ny = b.y + this.vy * speedMultiplier;

      // Bounce limits
      let bounced = false;
      if (nx <= a.x || nx >= a.x + a.width - b.width) {
        this.targetVx = -this.targetVx;
        this.vx = -this.vx;
        this.wanderAngle = Math.atan2(this.targetVy, this.targetVx);
        nx = b.x + this.vx * speedMultiplier;
        bounced = true;
      }
      if (ny <= a.y || ny >= groundY) {
        this.targetVy = -this.targetVy;
        this.vy = -this.vy;
        this.wanderAngle = Math.atan2(this.targetVy, this.targetVx);
        ny = b.y + this.vy * speedMultiplier;
        bounced = true;
      }

      if (bounced) {
        this.vx += (Math.random() - 0.5) * 0.04;
        this.vy += (Math.random() - 0.5) * 0.03;
        actions.push("bounce");
      }
    } else {
      // Grounded state / falling physics
      this.vx = this.vx + (this.targetVx - this.vx) * 0.05;

      let speedMultiplier = 1.0;
      if (movementMode === "suave") speedMultiplier = 0.35;
      else if (movementMode === "vivo") speedMultiplier = 1.6;

      nx = b.x + this.vx * speedMultiplier;

      // Apply gravity to vertical speed if above ground
      if (ny < groundY) {
        this.yVelocity += this.gravity;
        ny += this.yVelocity;
      } else {
        ny = groundY;
        this.yVelocity = 0;
      }

      // Check horizontal boundary bounces
      let bounced = false;
      if (nx <= a.x || nx >= a.x + a.width - b.width) {
        this.targetVx = -this.targetVx;
        this.vx = -this.vx;
        nx = b.x + this.vx * speedMultiplier;
        bounced = true;
      }

      if (bounced) {
        actions.push("bounce");
      }

      this.vy = this.yVelocity;
    }

    const clamp = (x, y, w, h) => {
      return {
        x: Math.max(a.x, Math.min(x, a.x + a.width - w)),
        y: Math.max(a.y, Math.min(y, a.y + a.height - h)),
      };
    };

    const safe = clamp(nx, ny, b.width, b.height);
    const finalBounds = {
      x: Math.round(safe.x),
      y: Math.round(safe.y),
      width: b.width,
      height: b.height
    };

    return {
      newBounds: finalBounds,
      stepPayload: { vx: this.vx, vy: this.vy, behaviorState: this.behaviorState },
      actions
    };
  }

  finishWarp(bounds, screenArea) {
    const a = screenArea;
    const b = bounds;
    
    // Warping can place Goatky in the air, allowing a dramatic landing!
    const nx = a.x + Math.random() * (a.width - b.width);
    const ny = a.y + Math.random() * (a.height - b.height) * 0.6; // warp within upper 60%
    
    const clamp = (x, y, w, h) => {
      return {
        x: Math.max(a.x, Math.min(x, a.x + a.width - w)),
        y: Math.max(a.y, Math.min(y, a.y + a.height - h)),
      };
    };
    
    const safe = clamp(nx, ny, b.width, b.height);
    
    this.behaviorState = "grounded_walk";
    this.behaviorTicks = 160;
    this.yVelocity = 0;

    return {
      x: Math.round(safe.x),
      y: Math.round(safe.y),
      width: b.width,
      height: b.height
    };
  }
}

module.exports = PetPhysics;
