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

// Equations
let questionAmount = 0;
let equationsArray = [];

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
