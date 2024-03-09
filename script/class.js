/* Classes zijn syntactic sugar t.o.v. constructors. Het dient als een blauwdruk om een object
te maken. Ik heb classes gemaakt afhankelijk van welke key value pairs ik nodig heb voor die
bepaalde image of hitbox die ik wil tekenen

de constructor neemt parameters in zo nodig, dan kan je de this keyword
gebruiken om key value pairs te maken, dit zal vergelijkbaar werken als
hoe je properties geeft aan een object.

this keyword zorgt ervoor dat de instance kan refereren naar de properties
ofwel de properties die hij inherit van zijn class kan worden gebruikt op de
bepaalde instance die ik heb gemaakt zonder dit expliciet per instance te zeggen
dat zal het hele idee van classes verwaarlozen

whichContext zorgt ervoor dat ik in de draw method de context ofwel het canvas kan
bepalen, hier heb ik onderscheid in gemaakt zodat ik dezelfde classes kan gebruiken
voor het rechter canvas 

position parameter zorgt voor de positie op canvas, die values worden ook genomen in
de draw method op 2de en 3de positie, hierin vul ik als argument een object in zodat 
ik hierin ook onderscheid kan nemen met de x en y waarde. Deze refereer ik met dot notation.

met de image parameter kan ik kiezen welke image ik wil tekenen voor dat object, die
wordt wederom doorgevoerd naar de draw method 

de draw method kan worden aangesproken om je object te tekenen, dit wordt getekend met
de drawImage method van canvas die 3, 5, 7 of 9 waardes kunnen nemen, deze waardes
verschuiven van betekenis afhankelijk van hoeveel waardes je invoert, voor 9 is het:
1 = image
2 = crop x begin
3 = crop y begin
4 = crop breedte
5 = crop hoogte
6 = x begin
7 = y begin
8 = breedte
9 = hoogte */

class Sprite {
    constructor(context, position, image) {
        this.whichContext = context
        this.position = position
        this.image = image
    }
    draw() {
        this.whichContext.drawImage(this.image, this.position.x, this.position.y)
    }
}

/* Hitbox tekent een rechthoek met de fillRect method die ik transparant heb
gemaakt met de fillStyle rgba waarde te geven, hierbij vraag ik ook de width 
en height voor de dimensies van de rechthoek, elke hitbox zou kunnen verschillen, 
als je bij de fillStyle de laatste waarde (alpha) op 1 of hoger dan 0 zet kan je
op de website zien hoe de hitboxes allemaal verschillende grootte hebben 

voor item1 voer ik in de argument het item die het object hold, als het item nog niet
bestaat in-game kan item1 gepusht worden naar itemHeld array zodat hij wel bestaat
*/

class Hitbox {
    constructor(context, position, width, height, item1) {
        this.whichContext = context
        this.position = position;
        this.width = width;
        this.height = height;

        this.item1 = item1
        this.itemHeld = []
        this.isItemBeingCrafted = false;
    }
    draw() {
        this.whichContext.fillStyle = 'rgba(255, 0, 0, 0)';
        this.whichContext.fillRect(
            this.position.x,
            this.position.y,
            this.width,
            this.height
        )
    }
}

/* voor position heb ik een object toegereikt met vaste waardes, deze
waardes zorgen ervoor dat de speler altijd in het midden van de canvas
staat. canvas breedte / 2 is het midden maar de image wordt geplaatst
t.o.v. de linker kant van de image, dus moet je de image breedte/hoogte
ook door de helft doen om de image in het echte midden te plaatsen 

this.moving staat standaard false en zet ik op true als de speler beweegt,
dan begint de this.tick te incrementen zodat ik player animaties kan toepassen
gebaseerd op de speler die beweegt. this.tick increment heel snel dus d.m.v.
FRAME_ITERATE wat een constante is van 12 wordt er pas geïtereerd om de 12 ticks.
Met Math.floor zal (this.tick / FRAME_ITERATE) dus optellen om de 12 ticks zonder
decimaal getallen. Dit is handig voor de modulus operator die alleen de remainder laat zien 
dit zorgt ervoor dat er wordt geteld tot 3, na  4/4 is de remainder 0 namelijk en begint 
het opnieuw met de remainder tellen, dan 8/4 is weer nul enzovoort. Dit wordt opgeslagen
in frameRate dat ik keer de breedte van één sprite doe, dit zit in frameX. Door frameX
in te voeren in het begin punt van de crop, verschuift dit beginpunt met 16 pixels totdat
dit 3x is gebeurt en springt weer terug naar 0, hij animeert dus de spritesheet zijn positie
om de verschillende frames aan te tonen, op 0 is het de eerste frame, op 1 de tweede enzovoort
playerState voer ik door in de y crop, dit zijn de spritesheet animaties van welke directie
de player naartoe kijkt */

class SpritePlayer {
    constructor(context, playerState) {
        this.whichContext = context;
        this.width = 16;
        this.height = 32;
        this.position = {
            x: (CANVAS_WIDTH - 16) / 2,
            y: (CANVAS_HEIGHT - 32) / 2
        };
        this.moving = false;
        this.playerState = playerState;
        this.elapsedTime = 0;
        this.currentFrame = 0;
        this.justStartedMoving = true
    }

    update(deltaTime) {
        if (this.moving) {
            if (this.justStartedMoving) {
                this.currentFrame = 1;
                this.justStartedMoving = false;
            }
            this.elapsedTime += deltaTime * 1000;

            if (this.elapsedTime >= FRAME_ITERATE) {
                this.currentFrame = (this.currentFrame + 1) % 4;
                this.elapsedTime -= FRAME_ITERATE;
            }
        } else {
            this.currentFrame = 0;
            this.elapsedTime = 0;
            this.justStartedMoving = true;
        }
    }

    draw() {
        let frameX = this.currentFrame * this.width;
        let frameY = this.playerState * this.height;
        this.whichContext.drawImage(
            playerImage,
            frameX,
            frameY,
            this.width,
            this.height,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        );
    }
}


class SpriteIndicator {
    constructor(context, position, image, frames, frameDuration) {
        this.whichContext = context;
        this.position = position;
        this.image = image;
        this.frames = frames;
        this.frameDuration = frameDuration; // Duration of each frame in milliseconds
        this.currentFrame = 0; // Current frame index
        this.elapsedTime = 0; // Time accumulated since last frame change
    }

    update(deltaTime) {
        // Convert deltaTime to milliseconds and accumulate elapsed time
        this.elapsedTime += deltaTime * 1000;

        // Check if it's time to update to the next frame
        if (this.elapsedTime >= this.frameDuration) {
            this.currentFrame = (this.currentFrame + 1) % this.frames; // Loop through frames
            this.elapsedTime = 0; // Reset elapsed time
        }
    }

    draw() {
        let frameWidth = this.image.width / this.frames;
        let frameX = this.currentFrame * frameWidth;

        this.whichContext.drawImage(
            this.image,
            frameX,
            0,
            frameWidth,
            this.image.height,
            this.position.x,
            this.position.y,
            frameWidth,
            this.image.height
        );
    }
}


class Collision {
    constructor(position, context) {
        this.whichContext = context
        this.position = position;
        this.width = TILE_WIDTH;
        this.height = TILE_HEIGHT;
    }
    draw() {
        this.whichContext.fillStyle = 'rgba(255, 0, 0, 0)'
        this.whichContext.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}