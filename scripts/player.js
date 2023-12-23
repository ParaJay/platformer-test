import {LivingEntity, MovingEntity} from "./entities.js"
import {dev, pressed, setDev} from "./main.js"
import { world } from "./world.js"

export class Player extends MovingEntity {
	constructor(x, y) {
		super(x, y)

        this.inventory = {}
		this.attackCooldown = 60
		this.ticksSinceLastAttack = 60
	}

	tick() {
		super.tick()

		if(!this.jumping)  {
			if(pressed[" "]) {
				if(dev) {
					this.y -= 4
				}

				this.jumpTicks += 2

				// this.height = this.h - ((this.h / 2) * (this.jumpTicks / this.jumpTicksMax)) code to make char squeez, doesn't work :/

				if(this.jumpTicks > this.jumpTicksMax) {
					this.jumpTicks = this.jumpTicksMax
				}
			}
		}

		if(pressed["a"]) {
			this.move("left")
			this.direction = "left"
		}

		if(pressed["d"]) {
			this.move("right")
			this.direction = "right"
		}

		if(pressed["Shift"]) {
			if(dev) {
				this.y += 4
			}
		}

		this.ticksSinceLastAttack++
	}

	move(direction, amount=2) {
		super.move(direction, amount)

		world.x = (this.x / (world.width / canvas.width))
	}

	moveY(y, attempt=0) {
		if(!dev) {
			super.moveY(y, attempt)
		}

		world.y = (this.y / (world.height / canvas.height)) + world.yOffset + (this.height * 2)
	}
	
	attack(entity) {
		if(this.ticksSinceLastAttack < this.attackCooldown) {
			return
		}

		if(entity.equals(this)) {
			return
		}

		if(!(entity instanceof LivingEntity)) {
			return
		}

		let type = entity.getType()

		if(entity.isDamageable()) {
			entity.damage()
		}

		if(entity.isInteractable()) {
			entity.onInteractedWith()
		}

		this.ticksSinceLastAttack = 0
	}

	onCollideWith(entity) {
		let type = entity.getType()

        if(entity.canPickUp()) {
            if(!entity.interactedWith) {
                world.remove(entity)
                this.addItem(entity)
                entity.interactedWith = true
            }
        }

		if(type == "Leaves") {
			entity.spawnLeaf()
		}
	}

    addItem(item) {
        let key = item.getType()

        if(!(key in this.inventory)) {
            this.inventory[key] = 0
        }

        this.inventory[key]++
    }
}