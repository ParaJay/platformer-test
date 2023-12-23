export const animations = {}
export const sprites = {}

export class Animations {
    constructor() {
        setAnimations("coin", 5)
        setAnimations("leaf", 1)
        setAnimations("log", 1)
		setSpriteSheet("gem", 4)
        setSpriteSheet("blob", 4, 4)
        setSpriteSheet("dragon", 4, 4)
        setSpriteSheet("slime", 8, 3)
        setSpriteSheet("fire", 6, 4)
        setSpriteSheet("fire_left", 6, 4)
    }
}

function setAnimations(name, amount) {
	for(let i = 0; i < amount; i++) {
		let img = document.createElement("img")

		img.src = "./res/" + name + "-" + i + ".png"
        img.onload = () => {
            if(!(name in animations)) {
                animations[name] = []
            }
    
            animations[name].push(img)
        }		
	}
}

function setSpriteSheet(name, cols, rows) {
	let img = document.createElement("img")

	img.src = "./res/" + name + "_spritesheet.png"

    img.onload = () => {
        if(!(name in sprites)) {
            sprites[name] = {}
        }
    
        sprites[name].src = name //just for console.log :)
        sprites[name].img = img
        sprites[name].rows = rows
        sprites[name].cols = cols
    
        for(let i = 0; i < rows; i++) {
            sprites[name]["row" + i] = (img.height / rows) * i
            
            sprites[name].x = img.width / cols
            sprites[name].y = img.height / rows
        }
    }
}

new Animations()