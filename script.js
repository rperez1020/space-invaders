const grid = document.querySelector('.grid')
const resultDisplay = document.querySelector('.results')
let currentShipIndex = 202
const width = 15
const alienInvadersRemoved = []
let invadersId
let isGoingRight = true
let direction = 1
let results = 0

for(let i = 0; i < width * width; i++){
   const square = document.createElement('div')
   grid.appendChild(square)
}

const squares = Array.from(document.querySelectorAll('.grid div'))

const alienInvaders = [
    0,1,2,3,4,5,6,7,8,9,
    15,16,17,18,19,20,21,22,23,24,
    30,31,32,33,34,35,36,37,38,39
]

function draw(){
    for(let i =0; i < alienInvaders.length; i++){
        if(!alienInvadersRemoved.includes(i)){
            squares[alienInvaders[i]].classList.add('invader')
        }
    }
}
console.log(squares)
draw()

squares[currentShipIndex].classList.add('ship')

function remove(){
    for (let i = 0; i < alienInvaders.length; i++ ){
        squares[alienInvaders[i]].classList.remove('invader')
    }
}

function moveShip(e){
    squares[currentShipIndex].classList.remove('ship')
    switch(e.key){
        case 'ArrowLeft':
            if(currentShipIndex % width !==0) currentShipIndex -=1
            break

        case 'ArrowRight':
            if(currentShipIndex % width !==14) currentShipIndex +=1
            break
    }
    squares[currentShipIndex].classList.add('ship')
}

document.addEventListener('keydown',moveShip)

function moveInvaders(){
    const leftEdge = alienInvaders[0] % width === 0
    const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width -1

    remove()

    if(rightEdge && isGoingRight){
        for (let i = 0; i < alienInvaders.length; i++){
            alienInvaders[i] += width + 1
            direction = -1
            isGoingRight = false
        }
    }
    if(leftEdge && !isGoingRight){
        for (let i = 0; i < alienInvaders.length; i++){
            alienInvaders[i] += width - 1
            direction = 1
            isGoingRight = true
        }
    }
    for (let i = 0; i < alienInvaders.length; i++){
        alienInvaders[i] += direction
    }

    draw()

    if(squares[currentShipIndex].classList.contains('invader')){
        resultDisplay.innerHTML = 'GAME OVER'
        clearInterval(invadersId)
    }

    if(alienInvadersRemoved.length === alienInvaders.length){
        resultDisplay.innerHTML = 'YOU WIN'
        clearInterval()
    }
}
invadersId = setInterval(moveInvaders, 750)

function shoot(e){
    let laserId
    let currentLaserIndex = currentShipIndex

    function moveLaser(){
        squares[currentLaserIndex].classList.remove('laser')
        currentLaserIndex -= width
        if(currentLaserIndex < 115){
            clearInterval(moveLaser)
            squares[currentLaserIndex].classList.remove('laser')
        }
        
        squares[currentLaserIndex].classList.add('laser')

        if(squares[currentLaserIndex].classList.contains('invader')){
            squares[currentLaserIndex].classList.remove('laser')
            squares[currentLaserIndex].classList.remove('invader')
            squares[currentLaserIndex].classList.add('boom')

            setTimeout(()=>{
                squares[currentLaserIndex].classList.remove('boom')
            }, 300)

            clearInterval(laserId)

            const alienRemoved = alienInvaders.indexOf(currentLaserIndex)
            alienInvadersRemoved.push(alienRemoved)
            results++
            resultDisplay.innerHTML = results
        }
        
    }
    switch(e.key){
        case 'ArrowUp':
            laserId = setInterval(moveLaser, 100)
    }
}

document.addEventListener('keydown', shoot)