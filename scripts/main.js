// Page variables
const menuPage = document.getElementById("menu-page");
const questionPage = document.getElementById("question-page");
const completePage = document.getElementById("complete-page");

// Header variables
const themeSwitch = document.getElementById("theme__switch");
const sunIcon = document.getElementById("theme__sun--dark");
const moonIcon = document.getElementById("theme__moon--dark");
const sliderLigt = document.getElementById("slider-light");
const sliderDark = document.getElementById("slider-dark");
const selectedSubject = document.getElementById("selected-subject");
const subjectText = document.querySelector(".subject__text");
const subjectIcon = document.getElementById("subject-icon");

// Menu page variables
const menuOptionArray = document.querySelectorAll(".menu__option");
const htmlBtn = document.getElementById("html-btn");
const cssBtn = document.getElementById("css-btn");
const jsBtn = document.getElementById("js-btn");
const accessBtn = document.getElementById("access-btn");

// Question Page variables
const questionOptionArray = document.querySelectorAll(".question__option");
const submitAnswerBtn = document.querySelector(".question__submit-btn");
const questionIndex = document.getElementById("question__index");
const questionText = document.querySelector(".question__text");
const optionTextArray = document.querySelectorAll(".question__opt-txt");
const a = document.getElementById("a");
const aText = document.getElementById("a-text");
const b = document.getElementById("b");
const bText = document.getElementById("b-text");
const c = document.getElementById("c");
const cText = document.getElementById("c-text");
const d = document.getElementById("d");
const dText = document.getElementById("d-text");
const validationIconArray = document.querySelectorAll(".validation-icon");
const progressBar = document.querySelector(".question__progress-bar");
const notAnsweredError = document.getElementById("question__submit-error");
const quesetionBtnArray = document.querySelectorAll(".question__button");

//API Variables
const chatInput = document.getElementById('chat-input');
const sendChatBtn = document.getElementById('send-chat-btn');
const chatHistoryDiv = document.getElementById('chat-history');
let conversationHistory = []; //To maintain conversation context

// Complete Page variables
const completeBtn = document.querySelector(".complete__again");
const completeSummary = document.querySelector(".complete__summary");
const finalScore = document.getElementById("final-score");


// dynamic variables
let quizData = [];
let questionIndexCounter = 1; //counts what question the user is currently in
let chosenSubjectIndex; //what subject did the user choose
let correctCounter = 0;
let answered = false;

/* 
    HELPER FUNCTIONS
*/
function switchPage(hidePage,showPage) {
    hidePage.classList.add("hide");
    showPage.classList.remove("hide");
}

function toggleHide(element) {
    element.classList.toggle("hide");
}

function getCurrentQuestion(index) {
    return quizData[index].questions[questionIndexCounter - 1]
}

 function updateProgressBar() {
    progressBar.style.width = `${(questionIndexCounter * 100)/getQuestionCount(chosenSubjectIndex)}%`;
};

function getQuestionCount(index = chosenSubjectIndex) {
    return quizData[index].questions.length;
}

/* 
    THEME FUNCTIONS
*/
function applyTheme(mode) {
  const isLight = mode === 'light';

  setThemeClasses(isLight); 
  updateIconsAndPills(isLight);
  themeSwitch.checked = isLight;
  localStorage.setItem('theme', mode); // remember preference
}

// Apply .light or .dark class to every themed element
function setThemeClasses(isLight) {
  flipOne(document.body, isLight);
  flipOne(completeSummary, isLight);
  menuOptionArray.forEach(element => flipOne(element, isLight));
  questionOptionArray.forEach(element => flipOne(element, isLight));
}

// Flip classes on ONE element
function flipOne(element, isLight) {
  element.classList.toggle('light', isLight);
  element.classList.toggle('dark',  !isLight);
}

// Swap icons and slider
function updateIconsAndPills(isLight) {
  sunIcon.src  = `images/icon-sun-${isLight ? 'dark' : 'light'}.svg`;
  moonIcon.src = `images/icon-moon-${isLight ? 'dark' : 'light'}.svg`;

  sliderLigt.classList.toggle('hide', !isLight);
  sliderDark.classList.toggle('hide',  isLight);
}

// Save and load theme if the page is refresed or exited
const savedTheme = localStorage.getItem('theme');
applyTheme(savedTheme === 'light' ? 'light' : 'dark');
   
// Listen for user toggle
themeSwitch.addEventListener('change', () => {
  applyTheme(themeSwitch.checked ? 'light' : 'dark');
});

/*
    QUIZ RENDERING FUNCTIONS
*/
// Load questions after clicking the specific subject
function loadSubjectQuestion(index) {
    updateQuestionText(index);
    populateAnswerOptions(index);
}

// Sets the current question text and number
function updateQuestionText(index) {
    questionText.textContent = getCurrentQuestion(index).question;
    questionIndex.textContent = questionIndexCounter;
}

// Fills in A,B,C,D option texts
function populateAnswerOptions(index) {
    let fetchedOptionArray = [];
    fetchedOptionArray = getCurrentQuestion(index).options;

    optionTextArray.forEach((option, i) => {
        option.textContent = fetchedOptionArray[i];
    })
}

function loadHeaderData(index) {
    subjectText.innerHTML = quizData[index].title;
    subjectIcon.src = quizData[index].icon;
}

// Remove green and red borders that show correct and wrong answer
function removeValidation() {
    questionOptionArray.forEach((btn) => {
        let validationIcon = btn.querySelector(".validation-icon");
        let letter = btn.querySelector(".question__button");

        btn.classList.remove("correct");
        btn.classList.remove("wrong");
        letter.classList.remove("correct");
        letter.classList.remove("wrong");
        validationIcon.classList.add("hide");
        questionOptionArray.forEach(b => b.disabled = false);
        
    });
}

/*
    FUNCTIONS THAT HANDLES THE ANSWER
*/
// Compare actual answer to the correct answer
function handleAnswerClick(btn) {
    let userAnswer = btn.querySelector(".question__opt-txt").textContent;
    let correct = getCurrentQuestion(chosenSubjectIndex).answer;
    let isCorrect = userAnswer === correct;

    if (btn.disabled) return;
    
    showAnswerFeedback(btn, isCorrect, correct);
    updateQuizStateAfterAnswer(isCorrect);

    questionOptionArray.forEach(b => b.disabled = true);
}

// Highlights the answer Red or Green
function showAnswerFeedback(btn, isCorrect, correctAnswer) {
    let letter = btn.querySelector(".question__button")
    let validationIcon = btn.querySelector(".validation-icon");

    if (btn.disabled) return;

    if (isCorrect) {
        btn.classList.add("correct");
        btn.classList.remove("wrong");
        letter.classList.add("correct");
        letter.classList.remove("wrong");
        validationIcon.classList.remove("hide");
        validationIcon.src = "images/icon-correct.svg";
    } else {
        btn.classList.add("wrong");
        btn.classList.remove("correct");
        letter.classList.add("wrong");
        letter.classList.remove("correct");
        validationIcon.classList.remove("hide");
        validationIcon.src = "images/icon-incorrect.svg";
        showCorrectAnswer(correctAnswer);
    } 
}

// Show correct answer after answering
function showCorrectAnswer(correctAnswer) {
    questionOptionArray.forEach((btn) => {
        let optionText = btn.querySelector(".question__opt-txt").textContent
        let letter = btn.querySelector(".question__button")
        let validationIcon = btn.querySelector(".validation-icon");
        if (optionText == correctAnswer){
            btn.classList.add("correct");
            validationIcon.classList.remove("hide");
            validationIcon.src = "images/icon-correct.svg";
            letter.classList.add("correct");
        }
    });
}

function updateQuizStateAfterAnswer(isCorrect) {
    answered = true;
    notAnsweredError.classList.add("hide");
    if (isCorrect) correctCounter++;
}

/*
    QUIZ NAVIGATION FUNCTIONS
*/

function handleEmptySubmit() {
    notAnsweredError.classList.remove("hide");
}

function handleFinalSubmit() {
    switchPage(questionPage, completePage);
    finalScore.textContent = correctCounter;
    answered = false;
    notAnsweredError.classList.add("hide");
}

function handleNextQuestion() {
    questionIndexCounter++;
    loadSubjectQuestion(chosenSubjectIndex);
    answered = false;
    notAnsweredError.classList.add("hide");
}

/*
    EVENT LISTENERS
*/

questionOptionArray.forEach((btn) => {
    btn.addEventListener("click", () => handleAnswerClick(btn));
});

// load data file after choosing a subject
menuOptionArray.forEach((btn, index) => {
    btn.addEventListener("click", () => {
        switchPage(menuPage, questionPage);
        toggleHide(selectedSubject);
        loadHeaderData(index);
        loadSubjectQuestion(index);
        chosenSubjectIndex = index;
        updateProgressBar();
    });
});

// go to next question
submitAnswerBtn.addEventListener("click", () => {
    if (!answered) {
        handleEmptySubmit();
    } else if (questionIndexCounter == getQuestionCount(chosenSubjectIndex)) {
        handleFinalSubmit();
    } else {
        handleNextQuestion();
    }
    removeValidation();
    updateProgressBar();
});

// go back to menu page
completeBtn.addEventListener("click", () => {
    switchPage(completePage, menuPage);
    toggleHide(selectedSubject);
    questionIndexCounter = 1;
    correctCounter = 0;
    updateProgressBar();
});

//store data in the variable quizData
fetch("data.json").then((response) => {
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
}).then((data) => {
    quizData = data.quizzes;
    console.log("Quiz data loaded:", quizData);
}).catch((error) => {
    console.error("Error loading quiz data:", error);
    alert("Failed to load Quiz data. Please try again.");
});


/*
    API FUNCTIONS
*/

sendChatBtn.addEventListener('click', async () => {
    const userMessage = chatInput.value.trim();
    if (userMessage === '') return;

    // Display user's message
    appendMessage(userMessage, 'user-message');
    chatInput.value = ''; // Clear input

    const loadingMessage = appendMessage('Thinking...', 'bot-message-loading');

    try {
        const response = await fetch('/api/gemini-chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: userMessage,
                history: conversationHistory // Send the full history
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const botResponse = data.text;

        loadingMessage.remove();
        appendMessage(botResponse, 'bot-message');

        // Update conversation history for the next turn
        conversationHistory.push({ role: "user", parts: [{ text: userMessage }] });
        conversationHistory.push({ role: "model", parts: [{ text: botResponse }] });

    } catch (error) {
        console.error('Error fetching AI response:', error);
        // Remove loading indicator
        loadingMessage.remove();
        appendMessage('Error: Could not get a response. Try again later.', 'error-message');
    }
});

function appendMessage(message, className) {
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messageElement.classList.add('chat-message', className);
    chatHistoryDiv.appendChild(messageElement);
    chatHistoryDiv.scrollTop = chatHistoryDiv.scrollHeight;
    return messageElement; // Return element to allow removal of loading message
}

// Allow pressing Enter to send message
chatInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendChatBtn.click();
    }
});