import { world } from "./world.js"
import {start, stop, running} from "./main.js"

class State {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId)
        this.context = this.canvas.getContext("2d")
    }

    getType() { return this.constructor.name }
    tick() {}
    render() {}
    init() {}

    fill(colour = "white") {
        this.context.beginPath()
        this.context.fillStyle = colour
        this.context.rect(0, 0, this.canvas.width, this.canvas.height)
        this.context.fill()
        this.context.stroke()
    }

    drawGrid() {
        this.context.beginPath()
        for(let i = 0; i < 32; i++) {
            let x = this.canvas.width / 32
            let y = this.canvas.height / 32
            this.context.moveTo(x * i, 0)
            this. context.lineTo(x * i, canvas.height)
    
            this.context.moveTo(0, y * i)
            this.context.lineTo(canvas.width, y * i)
        }
    
        this.context.stroke()
    }
}

class PlayState extends State {
    constructor() {
        super("canvas")
    }

    // init() {
    //     if(!running) {
    //         start()
    //     }
    // }

    tick() {
        world.tick()
    }

    render() {
        world.render()
    }
}

class PauseState extends State {
    constructor() {
        super("canvas")
    }

    init() {
        this.rendered = false
    }

    render() {
        if(!this.rendered) { //avoids unnecessary rendering
            this.context.font = "32px arial"
            this.context.fillStyle = "blue"
            let text = "Paused, press Escape to unpause"
            let metrics = this.context.measureText(text)
            let mheight = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent

            this.context.beginPath()
            this.context.fillText("Paused, press Escape to unpause", (this.canvas.width - metrics.width) / 2, (this.canvas.height - mheight) / 2)
            this.context.stroke()
            this.rendered = true
        }
    }
}

export const PLAY = new PlayState()
export const PAUSE = new PauseState()