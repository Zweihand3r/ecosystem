import { colors, types } from "../constants/critconst"
import { Creature } from "./creature";

export class Carnivore extends Creature {
  constructor(x, y) {
    super(x, y)

    this.type = types.carnivore
    this.color = colors.carnivore
    this.foodType = types.herbivore
    this.shape = ctx => {
      ctx.beginPath()
      ctx.moveTo(-this.drawSize / 2, -this.drawSize / 2)
      ctx.lineTo(this.drawSize / 2, 0)
      ctx.lineTo(-this.drawSize / 2, this.drawSize / 2)
      ctx.closePath()
    }
  }
}