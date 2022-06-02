import { Carnivore } from "../creatures/carnivore"
import { Herbivore } from "../creatures/herbivore"
import { Plant } from "../creatures/plant"
import { types } from "../constants/critconst"

const PLANT_REPLICATE_COOLDOWN = 75

let creatures = []
let markedForDeletion = []
let markedForReplication = []

let history = []

let idCounter = 0

const init = (pc, hc, cc) => {
  let i = 0

  for (i = 0; i < pc; i++) {
    create(types.plant)
  }
  for (i = 0; i < hc; i++) {
    create(types.herbivore)
  }
  for (i = 0; i < cc; i++) {
    create(types.carnivore)
  }
}

const restart = () => {
  creatures = []
  markedForDeletion = []
  markedForReplication = []
  history = []
  init(20, 10, 5)
}

const update = findex => {
  let pc = 0, hc = 0, cc = 0

  if (findex % PLANT_REPLICATE_COOLDOWN === 0) {
    create(types.plant)
  } 

  while (markedForDeletion.length) {
    const i = markedForDeletion.pop()
    creatures.splice(i, 1)
  }

  while (markedForReplication.length) {
    const crit = markedForReplication.pop()
    replicate(crit)
  }

  for (let i = 0; i < creatures.length; i++) {
    const crit = creatures[i]
    crit.update(
      findex, 
      creatures, 
      i => markedForDeletion.push(i),
      c => markedForReplication.push(c)
    )
    if (crit.type === types.plant) pc += 1
    else if (crit.type === types.herbivore) hc += 1
    else if (crit.type === types.carnivore) cc += 1
  }

  if (findex % 10) {
    history.push({ p: pc, h: hc, c: cc })
  }
}

const draw = (ctx, findex) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

  for (let i = 0; i < creatures.length; i++) {
    creatures[i].draw(ctx)
  }
}

const generateId = () => idCounter++

const create = (type, x, y) => {
  x = x || Math.random() * window.innerWidth
  y = y || Math.random() * window.innerHeight
  let crit
  switch (type) {
    case types.plant: crit = new Plant(x, y); break
    case types.herbivore: crit = new Herbivore(x, y); break
    case types.carnivore: crit = new Carnivore(x, y); break
    default:
      break;
  }
  crit.id = generateId()
  creatures.push(crit)
  return crit
}

const replicate = (crit) => {
  const replica = create(crit.type, crit.x, crit.y)
  const energy = crit.energy / 2
  replica.energy = energy
  replica.dx = crit.dx
  replica.dy = crit.dy
  crit.energy = energy
}

const getHistory = () => history

init(20, 10, 5)

export { update, draw, restart, getHistory }