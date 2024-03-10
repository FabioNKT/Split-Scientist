let instructionStepsR = 0;

let oneTimeR = 0

let txtIncrementR = 0;

let inventoryR = []

document.addEventListener('DOMContentLoaded', function () {
    let canvasR = document.querySelector('section:last-of-type>canvas');
    let ctxR = canvasR.getContext('2d');

    const CANVAS_WIDTH_R = canvasR.width = 15 * 16;
    const CANVAS_HEIGHT_R = canvasR.height = 50 * 16;

    let introductionPR = document.querySelector('div:last-of-type>p')

    const OFFSET_R = {
        x: TILE_WIDTH * -23.5 + (CANVAS_WIDTH_R - 16) / 2,
        y: TILE_HEIGHT * -15.5 + (CANVAS_HEIGHT_R - 32) / 2
    }

    let inventorySlotsR = [
        slot6 = new Sprite(ctxR, {
                x: TILE_WIDTH,
                y: (17 * TILE_WIDTH) + TILE_HEIGHT
            },
            emptyImage),
        slot7 = new Sprite(ctxR, {
                x: TILE_WIDTH * 4,
                y: (17 * TILE_WIDTH) + TILE_HEIGHT
            },
            emptyImage),
        slot8 = new Sprite(ctxR, {
                x: TILE_WIDTH * 7,
                y: (17 * TILE_WIDTH) + TILE_HEIGHT
            },
            emptyImage),
        slot9 = new Sprite(ctxR, {
                x: TILE_WIDTH * 10,
                y: (17 * TILE_WIDTH) + TILE_HEIGHT
            },
            emptyImage),
        slot0 = new Sprite(ctxR, {
                x: TILE_WIDTH * 13,
                y: (17 * TILE_WIDTH) + TILE_HEIGHT
            },
            emptyImage),
    ]

    // Collisions ////////////////////////////////////////////////////////////////////////////////////////

    let collisionMapR = []
    for (let i = 0; i < collisionDataR.length; i += 33) {
        collisionMapR.push(collisionDataR.slice(i, 33 + i))
    }

    let collisionObjectArrayR = [] // Alleen 1s
    collisionMapR.forEach((row, i) => {
        row.forEach((one, j) => {
            if (one === 1) {
                collisionObjectArrayR.push(new Collision({
                        x: j * TILE_WIDTH + OFFSET_R.x,
                        y: i * TILE_HEIGHT + OFFSET_R.y
                    },
                    ctxR))
            }
        })
    })

    // Instanceof ////////////////////////////////////////////////////////////////////////////////////////

    let hitboxR = new Hitbox(
        ctxR, {
            x: (CANVAS_WIDTH_R - 10) / 2,
            y: (CANVAS_HEIGHT_R + 6) / 2
        },
        10,
        8
    )

    let playerR = new SpritePlayer(ctxR, DOWN)

    let backgroundR = new Sprite(
        ctxR, {
            x: OFFSET_R.x,
            y: OFFSET_R.y
        },
        mapRightImage
    )

    // In-game Objects

    let objectBigPotArrayR = [
        bigPotPurpleShard = new Sprite(
            ctxR, {
                x: OFFSET_R.x + TILE_WIDTH * 29,
                y: OFFSET_R.y + TILE_HEIGHT * 20
            },
            bigPotImage
        ),
        bigPotRuby = new Sprite(
            ctxR, {
                x: OFFSET_R.x + TILE_WIDTH * 25,
                y: OFFSET_R.y + TILE_HEIGHT * 20
            },
            bigPotImage
        ),
    ]

    let objectShadowArrayR = [
        shadowEndPotionR = new Sprite(
            ctxR, {
                x: OFFSET_R.x + TILE_WIDTH * 30,
                y: OFFSET_R.y + TILE_HEIGHT * 15
            },
            shadowImage
        ),
        shadowPowderR = new Sprite(
            ctxR, {
                x: OFFSET_R.x + TILE_WIDTH * 30,
                y: OFFSET_R.y + TILE_HEIGHT * 3
            },
            shadowImage
        ),
        shadowPotion = new Sprite(
            ctxR, {
                x: OFFSET_R.x + TILE_WIDTH * 6,
                y: OFFSET_R.y + TILE_HEIGHT * 3
            },
            shadowImage
        )
    ]

    let objectOilpotArrayR = [
        oilpotSquareRuby = new Sprite(
            ctxR, {
                x: OFFSET_R.x + TILE_WIDTH * 25,
                y: OFFSET_R.y + TILE_HEIGHT * 22
            },
            oilpotSquareImage
        ),
        oilpotCirclePowderR = new Sprite(
            ctxR, {
                x: OFFSET_R.x + TILE_WIDTH * 27,
                y: OFFSET_R.y + TILE_HEIGHT * 4
            },
            oilpotCircleImage
        ),
        oilpotTrianglePotion = new Sprite(
            ctxR, {
                x: OFFSET_R.x + TILE_WIDTH * 1,
                y: OFFSET_R.y + TILE_HEIGHT * 4
            },
            oilpotTriangleImage
        ),
        oilpotCirclePotion = new Sprite(
            ctxR, {
                x: OFFSET_R.x + TILE_WIDTH * 1,
                y: OFFSET_R.y + TILE_HEIGHT * 5
            },
            oilpotCircleImage
        )
    ]

    let objectPotArrayR = [
        potPlants = new Sprite(
            ctxR, {
                x: OFFSET_R.x + TILE_WIDTH * 28,
                y: OFFSET_R.y + TILE_HEIGHT * 2
            },
            potImage
        ),
        potPlantsPowder = new Sprite(
            ctxR, {
                x: OFFSET_R.x + TILE_WIDTH * 2,
                y: OFFSET_R.y + TILE_HEIGHT * 2
            },
            potImage
        ),
        potShardPowder = new Sprite(
            ctxR, {
                x: OFFSET_R.x + TILE_WIDTH * 3,
                y: OFFSET_R.y + TILE_HEIGHT * 2
            },
            potImage
        ),
        potPotionEmpty = new Sprite(
            ctxR, {
                x: OFFSET_R.x + TILE_WIDTH * 4,
                y: OFFSET_R.y + TILE_HEIGHT * 2
            },
            potImage
        )
    ]

    let objectEndPotArrayR = [
        potEnd1R = new Sprite(
            ctxR, {
                x: OFFSET_R.x + TILE_WIDTH * 26,
                y: OFFSET_R.y + TILE_HEIGHT * 14
            },
            potImage
        ),
        potEnd2R = new Sprite(
            ctxR, {
                x: OFFSET_R.x + TILE_WIDTH * 24,
                y: OFFSET_R.y + TILE_HEIGHT * 14
            },
            potImage
        ),
        potEnd3R = new Sprite(
            ctxR, {
                x: OFFSET_R.x + TILE_WIDTH * 22,
                y: OFFSET_R.y + TILE_HEIGHT * 14
            },
            potImage
        )
    ]

    let objectPotStarterArrayR = [
        potStarterCircleR = new Sprite(
            ctxR, {
                x: OFFSET_R.x + TILE_WIDTH * 1,
                y: OFFSET_R.y + TILE_HEIGHT * 10
            },
            potImage
        ),
        potStarterSquareR = new Sprite(
            ctxR, {
                x: OFFSET_R.x + TILE_WIDTH * 1,
                y: OFFSET_R.y + TILE_HEIGHT * 11
            },
            potImage
        ),
        potStarterStarR = new Sprite(
            ctxR, {
                x: OFFSET_R.x + TILE_WIDTH * 1,
                y: OFFSET_R.y + TILE_HEIGHT * 12
            },
            potImage
        ),
        potStarterTriangleR = new Sprite(
            ctxR, {
                x: OFFSET_R.x + TILE_WIDTH * 1,
                y: OFFSET_R.y + TILE_HEIGHT * 13
            },
            potImage
        ),
    ]

    // Hitbox

    let hitboxGarbageR = new Hitbox(ctxR, {
            x: OFFSET_R.x + TILE_WIDTH * 4,
            y: OFFSET_R.y + TILE_HEIGHT * 11
        },
        16,
        8)

    let hitboxBigPotArrayR = [
        hitboxBigPotPurpleShard = new Hitbox(
            ctxR, {
                x: bigPotPurpleShard.position.x + 20,
                y: bigPotPurpleShard.position.y + TILE_HEIGHT * 2
            },
            8,
            8,
            'purpleShard'
        )
    ]

    let hitboxBigPotRubyArrayR = [
        hitboxBigPotRuby = new Hitbox(
            ctxR, {
                x: bigPotRuby.position.x + 20,
                y: bigPotRuby.position.y + TILE_HEIGHT * 2
            },
            8,
            8,
            'ruby'
        )
    ]

    let hitboxOilpotArrayR = [
        hitboxOilpotSquareRuby = new Hitbox(ctxR, {
                x: oilpotSquareRuby.position.x + TILE_WIDTH,
                y: oilpotSquareRuby.position.y + 22
            },
            4,
            4,
            'oilSquare'),
        hitboxOilpotCirclePowderR = new Hitbox(ctxR, {
                x: oilpotCirclePowderR.position.x + TILE_WIDTH,
                y: oilpotCirclePowderR.position.y + 22
            },
            4,
            4,
            'oilCircle'),
        hitboxOilpotTrianglePotion = new Hitbox(ctxR, {
                x: oilpotTrianglePotion.position.x + TILE_WIDTH,
                y: oilpotTrianglePotion.position.y + 22
            },
            4,
            4,
            'oilTriangle'),
        hitboxOilpotCirclePotion = new Hitbox(ctxR, {
                x: oilpotCirclePotion.position.x + TILE_WIDTH,
                y: oilpotCirclePotion.position.y + 22
            },
            4,
            4,
            'oilCircle')
    ]

    hitboxOilpotSquareRuby.shape = 'Square'
    hitboxOilpotSquareRuby.image = oilpotSquareImage

    hitboxOilpotCirclePowderR.shape = 'Circle'
    hitboxOilpotCirclePowderR.image = oilpotCircleImage

    hitboxOilpotTrianglePotion.shape = 'Triangle'
    hitboxOilpotTrianglePotion.image = oilpotTriangleImage

    hitboxOilpotCirclePotion.shape = 'Circle'
    hitboxOilpotCirclePotion.image = oilpotCircleImage

    let hitboxPotStarterArrayR = [
        hitboxPotStarterCircleR = new Hitbox(ctxR, {
                x: potStarterCircleR.position.x + TILE_WIDTH,
                y: potStarterCircleR.position.y + 22
            },
            4,
            4,
            'oilCircle'),
        hitboxPotStarterSquareR = new Hitbox(ctxR, {
                x: potStarterSquareR.position.x + TILE_WIDTH,
                y: potStarterSquareR.position.y + 22
            },
            4,
            4,
            'oilSquare'),
        hitboxPotStarterStarR = new Hitbox(ctxR, {
                x: potStarterStarR.position.x + TILE_WIDTH,
                y: potStarterStarR.position.y + 22
            },
            4,
            4,
            'oilStar'),
        hitboxPotStarterTriangleR = new Hitbox(ctxR, {
                x: potStarterTriangleR.position.x + TILE_WIDTH,
                y: potStarterTriangleR.position.y + 22
            },
            4,
            4,
            'oilTriangle'),
    ]

    let hitboxPotArrayR = [
        hitboxPotPlants = new Hitbox(ctxR, {
                x: potPlants.position.x + 4,
                y: potPlants.position.y + TILE_HEIGHT * 2
            },
            8,
            8,
            'mushroom'),
        hitboxPotPlantsPowder = new Hitbox(ctxR, {
                x: potPlantsPowder.position.x + 4,
                y: potPlantsPowder.position.y + TILE_HEIGHT * 2
            },
            4,
            4,
            'mushroomPowder'),
        hitboxPotShardPowder = new Hitbox(ctxR, {
                x: potShardPowder.position.x + 4,
                y: potShardPowder.position.y + TILE_HEIGHT * 2
            },
            4,
            4,
            'shardPowder'),
        hitboxPotPotionEmpty = new Hitbox(ctxR, {
                x: potPotionEmpty.position.x + 4,
                y: potPotionEmpty.position.y + TILE_HEIGHT * 2
            },
            4,
            4,
            'potionEmpty')
    ]

    hitboxPotPlants.item2 = 'weed'
    hitboxPotPlantsPowder.item2 = 'weedCrushed'
    hitboxPotShardPowder.item2 = 'rubyPowder'
    hitboxPotPotionEmpty.item2 = 'potionEmpty'

    let hitboxEndPotArrayR = [
        hitboxEndPot1R = new Hitbox(ctxR, {
                x: potEnd1R.position.x + 4,
                y: potEnd1R.position.y + TILE_HEIGHT * 2
            },
            8,
            8,
            'potionGreen'),
        hitboxEndPot2R = new Hitbox(ctxR, {
                x: potEnd2R.position.x + 4,
                y: potEnd2R.position.y + TILE_HEIGHT * 2
            },
            8,
            8,
            'potionRed'),
        hitboxEndPot3R = new Hitbox(ctxR, {
                x: potEnd3R.position.x + 4,
                y: potEnd3R.position.y + TILE_HEIGHT * 2
            },
            8,
            8,
            'blueShard')
    ]

    let hitboxShadowArrayR = [
        hitboxShadowEndPotionR = new Hitbox(ctxR, {
                x: shadowEndPotionR.position.x + 4,
                y: shadowEndPotionR.position.y + TILE_HEIGHT
            },
            8,
            8,
            'potionBlack'),
        hitboxShadowPowderR = new Hitbox(ctxR, {
                x: shadowPowderR.position.x + 4,
                y: shadowPowderR.position.y + TILE_HEIGHT
            },
            8,
            8,
            'mushroomPowder'),
        hitboxShadowPotion = new Hitbox(ctxR, {
                x: shadowPotion.position.x + 4,
                y: shadowPotion.position.y + TILE_HEIGHT
            },
            8,
            8,
            'potionGreen')
    ]

    hitboxShadowPotion.item2 = 'potionRed'
    hitboxShadowPowderR.item2 = 'weedCrushed'


    // Indicators

    let arrowR = new SpriteIndicator(ctxR, {
            x: (CANVAS_WIDTH_R - 16) / 2,
            y: (CANVAS_HEIGHT_R - 32) / 2 - 8
        },
        emptyImage,
        6,
        64)

    let arrowDownGarbageR = new SpriteIndicator(ctxR, {
            x: hitboxGarbageR.position.x,
            y: hitboxGarbageR.position.y - TILE_HEIGHT * 2.5
        },
        arrowDownImage,
        6,
        64)


    let timerBigPotArrayR = [
        timerBigPotPurpleShard = new SpriteIndicator(ctxR, {
                x: bigPotPurpleShard.position.x + 16,
                y: bigPotPurpleShard.position.y - 16
            },
            emptyImage,
            8,
            100
        )
    ]

    let timerBigPotRubyArrayR = [
        timerBigPotRuby = new SpriteIndicator(ctxR, {
                x: bigPotRuby.position.x + 16,
                y: bigPotRuby.position.y - 16
            },
            emptyImage,
            8,
            100
        ),
    ]

    let timerShadowArrayR = [
        timerShadowEndPotionR = new SpriteIndicator(ctxR, {
                x: shadowEndPotionR.position.x,
                y: shadowEndPotionR.position.y - 16
            },
            emptyImage,
            8,
            100
        ),

        timerShadowPowderR = new SpriteIndicator(ctxR, {
                x: shadowPowderR.position.x,
                y: shadowPowderR.position.y - 16
            },
            emptyImage,
            8,
            100
        ),

        timerShadowPotion = new SpriteIndicator(ctxR, {
                x: shadowPotion.position.x,
                y: shadowPotion.position.y - 16
            },
            emptyImage,
            8,
            100
        )
    ]

    window.addEventListener('keydown', (e) => {
        if (e.key === '6') {
            keys.six.pressed = true
        } else if (e.key === '7') {
            keys.seven.pressed = true
        } else if (e.key === '8') {
            keys.eight.pressed = true
        } else if (e.key === '9') {
            keys.nine.pressed = true
        } else if (e.key === '0') {
            keys.zero.pressed = true
        }
    })

    window.addEventListener('keyup', (e) => {
        if (e.key === '6') {
            keys.six.pressed = false
        } else if (e.key === '7') {
            keys.seven.pressed = false
        } else if (e.key === '8') {
            keys.eight.pressed = false
        } else if (e.key === '9') {
            keys.nine.pressed = false
        } else if (e.key === '0') {
            keys.zero.pressed = false
        }
    })

    window.addEventListener('keydown', (e) => {
        if (e.code === 'Enter') {
            keys.Enter.pressed = true
        }
    })

    window.addEventListener('keyup', (e) => {
        if (e.code === 'Enter') {
            keys.Enter.pressed = false
        }
    })

    let lastKeyR = ''
    window.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp') {
            keys.ArrowUp.pressed = true
            lastKeyR = 'ArrowUp'
        } else if (e.key === 'ArrowLeft') {
            keys.ArrowLeft.pressed = true
            lastKeyR = 'ArrowLeft'
        } else if (e.key === 'ArrowDown') {
            keys.ArrowDown.pressed = true
            lastKeyR = 'ArrowDown'
        } else if (e.key === 'ArrowRight') {
            keys.ArrowRight.pressed = true
            lastKeyR = 'ArrowRight'
        }
    })

    window.addEventListener('keyup', (e) => {
        if (e.key === 'ArrowUp') {
            keys.ArrowUp.pressed = false
        } else if (e.key === 'ArrowLeft') {
            keys.ArrowLeft.pressed = false
        } else if (e.key === 'ArrowDown') {
            keys.ArrowDown.pressed = false
        } else if (e.key === 'ArrowRight') {
            keys.ArrowRight.pressed = false
        }
    })

    // Movables ////////////////////////////////////////////////////////////////////////////////////////

    const movableObjectsR = [backgroundR,
        ...collisionObjectArrayR,
        ...objectBigPotArrayR,
        ...objectShadowArrayR,
        ...objectOilpotArrayR,
        ...objectPotArrayR,
        ...objectEndPotArrayR,
        ...objectPotStarterArrayR,
        ...hitboxBigPotArrayR,
        ...hitboxOilpotArrayR,
        ...hitboxPotStarterArrayR,
        ...hitboxPotArrayR,
        ...hitboxEndPotArrayR,
        ...hitboxShadowArrayR,
        ...hitboxBigPotRubyArrayR,
        ...timerBigPotArrayR,
        ...timerBigPotRubyArrayR,
        ...timerShadowArrayR,
        hitboxGarbageR,
        arrowDownGarbageR
    ]

    // Render canvasR ////////////////////////////////////////////////////////////////////////////////////////

    let lastTimeR = 0

    function renderR(timestamp) {

        if (!lastTimeR) lastTimeR = timestamp;

        let deltaTimeR = (timestamp - lastTimeR) / 1000;
        lastTimeR = timestamp;

        ctxR.clearRect(0, 0, CANVAS_WIDTH_R, CANVAS_HEIGHT_R)

        // Draw
        backgroundR.draw()
        collisionObjectArrayR.forEach((collisionBlock) => {
            collisionBlock.draw()
        })

        hitboxGarbageR.draw()

        objectBigPotArrayR.forEach((objectBlock) => {
            objectBlock.draw()
        })

        objectShadowArrayR.forEach((objectBlock) => {
            objectBlock.draw()
        })

        objectOilpotArrayR.forEach((objectBlock) => {
            objectBlock.draw()
        })

        objectPotArrayR.forEach((objectBlock) => {
            objectBlock.draw()
        })

        objectEndPotArrayR.forEach((objectBlock) => {
            objectBlock.draw()
        })

        objectPotStarterArrayR.forEach((objectBlock) => {
            objectBlock.draw()
        })

        hitboxBigPotArrayR.forEach((objectHitbox) => {
            objectHitbox.draw()
        })

        hitboxOilpotArrayR.forEach((objectHitbox) => {
            objectHitbox.draw()
        })

        hitboxPotStarterArrayR.forEach((objectHitbox) => {
            objectHitbox.draw()
        })

        hitboxPotArrayR.forEach((objectHitbox) => {
            objectHitbox.draw()
        })

        hitboxEndPotArrayR.forEach((objectHitbox) => {
            objectHitbox.draw()
        })

        hitboxShadowArrayR.forEach((objectHitbox) => {
            objectHitbox.draw()
        })

        hitboxBigPotRuby.draw()

        timerBigPotArrayR.forEach((objectTimer) => {
            objectTimer.update(deltaTimeR);
            objectTimer.draw()
        })

        timerBigPotRubyArrayR.forEach((objectTimer) => {
            objectTimer.update(deltaTimeR);
            objectTimer.draw()
        })

        timerShadowArrayR.forEach((objectTimer) => {
            objectTimer.update(deltaTimeR);
            objectTimer.draw()
        })

        playerR.update(deltaTimeR)
        playerR.draw()
        hitboxR.draw()

        arrowR.update(deltaTimeR);
        arrowR.draw()
        arrowDownGarbageR.update(deltaTimeR);
        arrowDownGarbageR.draw()

        // Hitbox interaction ////////////////////////////////////////////////////////////////////////////////////////

        if (keys.Enter.pressed || keys.seven.pressed || keys.eight.pressed || keys.nine.pressed || keys.zero.pressed) {
            oneTimeR++
        }

        if (!keys.Enter.pressed && !keys.seven.pressed && !keys.eight.pressed && !keys.nine.pressed && !keys.zero.pressed) {
            oneTimeR = 0;
        }

        if (collisionInteraction({
                shape1: hitboxR,
                shape2: hitboxGarbageR
            }) &&
            keys.Enter.pressed === true &&
            oneTimeR === 1 &&
            inventoryR[0] != 'oilCircle' &&
            inventoryR[0] != 'oilSquare' &&
            inventoryR[0] != 'oilStar' &&
            inventoryR[0] != 'oilTriangle') {
            inventoryR.shift()
        }

        hitboxBigPotArrayR.forEach((objectHitbox, index) => {
            if (collisionInteraction({
                    shape1: hitboxR,
                    shape2: objectHitbox
                }) &&
                keys.Enter.pressed === true &&
                oneTimeR === 1 &&
                objectHitbox.itemHeld.length === 0 &&
                !objectHitbox.isItemBeingCrafted) {

                objectHitbox.isItemBeingCrafted = true;
                timerBigPotArrayR[index].image = timerImage
                setTimeout(() => {
                    objectHitbox.isItemBeingCrafted = false;
                    objectHitbox.itemHeld.push(objectHitbox.item1)
                    timerBigPotArrayR[index].image = emptyImage
                }, 1500)
            } else if (collisionInteraction({
                    shape1: hitboxR,
                    shape2: objectHitbox
                }) &&
                inventoryR.length === 5 &&
                keys.Enter.pressed === true &&
                oneTimeR === 1 &&
                objectHitbox.itemHeld.length === 1) {
                // console.log('do nothing inventoryR is full')
            } else if ((collisionInteraction({
                        shape1: hitboxR,
                        shape2: objectHitbox
                    }) &&
                    inventoryR.length >= 0 &&
                    keys.Enter.pressed === true &&
                    oneTimeR === 1 &&
                    objectHitbox.itemHeld.length === 1)) {
                inventoryR.push(objectHitbox.itemHeld[0])
                objectHitbox.itemHeld.shift()
            }
        })

        if (collisionInteraction({
                shape1: hitboxR,
                shape2: hitboxBigPotRuby
            }) &&
            keys.Enter.pressed === true &&
            oneTimeR === 1 &&
            hitboxBigPotRuby.itemHeld.length === 0 &&
            hitboxOilpotSquareRuby.itemHeld.length === 0 &&
            !hitboxBigPotRuby.isItemBeingCrafted
        ) {
            // console.log('Dont execute potion there is no oil')
        } else if (collisionInteraction({
                shape1: hitboxR,
                shape2: hitboxBigPotRuby
            }) &&
            keys.Enter.pressed === true &&
            oneTimeR === 1 &&
            hitboxBigPotRuby.itemHeld.length === 0 &&
            hitboxOilpotSquareRuby.itemHeld.length === 1 &&
            !hitboxBigPotRuby.isItemBeingCrafted) {

            hitboxBigPotRuby.isItemBeingCrafted = true;
            timerBigPotRuby.image = timerImage
            setTimeout(() => {
                hitboxBigPotRuby.isItemBeingCrafted = false;
                hitboxBigPotRuby.itemHeld.push('ruby')
                timerBigPotRuby.image = emptyImage
            }, 1500)
        } else if (collisionInteraction({
                shape1: hitboxR,
                shape2: hitboxBigPotRuby
            }) &&
            keys.Enter.pressed === true &&
            oneTimeR === 1 &&
            hitboxBigPotRuby.itemHeld.length === 1 &&
            inventoryR.length >= 0 && inventoryR.length < 5) {
            inventoryR.push('ruby')
            hitboxBigPotRuby.itemHeld.shift()
        }

        hitboxOilpotArrayR.forEach((objectHitbox, index) => {
            if ((objectHitbox.itemHeld.length === 0)) {
                objectOilpotArrayR[index].image = objectHitbox.image
            } else if (objectHitbox.itemHeld[0] === 'oilCircle') {
                objectOilpotArrayR[index].image = oilpotCircleFillImage
            } else if (objectHitbox.itemHeld[0] === 'oilSquare') {
                objectOilpotArrayR[index].image = oilpotSquareFillImage
            } else if (objectHitbox.itemHeld[0] === 'oilStar') {
                objectOilpotArrayR[index].image = oilpotStarFillImage
            } else if (objectHitbox.itemHeld[0] === 'oilTriangle') {
                objectOilpotArrayR[index].image = oilpotTriangleFillImage
            }

            if (collisionInteraction({
                    shape1: hitboxR,
                    shape2: objectHitbox
                }) &&
                keys.Enter.pressed === true &&
                oneTimeR === 1 &&
                objectHitbox.itemHeld.length === 0 &&
                inventoryR[0] === objectHitbox.item1
            ) {
                objectHitbox.itemHeld.push(objectHitbox.item1)
                inventoryR.shift()
            } else if (collisionInteraction({
                    shape1: hitboxR,
                    shape2: objectHitbox
                }) &&
                keys.Enter.pressed === true &&
                oneTimeR === 1 &&
                objectHitbox.itemHeld.length === 1 &&
                inventoryR.length === 5
            ) {
                // console.log('do nothing inventoryR is full')
            } else if (collisionInteraction({
                    shape1: hitboxR,
                    shape2: objectHitbox
                }) &&
                keys.Enter.pressed === true &&
                oneTimeR === 1 &&
                objectHitbox.itemHeld.length === 1 &&
                inventoryR.length >= 0
            ) {
                inventoryR.push(objectHitbox.itemHeld[0])
                objectHitbox.itemHeld.shift()
            }
        })

        hitboxPotStarterArrayR.forEach((objectHitbox, index) => {
            if (starterPotArray[index][0] === 'oilCircle') {
                objectPotStarterArrayR[index].image = potCircleImage
            } else if (starterPotArray[index][0] === 'oilSquare') {
                objectPotStarterArrayR[index].image = potSquareImage
            } else if (starterPotArray[index][0] === 'oilStar') {
                objectPotStarterArrayR[index].image = potStarImage
            } else if (starterPotArray[index][0] === 'oilTriangle') {
                objectPotStarterArrayR[index].image = potTriangleImage
            } else if (starterPotArray[index].length === 1) {
                objectPotStarterArrayR[index].image = potFillImage
            } else {
                objectPotStarterArrayR[index].image = potImage
            }

            if (collisionInteraction({
                    shape1: hitboxR,
                    shape2: objectHitbox
                }) &&
                keys.Enter.pressed === true &&
                oneTimeR === 1 &&
                starterPotArray[index].length === 0 &&
                inventoryR.length > 0
            ) {
                starterPotArray[index].push(inventoryR[0])
                inventoryR.shift()
            } else if (collisionInteraction({
                    shape1: hitboxR,
                    shape2: objectHitbox
                }) &&
                keys.Enter.pressed === true &&
                oneTimeR === 1 &&
                starterPotArray[index].length === 1 &&
                inventoryR.length === 5
            ) {
                let shiftInventoryR = inventoryR.shift()
                starterPotArray[index].push(shiftInventoryR)
                let shiftItemHeldR = starterPotArray[index].shift()
                inventoryR.push(shiftItemHeldR)
            } else if (collisionInteraction({
                    shape1: hitboxR,
                    shape2: objectHitbox
                }) &&
                keys.Enter.pressed === true &&
                oneTimeR === 1 &&
                starterPotArray[index].length === 1 &&
                inventoryR.length >= 0
            ) {
                inventoryR.push(starterPotArray[index][0])
                starterPotArray[index].shift()
            }
        })

        hitboxPotArrayR.forEach((objectHitbox, index) => {
            if (objectHitbox.itemHeld.length === 1) {
                objectPotArrayR[index].image = potFillImage
            } else {
                objectPotArrayR[index].image = potImage
            }

            if (collisionInteraction({
                    shape1: hitboxR,
                    shape2: objectHitbox
                }) &&
                keys.Enter.pressed === true &&
                oneTimeR === 1 &&
                objectHitbox.itemHeld.length === 0 &&
                (inventoryR[0] === objectHitbox.item1 ||
                    inventoryR[0] === objectHitbox.item2) &&
                objectHitbox.itemHeld[0] != 'busy'
            ) {
                objectHitbox.itemHeld.push(inventoryR[0])
                inventoryR.shift()
            } else if (collisionInteraction({
                    shape1: hitboxR,
                    shape2: objectHitbox
                }) &&
                keys.Enter.pressed === true &&
                oneTimeR === 1 &&
                objectHitbox.itemHeld.length === 1 &&
                inventoryR.length === 5
            ) {
                // console.log('do nothing inventoryR is full')
            } else if (collisionInteraction({
                    shape1: hitboxR,
                    shape2: objectHitbox
                }) &&
                keys.Enter.pressed === true &&
                oneTimeR === 1 &&
                objectHitbox.itemHeld.length === 1 &&
                inventoryR.length >= 0 &&
                objectHitbox.itemHeld[0] != 'busy'
            ) {
                inventoryR.push(objectHitbox.itemHeld[0])
                objectHitbox.itemHeld.shift()
            }
        })

        hitboxEndPotArrayR.forEach((objectHitbox, index) => {
            if (endPotArray[index].itemHeld.length === 1) {
                objectEndPotArrayR[index].image = potFillImage
            } else {
                objectEndPotArrayR[index].image = potImage
            }

            if (collisionInteraction({
                    shape1: hitboxR,
                    shape2: objectHitbox
                }) &&
                keys.Enter.pressed === true &&
                oneTimeR === 1 &&
                endPotArray[index].itemHeld.length === 0 &&
                inventoryR[0] === endPotArray[index].item1 &&
                endPotArray[index].itemHeld[0] != 'busy'
            ) {
                endPotArray[index].itemHeld.push(inventoryR[0])
                inventoryR.shift()
            } else if (collisionInteraction({
                    shape1: hitboxR,
                    shape2: objectHitbox
                }) &&
                keys.Enter.pressed === true &&
                oneTimeR === 1 &&
                endPotArray[index].itemHeld.length === 1 &&
                inventoryR.length === 5
            ) {
                // console.log('do nothing inventoryR is full')
            } else if (collisionInteraction({
                    shape1: hitboxR,
                    shape2: objectHitbox
                }) &&
                keys.Enter.pressed === true &&
                oneTimeR === 1 &&
                endPotArray[index].itemHeld.length === 1 &&
                inventoryR.length >= 0 &&
                endPotArray[index].itemHeld[0] != 'busy'
            ) {
                inventoryR.push(endPotArray[index].itemHeld[0])
                endPotArray[index].itemHeld.shift()
            }
        })

        if (endPotArray[0].itemHeld[0] === 'potionGreen' &&
            endPotArray[1].itemHeld[0] === 'potionRed' &&
            endPotArray[2].itemHeld[0] === 'blueShard') {
            endPotArray[0].itemHeld.shift()
            endPotArray[0].itemHeld.push('busy')
            endPotArray[1].itemHeld.shift()
            endPotArray[1].itemHeld.push('busy')
            endPotArray[2].itemHeld.shift()
            endPotArray[2].itemHeld.push('busy')
            timerShadowEndPotionR.image = timerImage
            setTimeout(() => {
                endPotArray[0].itemHeld.shift()
                endPotArray[1].itemHeld.shift()
                endPotArray[2].itemHeld.shift()
                hitboxShadowEndPotionR.itemHeld.push('potionBlack')
                shadowEndPotionR.image = potionBlackImage
                timerShadowEndPotionR.image = emptyImage
            }, 5000)
        }

        if (collisionInteraction({
                shape1: hitboxR,
                shape2: hitboxShadowEndPotionR
            }) &&
            keys.Enter.pressed === true &&
            oneTimeR === 1 &&
            hitboxShadowEndPotionR.itemHeld.length === 1 &&
            inventoryR.length >= 0 && inventoryR.length < 5
        ) {
            inventoryR.push('potionBlack')
            hitboxShadowEndPotionR.itemHeld.shift()
            shadowEndPotionR.image = shadowImage
        }

        if (hitboxPotPlants.itemHeld[0] === 'mushroom' &&
            hitboxOilpotCirclePowderR.itemHeld[0] === 'oilCircle') {
            hitboxPotPlants.itemHeld.shift()
            hitboxPotPlants.itemHeld.push('busy')
            timerShadowPowderR.image = timerImage
            setTimeout(() => {
                hitboxPotPlants.itemHeld.shift()
                hitboxShadowPowderR.itemHeld.push('mushroomPowder')
                shadowPowderR.image = mushroomPowderImage
                timerShadowPowderR.image = emptyImage
            }, 20000)
        } else if (hitboxPotPlants.itemHeld[0] === 'weed' &&
            hitboxOilpotCirclePowderR.itemHeld[0] === 'oilCircle') {
            hitboxPotPlants.itemHeld.shift()
            hitboxPotPlants.itemHeld.push('busy')
            timerShadowPowderR.image = timerImage
            setTimeout(() => {
                hitboxPotPlants.itemHeld.shift()
                hitboxShadowPowderR.itemHeld.push('weedCrushed')
                shadowPowderR.image = weedCrushedImage
                timerShadowPowderR.image = emptyImage
            }, 20000)

        }

        if (collisionInteraction({
                shape1: hitboxR,
                shape2: hitboxShadowPowderR
            }) &&
            keys.Enter.pressed === true &&
            oneTimeR === 1 &&
            hitboxShadowPowderR.itemHeld[0] === 'mushroomPowder' &&
            inventoryR.length >= 0 && inventoryR.length < 5
        ) {
            inventoryR.push('mushroomPowder')
            hitboxShadowPowderR.itemHeld.shift()
            shadowPowderR.image = shadowImage
        } else if (collisionInteraction({
                shape1: hitboxR,
                shape2: hitboxShadowPowderR
            }) &&
            keys.Enter.pressed === true &&
            oneTimeR === 1 &&
            hitboxShadowPowderR.itemHeld[0] === 'weedCrushed' &&
            inventoryR.length >= 0 && inventoryR.length < 5
        ) {
            inventoryR.push('weedCrushed')
            hitboxShadowPowderR.itemHeld.shift()
            shadowPowderR.image = shadowImage
        }

        if (hitboxOilpotTrianglePotion.itemHeld[0] === 'oilTriangle' &&
            hitboxOilpotCirclePotion.itemHeld[0] === 'oilCircle' &&
            hitboxPotPlantsPowder.itemHeld[0] === 'mushroomPowder' &&
            hitboxPotShardPowder.itemHeld[0] === 'shardPowder' &&
            hitboxPotPotionEmpty.itemHeld[0] === 'potionEmpty') {
            hitboxPotPlantsPowder.itemHeld.shift()
            hitboxPotPlantsPowder.itemHeld.push('busy')
            hitboxPotShardPowder.itemHeld.shift()
            hitboxPotShardPowder.itemHeld.push('busy')
            hitboxPotPotionEmpty.itemHeld.shift()
            hitboxPotPotionEmpty.itemHeld.push('busy')
            timerShadowPotion.image = timerImage
            setTimeout(() => {
                hitboxPotPlantsPowder.itemHeld.shift()
                hitboxPotShardPowder.itemHeld.shift()
                hitboxPotPotionEmpty.itemHeld.shift()
                hitboxShadowPotion.itemHeld.push(hitboxShadowPotion.item1)
                shadowPotion.image = potionGreenImage
                timerShadowPotion.image = emptyImage
            }, 10000)
        } else if (hitboxOilpotTrianglePotion.itemHeld[0] === 'oilTriangle' &&
            hitboxOilpotCirclePotion.itemHeld[0] === 'oilCircle' &&
            hitboxPotPlantsPowder.itemHeld[0] === 'weedCrushed' &&
            hitboxPotShardPowder.itemHeld[0] === 'rubyPowder' &&
            hitboxPotPotionEmpty.itemHeld[0] === 'potionEmpty') {
            hitboxPotPlantsPowder.itemHeld.shift()
            hitboxPotShardPowder.itemHeld.shift()
            hitboxPotPotionEmpty.itemHeld.shift()
            timerShadowPotion.image = timerImage
            setTimeout(() => {
                hitboxShadowPotion.itemHeld.push(hitboxShadowPotion.item2)
                shadowPotion.image = potionRedImage
                timerShadowPotion.image = emptyImage
            }, 10000)
        }

        if (collisionInteraction({
                shape1: hitboxR,
                shape2: hitboxShadowPotion
            }) &&
            keys.Enter.pressed === true &&
            oneTimeR === 1 &&
            hitboxShadowPotion.itemHeld.length === 1 &&
            inventoryR.length >= 0 && inventoryR.length < 5
        ) {
            inventoryR.push(hitboxShadowPotion.itemHeld[0])
            hitboxShadowPotion.itemHeld.shift()
            shadowPotion.image = shadowImage
        }

        // arrowR indication

        arrowR.image = emptyImage
        hitboxBigPotArrayR.forEach((objectHitbox, index) => {
            if (collisionInteraction({
                    shape1: hitboxR,
                    shape2: objectHitbox
                }) && objectHitbox.itemHeld.length === 0) {
                arrowR.image = arrowDownImage
            } else if (collisionInteraction({
                    shape1: hitboxR,
                    shape2: objectHitbox
                }) && objectHitbox.itemHeld.length === 1) {
                arrowR.image = arrowUpImage
            }
        })

        hitboxBigPotRubyArrayR.forEach((objectHitbox, index) => {
            if (collisionInteraction({
                    shape1: hitboxR,
                    shape2: objectHitbox
                }) && objectHitbox.itemHeld.length === 0 &&
                hitboxOilpotSquareRuby.itemHeld.length === 1) {
                arrowR.image = arrowDownImage
            } else if (collisionInteraction({
                    shape1: hitboxR,
                    shape2: objectHitbox
                }) && objectHitbox.itemHeld.length === 1) {
                arrowR.image = arrowUpImage
            }
        })

        hitboxPotStarterArrayR.forEach((objectHitbox, index) => {
            if (collisionInteraction({
                    shape1: hitboxR,
                    shape2: objectHitbox
                }) && starterPotArray[index].length === 0) {
                arrowR.image = arrowDownImage
            } else if (collisionInteraction({
                    shape1: hitboxR,
                    shape2: objectHitbox
                }) && starterPotArray[index].length === 1) {
                arrowR.image = arrowUpImage
            }
        })

        hitboxOilpotArrayR.forEach((objectHitbox, index) => {
            if (collisionInteraction({
                    shape1: hitboxR,
                    shape2: objectHitbox
                }) && objectHitbox.itemHeld.length === 0 &&
                inventoryR[0] === objectHitbox.item1) {
                arrowR.image = arrowDownImage
            } else if (collisionInteraction({
                    shape1: hitboxR,
                    shape2: objectHitbox
                }) && objectHitbox.itemHeld.length === 1) {
                arrowR.image = arrowUpImage
            }
        })

        hitboxPotArrayR.forEach((objectHitbox, index) => {
            if (collisionInteraction({
                    shape1: hitboxR,
                    shape2: objectHitbox
                }) && objectHitbox.itemHeld.length === 0 &&
                (inventoryR[0] === objectHitbox.item1 ||
                    inventoryR[0] === objectHitbox.item2)) {
                arrowR.image = arrowDownImage
            } else if (collisionInteraction({
                    shape1: hitboxR,
                    shape2: objectHitbox
                }) && objectHitbox.itemHeld.length === 1) {
                arrowR.image = arrowUpImage
            }
        })

        hitboxEndPotArrayR.forEach((objectHitbox, index) => {
            if (collisionInteraction({
                    shape1: hitboxR,
                    shape2: objectHitbox
                }) && endPotArray[index].itemHeld.length === 0 &&
                inventoryR[0] === objectHitbox.item1) {
                arrowR.image = arrowDownImage
            } else if (collisionInteraction({
                    shape1: hitboxR,
                    shape2: objectHitbox
                }) && endPotArray[index].itemHeld.length === 1) {
                arrowR.image = arrowUpImage
            }
        })


        hitboxShadowArrayR.forEach((objectHitbox, index) => {
            if (collisionInteraction({
                    shape1: hitboxR,
                    shape2: objectHitbox
                }) && objectHitbox.itemHeld.length === 1) {
                arrowR.image = arrowUpImage
            }
        })

        // Inventory ////////////////////////////////////////////////////////////////////////////////////////

        if (keys.seven.pressed &&
            oneTimeR === 1 &&
            inventoryR.length >= 2) {
            let shift = inventoryR.shift()
            inventoryR.push(shift)

        } else if (keys.eight.pressed &&
            oneTimeR === 1 &&
            inventoryR.length >= 3) {

            for (i = 0; i < 2; i++) {
                shift = inventoryR.shift()
                inventoryR.push(shift)
            }

        } else if (keys.nine.pressed &&
            oneTimeR === 1 &&
            inventoryR.length >= 4) {

            for (i = 0; i < 3; i++) {
                shift = inventoryR.shift()
                inventoryR.push(shift)
            }

        } else if (keys.zero.pressed &&
            oneTimeR === 1 &&
            inventoryR.length === 5) {

            for (i = 0; i < 4; i++) {
                shift = inventoryR.shift()
                inventoryR.push(shift)
            }

        }

        // Inventory visuals

        ctxR.drawImage(inventoryRImage, 0, 17 * 16, CANVAS_WIDTH_R, 16 * 3)

        for (i = inventoryR.length; i < 5; i++) {
            inventorySlotsR[i].image = emptyImage
        }

        inventorySlotsR.forEach((slot, index) => {
            slot.draw()
            switch (inventoryR[index]) {
                case 'blueShard':
                    slot.image = blueShardImage
                    break
                case 'mushroomPowder':
                    slot.image = mushroomPowderImage
                    break
                case 'mushroom':
                    slot.image = mushroomImage
                    break
                case 'oilCircle':
                    slot.image = oilCircleImage
                    break
                case 'oilSquare':
                    slot.image = oilSquareImage
                    break
                case 'oilStar':
                    slot.image = oilStarImage
                    break
                case 'oilTriangle':
                    slot.image = oilTriangleImage
                    break
                case 'potionBlack':
                    slot.image = potionBlackImage
                    break
                case 'potionEmpty':
                    slot.image = potionEmptyImage
                    break
                case 'potionGreen':
                    slot.image = potionGreenImage
                    break
                case 'potionRed':
                    slot.image = potionRedImage
                    break
                case 'purpleShard':
                    slot.image = purpleShardImage
                    break
                case 'rubyPowder':
                    slot.image = rubyPowderImage
                    break
                case 'ruby':
                    slot.image = rubyImage
                    break
                case 'shardPowder':
                    slot.image = shardPowderImage
                    break
                case 'weedCrushed':
                    slot.image = weedCrushedImage
                    break
                case 'weed':
                    slot.image = weedImage
                    break
            }
        })

        // Movement ////////////////////////////////////////////////////////////////////////////////////////

        playerR.moving = false
        let movingR = true

        if (keys.ArrowUp.pressed != true &&
            keys.ArrowDown.pressed != true &&
            keys.ArrowLeft.pressed != true &&
            keys.ArrowRight.pressed != true) {
            playerR.tick = 10
        }

        if (!keys.ArrowUp.pressed && !keys.ArrowDown.pressed && !keys.ArrowLeft.pressed && !keys.ArrowRight.pressed) {
            playerR.moving = false;
            playerR.currentFrame = 0;
            playerR.elapsedTime = 0;
        }

        if (keys.ArrowUp.pressed && lastKeyR === 'ArrowUp' &&
            dialogueR != true && dialogue != true) {
            playerR.moving = true
            playerR.playerState = UP;

            for (let i = 0; i < collisionObjectArrayR.length; i++) {
                if (collisionInteraction({
                        shape1: hitboxR,
                        shape2: {
                            ...collisionObjectArrayR[i],
                            position: {
                                x: collisionObjectArrayR[i].position.x,
                                y: collisionObjectArrayR[i].position.y + 2
                            }
                        }
                    })) {
                    movingR = false
                    break
                }
            }

            if (movingR)
                movableObjectsR.forEach((movable) => {
                    movable.position.y += Math.round(movementSpeedPerSecond * deltaTimeR)
                })

        } else if (keys.ArrowLeft.pressed && lastKeyR === 'ArrowLeft' &&
            dialogueR != true && dialogue != true) {
            playerR.moving = true
            playerR.playerState = LEFT;

            for (let i = 0; i < collisionObjectArrayR.length; i++) {
                if (collisionInteraction({
                        shape1: hitboxR,
                        shape2: {
                            ...collisionObjectArrayR[i],
                            position: {
                                x: collisionObjectArrayR[i].position.x + 2,
                                y: collisionObjectArrayR[i].position.y
                            }
                        }
                    })) {
                    movingR = false
                    break
                }
            }

            if (movingR)
                movableObjectsR.forEach((movable) => {
                    movable.position.x += Math.round(movementSpeedPerSecond * deltaTimeR)
                })
        } else if (keys.ArrowDown.pressed && lastKeyR === 'ArrowDown' &&
            dialogueR != true && dialogue != true) {
            playerR.moving = true
            playerR.playerState = DOWN;

            for (let i = 0; i < collisionObjectArrayR.length; i++) {
                if (collisionInteraction({
                        shape1: hitboxR,
                        shape2: {
                            ...collisionObjectArrayR[i],
                            position: {
                                x: collisionObjectArrayR[i].position.x,
                                y: collisionObjectArrayR[i].position.y - 2
                            }
                        }
                    })) {
                    movingR = false
                    break
                }
            }

            if (movingR)
                movableObjectsR.forEach((movable) => {
                    movable.position.y -= Math.round(movementSpeedPerSecond * deltaTimeR)
                })
        } else if (keys.ArrowRight.pressed && lastKeyR === 'ArrowRight' &&
            dialogueR != true && dialogue != true) {
            playerR.moving = true
            playerR.playerState = RIGHT;

            for (let i = 0; i < collisionObjectArrayR.length; i++) {
                if (collisionInteraction({
                        shape1: hitboxR,
                        shape2: {
                            ...collisionObjectArrayR[i],
                            position: {
                                x: collisionObjectArrayR[i].position.x - 2,
                                y: collisionObjectArrayR[i].position.y
                            }
                        }
                    })) {
                    movingR = false
                    break
                }
            }

            if (movingR)
                movableObjectsR.forEach((movable) => {
                    movable.position.x -= Math.round(movementSpeedPerSecond * deltaTimeR)
                })
        } else if (keys.ArrowUp.pressed &&
            dialogueR != true && dialogue != true) {
            playerR.moving = true
            playerR.playerState = UP;

            for (let i = 0; i < collisionObjectArrayR.length; i++) {
                if (collisionInteraction({
                        shape1: hitboxR,
                        shape2: {
                            ...collisionObjectArrayR[i],
                            position: {
                                x: collisionObjectArrayR[i].position.x,
                                y: collisionObjectArrayR[i].position.y + 2
                            }
                        }
                    })) {
                    movingR = false
                    break
                }
            }

            if (movingR)
                movableObjectsR.forEach((movable) => {
                    movable.position.y += Math.round(movementSpeedPerSecond * deltaTimeR)
                })
        } else if (keys.ArrowLeft.pressed &&
            dialogueR != true && dialogue != true) {
            playerR.moving = true
            playerR.playerState = LEFT;

            for (let i = 0; i < collisionObjectArrayR.length; i++) {
                if (collisionInteraction({
                        shape1: hitboxR,
                        shape2: {
                            ...collisionObjectArrayR[i],
                            position: {
                                x: collisionObjectArrayR[i].position.x + 2,
                                y: collisionObjectArrayR[i].position.y
                            }
                        }
                    })) {
                    movingR = false
                    break
                }
            }

            if (movingR)
                movableObjectsR.forEach((movable) => {
                    movable.position.x += Math.round(movementSpeedPerSecond * deltaTimeR)
                })
        } else if (keys.ArrowDown.pressed &&
            dialogueR != true && dialogue != true) {
            playerR.moving = true
            playerR.playerState = DOWN;

            for (let i = 0; i < collisionObjectArrayR.length; i++) {
                if (collisionInteraction({
                        shape1: hitboxR,
                        shape2: {
                            ...collisionObjectArrayR[i],
                            position: {
                                x: collisionObjectArrayR[i].position.x,
                                y: collisionObjectArrayR[i].position.y - 2
                            }
                        }
                    })) {
                    movingR = false
                    break
                }
            }

            if (movingR)
                movableObjectsR.forEach((movable) => {
                    movable.position.y -= Math.round(movementSpeedPerSecond * deltaTimeR)
                })
        } else if (keys.ArrowRight.pressed &&
            dialogueR != true && dialogue != true) {
            playerR.moving = true
            playerR.playerState = RIGHT;

            for (let i = 0; i < collisionObjectArrayR.length; i++) {
                if (collisionInteraction({
                        shape1: hitboxR,
                        shape2: {
                            ...collisionObjectArrayR[i],
                            position: {
                                x: collisionObjectArrayR[i].position.x - 2,
                                y: collisionObjectArrayR[i].position.y
                            }
                        }
                    })) {
                    movingR = false
                    break
                }
            }

            if (movingR)
                movableObjectsR.forEach((movable) => {
                    movable.position.x -= Math.round(movementSpeedPerSecond * deltaTimeR)
                })
        }

        // Tutorial ////////////////////////////////////////////////////////////////////////////////////////


        if (keys.Enter.pressed && oneTimeR == 1) {
            instructionStepsR++
            introductionPR.textContent = ''
            txtIncrementR = 0
        }

        if (instructionStepsR < 4) {
            ctxR.fillStyle = 'rgba(79, 58, 58, 0.8)'
            ctxR.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
        }

        let txt1R = 'Press up, left, down, right arrow key to move up, left, down and right respectively [PRESS ENTER TO CONTINUE]'
        let txt2R = 'Press enter to interact [PRESS ENTER TO CONTINUE]'
        let txt3R = 'Interaction is only possible when these arrows occur on the screen [PRESS ENTER TO CONTINUE]'
        let txt4R = 'Press 7, 8, 9 or 0 to swap that item to your held item (slot 6) [PRESS ENTER TO CONTINUE]'

        switch (instructionStepsR) {
            case 0:
                if (txtIncrementR < txt1R.length) {
                    introductionPR.textContent += txt1R[txtIncrementR]
                    txtIncrementR++
                }
                step1R.update(deltaTimeR);
                step1R.draw()
                break
            case 1:
                if (txtIncrementR < txt2R.length) {
                    introductionPR.textContent += txt2R[txtIncrementR]
                    txtIncrementR++
                }
                step2R.update(deltaTimeR);
                step2R.draw()
                break
            case 2:
                if (txtIncrementR < txt3R.length) {
                    introductionPR.textContent += txt3R[txtIncrementR]
                    txtIncrementR++
                }
                step3R.draw()
                break
            case 3:
                if (txtIncrementR < txt4R.length) {
                    introductionPR.textContent += txt4R[txtIncrementR]
                    txtIncrementR++
                }
                step4R.update(deltaTimeR);
                step4R.draw()
                break
        }

        requestAnimationFrame(renderR)
    }

    let step1R, step2R, step3R, step4R;

    Promise.all(imageSources.map(src => loadImage(src))).then(images => {
        step1R = new SpriteIndicator(
            ctxR, {
                x: CANVAS_WIDTH / 2 - (step1RImage.width / 4) / 2,
                y: CANVAS_HEIGHT / 2 - step1RImage.height / 2,
            },
            step1RImage,
            4,
            640)

        step2R = new SpriteIndicator(
            ctxR, {
                x: CANVAS_WIDTH / 2 - (step2RImage.width / 2) / 2,
                y: CANVAS_HEIGHT / 2 - step2RImage.height / 2,
            },
            step2RImage,
            2,
            640)

        step3R = new Sprite(
            ctxR, {
                x: CANVAS_WIDTH / 2 - step3Image.width / 2,
                y: CANVAS_HEIGHT / 2 - step3Image.height / 2,
            },
            step3Image)

        step4R = new SpriteIndicator(
            ctxR, {
                x: CANVAS_WIDTH / 2 - (step4RImage.width / 2) / 2,
                y: CANVAS_HEIGHT / 2 - step4RImage.height / 2,
            },
            step4RImage,
            2,
            640)

        requestAnimationFrame(renderR);
    }).catch(error => {
        console.error('Error loading images:', error);
    });
});

//////////////////////////////////////////////////////////////////////////////////////////