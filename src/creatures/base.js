import { types } from "../constants/critconst"

export class Base {
  id = -1
  type = types.base
  color = '#fff'
  size = 20
  energy = 0.75

  constructor(x, y) {
    this.x = x
    this.y = y
  }

  get drawSize() {
    return this.size * this.energy
  }

  update(findex, creatures, markForDeletion, markForReplication) {}

  draw(ctx) {
    ctx.fillStyle = this.color
    ctx.fillRect(this.x - this.drawSize / 2, this.y - this.drawSize / 2, this.drawSize, this.drawSize)
  }

  eat(target) {
    this.energy = Math.min(this.energy + target.energy * .75, 1) 
  }
  
  getEaten() {
    this.energy = 0
  }
}