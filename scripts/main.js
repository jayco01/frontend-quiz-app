// page variables
const menuPage = document.getElementById("menu-page");
const questionPage = document.getElementById("question-page");
const completePage = document.getElementById("complete-page");
// theme variables
const themeSwitch = document.getElementById("theme__switch");
const sunIcon = document.getElementById("theme__sun--dark");
const moonIcon = document.getElementById("theme__moon--dark");
const sliderLigt = document.getElementById("slider-light");
const sliderDark = document.getElementById("slider-dark");
// menu option buttons variables
const menuOptionArray = document.querySelectorAll(".menu__option");
const htmlBtn = document.getElementById("html-btn");
const cssBtn = document.getElementById("css-btn");
const jsBtn = document.getElementById("js-btn");
const accessBtn = document.getElementById("access-btn");
// question option buttons variables
const quetionOptionArray = document.querySelectorAll(".question__option");

// dynamic variables
let quizData = [];

menuOptionArray.forEach((btn) => {
    btn.addEventListener("click", () => {
        switchPage(menuPage, questionPage);
        console.log(`test menu option ${btn}`)
    })
})

function switchPage(hidePage,showPage) {
    hidePage.classList.add("hide");
    showPage.classList.remove("hide");
}

//store data in the variable quizData
fetch("data.json").then((response) => {
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
}).then((data) => {
    quizData = data;
    console.log("Quiz data loaded:", quizData);
}).catch((error) => {
    console.error("Error loading quiz data:", error);
    alert("Failed to load Quiz data. Please try again.");
});


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
