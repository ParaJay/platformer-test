import { animations, sprites } from "./animations.js"
import * as States from "./states.js"
import { world } from "./world.js"
import { Random, randomUUID, calculateJumpSpeed, calculateFallSpeed } from "./utils.js"

function abstractCheck(p, c) {
	if(p === c) { throw new Error(`abstract class '${p}' cannot be initialized`) }
}

export class Animatable {
    constructor(x, y, width = canvas.width / 30, height = canvas.height / 30) {
		abstractCheck("Animatable", this.constructor.name)
		
        this.x = x
		this.y = y
		this.width = width
		this.height = height
		this.w = this.width
		this.h = this.height
        this.animationFrame = 0
		this.animationTicks = 0
        this.spriteRow = 0
        this.direction = "left"
        this.invert = false

        let t = this.getType().toLowerCase()
        
        if(t in animations) {
            this.animations = animations[t]
        }

        if(t in sprites) {
            this.spritesheet = sprites[t]
        }
    }

    tick() {
        if(this.spritesheet || this.animations) {
            if(this.direction == "left") {
                this.spriteRow = 0
            } else if(this.direction == "right") {
                this.spriteRow = 1
            } else {
                this.spriteRow = 2
            }

            this.animationTicks++

            if(this.animationTicks == 16) {
                this.animationTicks = 0

                this.animationFrame += (this.invert ? -1 : 1)
            }

            let end

            if(this.animations) {
                end = this.animationFrame == this.animations.length
            } else if(this.spritesheet) {
                end = Math.abs(this.animationFrame) == this.spritesheet.cols
            }

            if(end) {
                this.animationFrame = 0
            }
        }
    }

    render() {
        let yOffset = 2 //removes gap between entities and floors

        if(!this.isCollidable()) {
            yOffset = 0
        }

        let context = States.PLAY.context

        context.beginPath()

        let rX = this.x - world.x
        let rY = this.y + yOffset - world.y

        if(this.animations) {
            context.drawImage(this.animations[this.animationFrame], rX, rY, this.width, this.height)
        } else {
            if(this.spritesheet) {
                let x = this.spritesheet.x * this.animationFrame
                let y = this.spritesheet["row" + this.spriteRow]

                if(this.invert) {
                    x = this.spritesheet.x * (this.spritesheet.cols + this.animationFrame)
                }

                context.drawImage(this.spritesheet.img, x, y, this.spritesheet.x, this.spritesheet.y, rX, rY, this.width, this.height)
            } else {
                context.fillStyle = this.colour ? this.colour : "black"
                context.fillRect(rX, rY, this.width, this.height)
            }
        }

        context.fill()
        context.stroke()
    }

	getType() {
        return this.constructor.name
    }
}

export class Entity extends Animatable {
	constructor(x, y, width = canvas.width / 30, height = canvas.height / 30) {
        super(x, y, width, height)

		abstractCheck("Entity", this.constructor.name)

        this.uuid = randomUUID()
    }

    isCollidable() { return true }

    onCollideWith(entity) { }

    equals(other) {
        return other && other instanceof Entity && other.uuid.toString() == this.uuid.toString()
    }

    remove() {
        world.remove(this)
        this.drop()
    }

    drop() { }

    canPickUp() { return false }

	onInteractedWith(){}

	isInteractable() { return true }
}

export class StaticEntity extends Entity {
    constructor(x, y, width, height) {
        super(x, y, width, height)

		abstractCheck("StaticEntity", this.constructor.name)
    }

    isCollidable() { return false }
    move(direction, amount=2) {}
    moveY(y, attempt=0) {}
}

export class MovingEntity extends Entity {
    constructor(x, y, width = canvas.width / 30, height = canvas.height / 30) {
        super(x, y, width, height)

		abstractCheck("MovingEntity", this.constructor.name)
		
		this.jumping = false
		this.running = false
		this.jumpTicks = 0
		this.jumpTicksMax = 48
        this.fallingTicks = 0
		this.falling = false
       
	}

	tick() {
        super.tick()

        for(let i = 0; i < world.entities.length; i++) {
            if(this.collides(world.entities[i])) {
                this.onCollideWith(world.entities[i])
            }
        }

		if(this.jumping) {
			this.moveY(-(-calculateJumpSpeed(this)) + (0.5))

			this.jumpTicks--

			if(this.jumpTicks <= 0) {
				this.jumping = false
			}
		} else {
            if(this.y + this.height < world.height && !this.isColliding()) {
				this.fall()
			} else {
				this.falling = false
				this.fallingTicks = 0
			}
        }
	}

    fall() {
        this.falling = true
        this.fallingTicks++
        this.moveY(1 - calculateFallSpeed(this))
    }

	move(direction, amount=2) {
		let ox = this.x
        this.direction = direction

		this.x += (direction == "left" ? -amount : amount)

		if(this.x < 0) {
			this.x = 0
		}

		if(this.x + this.width >= world.width) {
			this.x = world.width - this.width
		}

		for(let i = 0; i < world.entities.length; i++) {
			if(!world.entities[i].isCollidable() && this.collides(world.entities[i], false, 1)) {
				this.x = ox

				if(amount == 2) {
					this.move(direction, 1)
					break
				}
			}
		}

        if(ox != this.x) {
            let d = ox - this.x

            if(d < 0) {
                this.direction = "right"
            } else {
                this.direction = "left"
            }
        } else {
            this.direction = ""
        }
	}

	moveX(x) { 

	}

	moveY(y, attempt=0) {
		let oy = (this.y)

		this.y += y

		if(this.y < 0) {
			this.y = 0
		}

		if(this.y + this.height > world.height) {
			this.y = world.height - this.height
		}
		
		for(let i = 0; i < world.entities.length; i++) {
			if(!world.entities[i].isCollidable() && this.collides(world.entities[i])) {
				this.y = Math.floor(oy + (y > 0 ? -1 : 0))

                if(attempt == 0) {
                    this.moveY(-0.5, 1)
                }

				if(this.jumpTicks > 0) {
					this.jumpTicks = 0
				}
			}
		}
	}

	collides(entity, eq=false, offset=0, offset2=0) {
        eq = false

        if(this == entity) {
            return false
        }

		let x1 = this.x - offset
		let x2 = entity.x + entity.width
		let x3 = this.x + this.width - offset2

		let y1 = this.y - offset
		let y2 = entity.y + entity.height - offset
		let y3 = this.y + this.height - offset

        if(!eq) {
			return x1 < x2 && entity.x < x3 && y1 < y2 && entity.y < y3
        } else {
			return x1 <= x2 && entity.x <= x3 && y1 <= y2 && entity.y <= y3
        }
	}

	jump() {
		if(this.falling) {
			return
		}

		this.jumping = true
	}

    isColliding() {
		for(let i = 0; i < world.entities.length; i++) {
			if(this.collides(world.entities[i], false, -2)) {
                if(!world.entities[i].isCollidable()) {
                    return true
                }
			}
		}
		
		return false
	}
}

export class LivingEntity extends MovingEntity {
    constructor(x, y, width = canvas.width / 30, height = canvas.height / 30, xPath, delay = 0) {
        super(x, y, width, height)

		abstractCheck("LivingEntity", this.constructor.name)
		
		this.movementCooldown = 6
        this.movementTicks = 0
        this.xPath = xPath
        this.ox = this.x
        this.oy = this.y
        this.idle = 0
        this.sX = this.x - this.xPath
        this.eX = this.x + this.xPath
        this.delay = delay
        //this.drawPath = true
        this.nextDirection = "right"
        this.movement = 2
        this.expectedDirection = "right"
        this.delayTicks = 0
		this.health = 1
	}

    render() {
        if(this.drawPath) {
			let xx = this.ox - world.x
			let yy = this.y - world.y

			let context = States.PLAY.context

            context.beginPath()
            context.fillStyle = "black"
            context.fillRect(xx, yy, this.width, this.height)
            context.fillStyle = "red"
            context.fillRect(xx - this.xPath, yy, this.width, this.height)
            context.fillStyle = "blue"
            context.fillRect(xx + this.xPath, yy, this.width, this.height)
            context.stroke()
        }

        super.render() //call after so that entity is in-front of path
    }

	//TODO: fix blob getting stuck in endless loop
	tick() {
        super.tick()

        if(this.xPath <= 0) {
            this.move("", 0)
            return
        }

        this.movementTicks++

        if(this.movementTicks >= this.movementCooldown) {
            if(this.delayTicks > 0) {
                this.delayTicks--
                this.move("", 0)
                return
            }

            this.direction = this.expectedDirection

            let px = this.x

            this.move(this.direction, this.movement)

            let xx = this.direction == "left" ? -this.movement : this.movement

            if(this.x == px) {
                this.idle += xx
            }

            if(this.x + this.idle <= this.sX || (this.x + this.idle) >= this.eX) {
                this.direction = this.nextDirection
                this.idle = 0
                this.nextDirection = this.direction == "right" ? "left" : "right"
                this.expectedDirection = this.nextDirection
                this.delayTicks = this.delay
            }

            this.movementTicks = 0
        }
	}

	damage(amount=1) {
		if(!this.isDamageable()) {
			return
		}

		this.health -= amount

		if(this.health <= 0) {
			this.remove()
		}
	}

	isDamageable() { return true }
}

export class StaticLivingEntity extends LivingEntity {
    constructor(x, y, width, height) {
        super(x, y, width, height)

		abstractCheck("StaticLivingEntity", this.constructor.name)
    }

    isCollidable() { return false }
    move(direction, amount=2) {}
    moveY(y, attempt=0) {}
}

export class Platform extends StaticEntity {
	constructor(x, y, w, h) {
		super(x, y, w, h)
	}
}

export class Coin extends MovingEntity {
	constructor(x, y) { super(x, y) }

    canPickUp() {
        return true
    }
}

export class Gem extends MovingEntity {
	constructor(x, y) { super(x, y) }

    canPickUp() {
        return true
    }
}

export class Leaves extends StaticLivingEntity {
	constructor(x, y, tree) {
		super(x, y)

		this.tree = tree

		this.colour = "green"
		this.leafRate = new Random().randint(600, 1200)
		this.leafTicks = 0
		this.spawnLeaves = true
	}

	tick() {
		if(this.spawnLeaves) {
			this.leafTicks++

			if(this.leafTicks == this.leafRate) {
				this.leafTicks = 0
				this.leafRate = new Random().randint(600, 1200)
				this.spawnLeaf()
			}
		}
	}

	disable() {
		this.spawnLeaves = false
	}

	isCollidable() {
		return true
	}

	drop() {
		let x = new Random().nextInt(3) + 1

		for(let i = 0; i < x; i++) {
			this.spawnLeaf()
		}
	}

	spawnLeaf() {
		let leaf = new Leaf(this.x, this.y, this.width, this.height)
		world.add(leaf)
	}
}

export class Tree extends StaticLivingEntity {
	constructor(x, y, h) {
		super(x, y)

		this.colour = "brown"
		this.size = canvas.width / 30
		this.treeHeight = h
		this.height = this.height * h
		this.h = this.height
		super.health = 3

		let a = new Leaves(this.x, this.y - this.size, this)
		a.disable()
		let b = new Leaves(this.x - this.size, this.y, this)
		let c = new Leaves(this.x + this.size, this.y, this)

		this.leaves = [a, b, c]

		world.add(a, b, c)
	}

    drop() {
        let amount = this.height / this.width

        for(let i = 0; i < amount; i++) {
            world.add(new Log(this.x, this.y + (this.width * i)))
        }
    }

	remove() {
		this.leaves.forEach(e => {
			if(world.entities.includes(e)) {
				e.remove()
			}
		})

		super.remove()
	}

	damage(amount=1) {
		if(amount < this.health) {
			this.leaves.forEach(e => {
				e.spawnLeaf()
			});
		}

		super.damage(amount)
	}
}

export class BackgroundTree extends Tree {
	constructor(x, y, h) {
		super(x, y, h)
	}

	isCollidable() { return true }
}

export class Swayable extends MovingEntity {
	constructor(x, y) {
		super(x, y)

		this.sway =  new Random().nextInt(100) < 50 ? "left" : "right"
		this.swaySwitch = new Random().randint(6, 8)
		this.swayMin = new Random().randint(1, 3)
		this.swayMax = new Random().randint(4, 6)
		this.swayTicks = 0
		this.swayDelay = new Random().randint(6, 10)
		this.delayTicks = 0
		this.sways = true
	}

	fall() {
        this.falling = true
        this.fallingTicks++

		if(this.sways) {
			this.delayTicks++

			if(this.delayTicks >= this.swayDelay) {
				this.swayTicks++

				if(this.swayTicks >= this.swaySwitch + this.swayDelay) {
					this.swayTicks = 0
					this.sway = this.sway == "right" ? "left" : "right"
				}
		
				if(this.y < world.height - (this.height * 2)) {
					this.move(this.sway, new Random().randfloat(this.swayMin, this.swayMax))
				}

				this.delayTicks = 0
			}
		}

		this.moveY(1 - (Math.random()))
    }
}

//TODO: implement wind that controls sway direction
//TODO: sway amount/speed dependent on wind.speed
export class Leaf extends Swayable {
	constructor(x, y) { super(x, y) }

    canPickUp() { return true }
}

export class Blob extends LivingEntity {
	constructor(x, y) {
		super(x, y, 32, 32, 64)
	}
}

export class Dragon extends LivingEntity {
	constructor(x, y) {
		super(x, y, 64, 64, 32, 0)
	}

	fire() {
		world.add(new Fire(this.x, this.y, 64, 64, this))
	}

	isDamageable() { return false }

	onInteractedWith() { this.fire() }
}

export class Slime extends LivingEntity {
	constructor(x, y) {
		super(x, y, 32, 32, 48, 128)
	}
}

export class Fire extends StaticEntity {
	constructor(x, y, w, h, parent) {
		super(x, y, w, h)

		this.parent = parent
		this.ticks = 0
	}

	tick() {
		if(this.parent.direction == "left") {
			this.spritesheet = sprites.fire_left
			this.invert = true
		} else {
			this.spritesheet = sprites.fire
			this.invert = false
		}

		super.tick()

		this.x = this.parent.x + (this.invert ? -this.parent.width : this.parent.width)
		this.y = this.parent.y

		
		if(this.animationFrame == 0 && this.ticks > 16) {
			world.remove(this)
		}

		this.ticks++
	}

	isCollidable() { return true }
}

export class Log extends MovingEntity {
    constructor(x, y) { super(x, y) }

    canPickUp() { return true }
}