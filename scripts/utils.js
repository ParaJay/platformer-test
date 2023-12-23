export class Random {
    constructor() {

    }

    /**
     * 
     * @param {Number} int the maximum value (inclusive)
     * @returns a number between 0 and int
     */
    nextInt(int) {
        return this.randint(0, int)
    }

    /**
     * 
     * @param {Number} min 
     * @param {Number} max 
     * @returns a number >= min and <= max
     */
    randint(min, max) {
        min = Math.ceil(min)
        max = Math.floor(max)
    
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    randfloat(min, max) {
        return Math.random() * (max - min) + min
    }
}

export function randomUUID() {
    let res = ""

    let chars = "01234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM".split("")

    let lists = [
        shuffle(chars),
        shuffle(chars),
        shuffle(chars),
        shuffle(chars)
    ]

    let dashes = 0
    let nextDash = 8

    while(res.length < 36) {
        if(res.length == nextDash && res.length != 0) {
            res += "-"
            dashes++
            nextDash += (8 + dashes)
        } else {
            let random = new Random().nextInt(chars.length - 1)

            let list = lists[new Random().nextInt(lists.length - 1)]

            res += list[random]
        }
    }

    return res
}

function shuffle(array) {
    let res = []
    
    array.forEach(e => {
        res.push(e)
    })

    for(let i = res.length - 1; i >= 1; i--) {
        let j = Math.floor(Math.random() * i)
        
        let a = res[i]
        let b = res[j]

        res[i] = b
        res[j] = a
    }

    return res
}

export function isUUID(uuid) {
    return uuid.match("[0-9a-zA-Z]{8}(-{1}[0-9a-zA-Z]{8}){3}")
}

export function calculateJumpSpeed(entity) {
    let acceleration = -9.81 * (entity.jumpTicks / (entity.jumpTicksMax * 2))
    return acceleration
}

export function calculateFallSpeed(entity) {
    let mps = entity.fallingTicks / 64
    let acceleration = -9.81 * (mps ** 2)

    return acceleration
}