import { colors, types } from "../constants/critconst"
import { Creature } from "./creature";

export class Herbivore extends Creature {
  constructor(x, y) {
    super(x, y)

    this.type = types.herbivore
    this.color = colors.herbivore
    this.foodType = types.plant
    this.dangerType = types.carnivore
    this.shape = ctx => {
      ctx.beginPath()
      ctx.moveTo(-this.drawSize / 2, -this.drawSize / 2)
      ctx.lineTo(this.drawSize / 4, -this.drawSize / 2)
      ctx.lineTo(this.drawSize / 2, -this.drawSize / 4)
      ctx.lineTo(this.drawSize / 2, this.drawSize / 4)
      ctx.lineTo(this.drawSize / 4, this.drawSize / 2)
      ctx.lineTo(-this.drawSize / 2, this.drawSize / 2)
      ctx.closePath()
    }
  }
}