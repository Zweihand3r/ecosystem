import { Base } from "./base"
import { types } from "../constants/critconst"

/**
 * sx, sy => speed x, y
 * ax, ay => rate of change of sx, sy (aka acceleration)
 * dx, dy => direction x, y
 * ri => repication index
 */

export class Creature extends Base {
  sx = 0
  sy = 0
  ax = 0
  ay = 0
  dx = .1
  dy = .1
  d = 0
  repIndex = 0
  speedMax = 1
  speedMod = 1
  accel = .01
  range = 100
  foodType = types.none
  dangerType = types.none
  energyDrain = .00025
  replicationRate = .001
  shape = ctx => {}
  target = null
  dangers = []

  update(findex, creatures, markForDeletion, markForReplication) {
    this.sense(findex, creatures, markForDeletion, markForReplication)
    this.updateSpeed()
    this.replication(markForReplication)
    this.useEnergy(creatures, markForDeletion)
    
    const lx = this.x
    const ly = this.y
    
    const [wx, wy] = this.warp(
      this.x + this.sx, 
      this.y + this.sy
    )

    this.dx = wx - lx
    this.dy = wy - ly

    this.d = Math.atan(this.dy / this.dx) + (this.dx < 0 ? Math.PI : 0)

    this.x = wx
    this.y = wy
  }

  draw(ctx) {
    ctx.save()

    ctx.translate(this.x, this.y)
    ctx.rotate(this.d)

    ctx.fillStyle = this.color
    ctx.beginPath()
    this.shape(ctx)
    ctx.fill()

    ctx.restore()

    this.indicateTarget(ctx)
    this.drawRange(ctx)
  }

  sense(findex, creatures, markForDeletion, markForReplication) {
    let td = Number.MAX_SAFE_INTEGER
    let te = 0
    let ti = -1
    let target = null

    this.dangers = []

    for (let i = 0; i < creatures.length; i++) {
      const crit = creatures[i]
      if (crit.id !== this.id) {
        const d = Math.sqrt(Math.pow(this.x - crit.x, 2) + Math.pow(this.y - crit.y, 2))
        if (d < this.range) {
          const e = crit.energy
          if (crit.type === this.dangerType) {
            this.dangers.push({ x: crit.x, y: crit.y, d })
          } else if (!this.dangers.length && crit.type === this.foodType && e > .1) {
            if (e > te && d < td) {
              td = d
              te = e
              ti = i
              target = crit
            }
          }
        }
      }
    }

    this.speedMod = 1
    this.target = null

    if (target && this.energy < .2) {
      this.pursueTarget(target, td, ti, markForDeletion)
    } else if (this.dangers.length) {
      this.runFromDanger()
    } else if (target && this.energy < .75) {
      this.pursueTarget(target, td, ti, markForDeletion)
    } else {
      this.ax = Math.random() * .1 - .05
      this.ay = Math.random() * .1 - .05
    }
  }

  useEnergy = (creatures, markForDeletion) => {
    this.energy = Math.max(this.energy - this.energyDrain, 0)
    if (this.energy === 0) {
      for (let i = 0; i < creatures.length; i++) {
        if (creatures[i].id === this.id) {
          markForDeletion(i)
        }
      }
    }
  }

  updateSpeed = () => {
    const max = this.speedMax + this.speedMax * (1 - this.energy) * .5 - .25
    const nx = (this.sx + this.ax) * this.speedMod
    const ny = (this.sy + this.ay) * this.speedMod

    if (window.useAccel) {
      if (this.sx < nx) {
        this.sx = Math.min(this.sx + this.accel, max)
      } else {
        this.sx = Math.max(this.sx - this.accel, -max)
      }
      if (this.sy < ny) {
        this.sy = Math.min(this.sy + this.accel, max)
      } else {
        this.sy = Math.max(this.sy - this.accel, -max)
      }
    } else {
      // Constant Speed
      this.sx = Math.clamp(-max, nx, max)
      this.sy = Math.clamp(-max, ny, max)
    }
  }

  replication = (markForReplication) => {
    if (this.energy > .9) {
      this.repIndex += this.replicationRate
      if (this.repIndex > 1) {
        markForReplication(this)
        this.repIndex = 0
      }
    }
  }

  runFromDanger = () => {
    let dx = 0, dy = 0
    for (let i = 0; i < this.dangers.length; i++) {
      const { x, y, d } = this.dangers[i]
      dx += (this.x - x) / d * .05
      dy += (this.y - y) / d * .05
    }
    this.ax = dx
    this.ay = dy
  }

  pursueTarget = (target, td, ti, markForDeletion) => {
    if (td < this.size) {
      this.eat(target)
      target.getEaten()
      markForDeletion(ti)
    } else {
      const tdx = target.x - this.x
      const tdy = target.y - this.y

      const dot = this.dx * tdx + this.dy * tdy
      const d1 = Math.sqrt(Math.pow(this.dx, 2) + Math.pow(this.dy, 2))
      const d2 = Math.sqrt(Math.pow(tdx, 2) + Math.pow(tdy, 2))
      const a = Math.acos(dot / (d1 * d2))

      if (!isNaN(a)) {
        this.speedMod = Math.lerp(0.5, 1, Math.inverseLerp(0, Math.PI, Math.PI - a))
      }

      this.ax = - (this.x - target.x) / td * .05
      this.ay = - (this.y - target.y) / td * .05
    }
    this.target = target
  }

  warp(nx, ny) {
    if (nx > window.innerWidth) {
      nx = -this.size
    } else if (nx < -this.size) {
      nx = window.innerWidth
    }

    if (ny > window.innerHeight) {
      ny = -this.size
    } else if (ny < -this.size) {
      ny = window.innerHeight
    }

    return [nx, ny]
  }

  indicateTarget(ctx, type = this.foodType) {
    if (window.isIndicateTarget && this.target && this.target.type === type) {
      const grad = ctx.createLinearGradient(this.x, this.y, this.target.x, this.target.y)
      grad.addColorStop(0, this.color)
      grad.addColorStop(1, this.target.color)
      ctx.strokeStyle = grad
      ctx.lineWidth = 1

      ctx.beginPath()
      ctx.moveTo(this.x, this.y)
      ctx.lineTo(this.target.x, this.target.y)
      ctx.closePath()

      ctx.stroke()
    }
  }

  drawRange(ctx) {
    if (window.isDrawRange) {
      ctx.strokeStyle = `${this.color}25`
      ctx.strokeWidth = 1

      ctx.beginPath()
      ctx.arc(this.x, this.y, this.range, 0, 2 * Math.PI)
      ctx.closePath()
      ctx.stroke()
    }
  }

  logCrit(id, log) {
    if (this.id === id) {
      console.log(log)
    }
  }
}