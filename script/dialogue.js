let dialogueBox = document.querySelector('article>p')
let txtIncrementD = 0

let dialogue1 = 'Oh no! You split into 2 probable universes. With that you separated your two personalities!? Brew the dark matter potion to fix yourself!'
let dialogue2 = 'Something seems off about this room... It happens to be mirrored with the other dimension.'
let dialogue3 = 'Hoorayy! You fixed yourself! However, by drinking the dark matter potion you eliminated the whole other universe and your second personality seizes to exist, or was it your first personality?'


let dialogue2Start = 0
let dialogueCount = 0

dialogueBox.style.display = 'none'

function renderDialogue() {

    // Introduction dialogue
    if (instructionSteps < 4) {
        dialogueL = true
    } else {
        dialogueL = false
    }

    if (instructionStepsR < 4) {
        dialogueR = true
    } else {
        dialogueR = false
    }

    // Dialogue 1
    if (instructionSteps >= 4 &&
        instructionStepsR >= 4 &&
        dialogueCount === 0) {

        dialogue = true
        dialogueBox.style.display = 'block'

        if (txtIncrementD < dialogue1.length) {
            dialogueBox.textContent += dialogue1[txtIncrementD]
            txtIncrementD++
        }
    }

    // Dialogue 1 done
    if (txtIncrementD === dialogue1.length &&
        (keys.space.pressed || keys.Enter.pressed) &&
        dialogueCount === 0 &&
        (oneTimeL == 1 || oneTimeR == 1)) {
        dialogue = false
        dialogueBox.textContent = ''
        txtIncrementD = 0
        dialogueCount++
        console.log(dialogueCount)
        dialogueBox.style.display = 'none'
    }

    // Dialogue 2

    if (starterPotOne.length === 0 ||
        starterPotTwo.length === 0 ||
        starterPotThree.length === 0 ||
        starterPotFour.length === 0) {
        dialogue2Start = 1
    }

    if (dialogueCount === 1 &&
        dialogue2Start === 1) {

        dialogue = true
        dialogueBox.style.display = 'block'

        if (txtIncrementD < dialogue2.length) {
            dialogueBox.textContent += dialogue2[txtIncrementD]
            txtIncrementD++
        }
    }

    // Dialogue 2 done
    if (txtIncrementD === dialogue2.length &&
        (keys.space.pressed || keys.Enter.pressed) &&
        dialogueCount === 1 &&
        (oneTimeL == 1 || oneTimeR == 1)) {
        dialogue = false
        dialogueBox.textContent = ''
        txtIncrementD = 0
        dialogueCount++
        console.log(dialogueCount)
        dialogueBox.style.display = 'none'
    }

    // Dialogue 3
    for (i = 0; i < 5; i++) {
        if (inventoryL[i] === 'potionBlack' &&
            dialogueCount === 2) {
            canvasR.classList.add('nausea')
            setTimeout(() => {
                canvasR.classList.remove('nausea')
                canvasR.style.display = 'none'
                dialogueCount++
            }, 3000)
        } else if (inventoryR[i] === 'potionBlack' &&
            dialogueCount === 2) {
            canvasL.classList.add('nausea')
            setTimeout(() => {
                canvasL.classList.remove('nausea')
                canvasL.style.display = 'none'
                dialogueCount++
            }, 3000)
        }
    }

    if (dialogueCount > 3) {
        dialogue = true
        dialogueBox.style.display = 'block'

        if (txtIncrementD < dialogue3.length) {
            dialogueBox.textContent += dialogue3[txtIncrementD]
            txtIncrementD++
        }
    }

    if (dialogueCount > 3 &&
        txtIncrementD === dialogue3.length &
        (keys.space.pressed || keys.Enter.pressed)) {
        document.querySelector('article').classList.add('blackout')
        setTimeout(() => {
            window.location.reload()
        }, 3000)
    }

    requestAnimationFrame(renderDialogue)
}
renderDialogue()