// define following variables: mole, square, time, score
const squares = document.querySelectorAll(".squareGrid");
const timeLeft = document.querySelector("#timeLeft");
const score = document.querySelector("#score");
const levelForm = document.getElementById("levelForm");
const radioBtnResult = document.getElementById("levelText");
const congratsContainer = document.querySelector(".congratsContainer")
const playAgain = document.querySelector("#playAgain");

const selectedLevel = document.getElementById("#selectedLevel");

let squaresLen = squares.length; //24
let currentMolePosition;
let currentScore = 0;
let currentTime = 30;
let timerId;
let countDownTimer;
let currentRadioBtn;
let moleSpeed;

//music & sounds
var backgroundMusic = new Audio('assets/audio/backgroundmusic.mp3');
var hammerMusic = new Audio('assets/audio/impact.wav');
var loserMusic = new Audio('assets/audio/lose.wav');
var gunSound = new Audio('assets/audio/gun.wav');
var levelSound = new Audio('assets/audio/levelup.wav');
var angelHit = new Audio('assets/audio/ouch.mp3')
var devilGiggle = new Audio('assets/audio/giggle.mp3');
var whackHit = new Audio('assets/audio/whack.wav');



// remove each mole & create a random position
function removeMole() {
    for (let i =0; i< squaresLen; i++){
        squares[i].classList.remove("mole"); //removes all mole, can also use foreach
    }
}


//Create a random Mole
function randomMole() {
    let randomMoleIndex = Math.floor(Math.random() * squaresLen);
    squares[randomMoleIndex].classList.add("mole");

    //get the current mole position;
    currentMolePosition = squares[randomMoleIndex].id;
}


// Event Listener upon click
function clickMole(){
    for(let i=0; i<squares.length; i++){
        let squarePosition = squares[i];
        let squarePositionText = squarePosition.id; //convert the object to text

        //check which of the boxes were clicked;
        squarePosition.addEventListener("click", () => {
            if(squarePositionText == currentMolePosition){
                removeMole();
                currentScore++;
                score.textContent = currentScore;
                gunSound.play();
                whackHit.play();
            } 
            else if(squarePositionText != currentMolePosition ){
                loserMusic.play();
                removeMole();
            }
            squarePosition.style.cursor = 'url("assets/cursorHammerDown.png"), auto';  //onclick
        })

        squarePosition.addEventListener("mousemove", () =>{
            squarePosition.style.cursor = 'url("assets/cursorHammer.png"), auto'; //change cursor picture upon movement
        })
    }
}


// move the mole at a certain time
function moveMole() {
    timerId = setInterval(removeMole,moleSpeed );
    timerId = setInterval(randomMole,moleSpeed );
}



// countDown Function
function timer(){
    currentTime = currentTime - 1;
    timeLeft.textContent = currentTime;

    //What happens if the timer reach zero
    if(currentTime <= 0){
        backgroundMusic.pause();
        levelSound.play();
        devilGiggle.play();
        
        congratulations();
        
        removeAngel();
        removeDevil();
        removeMole();
        clearInterval(countDownTimer);
        clearInterval(timerId);
        
    }
}


//get Selected level
function selectLevel(){
    let radioBtns = document.querySelectorAll("input[name='level']");
    
    // 3 levels
    for(let i=0; i < 3; i++){
        if(radioBtns[i].checked){
            currentRadioBtn = radioBtns[i].value.toUpperCase();
            radioBtnResult.textContent = currentRadioBtn;
        }
    }
}






//ANGEL

function removeAngel() {
    for (let i =0; i< squaresLen; i++){
        squares[i].classList.remove("angel"); //removes all angel, can also use foreach
    }
}

function randomAngel(){
    let randomAngelIndex = Math.floor(Math.random() * squaresLen);
    currentAngelPosition = squares[randomAngelIndex].id;

    if(currentMolePosition != currentAngelPosition){
        squares[randomAngelIndex].classList.add("angel");
    } else {
        randomAngel();
    }
}

function clickAngel(){
        //move Angel
        for(let i=0; i<squares.length; i++){
            let squarePosition = squares[i];
            let squarePositionText = squarePosition.id; //convert the object to text
    
            //check which of the boxes were clicked;
            squarePosition.addEventListener("click", () => {
                if(squarePositionText == currentAngelPosition){
                    currentScore = currentScore - 1;
                    score.textContent = currentScore;
                    angelHit.play();
                } 
            })
        }
}

function moveAngel() {
    timerId = setInterval(removeAngel,moleSpeed);
    timerId = setInterval(randomAngel,moleSpeed);
}





//DEVIL

function removeDevil() {
    for (let i =0; i< squaresLen; i++){
        squares[i].classList.remove("devil"); //removes all devil, can also use foreach
    }
}

function randomDevil(){
    let randomDevilIndex = Math.floor(Math.random() * squaresLen);
    currentDevilPosition = squares[randomDevilIndex].id;

    if(currentMolePosition || currentAngelPosition != currentDevilPosition){
        squares[randomDevilIndex].classList.add("devil");
    } else {
        randomDevil();
    }
}

function clickDevil(){
        //move Angel
        for(let i=0; i<squares.length; i++){
            let squarePosition = squares[i];
            let squarePositionText = squarePosition.id; //convert the object to text
    
            //check which of the boxes were clicked;
            squarePosition.addEventListener("click", () => {
                if(squarePositionText == currentDevilPosition){
                    currentScore = currentScore - 2;
                    score.textContent = currentScore;
                    devilGiggle.play();
                } 
            })
        }
}


function moveDevil() {
    timerId = setInterval(removeDevil,moleSpeed);
    timerId = setInterval(randomDevil,moleSpeed);
}




// Show Congatulations

function congratulations(){
    congratsContainer.style.display="flex";
    let selectedLevelText = document.querySelector("#selectedLevelText");
    selectedLevelText.textContent = currentRadioBtn;
    
    let finalScore = document.querySelector("#finalScore");
    finalScore.textContent = currentScore;
    
}

//Play Again Button

function clickPlayAgain(){
    congratsContainer.style.display="none";
    location.reload();
}





// Upon Click of start
levelForm.addEventListener('submit', function(event){
    
    countDownTimer = setInterval(timer, 1000);
    event.preventDefault(); //prevent autosubmit of form
    backgroundMusic.play();

    selectLevel();
    // can assign value if >1, >2, >3 ...
    if(currentRadioBtn == "EASY"){
        moleSpeed = 750;

    } else if(currentRadioBtn == "MEDIUM"){
        moleSpeed = 700;
        randomAngel();
        clickAngel();
        moveAngel();

    } else if(currentRadioBtn == "HARD"){
        moleSpeed = 650;
        randomAngel();
        clickAngel();
        moveAngel();

        randomDevil();
        clickDevil();
        moveDevil();
    }

        randomMole();
        clickMole();
        moveMole();
        timer();
})




//MODAL
var modal = document.getElementById("myModal");
var modalBtn = document.getElementById("modalBtn");
// var spanModal = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
modalBtn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}