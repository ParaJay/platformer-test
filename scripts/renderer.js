import * as States from "./states.js"

export class Renderer {
    constructor() {
        this.state = States.PLAY
    }

    setState(state) {
        this.state = state
        this.state.init()
        //TODO: hide other canvases
    }

    tick() {
        this.state.tick()
    }

    render() {
        this.state.render()
    }
}