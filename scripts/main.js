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
const quetionOptionArray = document.querySelectorAll(".question__option");
const submitAnswerBtn = document.querySelector(".question__submit-btn");
const questionIndex = document.getElementById("question__index");
const questionText = document.querySelector(".question__text");
const optionTextArray = document.querySelectorAll(".question__opt-txt")
const a = document.getElementById("a");
const aText = document.getElementById("a-text");
const b = document.getElementById("b");
const bText = document.getElementById("b-text");
const c = document.getElementById("c");
const cText = document.getElementById("c-text");
const d = document.getElementById("d");
const dText = document.getElementById("d-text");

// Complete Page variables
const completeBtn = document.querySelector(".complete__again");

// json data variables
let quizData = [];
let questionIndexCounter = 1;
let chosenSubjectIndex;


quetionOptionArray.forEach((btn) => {
})





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
        loadSubjectQuestion(chosenSubjectIndex);
        questionIndexCounter++;
    }
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


// store and save the theme chosen
const savedTheme = localStorage.getItem("theme");


// apply the saved theme when relaoding the page
if (savedTheme === "light") {
    document.body.classList.add("light");
    document.body.classList.remove("dark");

    menuOptionArray.forEach(element => {
        element.classList.add("light");
        element.classList.remove("dark");
    });

    sunIcon.src = "images/icon-sun-dark.svg";
    moonIcon.src = "images/icon-moon-dark.svg";

    sliderLigt.classList.remove("hide");
    sliderDark.classList.add("hide");

    themeSwitch.checked = true;
} else {
    document.body.classList.remove("light");
    document.body.classList.add("dark");

    menuOptionArray.forEach(element => {
        element.classList.add("dark");
        element.classList.remove("light");
    });

    sunIcon.src = "images/icon-sun-light.svg";
    moonIcon.src = "images/icon-moon-light.svg";

    sliderLigt.classList.add("hide");
    sliderDark.classList.remove("hide");

    themeSwitch.checked = false;
}

// switch theme and set the variable "theme" to the appropriate value
themeSwitch.addEventListener("change", () => {
    if (themeSwitch.checked) {
        document.body.classList.add("light");
        document.body.classList.remove("dark");

        menuOptionArray.forEach(element => {
            element.classList.add("light");
            element.classList.remove("dark");
        });

        sunIcon.src = "images/icon-sun-dark.svg";
        moonIcon.src = "images/icon-moon-dark.svg";

        sliderLigt.classList.remove("hide");
        sliderDark.classList.add("hide");
        
        localStorage.setItem("theme", "light");
    } else {
        document.body.classList.remove("light");
        document.body.classList.add("dark");

        menuOptionArray.forEach(element => {
            element.classList.add("dark");
            element.classList.remove("light");
        });

        sunIcon.src = "images/icon-sun-light.svg";
        moonIcon.src = "images/icon-moon-light.svg";

        sliderLigt.classList.add("hide");
        sliderDark.classList.remove("hide");
        
        localStorage.setItem("theme", "dark");
    }
});