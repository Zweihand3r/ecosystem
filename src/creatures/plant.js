import { Base } from "./base";
import { colors, types } from "../constants/critconst"

export class Plant extends Base {
  growthRate = Math.random() * .0020 + .0005

  constructor(x, y) {
    super(x, y)

    this.type = types.plant
    this.color = colors.plant
    this.energy = 0
  }

  draw(ctx) {
    ctx.fillStyle = this.color

    ctx.beginPath()
    ctx.arc(this.x, this.y, this.drawSize / 2, 0, 2 * Math.PI)
    ctx.closePath()

    ctx.fill()
  }

  update() {
    if (this.energy < .75) {
      this.energy += this.growthRate
    }
  }
}