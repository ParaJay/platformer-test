import * as States from "./states.js"

export class World {
    #remQue; #addQue

    constructor() {
        this.x = 0
        this.y = 0
        this.width = 1200
        this.height = 1300
        this.px = 0
        this.py = 0
        this.yOffset = 50
        this.entities = []
        this.#remQue = []
        this.#addQue = []
    }

    add(...entities) {
        entities.forEach(entity => {
            this.#addQue.push(entity)
        })
    }

    remove(...entities) {
        entities.forEach(entity => {
            this.#remQue.push(entity)
        })
    }

    tick() {
        if(this.#remQue.length > 0) {
            for(let i = 0; i < this.#remQue.length; i++) {
                for(let j = 0; j < this.entities.length; j++) {
                    if(this.entities[j].equals(this.#remQue[i])) {
                        this.entities.splice(j, 1)
                    }
                }
                
            }
    
            this.#remQue = []
        }
    
        if(this.#addQue.length > 0) {
            for(let i = 0; i < this.#addQue.length; i++) {
                let add = this.#addQue[i]
    
                if(add) {
                    this.entities.unshift(add)
                }
            }
    
            this.#addQue = []
        }
        
        for(let i = 0; i < this.entities.length; i++) {
            this.entities[i].tick()
        }
    }

    render() {
        let context = States.PLAY.context

        
        // States.PLAY.fill()
        States.PLAY.fill("rgb(112, 215, 84)")
    
        context.fillStyle = "black"
    
        // drawGrid()
    
        let x
        for(let i = 0; i < this.entities.length; i++) {
            if(this.entities[i].constructor.name == "Player") {
                x = i
                continue
            }
    
            this.entities[i].render()
        }
    
        this.entities[x].render() //render player last
    }
}

export const world = new World()