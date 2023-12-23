import * as Entities from "./entities.js"
import { Renderer } from "./renderer.js"
import { Player } from "./player.js"
import { world } from "./world.js"
import { PAUSE, PLAY } from "./states.js"

export var running
export var dev = false
 // if true, we can fly :o
export const usize = 20
export const pressed = {}
export var renderer
export var player

window.onload = () => {
	init()
}

function init() {
	if(new URLSearchParams(window.location.search).get("dev") == "true") {
		dev = true
	}

	renderer = new Renderer()

	world.add(new Entities.Coin(440, 200))
	world.add(new Entities.Coin(210, 30))
	// world.add(new Entities.Gem(110, 80))
	world.add(new Entities.Platform(420, 560*2, 102, 8))
	world.add(new Entities.Platform(440, 540*2, 102, 8))
	world.add(new Entities.Platform(480, 500*2, 102, 8))
	world.add(new Entities.Platform(520, 460*2, 102, 8))
	world.add(new Entities.Platform(560, 420*2, 102, 8))
	world.add(new Entities.Platform(600, 380*2, 102, 8))
	world.add(new Entities.Platform(590, 340*2, 102, 8))
	world.add(new Entities.Platform(570, 300*2, 102, 8))
	world.add(new Entities.Tree(128, 1200 - (usize * 4), 4))
	world.add(new Entities.Blob(150, 560*2))
	world.add(new Entities.Dragon(333, 560*2))
	world.add(new Entities.Slime(500, 580*2))
	world.add(new Entities.Leaf(100, 100*2, 20, 20))
	world.add(setPlayer(new Player(0, 560*2)))
	world.add(new Entities.Platform(0, world.height - (world.yOffset * 2), world.width, 8))
    world.add(new Entities.Platform(0, -20, world.width, 8))

	start()
}

export function setDev(val) {
	dev = val
}

export async function start() {
	running = true

	const target = 60
	const optimal = 1000000000 / target //optimal wait time in nanoseconds

	while(running) {
		let now = new Date()

		renderer.tick()
		renderer.render()

		let updateTime = new Date() - now //how long tick and render took in nanoseconds
		
		let wait = (optimal - updateTime) / 1000000 //calculate wait time and convert to milliseconds

		await sleep(wait) //wait
	}
}

export function stop() {
	running = false
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms))
}

function setPlayer(Player) {
	player = Player

	return player
}

export function getPlayer() {
	if(player) {
		return player
	}

	let entities = world.entities
	
	for(let i = 0; i < entities.length; i++) {
		if(entities[i].getType() == "Player") {
			return setPlayer(entities[i])
		}
	}

	return undefined
}

window.addEventListener("keyup", (e) => {
	let k = e.key

	pressed[k] = false

	if(k == " ") {
		getPlayer().jump()
	}

	if(k == "Escape") {
		if(renderer.state.getType() === "PlayState") {
			renderer.setState(PAUSE)
		} else if(renderer.state.getType() == "PauseState") {
			renderer.setState(PLAY)
		}
	}

    if(k == "i") {
        console.log(getPlayer().inventory)
    }

	if(k == "x") {
		dev = !dev
	}

	if(k == "e") {
		if(!player) {
			return
		}
		world.entities.forEach(e => {
			if(!e.equals(player)) {
				let off = player.direction == "left" ? 2 : -2

				if(player.collides(e, false, off, off) ) {
					player.attack(e)
				}
			}
		})
	}
})

window.addEventListener("keydown", (e) => {
	let k = e.key

	pressed[k] = true
})