// Select required elements
const timer = document.querySelector(".timer");
const quizContainer = document.getElementById("container");
const nextButton = document.getElementById("next-button");
const numOfQuestions = document.querySelector(".number-of-questions");
const displayContainer = document.getElementById("display-container");
const scoreContainer = document.querySelector(".score-container");
const restartButton = document.getElementById("restart");
const userScore = document.getElementById("user-score");
const startScreen = document.querySelector(".start-screen");
const startButton = document.getElementById("start-button");

let questionCount = 0;
let scoreCount = 0;
let count = 10;
let countdown;

// Quiz data structure
let quizArray = [];

// Function to generate random RGB value
const generateRGBValue = () => {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r}, ${g}, ${b})`;
};

// Populate quiz array
const populateQuiz = () => {
  for (let i = 0; i < 5; i++) {
    const correctColor = generateRGBValue();
    const optionsSet = new Set([correctColor]);

    // Ensure 4 unique options
    while (optionsSet.size < 4) {
      optionsSet.add(generateRGBValue());
    }

    quizArray.push({
      id: i + 1,
      correct: correctColor,
      options: Array.from(optionsSet),
    });
  }
};

// Timer function
const startTimer = () => {
  count = 10;
  clearInterval(countdown);
  countdown = setInterval(() => {
    timer.innerHTML = `<span>Time Left: </span> ${count}s`;
    count--;

    if (count < 0) {
      clearInterval(countdown);
      nextQuestion();
    }
  }, 1000);
};

// Display the next question
const nextQuestion = () => {
  questionCount++;

  if (questionCount === quizArray.length) {
    // End of quiz
    displayContainer.classList.add("hide");
    scoreContainer.classList.remove("hide");
    userScore.innerHTML = `Your score is ${scoreCount} out of ${quizArray.length}`;
  } else {
    // Display the next question
    numOfQuestions.textContent = `${questionCount + 1} of ${quizArray.length} Questions`;
    displayQuiz(questionCount);
    startTimer();
  }

  nextButton.classList.add("hide");
};

// Display quiz content
const displayQuiz = (index) => {
  const quizCards = document.querySelectorAll(".container-mid");
  quizCards.forEach((card) => card.classList.add("hide"));
  quizCards[index].classList.remove("hide");
};

// Create the quiz
const createQuiz = () => {
  quizArray.forEach((question, index) => {
    const quizCard = document.createElement("div");
    quizCard.classList.add("container-mid", "hide");

    const questionElement = document.createElement("p");
    questionElement.classList.add("question-color");
    questionElement.textContent = question.correct;

    const optionsContainer = document.createElement("div");
    optionsContainer.classList.add("button-container");

    question.options.forEach((option) => {
      const optionButton = document.createElement("button");
      optionButton.classList.add("option-div");
      optionButton.style.background = option;
      optionButton.dataset.option = option;

      optionButton.addEventListener("click", () => checkAnswer(optionButton));
      optionsContainer.appendChild(optionButton);
    });

    quizCard.appendChild(questionElement);
    quizCard.appendChild(optionsContainer);
    quizContainer.appendChild(quizCard);
  });
};

// Check user's answer
const checkAnswer = (selectedOption) => {
  const userAnswer = selectedOption.dataset.option;
  const currentQuestion = quizArray[questionCount];
  const allOptions = document.querySelectorAll(".container-mid:not(.hide) .option-div");

  if (userAnswer === currentQuestion.correct) {
    selectedOption.classList.add("correct");
    scoreCount++;
  } else {
    selectedOption.classList.add("incorrect");
    allOptions.forEach((option) => {
      if (option.dataset.option === currentQuestion.correct) {
        option.classList.add("correct");
      }
    });
  }

  clearInterval(countdown);
  allOptions.forEach((option) => (option.disabled = true));
  nextButton.classList.remove("hide");
};

// Restart the game
const restartGame = () => {
  questionCount = 0;
  scoreCount = 0;
  count = 10;
  quizArray = [];
  quizContainer.innerHTML = "";
  populateQuiz();
  createQuiz();
  displayQuiz(questionCount);
  startTimer();

  displayContainer.classList.remove("hide");
  scoreContainer.classList.add("hide");
};

// Initialize the game
const initializeGame = () => {
  questionCount = 0;
  scoreCount = 0;
  count = 10;
  quizArray = [];
  populateQuiz();
  createQuiz();
  displayQuiz(questionCount);
  startTimer();

  startScreen.classList.add("hide");
  displayContainer.classList.remove("hide");
};

// Event listeners
startButton.addEventListener("click", initializeGame);
restartButton.addEventListener("click", restartGame);
nextButton.addEventListener("click", nextQuestion);