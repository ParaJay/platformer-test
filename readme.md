# platformer-test

a simple platformer I made to test certain things
<br>
notable things I wanted to test
- animatable entities using sprite sheets or multiple images (this is the first time I tried to use spritesheets and I am very pleased with the results!)
- entity collisions
- simple physics (implementation of gravity used to control jump and fall speeds)
- simple game loop (target: 60fps)

## Controls

`A` - moves the player left
<br>
`D` - moves the player right
<br>
`SPACE` - jump (holding will charge the jump allowing different heights to be reached), if dev mode is activate this will just make the player fly higher
<br>
`SHIFT` - if dev mode is active this will lower the player
<br>
`X` - toggles dev mode
<br>
`I` - logs the player's inventory to the console
<br>
`E` -
<br> &emsp;&emsp; 
calls `LivingEntity.damage` damages if `LivingEntity.isDamageable`
<br> &emsp;&emsp;
calls `Entity.onInteractedWith` if `Entity.isInteractable`

## Known Issues
- blob entity will get stuck when reaching the end of its path (after Tree is destroyed) and will constantly switch directions

## Future Plans
- adding Wind which will affect Swayables sway distance, Fall speed, Jump power and Movement speed

## Entities
entities are collidable unless specified otherwise
<br>
entities can mostly be interacted with
<br>
entities have gravity and can fall unless specified otherwise
<br>
living entities follow a path

`Tree`
- destroys when interacted with
- destroys all associated Leaves when Tree is destroyed]
- non-collidable

`BackgroundTree`
- collidable

`Leaves`
- the block representation of a Leaf
- spawns a Leaf entity when the player collides with it
- destroys when interacted with
- spawns Leaf when destroyed
- spawns Leaf when damaged
- spawns Leaf every 600 - 1200 ticks if alive

`Leaf`
- sways randomly as if being blown by the wind
- can be picked up
- has gravity

`Log`
- spawned when a Tree is destroyed
- can be picked up
- 
`Coin`
- can be picked up

`Gem`
- can be picked up

`Dragon`
- living
- breathes Fire when interacted with
- not damageable

`Fire`
- animated fire blast

`Blob`
- living

`Slime`
- living

`Platform`
- non-collidable

## Abstract Entities
`Animatable`
- changes animation 'frame' every 16 ticks

`Entity`
- extends Animatable
- each has unique id
- can be interacted with (if supported)
- can be collided with
- removable from world
- can be 'dropped' (if supported)

`StaticEntity`
- extends Entity
- cannot move :(

`MovingEntity`
- extends Entity
- can move :o
- has gravity (can fall and jump)

`LivingEntity`
- extends MovingEntity
- has health
- can follow a set path

`StaticLivingEntity`
- extends LivingEntity
- although it also extends MovingEntity, it cannot move

