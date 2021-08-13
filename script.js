// Pages
const gamePage = document.getElementById("game-page");
const scorePage = document.getElementById("score-page");
const splashPage = document.getElementById("splash-page");
const countdownPage = document.getElementById("countdown-page");
// Splash Page
const startForm = document.getElementById("start-form");
const radioContainers = document.querySelectorAll(".radio-container");
const radioInputs = document.querySelectorAll("input");
const bestScores = document.querySelectorAll(".best-score-value");
// Countdown Page
const countdown = document.querySelector(".countdown");
// Game Page
const itemContainer = document.querySelector(".item-container");
// Score Page

const finalTimeEl = document.querySelector(".final-time");
const baseTimeEl = document.querySelector(".base-time");
const penaltyTimeEl = document.querySelector(".penalty-time");
const playAgainBtn = document.querySelector(".play-again");

const bestScoresEls = document.querySelectorAll(".best-score-value");

// Equations
let questionAmount = 0;
let equationsArray = [];
let playerGuessArray = [];
let bestScoresArray = [];

//timer
let timer;
let timePlayed = 0;
let finalTime = 0;
let baseTime = 0;
let penaltyTime = 0;
let finalTimeDisplay = "0.0s";

// resetTheGAme (button)
function playAgain() {
  playerTrueGuessNumber = 0;
  valueScrollY = 0;
  equationsArray = [];
  playerGuessArray = [];
  scorePage.hidden = true;
  splashPage.hidden = false;
}

//
let playerTrueGuessNumber = 0;

function addTimer() {
  timePlayed += 0.1;
  console.log(timePlayed);
}

function updateTimerElements() {
  finalTimeEl.textContent = `${Math.round(finalTime * 10) / 10}s`;
  baseTimeEl.textContent = `BaseTime: ${timePlayed.toFixed(1)}s`;
  penaltyTimeEl.textContent = `PenaltyTime: +${penaltyTime}s`;
}

function calculateBestScore() {
  //check user final Time with bestScoreArray
  //you need to know which game you are playing so you can learn it with questionAmount

  bestScoresArray.forEach((scoreObject, index) => {
    if (scoreObject.question == questionAmount) {
      if (scoreObject.bestScore === 0) {
        scoreObject.bestScore = finalTime;
        bestScoresEls[index].textContent = `${finalTime.toFixed(1)}s`;
        localStorage.setItem("bestScores", JSON.stringify(bestScoresArray));
      } else if (
        scoreObject.bestScore !== 0 &&
        scoreObject.bestScore > finalTime
      ) {
        scoreObject.bestScore = finalTime;
        bestScoresEls[index].textContent = `${finalTime.toFixed(1)}s`;
        localStorage.setItem("bestScores", JSON.stringify(bestScoresArray));
      }
    }
  });
}

// means showing score page
function stopTimer() {
  clearInterval(timer);
  calculationPlayerScore();
  updateTimerElements();
  itemContainer.scrollTo({ top: 0, behavior: "instant" });
  gamePage.hidden = true;
  scorePage.hidden = false;
  calculateBestScore();

  setTimeout(() => {
    playAgainBtn.hidden = false;
  }, 1000);
}

function startTimer() {
  //reset timer
  timePlayed = 0;
  finalTime = 0;
  baseTime = 0;
  penaltyTime = 0;

  timer = setInterval(addTimer, 100);
  gamePage.removeEventListener("click", startTimer);
}

// bestScoresToDom

function bestScoresToDOM() {
  bestScoresArray.forEach((scoreObject, index) => {
    bestScoresEls[index].textContent = `${scoreObject.bestScore.toFixed(1)}s`;
  });
}

//localStorage
function getSavedBestScores() {
  if (localStorage.getItem("bestScores")) {
    bestScoresArray = JSON.parse(localStorage.getItem("bestScores"));
  } else {
    bestScoresArray = [
      { question: 10, bestScore: finalTime },
      { question: 25, bestScore: finalTime },
      { question: 50, bestScore: finalTime },
      { question: 99, bestScore: finalTime },
    ];

    localStorage.setItem("bestScores", JSON.stringify(bestScoresArray));
  }

  bestScoresToDOM();
}

function calculationPlayerScore() {
  equationsArray.forEach((equation, index) => {
    const realAnswer = equation.evaluated;
    const playerAnswer = playerGuessArray[index];

    if (realAnswer === playerAnswer) {
      playerTrueGuessNumber++;
    }
  });

  penaltyTime = (playerGuessArray.length - playerTrueGuessNumber) * 0.5;
  finalTime = timePlayed + penaltyTime;
  finalTimeDisplay = `${finalTime}s`;
}

// scroll
let valueScrollY = 0;

// Game Page
let firstNumber = 0;
let secondNumber = 0;
let equationObject = {};
const wrongFormat = [];

// helpfull small functions

function getQuestionAmount() {
  let radioValue;
  radioInputs.forEach((radioInput) => {
    if (radioInput.checked) {
      radioValue = radioInput.value;
    }
  });

  return radioValue;
}

function makeRandomNumber(num) {
  return Math.floor(Math.random() * num);
}

function showCountDownPage() {
  splashPage.hidden = true;
  countdownPage.hidden = false;
  countdownStart();
}

// ----------------------

function countdownStart() {
  let countdownNumber = 3;
  countdown.textContent = countdownNumber;

  let myTimer = setInterval(() => {
    countdownNumber--;
    countdown.textContent = countdownNumber;
  }, 1000);

  setTimeout(() => {
    clearInterval(myTimer);
    countdown.textContent = "GO!";
  }, 3000);
}

function equationToDOM() {
  countdownPage.hidden = true;
  gamePage.hidden = false;
  equationsArray.forEach((equation) => {
    // item
    const item = document.createElement("div");
    item.classList.add("item");

    // equationText
    const equationTextEl = document.createElement("h1");
    equationTextEl.textContent = equation.value;

    item.appendChild(equationTextEl);

    //appendto imagecontainer
    itemContainer.appendChild(item);
  });
}

function selectQuestionAmount(e) {
  e.preventDefault();
  questionAmount = getQuestionAmount();
  console.log(questionAmount);
  if (questionAmount) {
    showCountDownPage();
    populateGamePage();
  }
}

// right & wrong function

function select(selectedTrue) {
  valueScrollY += 80;

  itemContainer.scroll(0, valueScrollY);

  selectedTrue ? playerGuessArray.push("true") : playerGuessArray.push("false");

  console.log(playerGuessArray);

  if (playerGuessArray.length === equationsArray.length) {
    console.log("stop timer excuted.");
    stopTimer();
  }
}

// ------

// Create Correct/Incorrect Random Equations
function createEquations() {
  // Randomly choose how many correct equations there should be
  const correctEquations = makeRandomNumber(questionAmount);
  // Set amount of wrong equations
  const wrongEquations = questionAmount - correctEquations;

  // Loop through, multiply random numbers up to 9, push to array
  for (let i = 0; i < correctEquations; i++) {
    firstNumber = makeRandomNumber(10);
    secondNumber = makeRandomNumber(10);
    const equationValue = firstNumber * secondNumber;
    const equation = `${firstNumber} x ${secondNumber} = ${equationValue}`;
    equationObject = { value: equation, evaluated: "true" };
    equationsArray.push(equationObject);
  }
  // Loop through, mess with the equation results, push to array
  for (let i = 0; i < wrongEquations; i++) {
    firstNumber = makeRandomNumber(10);
    secondNumber = makeRandomNumber(10);
    const equationValue = firstNumber * secondNumber;
    wrongFormat[0] = `${firstNumber} x ${secondNumber + 1} = ${equationValue}`;
    wrongFormat[1] = `${firstNumber} x ${secondNumber} = ${equationValue - 1}`;
    wrongFormat[2] = `${firstNumber + 1} x ${secondNumber} = ${equationValue}`;
    const formatChoice = makeRandomNumber(2);
    const equation = wrongFormat[formatChoice];
    equationObject = { value: equation, evaluated: "false" };
    equationsArray.push(equationObject);
  }
  equationsArray = shuffle(equationsArray);
  console.log(equationsArray);
}

// Dynamically adding correct/incorrect equations
function populateGamePage() {
  // Reset DOM, Set Blank Space Above
  itemContainer.textContent = "";
  // Spacer
  const topSpacer = document.createElement("div");
  topSpacer.classList.add("height-240");
  // Selected Item
  const selectedItem = document.createElement("div");
  selectedItem.classList.add("selected-item");
  // Append
  itemContainer.append(topSpacer, selectedItem);

  // Create Equations, Build Elements in DOM
  createEquations();
  equationToDOM();

  // Set Blank Space Below
  const bottomSpacer = document.createElement("div");
  bottomSpacer.classList.add("height-500");
  itemContainer.appendChild(bottomSpacer);
}

// ****** Event Listeners ****

startForm.addEventListener("submit", selectQuestionAmount);

// form selecting radio
startForm.addEventListener("click", () => {
  radioContainers.forEach((radioEl) => {
    radioEl.classList.remove("selected-label");

    //if input (radio) checked
    if (radioEl.children[1].checked) {
      radioEl.classList.add("selected-label");
    }
  });
});

gamePage.addEventListener("click", startTimer);

// onload connect to local

getSavedBestScores();
