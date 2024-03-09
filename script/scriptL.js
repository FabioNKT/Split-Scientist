// Assets: https://limezu.itch.io/moderninteriors
// https://oege.ie.hva.nl/~tranfn/
// Tutorial gevolgd voor map movement & collisions: https://www.youtube.com/watch?v=yP5DKzriqXA&t=10973s

/* Neemt canvas element van DOM & geeft 2d context zodat
ik kan tekenen & images plaatsen. Specfiek gerefereerd met een L 
achter de variables zodat het rechter canvas voor het rechter scherm ook
kan worden geselecteerd. */
let canvasL = document.querySelector('section:first-of-type>canvas');
let ctxL = canvasL.getContext('2d');

/* Definieer canvas breedte en hoogte zodat ik pixels kan upscalen,
canvas width in css is bijv 50vw, 50vw staat relatief met 15 * 16 
image rendering pixelated zorgt ervoor dat de upscaled pixels niet
blurry zijn */
const CANVAS_WIDTH = canvasL.width = 15 * 16;
const CANVAS_HEIGHT = canvasL.height = 50 * 16;

/* Alles is gestructureerd in blokken van 16, de waardes zijn hetzelfde maar toch
onderscheid gemaakt voor leesbaarheid*/
const TILE_WIDTH = 16;
const TILE_HEIGHT = 16;

/* Selecter p element van DOM en bewaar in introductionP */
let introductionP = document.querySelector('div:first-of-type>p')

let dialogue = false
let dialogueL = false
let dialogueR = false

/* Aangezien de player sprite in het midden staat en canvas elementen linksboven
beginnen is het handig om een offset variable te maken om de elementen er omheen
juist te plaatsen, de eerste helft is de daadwerkelijke offset t.o.v. de player sprite
en de tweede helft is de positie van de player sprite op de canvas (dus het centreren) */
const OFFSET_L = {
    x: TILE_WIDTH * -8.5 + (CANVAS_WIDTH - 16) / 2,
    y: TILE_HEIGHT * -15.5 + (CANVAS_HEIGHT - 32) / 2
}

/* Sprite animation 
tick zit in de function loop als tick++ via een draw() method die telkens
wordt opgeroepen via de loop, hij blijft dus incrementen met 1.
zorgt ervoor dat animaties kunnen worden afgespeeld maar de tick gaat snel
dus heb je een buffer nodig FRAME_ITERATE, frames worden om de 12 ticks geïtereerd */
let tickAlways = 0
const FRAME_ITERATE = 12

/* Player animaties staan op 1 spritesheet, dit is puur om beter te lezen welke 
animation state ik wil aanspreken, de eerste animatie is naar beneden, de tweede
naar rechts enz. I.p.v. te onthouden dat 0 = naar beneden is, schrijf ik het op in const */
const DOWN = 0;
const RIGHT = 1;
const UP = 2;
const LEFT = 3;

/* Begint op 0, increment als een bepaalde toets wordt ingedrukt, en als voorwaarde in een
if else vraag of oneTimeL == 1 zodat die bepaalde statement maar 1x wordt uitgevoerd */
let oneTimeL = 0

/* Increment op spatie, elk nieuwe nummer vraagt nieuwe stap*/
let instructionSteps = 0;

let txtIncrement = 0;

let movementSpeedPerSecond = 130;

// Inventory
/* Bestaat uit een array en items worden gepusht en geshift afhankelijk van
wat voor interactie er is*/
let inventoryL = []

/* De aparte slots zorgen puur voor de visuals van de inventory. Ik maak
een array van objects, deze objects zijn gepositioneerd exact in de
vakjes van de inventory en houden een emptyImage vast, dit komt later van pas
maar standaard een emptyImage omdat er dan niks in de inventory zit. De
definitie van de arguments kunnen terug worden gerefereerd van de parameter
uitleg in class.js */
let inventorySlots = [
    slot1 = new Sprite(ctxL, {
            x: TILE_WIDTH,
            y: (17 * TILE_WIDTH) + TILE_HEIGHT
        },
        emptyImage),
    slot2 = new Sprite(ctxL, {
            x: TILE_WIDTH * 4,
            y: (17 * TILE_WIDTH) + TILE_HEIGHT
        },
        emptyImage),
    slot3 = new Sprite(ctxL, {
            x: TILE_WIDTH * 7,
            y: (17 * TILE_WIDTH) + TILE_HEIGHT
        },
        emptyImage),
    slot4 = new Sprite(ctxL, {
            x: TILE_WIDTH * 10,
            y: (17 * TILE_WIDTH) + TILE_HEIGHT
        },
        emptyImage),
    slot5 = new Sprite(ctxL, {
            x: TILE_WIDTH * 13,
            y: (17 * TILE_WIDTH) + TILE_HEIGHT
        },
        emptyImage),
]

// Collisions ////////////////////////////////////////////////////////////////////////////////////////

/* collisionsL.js heeft een array dat de collisions uitmapt. 0 = leeg, 1 = collision,
elke 0 en 1 duidt een tile aan, ik wil het zo splicen dat het overeenkomt met de
dimensies van de map. De map bestaat uit 33 tiles per rij dus om de 33 wil ik een
nieuwe array. Zo kan je coordinaten van de collisions onderscheiden per rij en kolom,
dit heb ik later nodig  */

/* Ik maak een array waar ik de gesplicete arrays in kan pushen, dit doe ik met een for loop
waar i = 0 en zolang i kleiner is dan de hoeveelheid tiles in collisionsL.js (collisionDataL) blijft hij
i incrementen met 33, hij voert dan telkens een push naar de lege array uit. Hij pusht het
geslicete gedeelte van de array met 0 en 1s, en er komt telkens een nieuw startpunt per loop
omdat dit startpunt gelijk is aan i dat dus increment met 33, ofwel elke nieuwe rij */
let collisionMapL = [] // Alle 0 en 1s
for (i = 0; i < collisionDataL.length; i += 33) {
    collisionMapL.push(collisionDataL.slice(i, 33 + i))
}

/* Voor elke array in collisionMapL, voor elke 1 in die nested array, push een instanceof 
Collision naar een nieuwe empty array (collisionObjectArrayL) en vul in als argument
een object met x en y position gebaseerd op hoeveelste rij het was en hoeveelste item in
de nested array het was ofwel kolom */

/* Nu om alleen de collision blokken te pakken (de 1en) maak ik een nieuwe array aan voor alleen
de collision blokken om in te pushen. Dit doe ik met een forEach op de vorige array (collisionMapL)
en in die forEach vraag ik nog een forEach op per rij, hij checkt nu dus voor elke array en daarin
elk item in die array of dat item een 1 is. De eerste parameter van de arrow function is dat bepaalde item
waar de forEach op wordt gezet. Dus voor de collisionMapL.forEach is de eerste paramater (row) elke array
in collisionMapL en voor de tweede forEach, row.forEach is de eerste parameter (one) de items ofwel integers in 
dat array. De if statement checkt dus voor elke integer of dat gelijk is aan 1, als dat zo is push ik een
nieuw object (een collision block) in de nieuwe array (collisionObjectArrayL) en we geven dat nieuwe object 
een position op basis van de coordinaten op de map die weer zijn gebaseerd op de plaats in de arrays.
De integers duiden de x coordinaten aan terwijl de nested arrays de y coordinaten aanduiden, m.b.v de 
index parameters i & j die de index laten zien van de forEach kunnen de coordinaten worden gevestigd van
dat bepaalde blok door i & j in te vullen in de x en y properties van de position object en tevermenigvuldigen 
met 16 ofwel TILE_WIDTH en de offset toe te voegen zodat deze 1 staan met de map. */
let collisionObjectArrayL = [] // Alleen 1s
collisionMapL.forEach((row, i) => {
    row.forEach((one, j) => {
        if (one === 1) {
            collisionObjectArrayL.push(new Collision({
                x: j * TILE_WIDTH + OFFSET_L.x,
                y: i * TILE_HEIGHT + OFFSET_L.y
            }, ctxL))
        }
    })
})

// Instanceof ////////////////////////////////////////////////////////////////////////////////////////
/* Maakt instances van bepaalde class, dit zijn alle images/hitboxes die
worden getekend op canvas zodra de draw() method wordt uitgevoerd, doordat deze in
de render function zit die wordt gelooped wordt het steeds getekend net als
een video en frames 

deze bepaalde syntax 'let letNaam = new classNaam()' zorgt ervoor dat er een
nieuwe leeg object wordt aangemaakt en de properties van de class eraan worden
toegereikt, dit nieuwe object is dan een instance van die class en bewaar ik in
een variable. Wat er tussen de haakjes staat zijn de arguments die worden opgevraagd
in de constructor, dit verschilt per class en uitleg voor de definitie van de parameters 
staan in class.js */

let hitboxL = new Hitbox(
    ctxL, {
        x: (CANVAS_WIDTH - 10) / 2,
        y: (CANVAS_HEIGHT + 6) / 2
    },
    10,
    8
)

let playerL = new SpritePlayer(ctxL, DOWN)

let backgroundL = new Sprite(
    ctxL, {
        x: OFFSET_L.x,
        y: OFFSET_L.y
    },
    mapLeftImage
)

// In-game Objects

/* De in-game objects & hitboxes etc. zijn weer gesubcategoriseerd in een array.
Zo hoef ik niet elk aparte object te tekenen met zijn draw method maar kan ik
een forEach gebruiken om ze allemaal aan te spreken. Er is onderscheid gemaakt
tussen de soorten objecten omdat ze per soort anders functioneren, per soort kan
ik dan een forEach stellen die de functies per object geeft. */
let objectBigPotArrayL = [
    bigPotMushroom = new Sprite(
        ctxL, {
            x: OFFSET_L.x + TILE_WIDTH * 1,
            y: OFFSET_L.y + TILE_HEIGHT * 20
        },
        bigPotImage
    ),
    bigPotWeed = new Sprite(
        ctxL, {
            x: OFFSET_L.x + TILE_WIDTH * 5,
            y: OFFSET_L.y + TILE_HEIGHT * 20
        },
        bigPotImage
    ),
    bigPotPotion = new Sprite(
        ctxL, {
            x: OFFSET_L.x + TILE_WIDTH * 11,
            y: OFFSET_L.y + TILE_HEIGHT * 20
        },
        bigPotImage
    )
]

let objectShadowArrayL = [
    shadowEndPotion = new Sprite(
        ctxL, {
            x: OFFSET_L.x + TILE_WIDTH * 2,
            y: OFFSET_L.y + TILE_HEIGHT * 15
        },
        shadowImage
    ),
    shadowPowder = new Sprite(
        ctxL, {
            x: OFFSET_L.x + TILE_WIDTH * 2,
            y: OFFSET_L.y + TILE_HEIGHT * 3
        },
        shadowImage
    ),
    shadowBlueShard = new Sprite(
        ctxL, {
            x: OFFSET_L.x + TILE_WIDTH * 26,
            y: OFFSET_L.y + TILE_HEIGHT * 3
        },
        shadowImage
    )
]

let objectOilpotArrayL = [
    oilpotSquarePotion = new Sprite(
        ctxL, {
            x: OFFSET_L.x + TILE_WIDTH * 10,
            y: OFFSET_L.y + TILE_HEIGHT * 21
        },
        oilpotSquareImage
    ),
    oilpotCirclePowder = new Sprite(
        ctxL, {
            x: OFFSET_L.x + TILE_WIDTH * 5,
            y: OFFSET_L.y + TILE_HEIGHT * 4
        },
        oilpotCircleImage
    ),
    oilpotStarPowder = new Sprite(
        ctxL, {
            x: OFFSET_L.x + TILE_WIDTH * 5,
            y: OFFSET_L.y + TILE_HEIGHT * 5
        },
        oilpotStarImage
    ),
    oilpotSquareBlueShard = new Sprite(
        ctxL, {
            x: OFFSET_L.x + TILE_WIDTH * 31,
            y: OFFSET_L.y + TILE_HEIGHT * 4
        },
        oilpotSquareImage
    ),
    oilpotStarBlueShard = new Sprite(
        ctxL, {
            x: OFFSET_L.x + TILE_WIDTH * 31,
            y: OFFSET_L.y + TILE_HEIGHT * 5
        },
        oilpotStarImage
    )
]

let objectPotArrayL = [
    potShards = new Sprite(
        ctxL, {
            x: OFFSET_L.x + TILE_WIDTH * 4,
            y: OFFSET_L.y + TILE_HEIGHT * 2
        },
        potImage
    ),
    potPurpleShard = new Sprite(
        ctxL, {
            x: OFFSET_L.x + TILE_WIDTH * 28,
            y: OFFSET_L.y + TILE_HEIGHT * 2
        },
        potImage
    ),
    potMushroom = new Sprite(
        ctxL, {
            x: OFFSET_L.x + TILE_WIDTH * 30,
            y: OFFSET_L.y + TILE_HEIGHT * 2
        },
        potImage
    )
]

let objectEndPotArrayL = [
    potEnd1 = new Sprite(
        ctxL, {
            x: OFFSET_L.x + TILE_WIDTH * 6,
            y: OFFSET_L.y + TILE_HEIGHT * 14
        },
        potImage
    ),
    potEnd2 = new Sprite(
        ctxL, {
            x: OFFSET_L.x + TILE_WIDTH * 8,
            y: OFFSET_L.y + TILE_HEIGHT * 14
        },
        potImage
    ),
    potEnd3 = new Sprite(
        ctxL, {
            x: OFFSET_L.x + TILE_WIDTH * 10,
            y: OFFSET_L.y + TILE_HEIGHT * 14
        },
        potImage
    )
]

let objectPotStarterArrayL = [
    potStarterCircle = new Sprite(
        ctxL, {
            x: OFFSET_L.x + TILE_WIDTH * 31,
            y: OFFSET_L.y + TILE_HEIGHT * 10
        },
        potImage
    ),
    potStarterSquare = new Sprite(
        ctxL, {
            x: OFFSET_L.x + TILE_WIDTH * 31,
            y: OFFSET_L.y + TILE_HEIGHT * 11
        },
        potImage
    ),
    potStarterStar = new Sprite(
        ctxL, {
            x: OFFSET_L.x + TILE_WIDTH * 31,
            y: OFFSET_L.y + TILE_HEIGHT * 12
        },
        potImage
    ),
    potStarterTriangle = new Sprite(
        ctxL, {
            x: OFFSET_L.x + TILE_WIDTH * 31,
            y: OFFSET_L.y + TILE_HEIGHT * 13
        },
        potImage
    ),
]

// Hitbox

let hitboxGarbageL = new Hitbox(ctxL, {
        x: OFFSET_L.x + TILE_WIDTH * 28,
        y: OFFSET_L.y + TILE_HEIGHT * 11
    },
    16,
    8)

let hitboxBigPotArrayL = [
    hitboxBigPotMushroom = new Hitbox(
        ctxL, {
            x: bigPotMushroom.position.x + 20,
            y: bigPotMushroom.position.y + TILE_HEIGHT * 2
        },
        8,
        8,
        'mushroom'
    ),
    hitboxBigPotWeed = new Hitbox(
        ctxL, {
            x: bigPotWeed.position.x + 20,
            y: bigPotWeed.position.y + TILE_HEIGHT * 2
        },
        8,
        8,
        'weed'
    )
]

let hitboxBigPotPotionArrayL = [
    hitboxBigPotPotion = new Hitbox(ctxL, {
            x: bigPotPotion.position.x + 20,
            y: bigPotPotion.position.y + TILE_HEIGHT * 2
        },
        8,
        8,
        'potionEmpty'
    )
]

let hitboxOilpotArrayL = [
    hitboxOilpotSquarePotion = new Hitbox(ctxL, {
            x: oilpotSquarePotion.position.x + 16,
            y: oilpotSquarePotion.position.y + 20
        },
        8,
        8,
        'oilSquare'),
    hitboxOilpotCirclePowder = new Hitbox(ctxL, {
            x: oilpotCirclePowder.position.x - 4,
            y: oilpotCirclePowder.position.y + 22
        },
        4,
        4,
        'oilCircle'),
    hitboxOilpotStarPowder = new Hitbox(ctxL, {
            x: oilpotStarPowder.position.x - 4,
            y: oilpotStarPowder.position.y + 22
        },
        4,
        4,
        'oilStar'),
    hitboxOilpotSquareBlueShard = new Hitbox(ctxL, {
            x: oilpotSquareBlueShard.position.x - 4,
            y: oilpotSquareBlueShard.position.y + 22
        },
        4,
        4,
        'oilSquare'),
    hitboxOilpotStarBlueShard = new Hitbox(ctxL, {
            x: oilpotStarBlueShard.position.x - 4,
            y: oilpotStarBlueShard.position.y + 22
        },
        4,
        4,
        'oilStar')
]

hitboxOilpotSquarePotion.shape = 'Square'
hitboxOilpotSquarePotion.image = oilpotSquareImage

hitboxOilpotCirclePowder.shape = 'Circle'
hitboxOilpotCirclePowder.image = oilpotCircleImage

hitboxOilpotStarPowder.shape = 'Star'
hitboxOilpotStarPowder.image = oilpotStarImage

hitboxOilpotSquareBlueShard.shape = 'Square'
hitboxOilpotSquareBlueShard.image = oilpotSquareImage

hitboxOilpotStarBlueShard.shape = 'Star'
hitboxOilpotStarBlueShard.image = oilpotStarImage

let hitboxPotStarterArrayL = [
    hitboxPotStarterCircle = new Hitbox(ctxL, {
            x: potStarterCircle.position.x - 4,
            y: potStarterCircle.position.y + 22
        },
        4,
        4,
        'oilCircle'),
    hitboxPotStarterSquare = new Hitbox(ctxL, {
            x: potStarterSquare.position.x - 4,
            y: potStarterSquare.position.y + 22
        },
        4,
        4,
        'oilSquare'),
    hitboxPotStarterStar = new Hitbox(ctxL, {
            x: potStarterStar.position.x - 4,
            y: potStarterStar.position.y + 22
        },
        4,
        4,
        'oilStar'),
    hitboxPotStarterTriangle = new Hitbox(ctxL, {
            x: potStarterTriangle.position.x - 4,
            y: potStarterTriangle.position.y + 22
        },
        4,
        4,
        'oilTriangle'),
]

let hitboxPotArrayL = [
    hitboxPotShards = new Hitbox(ctxL, {
            x: potShards.position.x + 4,
            y: potShards.position.y + TILE_HEIGHT * 2
        },
        8,
        8,
        'purpleShard'),
    hitboxPotPurpleShard = new Hitbox(ctxL, {
            x: potPurpleShard.position.x + 4,
            y: potPurpleShard.position.y + TILE_HEIGHT * 2
        },
        8,
        8,
        'purpleShard'),
    hitboxPotMushroom = new Hitbox(ctxL, {
            x: potMushroom.position.x + 4,
            y: potMushroom.position.y + TILE_HEIGHT * 2
        },
        8,
        8,
        'mushroom')
]

hitboxPotShards.item2 = 'ruby'
hitboxPotPurpleShard.item2 = 'purpleShard'
hitboxPotMushroom.item2 = 'mushroom'

let hitboxEndPotArrayL = [
    hitboxEndPot1 = new Hitbox(ctxL, {
            x: potEnd1.position.x + 4,
            y: potEnd1.position.y + TILE_HEIGHT * 2
        },
        8,
        8,
        'potionGreen'),
    hitboxEndPot2 = new Hitbox(ctxL, {
            x: potEnd2.position.x + 4,
            y: potEnd2.position.y + TILE_HEIGHT * 2
        },
        8,
        8,
        'potionRed'),
    hitboxEndPot3 = new Hitbox(ctxL, {
            x: potEnd3.position.x + 4,
            y: potEnd3.position.y + TILE_HEIGHT * 2
        },
        8,
        8,
        'blueShard')
]

let hitboxShadowArrayL = [
    hitboxShadowEndPotion = new Hitbox(ctxL, {
            x: shadowEndPotion.position.x + 4,
            y: shadowEndPotion.position.y + TILE_HEIGHT
        },
        8,
        8,
        'potionBlack'),
    hitboxShadowPowder = new Hitbox(ctxL, {
            x: shadowPowder.position.x + 4,
            y: shadowPowder.position.y + TILE_HEIGHT
        },
        8,
        8,
        'shardPowder'),
    hitboxShadowBlueShard = new Hitbox(ctxL, {
            x: shadowBlueShard.position.x + 4,
            y: shadowBlueShard.position.y + TILE_HEIGHT
        },
        8,
        8,
        'blueShard')
]

hitboxShadowPowder.item2 = 'rubyPowder'

// Indicators

let arrowDown = new SpriteIndicator(ctxL, {
        x: (CANVAS_WIDTH - 16) / 2,
        y: (CANVAS_HEIGHT - 32) / 2 - 8
    },
    emptyImage,
    6,
    64)

let arrowDownGarbageL = new SpriteIndicator(ctxL, {
        x: hitboxGarbageL.position.x,
        y: hitboxGarbageL.position.y - TILE_HEIGHT * 2.5
    },
    arrowDownImage,
    6,
    64)


let timerBigPotArrayL = [
    timerBigPotMushroom = new SpriteIndicator(ctxL, {
            x: bigPotMushroom.position.x + 16,
            y: bigPotMushroom.position.y - 16
        },
        emptyImage,
        8,
        100
    ),

    timerBigPotWeed = new SpriteIndicator(ctxL, {
            x: bigPotWeed.position.x + 16,
            y: bigPotWeed.position.y - 16
        },
        emptyImage,
        8,
        100
    )
]

let timerBigPotPotionArrayL = [
    timerBigPotPotion = new SpriteIndicator(ctxL, {
            x: bigPotPotion.position.x + 16,
            y: bigPotPotion.position.y - 16
        },
        emptyImage,
        8,
        100
    )
]

let timerShadowArrayL = [
    timerShadowEndPotion = new SpriteIndicator(ctxL, {
            x: shadowEndPotion.position.x,
            y: shadowEndPotion.position.y - 16
        },
        emptyImage,
        8,
        100
    ),

    timerShadowPowder = new SpriteIndicator(ctxL, {
            x: shadowPowder.position.x,
            y: shadowPowder.position.y - 16
        },
        emptyImage,
        8,
        100
    ),

    timerShadowBlueShard = new SpriteIndicator(ctxL, {
            x: shadowBlueShard.position.x,
            y: shadowBlueShard.position.y - 16
        },
        emptyImage,
        8,
        100
    )
]

/*  Dit zijn arrays vergelijkbaar met de rest alleen apart gezet
zodat ze niet afhankelijk zijn van de hitbox interactie, zo kan ik deze hergebruiken
op de andere canvas. Als ik in de js van het andere canvas ook naar deze arrays refereer,
dan wat er op canvasL gebeurt, gebeurt dan ook op canvasR */
let starterPotOne = ['oilCircle']
let starterPotTwo = ['oilSquare']
let starterPotThree = ['oilStar']
let starterPotFour = ['oilTriangle']

let starterPotArray = [starterPotOne, starterPotTwo, starterPotThree, starterPotFour]

let endPot1 = {
    itemHeld: [],
    item1: 'potionGreen'
}
let endPot2 = {
    itemHeld: [],
    item1: 'potionRed'
}
let endPot3 = {
    itemHeld: [],
    item1: 'blueShard'
}

let endPotArray = [endPot1, endPot2, endPot3]

// Keys ////////////////////////////////////////////////////////////////////////////////////////

/* Een object met properties die een object vasthouden met de property pressed,
staat standaard op false maar als een key wordt gedrukt staat deze op true */
const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    },
    space: {
        pressed: false
    },
    one: {
        pressed: false
    },
    two: {
        pressed: false
    },
    three: {
        pressed: false
    },
    four: {
        pressed: false
    },
    five: {
        pressed: false
    },

    ArrowUp: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowDown: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    Enter: {
        pressed: false
    },
    six: {
        pressed: false
    },
    seven: {
        pressed: false
    },
    eight: {
        pressed: false
    },
    nine: {
        pressed: false
    },
    zero: {
        pressed: false
    },
}

/* EventListener op de window, dus luistert naar de browser op keydown en keyup
of er wordt geklikt m.b.v event object (e), ik stel een if statement in de eventlistener
van de window die checkt op keydown/keyup, en voert een arrow function uit met parameter
event object, met voorwaarde of een bepaalde key wordt gedrukt, dit doe ik met dot notation, 
e.key is de key die wordt gedrukt als dit bij wijze van spreken 1 is, dan zeg ik dat 1 
is gedrukt en dus in de keys object (keys.), one (one.) en in zijn property pressed (pressed) 
true zetten (keys.one.pressed = true). Dit check ik voor elke key die relevant is voor deze game.
Dan voor het geval van keyup zet de key met dot notation op false, dit gebruikt zelfde soort syntax 
als de keydown functie*/

window.addEventListener('keydown', (e) => {
    if (e.key === '1') {
        keys.one.pressed = true
    } else if (e.key === '2') {
        keys.two.pressed = true
    } else if (e.key === '3') {
        keys.three.pressed = true
    } else if (e.key === '4') {
        keys.four.pressed = true
    } else if (e.key === '5') {
        keys.five.pressed = true
    }
})

window.addEventListener('keyup', (e) => {
    if (e.key === '1') {
        keys.one.pressed = false
    } else if (e.key === '2') {
        keys.two.pressed = false
    } else if (e.key === '3') {
        keys.three.pressed = false
    } else if (e.key === '4') {
        keys.four.pressed = false
    } else if (e.key === '5') {
        keys.five.pressed = false
    }
})

window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        keys.space.pressed = true
    }
})

window.addEventListener('keyup', (e) => {
    if (e.code === 'Space') {
        keys.space.pressed = false
    }
})

let lastKeyL = ''
window.addEventListener('keydown', (e) => {
    if (e.key === 'w') {
        keys.w.pressed = true
        lastKeyL = 'w'
    } else if (e.key === 'a') {
        keys.a.pressed = true
        lastKeyL = 'a'
    } else if (e.key === 's') {
        keys.s.pressed = true
        lastKeyL = 's'
    } else if (e.key === 'd') {
        keys.d.pressed = true
        lastKeyL = 'd'
    }
})

window.addEventListener('keyup', (e) => {
    if (e.key === 'w') {
        keys.w.pressed = false
    } else if (e.key === 'a') {
        keys.a.pressed = false
    } else if (e.key === 's') {
        keys.s.pressed = false
    } else if (e.key === 'd') {
        keys.d.pressed = false
    }
})

//////////////////////////////////////////////////////////////////////////////////////////

/* Functie neemt 2 parameters, de twee objecten die worden gecheckt of ze met elkaar
colliden. Returned een true of false op basis van of de twee shapes overlappen,
als de rechterkant van shape1 groter is dan de linkerkant van shape2 &&
de linkerkant van shape1 groter is dan de rechterkant van shape2 &&
enzovoort. Als dat zo is dan return true in de functie en zo kan dit als voorwaarde
in een if statement worden gebruikt om iets uit te voeren als collision/interactie is */

function collisionInteraction({
    shape1,
    shape2
}) {
    return (
        shape1.position.x + shape1.width >= shape2.position.x &&
        shape1.position.x <= shape2.position.x + shape2.width &&
        shape1.position.y + shape1.height >= shape2.position.y &&
        shape1.position.y <= shape2.position.y + shape2.height
    )
}

// Movables ////////////////////////////////////////////////////////////////////////////////////////

/* Een array met objecten die beweegbaar zijn, aangezien ik de illusie geef dat de speler in het midden
niet beweegt moet alles om hem heen in de game wel bewegen, dat zijn de objecten in deze array. De items
in dit array zijn ook arrays dus met de spread operator (...) pakt het alle items/objects in die arrays en
zijn het losse items in de movableObjectsL array */

let movableObjectsL = [backgroundL,
    ...collisionObjectArrayL,
    ...objectBigPotArrayL,
    ...objectShadowArrayL,
    ...objectOilpotArrayL,
    ...objectPotArrayL,
    ...objectEndPotArrayL,
    ...objectPotStarterArrayL,
    ...hitboxBigPotArrayL,
    ...hitboxOilpotArrayL,
    ...hitboxPotStarterArrayL,
    ...hitboxPotArrayL,
    ...hitboxEndPotArrayL,
    ...hitboxShadowArrayL,
    ...hitboxBigPotPotionArrayL,
    ...timerBigPotArrayL,
    ...timerBigPotPotionArrayL,
    ...timerShadowArrayL,
    hitboxGarbageL,
    arrowDownGarbageL
]

// Image preloader

function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

const imageSources = [
    'img/map/map-left.png',
    'img/map/map-right.png',
    'img/character/player.png',
    'img/objects/big-pot.png',
    'img/objects/oilpot-circle.png',
    'img/objects/oilpot-square.png',
    'img/objects/oilpot-star.png',
    'img/objects/oilpot-triangle.png',
    'img/objects/oilpot-circle-fill.png',
    'img/objects/oilpot-square-fill.png',
    'img/objects/oilpot-star-fill.png',
    'img/objects/oilpot-triangle-fill.png',
    'img/objects/pot-1x.png',
    'img/objects/pot-2x.png',
    'img/objects/pot-3x.png',
    'img/objects/pot.png',
    'img/objects/pot-fill.png',
    'img/objects/shadow.png',
    'img/objects/pot-circle.png',
    'img/objects/pot-square.png',
    'img/objects/pot-star.png',
    'img/objects/pot-triangle.png',
    'img/items/16x16/blue-shard.png',
    'img/items/16x16/mushroom-powder.png',
    'img/items/16x16/mushroom.png',
    'img/items/16x16/oil-circle.png',
    'img/items/16x16/oil-square.png',
    'img/items/16x16/oil-star.png',
    'img/items/16x16/oil-triangle.png',
    'img/items/16x16/potion-black.png',
    'img/items/16x16/potion-empty.png',
    'img/items/16x16/potion-green.png',
    'img/items/16x16/potion-red.png',
    'img/items/16x16/purple-shard.png',
    'img/items/16x16/ruby-powder.png',
    'img/items/16x16/ruby.png',
    'img/items/16x16/shard-powder.png',
    'img/items/16x16/weed-crushed.png',
    'img/items/16x16/weed.png',
    'img/indicators/arrowDown.png',
    'img/indicators/arrowUp.png',
    'img/indicators/timer.png',
    'img/inventory/inventoryL.png',
    'img/inventory/inventoryR.png',
    'img/items/16x16/empty.png',
    'img/introduction/step-1L.png',
    'img/introduction/step-2L.png',
    'img/introduction/step-3.png',
    'img/introduction/step-4L.png',
    'img/introduction/step-1R.png',
    'img/introduction/step-2R.png',
    'img/introduction/step-4R.png'
];

// Render canvasL ////////////////////////////////////////////////////////////////////////////////////////

let lastTime = 0;

/* function dat zichzelf called nadat hij een keer is gecalled door requestAnimationFrame
hij looped dus */
function render(timestamp) {

    if (!lastTime) lastTime = timestamp;

    let deltaTime = (timestamp - lastTime) / 1000;
    lastTime = timestamp;

    /* Aangezien positie van canvas elementen de hele tijd verplaatsen moet de oude positie
    gecleared worden, met clearRect, beginpunt linksboven (0,0) en rekt uit over de hele
    canvas breedte en hoogte */
    ctxL.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    // Draw
    /* draw() method voert een drawImage() uit of fillRect in geval van collision of hitbox die is
    aangemaakt in de class, dit zorgt ervoor dat deze bepaalde instances worden getekend op het canvas */
    backgroundL.draw()

    /* De instances die ik wil tekenen zitten in een array, met forEach kan ik per instance 
    draw(), zoals al eerder verteld, de parameter in de arrow function refereert naar dat object
    in de array, dus voer ik een draw() uit op dat object in dat array en dat voor elk (forEach) 
    object */

    collisionObjectArrayL.forEach((collisionBlock) => {
        collisionBlock.draw()
    })

    hitboxGarbageL.draw()

    objectBigPotArrayL.forEach((objectBlock) => {
        objectBlock.draw()
    })

    objectShadowArrayL.forEach((objectBlock) => {
        objectBlock.draw()
    })

    objectOilpotArrayL.forEach((objectBlock) => {
        objectBlock.draw()
    })

    objectPotArrayL.forEach((objectBlock) => {
        objectBlock.draw()
    })

    objectEndPotArrayL.forEach((objectBlock) => {
        objectBlock.draw()
    })

    objectPotStarterArrayL.forEach((objectBlock) => {
        objectBlock.draw()
    })

    hitboxBigPotArrayL.forEach((objectHitbox) => {
        objectHitbox.draw()
    })

    hitboxOilpotArrayL.forEach((objectHitbox) => {
        objectHitbox.draw()
    })

    hitboxPotStarterArrayL.forEach((objectHitbox) => {
        objectHitbox.draw()
    })

    hitboxPotArrayL.forEach((objectHitbox) => {
        objectHitbox.draw()
    })

    hitboxEndPotArrayL.forEach((objectHitbox) => {
        objectHitbox.draw()
    })

    hitboxShadowArrayL.forEach((objectHitbox) => {
        objectHitbox.draw()
    })

    hitboxBigPotPotion.draw()

    timerBigPotArrayL.forEach((objectTimer) => {
        objectTimer.draw()
    })

    timerBigPotPotionArrayL.forEach((objectTimer) => {
        objectTimer.draw()
    })

    timerShadowArrayL.forEach((objectTimer) => {
        objectTimer.draw()
    })

    playerL.draw()
    hitboxL.draw()

    arrowDown.draw()
    arrowDownGarbageL.draw()

    // Hitbox interaction ////////////////////////////////////////////////////////////////////////////////////////

    /* Als een key word gedrukt staat zijn pressed property op true, dat betekent bij een if statement
    dat hij de hele tijd aan staat als je de key ingedrukt houdt dus wordt de if statement de hele tijd 
    uitgevoerd als ik keys.space.pressed als voorwaarde gebruik. Ik heb nodig dat de interactie maar 
    1x wordt uitgevoerd als je de key ingedrukt houdt, dus ik maak een oneTimeL variable aan, deze
    increment als een van de keys wordt gedrukt dat tussen haakjes staat in de if statement, als deze
    niet worden gedrukt reset het naar 0. In de meeste volgende if statements vraag ik waar 
    oneTimeL === 1 is, dit gebeurt dan maar 1x zelfs als je die bepaalde key ingedrukt houdt, omdat de
    1 maar 1x voorkomt */

    if (keys.space.pressed || keys.two.pressed || keys.three.pressed || keys.four.pressed || keys.five.pressed) {
        oneTimeL++
    }

    if (!keys.space.pressed && !keys.two.pressed && !keys.three.pressed && !keys.four.pressed && !keys.five.pressed) {
        oneTimeL = 0;
    }

    /* If collision met prullenbak, spatie gedrukt, eerste inventory item is geen oil,
    verwijder inventory item 
    
    Een if statement voor de prullenbak, als er collision ontstaat met de 2 ingevulde shapes, de
    eerste is de spelers hitbox end de tweede is de hitbox van de prullenbak && als de spatiebalk
    ingedrukt is && als oneTimeL 1 is && als geen van de oils in de speler zijn hand zijn 
    (het is de bedoeling dat je geen oils kan verwijderen, deze zijn nodig in de game)
    dan shift dat item dat de speler vasthoudt uit zijn inventory ofwel verwijder de held item
    van de game. */
    // hitboxGarbageL
    if (collisionInteraction({
            shape1: hitboxL,
            shape2: hitboxGarbageL
        }) &&
        keys.space.pressed === true &&
        oneTimeL === 1 &&
        inventoryL[0] != 'oilCircle' &&
        inventoryL[0] != 'oilSquare' &&
        inventoryL[0] != 'oilStar' &&
        inventoryL[0] != 'oilTriangle') {
        inventoryL.shift()
    }

    /* Voor elk item(array) in de hitbox array, check voor collision, of spatie is ingedrukt
    of de pot een itemHeld heeft, of de inventory juist is, voer dan uit push en shift items
    verander de image van timer van empty naar timer 
    
    Check voor elk (forEach) object in de array hitboxBigPotArrayL, met een arrow function
    kan ik 2 parameters pakken, waarvan de eerste de objects zijn in de array en de tweede
    hoeveelste nummer (index) dat object is in de array, er wordt gecheckt op collision met
    de collisionInteraction({}) function die true of false returnt op basis van of de twee
    ingevulde shapes colliden, waarbij shape1 de spelers hitbox is en shape2 dat item/object 
    in de array, er wordt gecheckt of de spatie knop gedrukt is met keys.space.pressed === true,
    er wordt gecheckt of oneTimeL === 1 is, dat maar 1x gebeurt als je spatie knop ingedrukt houdt,
    en er wordt gecheckt of het object al een item vasthoudt met objectHitbox.itemHeld.length === 0,
    dit zegt, als het niets vasthoudt ofwel de itemHeld array is 0, het heeft niks dan is deze if
    statement true en wordt uitgevoerd: De timer foto wordt veranderd van emptyImage naar timerImage,
    dat laat zien dat je de BigPot heb geactiveerd, de volgorde van timerBigPotArrayL is hetzelfde als
    hitboxBigPotArrayL, dat betekent dat de eerste BigPot in hitboxBigPotArrayL ook de eerste timer is in
    timerBigPotArrayL enzovoort voor de tweede en derde. zo kan je met de index parameter op een interactie
    van de objectHitbox een actie uitvoeren op een andere array omdat de indexering hetzelfde is. Stel hij is
    bij de tweede objectHitbox van hitboxBigPotArray, dan qua index refereert timerBigPotArrayL[index] ook naar
    de tweede in dat array, en dit is de juiste timer voor die BigPot. Deze timer image wordt dan veranderd
    met timerBigPotArray[index].image = timerImage. Daarna volgt een timeout van 1500ms ofwel 1.5 seconden,
    na deze 1.5 seconden push ik een object naar die bepaalde BigPot met objectHitbox.itemHeld.push(objectHitbox.item1),
    nu zie je ook waarom item1 nodig is, deze bestond eerst niet in het spel en kan dus niet ergens vandaan worden geshift.
    Een exacte waarde kon niet worden ingevoerd want dat zou niet meer juist zijn voor de andere objectHitboxen in dat array.
    daarna is de timer image weer empty met timerBigPotArrayL[index].image = emptyImage. 
    
    De volgende else if checkt of de inventory al 5 items heeft met inventoryL.length === 5 en of de BigPot al een item vast heeft
    met objectHitbox.itemHeld.length === 1, als dat zo is dan kan dat item niet worden geshift uit de BigPot en gepusht worden 
    naar de inventory want de inventory is al vol 
    
    Voor de volgende else if vraagt het dan of de inventory groter of gelijk is aan 0, als dat zo is en er zit een item in de BigPot
    objectHitbox.itemHeld.length === 1 (en de andere uitgelegde voorwaardes space ingedrukt en oneTimeL == 1) dan wordt het item
    gepusht achteraan naar de inventory met inventoryL.push(objectHitbox.itemHeld[0] dat het eerste item in de itemHeld array pusht
    van die bepaalde objectHitbox en dat item wordt ook weer weggeshift met objectHitbox.itemHeld.shift() zodat dat item maar
    1x verkrijgbaar is */
    hitboxBigPotArrayL.forEach((objectHitbox, index) => {
        if (collisionInteraction({
                shape1: hitboxL,
                shape2: objectHitbox
            }) &&
            keys.space.pressed === true &&
            oneTimeL === 1 &&
            objectHitbox.itemHeld.length === 0 &&
            !objectHitbox.isItemBeingCrafted) {

            objectHitbox.isItemBeingCrafted = true;
            timerBigPotArrayL[index].image = timerImage
            setTimeout(() => {
                objectHitbox.itemHeld.push(objectHitbox.item1)
                timerBigPotArrayL[index].image = emptyImage
                objectHitbox.isItemBeingCrafted = false;
            }, 1500)
        } else if (collisionInteraction({
                shape1: hitboxL,
                shape2: objectHitbox
            }) &&
            inventoryL.length === 5 &&
            keys.space.pressed === true &&
            oneTimeL === 1 &&
            objectHitbox.itemHeld.length === 1) {
            // console.log('do nothing inventoryL is full')
        } else if ((collisionInteraction({
                    shape1: hitboxL,
                    shape2: objectHitbox
                }) &&
                inventoryL.length >= 0 &&
                keys.space.pressed === true &&
                oneTimeL === 1 &&
                objectHitbox.itemHeld.length === 1)) {
            inventoryL.push(objectHitbox.itemHeld[0])
            objectHitbox.itemHeld.shift()
        }
    })


    /* Deze BigPot staat apart van de BigPotArray omdat deze ook anders functioneert.
    Deze heeft een extra voorwaarde nodig, dat is als er een oil (een deel van de
    ingredienten) in de pot staat, hier wordt dus ook voor gecheckt met 
    hitboxOilpotSquarePotion.itemHeld.length === 0, dit zegt als de itemHeld van die
    olie pot 0 is ofwel er zit geen item/olie in, dan wordt er niks uitgevoerd. Dan
    is de volgende syntax weer hetzelfde als de hierboven uitgelegde syntax maar als
    extra voorwaarde is de olie er dus wel hitboxOilpotSquarePotion.itemHeld.length === 1 
    als de olie er wel is dan wordt het item dus gemaakt en gepusht naar de itemHeld van
    de BigPot, om te shiften is de olie niet meer nodig aangezien het item al is 'gemaakt'
    en wordt er ook niet naar gevraagd in de laatste else if statement waar er wordt geshift */
    // hitboxBigPotPotion
    if (collisionInteraction({
            shape1: hitboxL,
            shape2: hitboxBigPotPotion
        }) &&
        keys.space.pressed === true &&
        oneTimeL === 1 &&
        hitboxBigPotPotion.itemHeld.length === 0 &&
        hitboxOilpotSquarePotion.itemHeld.length === 0 &&
        !objectHitbox.isItemBeingCrafted) {
        // console.log('Dont execute potion there is no oil')
    } else if (collisionInteraction({
            shape1: hitboxL,
            shape2: hitboxBigPotPotion
        }) &&
        keys.space.pressed === true &&
        oneTimeL === 1 &&
        hitboxBigPotPotion.itemHeld.length === 0 &&
        hitboxOilpotSquarePotion.itemHeld.length === 1 &&
        !hitboxBigPotPotion.isItemBeingCrafted) {

        hitboxBigPotPotion.isItemBeingCrafted = true;
        timerBigPotPotion.image = timerImage
        setTimeout(() => {
            hitboxBigPotPotion.itemHeld.push('potionEmpty')
            timerBigPotPotion.image = emptyImage
            hitboxBigPotPotion.isItemBeingCrafted = false;
        }, 1500)
    } else if (collisionInteraction({
            shape1: hitboxL,
            shape2: hitboxBigPotPotion
        }) &&
        keys.space.pressed === true &&
        oneTimeL === 1 &&
        hitboxBigPotPotion.itemHeld.length === 1 &&
        inventoryL.length >= 0 && inventoryL.length < 5) {
        inventoryL.push('potionEmpty')
        hitboxBigPotPotion.itemHeld.shift()
    }

    hitboxOilpotArrayL.forEach((objectHitbox, index) => {

        /* Verander oilpot image als er een oil in zit 
        
        Met deze if statement in de forEach van de Oilpots checkt het
        of de objectHitbox (oilpot) een item vasthoudt met objectHitbox.itemHeld.length === 0,
        hier zegt het als de length van de itemHeld array 0 is, dan heeft het niets vast, zet
        dan de image van die pot naar zijn standaard image met objectOilpotArrayL[index].image = objectHitbox.image.
        De objectOilPotArrayL zijn de visueel zienbare potten, deze objecten zijn weer in dezelfde orde als zijn
        hitboxen en kunnen dus respectievelijk worden gerefereert met de index parameter, hiermee pak ik de juiste
        pot en met dot notation zet ik de image naar de juiste default image die het moet zijn. Als het wel de
        juiste item vast heeft, wat wordt gecheckt met objectHitbox.itemHeld[0] === 'oilCircle' waar het checkt
        of de itemHeld[0] (de eerste, het kan er maar tevens 1 vasthouden) de juiste item is, dan wordt de image
        van zijn respectievelijke objectOilpot veranderd naar een pot met die olie/kleur, dit wordt gedaan met
        objectOilpotArrayL[index].image = oilpotCircleFillImage, waar het weer de juiste Oilpot uit de array pakt
        met de index, dan met dot notation de image pakt en veranderd naar de juiste image. De image is ter verduidelijking
        dus de this.image property in de class die wordt gebruikt in de draw method */
        if ((objectHitbox.itemHeld.length === 0)) {
            objectOilpotArrayL[index].image = objectHitbox.image
        } else if (objectHitbox.itemHeld[0] === 'oilCircle') {
            objectOilpotArrayL[index].image = oilpotCircleFillImage
        } else if (objectHitbox.itemHeld[0] === 'oilSquare') {
            objectOilpotArrayL[index].image = oilpotSquareFillImage
        } else if (objectHitbox.itemHeld[0] === 'oilStar') {
            objectOilpotArrayL[index].image = oilpotStarFillImage
        } else if (objectHitbox.itemHeld[0] === 'oilTriangle') {
            objectOilpotArrayL[index].image = oilpotTriangleFillImage
        }

        /* Het principe is hier erg vergelijkbaar met de BigPots alleen iets anders, er wordt namelijk
        gecheckt of de item held door de speler wel de juiste item is, de oilpots nemen alleen het item
        in als dat het item is dat ze zoeken, de oilpotCircle wil bijvoorbeeld alleen de oilCircle item,
        dit wordt gecheckt met inventoryL[0] === objectHitbox.item1, dit zegt of de eerste item in de 
        inventoryL array het juiste item is voor deze objectHitbox (oilpot), het juiste item heb ik 
        vastgesteld in item1 property van die objectHitbox, als deze gelijk staan dan voer uit: 
        Het item uit je inventory wordt gepusht naar de objectHitbox (oilpot) met 
        objectHitbox.itemHeld.push(objectHitbox.item1) (hier staat objectHitbox.item1 en dat is niet direct
        het item uit de inventory maar deze zijn hetzelfde as stated in de voorwaarde dus had het niet
        uitgemaakt of ik dit gebruik of inventoryL[0]), dan shift het je held item uit de inventory met
        inventoryL.shift(). Hij is dan qua game perspectief in de oilpot maar eigenlijk gooit het dus een
        hele nieuwe exact zelfde item in de oilpot en verwijdert het de item van de inventory */
        if (collisionInteraction({
                shape1: hitboxL,
                shape2: objectHitbox
            }) &&
            keys.space.pressed === true &&
            oneTimeL === 1 &&
            objectHitbox.itemHeld.length === 0 &&
            inventoryL[0] === objectHitbox.item1
        ) {
            objectHitbox.itemHeld.push(objectHitbox.item1)
            inventoryL.shift()
        } else if (collisionInteraction({
                shape1: hitboxL,
                shape2: objectHitbox
            }) &&
            keys.space.pressed === true &&
            oneTimeL === 1 &&
            objectHitbox.itemHeld.length === 1 &&
            inventoryL.length === 5
        ) {
            // console.log('do nothing inventoryL is full')
        } else if (collisionInteraction({
                shape1: hitboxL,
                shape2: objectHitbox
            }) &&
            keys.space.pressed === true &&
            oneTimeL === 1 &&
            objectHitbox.itemHeld.length === 1 &&
            inventoryL.length >= 0
        ) {
            inventoryL.push(objectHitbox.itemHeld[0])
            objectHitbox.itemHeld.shift()
        }
    })

    /* Hetzelfde principe als hierboven maar iets anders gerefereert, de hitbox en de itemHeld en de visuele pot
    zijn allemaal apart nu (eerst waren de hitbox en itemHeld samen en apart van de visuele pot), de itemHeld
    array van de pots zitten nu in een array en wordt mee gerefereert met starterPotArray[index][0], hij pakt dan
    de juiste array op basis van de [index] en daarin vraagt hij het eerste item van die array [0], als deze
    gelijk is aan een bepaald item === 'oilCircle', verander dan de image van de pot met 
    objectPotStarterArrayL[index].image = potCircleImage */
    hitboxPotStarterArrayL.forEach((objectHitbox, index) => {
        if (starterPotArray[index][0] === 'oilCircle') {
            objectPotStarterArrayL[index].image = potCircleImage
        } else if (starterPotArray[index][0] === 'oilSquare') {
            objectPotStarterArrayL[index].image = potSquareImage
        } else if (starterPotArray[index][0] === 'oilStar') {
            objectPotStarterArrayL[index].image = potStarImage
        } else if (starterPotArray[index][0] === 'oilTriangle') {
            objectPotStarterArrayL[index].image = potTriangleImage
        } else if (starterPotArray[index].length === 1) {
            objectPotStarterArrayL[index].image = potFillImage
        } else {
            objectPotStarterArrayL[index].image = potImage
        }

        /* In principe hetzelfde als hierboven maar dan is starterPotArray[index] i.p.v objectHitbox.itemHeld
        deze zijn allebei hetzelfde in principe maar starterPotArray is een array bruikbaar voor beide canvassen 
        zo kunnen items worden verstuurd en genomen uit dezelfde pot (array) en dus kan canvas1 items maken en 
        versturen naar canvas2 via deze pot die dezelfde array neemt voor beide kanten.*/
        if (collisionInteraction({
                shape1: hitboxL,
                shape2: objectHitbox
            }) &&
            keys.space.pressed === true &&
            oneTimeL === 1 &&
            starterPotArray[index].length === 0 &&
            inventoryL.length > 0
        ) {
            starterPotArray[index].push(inventoryL[0])
            inventoryL.shift()
        } else if (collisionInteraction({
                shape1: hitboxL,
                shape2: objectHitbox
            }) &&
            keys.space.pressed === true &&
            oneTimeL === 1 &&
            starterPotArray[index].length === 1 &&
            inventoryL.length === 5
        ) {
            let shiftInventory = inventoryL.shift()
            starterPotArray[index].push(shiftInventory)
            let shiftItemHeld = starterPotArray[index].shift()
            inventoryL.push(shiftItemHeld)
        } else if (collisionInteraction({
                shape1: hitboxL,
                shape2: objectHitbox
            }) &&
            keys.space.pressed === true &&
            oneTimeL === 1 &&
            starterPotArray[index].length === 1 &&
            inventoryL.length >= 0
        ) {
            inventoryL.push(starterPotArray[index][0])
            starterPotArray[index].shift()
        }
    })

    /* heeft een extra voorwaarde, als de itemHeld niet busy is dan wordt de statement uitgevoerd, dit wordt
    gedaan met objectHitbox.itemHeld[0] != 'busy', later in de code push ik een 'busy' string naar de ingredienten
    potten (dat zijn deze) dat duidt aan dat alle ingredienten aanwezig waren en het item wordt gemaakt, dan zijn 
    deze potten tijdelijk gesloten totdat het item is gemaakt, hiervoor wordt een 'busy' string gepusht naar de
    pot wat ervoor zorgt dat je niet met deze potten kan interacten, daarvoor moet er geen 'busy' in zitten ofwel
    objectHitbox.itemHeld[0] != 'busy' */
    hitboxPotArrayL.forEach((objectHitbox, index) => {
        if (objectHitbox.itemHeld.length === 1) {
            objectPotArrayL[index].image = potFillImage
        } else {
            objectPotArrayL[index].image = potImage
        }

        if (collisionInteraction({
                shape1: hitboxL,
                shape2: objectHitbox
            }) &&
            keys.space.pressed === true &&
            oneTimeL === 1 &&
            objectHitbox.itemHeld.length === 0 &&
            (inventoryL[0] === objectHitbox.item1 ||
                inventoryL[0] === objectHitbox.item2) &&
            objectHitbox.itemHeld[0] != 'busy'
        ) {
            objectHitbox.itemHeld.push(inventoryL[0])
            inventoryL.shift()
        } else if (collisionInteraction({
                shape1: hitboxL,
                shape2: objectHitbox
            }) &&
            keys.space.pressed === true &&
            oneTimeL === 1 &&
            objectHitbox.itemHeld.length === 1 &&
            inventoryL.length === 5
        ) {
            // console.log('do nothing inventoryL is full')
        } else if (collisionInteraction({
                shape1: hitboxL,
                shape2: objectHitbox
            }) &&
            keys.space.pressed === true &&
            oneTimeL === 1 &&
            objectHitbox.itemHeld.length === 1 &&
            inventoryL.length >= 0 &&
            objectHitbox.itemHeld[0] != 'busy'
        ) {
            inventoryL.push(objectHitbox.itemHeld[0])
            objectHitbox.itemHeld.shift()
        }
    })

    hitboxEndPotArrayL.forEach((objectHitbox, index) => {
        if (endPotArray[index].itemHeld.length === 1) {
            objectEndPotArrayL[index].image = potFillImage
        } else {
            objectEndPotArrayL[index].image = potImage
        }

        if (collisionInteraction({
                shape1: hitboxL,
                shape2: objectHitbox
            }) &&
            keys.space.pressed === true &&
            oneTimeL === 1 &&
            endPotArray[index].itemHeld.length === 0 &&
            inventoryL[0] === endPotArray[index].item1 &&
            endPotArray[index].itemHeld[0] != 'busy'
        ) {
            endPotArray[index].itemHeld.push(inventoryL[0])
            inventoryL.shift()
        } else if (collisionInteraction({
                shape1: hitboxL,
                shape2: objectHitbox
            }) &&
            keys.space.pressed === true &&
            oneTimeL === 1 &&
            endPotArray[index].itemHeld.length === 1 &&
            inventoryL.length === 5
        ) {
            // console.log('do nothing inventoryL is full')
        } else if (collisionInteraction({
                shape1: hitboxL,
                shape2: objectHitbox
            }) &&
            keys.space.pressed === true &&
            oneTimeL === 1 &&
            endPotArray[index].itemHeld.length === 1 &&
            inventoryL.length >= 0 &&
            endPotArray[index].itemHeld[0] != 'busy'
        ) {
            inventoryL.push(endPotArray[index].itemHeld[0])
            endPotArray[index].itemHeld.shift()
        }
    })

    /* De shadow zijn de plekken waar de eindproducten worden gemaakt als alle ingredienten er zijn,
    de if statement checkt dus voor alle ingredienten met endPotArray[0].itemHeld[0] === 'potionGreen' && enzovoort.
    het checkt of alle potten endPotArray[0] het item itemHeld[0] vasthouden dat ze nodig hebben === 'potionGreen', 
    als alle potten de juiste items vasthouden voer dan uit: endPotArray[0].itemHeld.shift() en 
    endPotArray[0].itemHeld.push('busy'), het haalt de items eruit met shift op de itemHeld array en pusht een 'busy'
    string dat hierboven ervoor zorgt dat de potten niet kunnen worden gebruikt tijdens het maken van een item. Het
    maak proces wordt aangeduid met timerShadowEndPotion.image = timerImage dat ervoor zorgt dat de emptyImage van
    timerShadowEndPotion een timerImage wordt, dan een setTimeout van 5000ms ofwel 5 seconden dat de busy strings dan
    weer weghaald met endPotArray[0].itemHeld.shift() enzovoort en dan de juiste 'crafted item' pusht naar de shadow met
    hitboxShadowEndPotion.itemHeld.push('potionBlack') en visueel wordt dit item op de shadow image geplaatst met 
    shadowEndPotion.image = potionBlackImage. */
    // hitboxShadowEndPotion
    if (endPotArray[0].itemHeld[0] === 'potionGreen' &&
        endPotArray[1].itemHeld[0] === 'potionRed' &&
        endPotArray[2].itemHeld[0] === 'blueShard') {
        // console.log('left')
        endPotArray[0].itemHeld.shift()
        endPotArray[0].itemHeld.push('busy')
        endPotArray[1].itemHeld.shift()
        endPotArray[1].itemHeld.push('busy')
        endPotArray[2].itemHeld.shift()
        endPotArray[2].itemHeld.push('busy')
        timerShadowEndPotion.image = timerImage
        setTimeout(() => {
            endPotArray[0].itemHeld.shift()
            endPotArray[1].itemHeld.shift()
            endPotArray[2].itemHeld.shift()
            hitboxShadowEndPotion.itemHeld.push('potionBlack')
            shadowEndPotion.image = potionBlackImage
            timerShadowEndPotion.image = emptyImage
        }, 5000)
    }

    /* Als de inventory genoeg plaats heeft, dus onder 5 inventoryL.length < 5, dan wordt dat item
    gepusht naar de inventory inventoryL.push('potionBlack') en weggehaald van de shadow 
    hitboxShadowEndPotion.itemHeld.shift(). Ook wordt de shadowEndPotion.image weer terug gezet naar
    zijn default shadow image */
    if (collisionInteraction({
            shape1: hitboxL,
            shape2: hitboxShadowEndPotion
        }) &&
        keys.space.pressed === true &&
        oneTimeL === 1 &&
        hitboxShadowEndPotion.itemHeld.length === 1 &&
        inventoryL.length >= 0 && inventoryL.length < 5
    ) {
        inventoryL.push('potionBlack')
        hitboxShadowEndPotion.itemHeld.shift()
        shadowEndPotion.image = shadowImage
    }

    // hitboxShadowPowder
    if (hitboxPotShards.itemHeld[0] === 'purpleShard' &&
        hitboxOilpotCirclePowder.itemHeld[0] === 'oilCircle' &&
        hitboxOilpotStarPowder.itemHeld[0] === 'oilStar') {
        hitboxPotShards.itemHeld.shift()
        hitboxPotShards.itemHeld.push('busy')
        timerShadowPowder.image = timerImage
        setTimeout(() => {
            hitboxPotShards.itemHeld.shift()
            hitboxShadowPowder.itemHeld.push('shardPowder')
            shadowPowder.image = shardPowderImage
            timerShadowPowder.image = emptyImage
        }, 20000)
    } else if (hitboxPotShards.itemHeld[0] === 'ruby' &&
        hitboxOilpotCirclePowder.itemHeld[0] === 'oilCircle' &&
        hitboxOilpotStarPowder.itemHeld[0] === 'oilStar') {
        hitboxPotShards.itemHeld.shift()
        hitboxPotShards.itemHeld.push('busy')
        timerShadowPowder.image = timerImage
        setTimeout(() => {
            hitboxPotShards.itemHeld.shift()
            hitboxShadowPowder.itemHeld.push('rubyPowder')
            shadowPowder.image = rubyPowderImage
            timerShadowPowder.image = emptyImage
        }, 20000)

    }

    if (collisionInteraction({
            shape1: hitboxL,
            shape2: hitboxShadowPowder
        }) &&
        keys.space.pressed === true &&
        oneTimeL === 1 &&
        hitboxShadowPowder.itemHeld[0] === 'shardPowder' &&
        inventoryL.length >= 0 && inventoryL.length < 5
    ) {
        inventoryL.push('shardPowder')
        hitboxShadowPowder.itemHeld.shift()
        shadowPowder.image = shadowImage
    } else if (collisionInteraction({
            shape1: hitboxL,
            shape2: hitboxShadowPowder
        }) &&
        keys.space.pressed === true &&
        oneTimeL === 1 &&
        hitboxShadowPowder.itemHeld[0] === 'rubyPowder' &&
        inventoryL.length >= 0 && inventoryL.length < 5
    ) {
        inventoryL.push('rubyPowder')
        hitboxShadowPowder.itemHeld.shift()
        shadowPowder.image = shadowImage
    }

    // hitboxShadowBlueShard
    if (hitboxOilpotSquareBlueShard.itemHeld[0] === 'oilSquare' &&
        hitboxOilpotStarBlueShard.itemHeld[0] === 'oilStar' &&
        hitboxPotPurpleShard.itemHeld[0] === 'purpleShard' &&
        hitboxPotMushroom.itemHeld[0] === 'mushroom') {
        hitboxPotPurpleShard.itemHeld.shift()
        hitboxPotPurpleShard.itemHeld.push('busy')
        hitboxPotMushroom.itemHeld.shift()
        hitboxPotMushroom.itemHeld.push('busy')
        timerShadowBlueShard.image = timerImage
        setTimeout(() => {
            hitboxPotPurpleShard.itemHeld.shift()
            hitboxPotMushroom.itemHeld.shift()
            hitboxShadowBlueShard.itemHeld.push('blueShard')
            shadowBlueShard.image = blueShardImage
            timerShadowBlueShard.image = emptyImage
        }, 10000)
    }

    if (collisionInteraction({
            shape1: hitboxL,
            shape2: hitboxShadowBlueShard
        }) &&
        keys.space.pressed === true &&
        oneTimeL === 1 &&
        hitboxShadowBlueShard.itemHeld.length === 1 &&
        inventoryL.length >= 0 && inventoryL.length < 5
    ) {
        inventoryL.push('blueShard')
        hitboxShadowBlueShard.itemHeld.shift()
        shadowBlueShard.image = shadowImage
    }

    // arrowDown indication
    /* Zet de staat van arrowDown standaard op invisible (emptyImage)
    Selecteer de hitboxArray van de objects, voor elk (forEach) item (objectHitbox) 
    in dat array check of er collision is met collisionInteraction({}), als dat zo is en evt andere 
    voorwaarden zoals de juiste item in je hand hebben inventoryL[0] === objectHitbox.item1 en er zit nog
    niks in objectHitbox.itemHeld.length === 0 enzovoort, dan verander de emptyImage van arrowDown naar 
    een arrowDownImage met arrowDown.image = arrowDownImage, als er al iets inzit objectHitbox.itemHeld.length === 1
    dan verander de image naar een arrowUpImage met arrowDown.image = arrowUpImage, dit duidt aan dat er iets in de
    pot zit en je dus eruit moet pakken */

    arrowDown.image = emptyImage
    hitboxBigPotArrayL.forEach((objectHitbox, index) => {
        if (collisionInteraction({
                shape1: hitboxL,
                shape2: objectHitbox
            }) && objectHitbox.itemHeld.length === 0) {
            arrowDown.image = arrowDownImage
        } else if (collisionInteraction({
                shape1: hitboxL,
                shape2: objectHitbox
            }) && objectHitbox.itemHeld.length === 1) {
            arrowDown.image = arrowUpImage
        }
    })

    hitboxBigPotPotionArrayL.forEach((objectHitbox, index) => {
        if (collisionInteraction({
                shape1: hitboxL,
                shape2: objectHitbox
            }) && objectHitbox.itemHeld.length === 0 &&
            hitboxOilpotSquarePotion.itemHeld.length === 1) {
            arrowDown.image = arrowDownImage
        } else if (collisionInteraction({
                shape1: hitboxL,
                shape2: objectHitbox
            }) && objectHitbox.itemHeld.length === 1) {
            arrowDown.image = arrowUpImage
        }
    })

    hitboxPotStarterArrayL.forEach((objectHitbox, index) => {
        if (collisionInteraction({
                shape1: hitboxL,
                shape2: objectHitbox
            }) && starterPotArray[index].length === 0) {
            arrowDown.image = arrowDownImage
        } else if (collisionInteraction({
                shape1: hitboxL,
                shape2: objectHitbox
            }) && starterPotArray[index].length === 1) {
            arrowDown.image = arrowUpImage
        }
    })

    hitboxOilpotArrayL.forEach((objectHitbox, index) => {
        if (collisionInteraction({
                shape1: hitboxL,
                shape2: objectHitbox
            }) && objectHitbox.itemHeld.length === 0 &&
            inventoryL[0] === objectHitbox.item1) {
            arrowDown.image = arrowDownImage
        } else if (collisionInteraction({
                shape1: hitboxL,
                shape2: objectHitbox
            }) && objectHitbox.itemHeld.length === 1) {
            arrowDown.image = arrowUpImage
        }
    })

    hitboxPotArrayL.forEach((objectHitbox, index) => {
        if (collisionInteraction({
                shape1: hitboxL,
                shape2: objectHitbox
            }) && objectHitbox.itemHeld.length === 0 &&
            (inventoryL[0] === objectHitbox.item1 ||
                inventoryL[0] === objectHitbox.item2)) {
            arrowDown.image = arrowDownImage
        } else if (collisionInteraction({
                shape1: hitboxL,
                shape2: objectHitbox
            }) && objectHitbox.itemHeld.length === 1) {
            arrowDown.image = arrowUpImage
        }
    })

    hitboxEndPotArrayL.forEach((objectHitbox, index) => {
        if (collisionInteraction({
                shape1: hitboxL,
                shape2: objectHitbox
            }) && endPotArray[index].itemHeld.length === 0 &&
            inventoryL[0] === objectHitbox.item1) {
            arrowDown.image = arrowDownImage
        } else if (collisionInteraction({
                shape1: hitboxL,
                shape2: objectHitbox
            }) && endPotArray[index].itemHeld.length === 1) {
            arrowDown.image = arrowUpImage
        }
    })

    hitboxShadowArrayL.forEach((objectHitbox, index) => {
        if (collisionInteraction({
                shape1: hitboxL,
                shape2: objectHitbox
            }) && objectHitbox.itemHeld.length === 1) {
            arrowDown.image = arrowUpImage
        }
    })

    // Inventory ////////////////////////////////////////////////////////////////////////////////////////

    /* Checkt per key pressed hoevaak hij shift en pusht
    bijv. als je 3 indrukt shift hij 2 items zodat 3 op plaats 1
    komt. dan pusht hij deze 2 items naar achter */
    if (keys.two.pressed &&
        oneTimeL === 1 &&
        inventoryL.length >= 2) {
        let shift = inventoryL.shift()
        inventoryL.push(shift)

    } else if (keys.three.pressed &&
        oneTimeL === 1 &&
        inventoryL.length >= 3) {

        for (i = 0; i < 2; i++) {
            shift = inventoryL.shift()
            inventoryL.push(shift)
        }

    } else if (keys.four.pressed &&
        oneTimeL === 1 &&
        inventoryL.length >= 4) {

        for (i = 0; i < 3; i++) {
            shift = inventoryL.shift()
            inventoryL.push(shift)
        }

    } else if (keys.five.pressed &&
        oneTimeL === 1 &&
        inventoryL.length === 5) {

        for (i = 0; i < 4; i++) {
            shift = inventoryL.shift()
            inventoryL.push(shift)
        }

    }

    // Inventory visuals

    /* Tekend image op canvas, geen class gebruikt omdat parameters
    net niet overkomen met wat ik hier in drawImage moet zetten,
    heb namelijk de breedte en hoogte nodig bij de inventory image */
    ctxL.drawImage(inventoryImage, 0, 17 * 16, CANVAS_WIDTH, 16 * 3)

    /* Checkt voor overige slots die leeg zijn met een for loop door het startpunt van i
    te zetten op de lengte i = inventoryL.length, hij begint dus met incrementen vanaf het punt
    waar er geen items meer zijn, als er 3 items in de inventory zitten dan begint i bij 3. 
    Dan geeft het per lege slot een emptyImage met inventorySlots[i].image = emptyImage, i
    zal dan 4 en 5 zijn, daar zitten geen items meer in, voor deze zal inventorySlots.image
    een emptyImage zijn */
    for (i = inventoryL.length; i < 5; i++) {
        inventorySlots[i].image = emptyImage
    }

    /* Checkt of het bepaalde slot een item draagt, als het dat specifieke
    item draagt verander dan image naar dat itemImage 
    
    Voor elk slot wordt gekeken met inventorySlots.forEach, en met een switch statement
    wordt gekeken bij elke inventory slot inventoryL[index] of het dat bepaalde item vast heeft
    case 'blueShard', als dat zo is stuur dan dat item image naar dat item slot slot.image = blueShardImage
    en dan break want item is gevonden, dit wordt gecheckt voor elk item voor elk slot */
    inventorySlots.forEach((slot, index) => {
        slot.draw()
        switch (inventoryL[index]) {
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

    playerL.moving = false
    let movingL = true

    if (keys.w.pressed != true &&
        keys.a.pressed != true &&
        keys.s.pressed != true &&
        keys.d.pressed != true) {
        playerL.tick = 10
    }

    /* (keys.w.pressed && lastKeyL === 'w') zegt als w ingedrukt is en het was de laatste key doe dan */
    if (keys.w.pressed && lastKeyL === 'w' &&
        dialogueL != true && dialogue != true) {
        /* Zorgt ervoor dat tick increment als je beweegt, dit is zodat de spritesheet animatie kan 
        worden geactiveerd */
        playerL.moving = true
        /* playerL.playerState = UP zorgt ervoor dat de y position in de spritesheet veranderd
        naar de positie waar de sprite omhoog loopt */
        playerL.playerState = UP;

        /* De for loop gaat elk item in collisionObjectArrayL langs met i < collisionObjectArrayL.length waar
        i 0 is en increment met 1 zodat het elk item langs gaat. dan voor elk item checkt het collision
        als (if) collisionInteraction met de twee shapes true is, betekent het dat je botst met een muur,
        en dus zetten we movement op false movingL = false, omdat je al niet meer beweegt hoeft er niet
        meer verder worden gezocht naar muren waar je mee collide dus break. shape2 is een clone van dat
        bepaalde collision block, dit wordt gedaan met de spread operator en dat bepaalde collision block
        wordt aangesproken met [i] dus ...collisionObjectArrayL[i], hiervaan offset ik de positie 2px naar
        beneden, dit is zodat het collision detecteert vóórdat het daadwerkelijk botst tegen de muur als het
        ware. Dit zorgt ervoor hij niet al botst in de muur en al vast zit waardoor movingL altijd false zal
        zijn omdat je vast zit in de muur, deze is 2px naar beneden omdat we van beneden aankomen met w
        ingedrukt */

        for (i = 0; i < collisionObjectArrayL.length; i++) {
            if (collisionInteraction({
                    shape1: hitboxL,
                    shape2: {
                        ...collisionObjectArrayL[i],
                        position: {
                            x: collisionObjectArrayL[i].position.x,
                            y: collisionObjectArrayL[i].position.y + 2
                        }
                    }
                })) {
                movingL = false
                break
            }
        }

        /* check of movingL true is (deze staat altijd true behalve als je dus
        collide met een collision block). In alle gevallen dat je niet collide
        voer een forEach uit op de movableObjectsL array dat alle objecten die
        bewegen bewaart, dit doe ik met movableObjectsL.forEach en deze houdt
        een arrow function vast met waardoor ik met de parameter elk aparte item
        in de arra kan aanspreken om met 2px hun y positie te verplaatsen, hiernaar
        wordt gerefereerd met dot notation movable.position.y += 2 */
        if (movingL)
            movableObjectsL.forEach((movable) => {
                movable.position.y += Math.round(movementSpeedPerSecond * deltaTime)
            })

    } else if (keys.a.pressed && lastKeyL === 'a' &&
        dialogueL != true && dialogue != true) {
        playerL.moving = true
        playerL.playerState = LEFT;

        for (let i = 0; i < collisionObjectArrayL.length; i++) {
            if (collisionInteraction({
                    shape1: hitboxL,
                    shape2: {
                        ...collisionObjectArrayL[i],
                        position: {
                            x: collisionObjectArrayL[i].position.x + 2,
                            y: collisionObjectArrayL[i].position.y
                        }
                    }
                })) {
                movingL = false
                break
            }
        }

        if (movingL)
            movableObjectsL.forEach((movable) => {
                movable.position.x += Math.round(movementSpeedPerSecond * deltaTime)
            })
    } else if (keys.s.pressed && lastKeyL === 's' &&
        dialogueL != true && dialogue != true) {
        playerL.moving = true
        playerL.playerState = DOWN;

        for (let i = 0; i < collisionObjectArrayL.length; i++) {
            if (collisionInteraction({
                    shape1: hitboxL,
                    shape2: {
                        ...collisionObjectArrayL[i],
                        position: {
                            x: collisionObjectArrayL[i].position.x,
                            y: collisionObjectArrayL[i].position.y - 2
                        }
                    }
                })) {
                movingL = false
                break
            }
        }

        if (movingL)
            movableObjectsL.forEach((movable) => {
                movable.position.y -= Math.round(movementSpeedPerSecond * deltaTime)
            })
    } else if (keys.d.pressed && lastKeyL === 'd' &&
        dialogueL != true && dialogue != true) {
        playerL.moving = true
        playerL.playerState = RIGHT;

        for (let i = 0; i < collisionObjectArrayL.length; i++) {
            if (collisionInteraction({
                    shape1: hitboxL,
                    shape2: {
                        ...collisionObjectArrayL[i],
                        position: {
                            x: collisionObjectArrayL[i].position.x - 2,
                            y: collisionObjectArrayL[i].position.y
                        }
                    }
                })) {
                movingL = false
                break
            }
        }

        if (movingL)
            movableObjectsL.forEach((movable) => {
                movable.position.x -= Math.round(movementSpeedPerSecond * deltaTime)
            })
    } else if (keys.w.pressed &&
        dialogueL != true && dialogue != true) {
        playerL.moving = true
        playerL.playerState = UP;

        for (let i = 0; i < collisionObjectArrayL.length; i++) {
            if (collisionInteraction({
                    shape1: hitboxL,
                    shape2: {
                        ...collisionObjectArrayL[i],
                        position: {
                            x: collisionObjectArrayL[i].position.x,
                            y: collisionObjectArrayL[i].position.y + 2
                        }
                    }
                })) {
                movingL = false
                break
            }
        }

        if (movingL)
            movableObjectsL.forEach((movable) => {
                movable.position.y += Math.round(movementSpeedPerSecond * deltaTime)
            })
    } else if (keys.a.pressed &&
        dialogueL != true && dialogue != true) {
        playerL.moving = true
        playerL.playerState = LEFT;

        for (let i = 0; i < collisionObjectArrayL.length; i++) {
            if (collisionInteraction({
                    shape1: hitboxL,
                    shape2: {
                        ...collisionObjectArrayL[i],
                        position: {
                            x: collisionObjectArrayL[i].position.x + 2,
                            y: collisionObjectArrayL[i].position.y
                        }
                    }
                })) {
                movingL = false
                break
            }
        }

        if (movingL)
            movableObjectsL.forEach((movable) => {
                movable.position.x += Math.round(movementSpeedPerSecond * deltaTime)
            })
    } else if (keys.s.pressed &&
        dialogueL != true && dialogue != true) {
        playerL.moving = true
        playerL.playerState = DOWN;

        for (let i = 0; i < collisionObjectArrayL.length; i++) {
            if (collisionInteraction({
                    shape1: hitboxL,
                    shape2: {
                        ...collisionObjectArrayL[i],
                        position: {
                            x: collisionObjectArrayL[i].position.x,
                            y: collisionObjectArrayL[i].position.y - 2
                        }
                    }
                })) {
                movingL = false
                break
            }
        }

        if (movingL)
            movableObjectsL.forEach((movable) => {
                movable.position.y -= Math.round(movementSpeedPerSecond * deltaTime)
            })
    } else if (keys.d.pressed &&
        dialogueL != true && dialogue != true) {
        playerL.moving = true
        playerL.playerState = RIGHT;

        for (let i = 0; i < collisionObjectArrayL.length; i++) {
            if (collisionInteraction({
                    shape1: hitboxL,
                    shape2: {
                        ...collisionObjectArrayL[i],
                        position: {
                            x: collisionObjectArrayL[i].position.x - 2,
                            y: collisionObjectArrayL[i].position.y
                        }
                    }
                })) {
                movingL = false
                break
            }
        }

        if (movingL)
            movableObjectsL.forEach((movable) => {
                movable.position.x -= Math.round(movementSpeedPerSecond * deltaTime)
            })
    }

    // Tutorial ////////////////////////////////////////////////////////////////////////////////////////


    /* if statement checkt of spatie wordt gedrukt en gebeurt maar 1x met oneTimeL keys.space.pressed && oneTimeL == 1,
    Dan increment het introductionSteps met 1, voor elk nummer hiervoor is een andere tekst, bij elke stap wordt de tekst
    gereset naar een empty string en de txtIncrement is ook 0, deze zorgt voor een typewriter effect, wordt hier beneden
    besproken */
    if (keys.space.pressed && oneTimeL == 1) {
        instructionSteps++
        introductionP.textContent = ''
        txtIncrement = 0
    }

    /* Zorgt ervoor dat tijdens de stappen er een achtergrond kleur is met ctxL.fillStyle = 'rgba(58, 58, 79, 0.8)' die
    de hele achtergrond bedekt met een fillRect ctxL.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)*/
    if (instructionSteps < 4) {
        ctxL.fillStyle = 'rgba(58, 58, 79, 0.8)'
        ctxL.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    }

    let txt1 = 'Press w, a, s, d to move up, left, down and right respectively [PRESS SPACE TO CONTINUE]'
    let txt2 = 'Press space to interact [PRESS SPACE TO CONTINUE]'
    let txt3 = 'Interaction is only possible when these arrows occur on the screen [PRESS SPACE TO CONTINUE]'
    let txt4 = 'Press 2, 3, 4 or 5 to swap that item to your held item (slot 1) [PRESS SPACE TO CONTINUE]'

    /* De switch statement checkt voor de introductionSteps voor het geval het 0, 1 of 2 is.
    Dit zijn de 3 verschillende stappen van de introductie. Elke stap heeft een if statement
    die checkt of txtIncrement kleiner is dan zijn preset text lengte (txtIncrement < txt1.length),
    dit is zodat de typewriter stopt met tekst toevoegen aan de textContent, want er is dan geen
    textContent meer om te pushen dus pusht het undefined, dat wil ik niet dus stop als de tekst klaar is.
    Dan voegen we de letters toe met introductionP.textContent += txt1[txtIncrement], de txtIncrement
    dient dus als elke letter van txt1 die wordt toegevoegd met de += operator, introductionP.textContent
    bestaat dus eigenlijk uit txt1[0] + txt1[1] + txt1[2] enzovoort totdat de lengte is bereikt, dan is de
    statement false. Als laatst tekent het de een image, die de stap illustrative content geeft.*/
    switch (instructionSteps) {
        case 0:
            if (txtIncrement < txt1.length) {
                introductionP.textContent += txt1[txtIncrement]
                txtIncrement++
            }
            step1.draw()
            break
        case 1:
            if (txtIncrement < txt2.length) {
                introductionP.textContent += txt2[txtIncrement]
                txtIncrement++
            }
            step2.draw()
            break
        case 2:
            if (txtIncrement < txt3.length) {
                introductionP.textContent += txt3[txtIncrement]
                txtIncrement++
            }
            step3.draw()
            break
        case 3:
            if (txtIncrement < txt4.length) {
                introductionP.textContent += txt4[txtIncrement]
                txtIncrement++
            }
            step4.draw()
            break
    }

    requestAnimationFrame(render)
}

let step1, step2, step3, step4;

Promise.all(imageSources.map(src => loadImage(src))).then(images => {
    step1 = new SpriteIndicator(
        ctxL, {
            x: CANVAS_WIDTH / 2 - (step1Image.width / 4) / 2,
            y: CANVAS_HEIGHT / 2 - step1Image.height / 2,
        },
        step1Image,
        4,
        1000)

    step2 = new SpriteIndicator(
        ctxL, {
            x: CANVAS_WIDTH / 2 - (step2Image.width / 2) / 2,
            y: CANVAS_HEIGHT / 2 - step2Image.height / 2,
        },
        step2Image,
        2,
        1000)

    step3 = new Sprite(
        ctxL, {
            x: CANVAS_WIDTH / 2 - step3Image.width / 2,
            y: CANVAS_HEIGHT / 2 - step3Image.height / 2,
        },
        step3Image)

    step4 = new SpriteIndicator(
        ctxL, {
            x: CANVAS_WIDTH / 2 - (step4Image.width / 2) / 2,
            y: CANVAS_HEIGHT / 2 - step4Image.height / 2,
        },
        step4Image,
        2,
        1000)

    requestAnimationFrame(render);
}).catch(error => {
    console.error('Error loading images:', error);
});

//////////////////////////////////////////////////////////////////////////////////////////