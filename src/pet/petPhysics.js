class PetPhysics {
  constructor() {
    this.vx = 0.25;
    this.vy = 0.20;
    this.targetVx = 0.25;
    this.targetVy = 0.20;

    this.behaviorState = "walk";
    this.behaviorTicks = 0;
    this.lastWarpTime = Date.now();
    this.wanderAngle = Math.random() * Math.PI * 2;
    this.speedBase = 0.25;
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

    if (movementMode !== "suave") {
      if (this.behaviorTicks <= 0) {
        const rand = Math.random();
        
        let walkThreshold = 0.70;
        let dashThreshold = 0.75;
        let haltThreshold = 0.95;
        
        if (skillCount <= 2) {
          walkThreshold = 0.75;
          dashThreshold = 0.80;
          haltThreshold = 1.0;
        } else if (skillCount <= 5) {
          walkThreshold = 0.70;
          dashThreshold = 0.75;
          haltThreshold = 0.95;
        } else {
          walkThreshold = 0.50;
          dashThreshold = 0.55;
          haltThreshold = 0.95;
        }
        
        if (rand < walkThreshold) {
          this.behaviorState = "walk";
          this.behaviorTicks = Math.floor(Math.random() * 400) + 300;
          const speedScale = skillCount <= 2 ? 0.95 : (skillCount <= 5 ? 1.3 : 1.7);
          this.speedBase = (0.045 + Math.random() * 0.05) * speedScale;
          this.wanderAngle = Math.random() * Math.PI * 2;
        } else if (rand < dashThreshold) {
          this.behaviorState = "dash";
          this.behaviorTicks = Math.floor(Math.random() * 150) + 100;
          const speedScale = skillCount <= 2 ? 1.0 : (skillCount <= 5 ? 1.3 : 1.6);
          this.speedBase = (0.13 + Math.random() * 0.09) * speedScale;
          this.wanderAngle = Math.random() * Math.PI * 2;
        } else if (rand < haltThreshold) {
          this.behaviorState = "halt";
          const haltDuration = skillCount >= 6 ? (Math.floor(Math.random() * 800) + 400) : (Math.floor(Math.random() * 500) + 300);
          this.behaviorTicks = haltDuration;
          this.speedBase = 0;
          this.targetVx = 0;
          this.targetVy = 0;
          if (Math.random() > 0.4) {
            actions.push("celebrate");
          }
        } else {
          if (Date.now() - this.lastWarpTime > 12000) {
            this.behaviorState = "warp";
            this.lastWarpTime = Date.now();
          } else {
            this.behaviorState = "walk";
            this.behaviorTicks = 160;
          }
        }
      }
      
      if (this.behaviorState === "walk" || this.behaviorState === "dash") {
        this.wanderAngle += (Math.random() - 0.5) * 0.08;
        this.targetVx = Math.cos(this.wanderAngle) * this.speedBase;
        this.targetVy = Math.sin(this.wanderAngle) * this.speedBase;
      }
      
      this.behaviorTicks--;
    } else {
      this.behaviorState = "walk";
      this.wanderAngle += (Math.random() - 0.5) * 0.08;
      this.speedBase = 0.045;
      this.targetVx = Math.cos(this.wanderAngle) * this.speedBase;
      this.targetVy = Math.sin(this.wanderAngle) * this.speedBase;
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

    // Obstacle Avoidance
    if (this.behaviorState === "walk" || this.behaviorState === "dash") {
      const margin = 120;
      let avoidForceX = 0;
      let avoidForceY = 0;

      if (b.x < a.x + margin) {
        avoidForceX += ((a.x + margin - b.x) / margin) * 0.15;
      } else if (b.x + b.width > a.x + a.width - margin) {
        avoidForceX -= ((b.x + b.width - (a.x + a.width - margin)) / margin) * 0.15;
      }

      if (b.y < a.y + margin) {
        avoidForceY += ((a.y + margin - b.y) / margin) * 0.15;
      } else if (b.y + b.height > a.y + a.height - margin) {
        avoidForceY -= ((b.y + b.height - (a.y + a.height - margin)) / margin) * 0.15;
      }

      if (avoidForceX !== 0 || avoidForceY !== 0) {
        this.targetVx += avoidForceX;
        this.targetVy += avoidForceY;
        const actSpeed = Math.sqrt(this.targetVx * this.targetVx + this.targetVy * this.targetVy);
        if (actSpeed > this.speedBase) {
          this.targetVx = (this.targetVx / actSpeed) * this.speedBase;
          this.targetVy = (this.targetVy / actSpeed) * this.speedBase;
        }
        this.wanderAngle = Math.atan2(this.targetVy, this.targetVx);
      }
    }

    this.vx = this.vx + (this.targetVx - this.vx) * 0.03;
    this.vy = this.vy + (this.targetVy - this.vy) * 0.03;

    let speedMultiplier = 1.0;
    if (movementMode === "suave") {
      speedMultiplier = 0.35;
    } else if (movementMode === "vivo") {
      speedMultiplier = 1.6;
    }

    nx = b.x + this.vx * speedMultiplier;
    ny = b.y + this.vy * speedMultiplier;
    let bounced = false;

    if (nx <= a.x || nx >= a.x + a.width - b.width) {
      this.targetVx = -this.targetVx;
      this.vx = -this.vx;
      this.wanderAngle = Math.atan2(this.targetVy, this.targetVx);
      nx = b.x + this.vx * speedMultiplier;
      bounced = true;
    }

    if (ny <= a.y || ny >= a.y + a.height - b.height) {
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
    const nx = a.x + Math.random() * (a.width - b.width);
    const ny = a.y + Math.random() * (a.height - b.height);
    
    const clamp = (x, y, w, h) => {
      return {
        x: Math.max(a.x, Math.min(x, a.x + a.width - w)),
        y: Math.max(a.y, Math.min(y, a.y + a.height - h)),
      };
    };
    
    const safe = clamp(nx, ny, b.width, b.height);
    
    this.behaviorState = "walk";
    this.behaviorTicks = 160;

    return {
      x: Math.round(safe.x),
      y: Math.round(safe.y),
      width: b.width,
      height: b.height
    };
  }
}

module.exports = PetPhysics;
