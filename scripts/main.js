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

// Complete Page variables
const completeBtn = document.querySelector(".complete__again");

// dynamic variables
let quizData = [];
let questionIndexCounter = 1; //counts what question the user is currently in
let chosenSubjectIndex; //what subject did the user choose
let correctCounter = 0;

// compare actual answer to the correct answer
questionOptionArray.forEach((btn) => {
    btn.addEventListener("click", () => {
        let userAnswer = btn.querySelector(".question__opt-txt").textContent;
        let correct = quizData[chosenSubjectIndex].questions[questionIndexCounter - 1].answer;
        let validationIcon = btn.querySelector(".validation-icon");
        console.log(correct);

        if (userAnswer == correct) {
            btn.classList.add("correct");
            btn.classList.remove("wrong");
            validationIcon.classList.remove("hide");
            validationIcon.src = "images/icon-correct.svg";
        } else {
            btn.classList.add("wrong");
            btn.classList.remove("correct");
            validationIcon.classList.remove("hide");
            validationIcon.src = "images/icon-incorrect.svg";
            showCorrectAnswer(correct);
        } 
        questionOptionArray.forEach(b => b.disabled = true)
    })
})

// show correct answer after answering
function showCorrectAnswer(correct) {
    questionOptionArray.forEach((btn) => {
        let optionText = btn.querySelector(".question__opt-txt").textContent
        let validationIcon = btn.querySelector(".validation-icon");
        if (optionText == correct){
            btn.classList.add("correct");
            validationIcon.classList.remove("hide");
            validationIcon.src = "images/icon-correct.svg";
        }

    })
}

// Remove validation
function removeValidation() {
    questionOptionArray.forEach((btn) => {
        btn.classList.remove("correct");
        btn.classList.remove("wrong");
        let validationIcon = btn.querySelector(".validation-icon");
        validationIcon.classList.add("hide");
        questionOptionArray.forEach(b => b.disabled = false)
    })
}

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

// load data file after clicking menu option
menuOptionArray.forEach((btn, index) => {
    btn.addEventListener("click", () => {
        switchPage(menuPage, questionPage);
        toggleHide(selectedSubject);
        loadHeaderData(index);
        loadSubjectQuestion(index);
        chosenSubjectIndex = index;
    });
});

// go to next question
submitAnswerBtn.addEventListener("click", () => {
    if (questionIndexCounter == 10) {
        switchPage(questionPage, completePage);
    } else {
        questionIndexCounter++;
        loadSubjectQuestion(chosenSubjectIndex);
    }
    removeValidation();
});

// go back to menu page
completeBtn.addEventListener("click", () => {
    switchPage(completePage, menuPage);
    toggleHide(selectedSubject);
    questionIndexCounter = 1;
});

// load subject data to question page after clicking the specific subject
function loadSubjectQuestion(index) {
    questionText.textContent = quizData[index].questions[(questionIndexCounter - 1)].question;
    questionIndex.textContent = questionIndexCounter;

    let fetchedOptionArray = [];
    fetchedOptionArray = quizData[index].questions[(questionIndexCounter - 1)].options;

    optionTextArray.forEach((option, i) => {
        option.textContent = fetchedOptionArray[i];
    })
    
}

// load the header data from json file
function loadHeaderData(index) {
    subjectText.innerHTML = quizData[index].title;
    subjectIcon.src = quizData[index].icon;
}

// Toggle between pages
function switchPage(hidePage,showPage) {
    hidePage.classList.add("hide");
    showPage.classList.remove("hide");
}

//add and remove hide class
function toggleHide(element) {
    element.classList.toggle("hide");
}



/* 
   main theme function
*/
function applyTheme(mode) {
  const isLight = mode === 'light';

  setThemeClasses(isLight); 
  updateIconsAndPills(isLight);
  themeSwitch.checked = isLight;
  localStorage.setItem('theme', mode); // remember preference
}

//apply .light / .dark to every themed element
function setThemeClasses(isLight) {
  flipOne(document.body, isLight);
  menuOptionArray.forEach(element => flipOne(element, isLight));
  questionOptionArray.forEach(element => flipOne(element, isLight));
}

//flip classes on ONE element
function flipOne(element, isLight) {
  element.classList.toggle('light', isLight);
  element.classList.toggle('dark',  !isLight);
}

// swap icons and slider
function updateIconsAndPills(isLight) {
  sunIcon.src  = `images/icon-sun-${isLight ? 'dark' : 'light'}.svg`;
  moonIcon.src = `images/icon-moon-${isLight ? 'dark' : 'light'}.svg`;

  sliderLigt.classList.toggle('hide', !isLight);
  sliderDark.classList.toggle('hide',  isLight);
}

//Save and load theme if the page is refresed or exited
const savedTheme = localStorage.getItem('theme');
applyTheme(savedTheme === 'light' ? 'light' : 'dark');
   
// listen for user toggle
themeSwitch.addEventListener('change', () => {
  applyTheme(themeSwitch.checked ? 'light' : 'dark');
});
