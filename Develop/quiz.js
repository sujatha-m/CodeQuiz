let curPage = 0; // holds the current page being displayed
let myAnswers = []; //array that holds the user selected answer 
/* Array of quiz questions and answers 
 * index 0 --> Question
 * index 1 --> Correct Answer
 * index 2,3,4,5 --> choices
 */
let myQuiz = [
    ["What is addEventListener() used for?", 1, "attach a click event", "nothing", "never use it",
        "listens to HTML"
    ],
    ["What does DOM stand for", 1, "Document Object Model ", "Document Over Mountains",
        "Do Over Models", "Nothing"
    ],
    ["What does BOM stand for", 4, "document Object Model", "nothing", "Big Object Model",
        " Browser Object Model "
    ],
    ["What are variables used for in JavaScript Programs?", 1, "Storing numbers, dates, or other values",
        "Causing high-school algebra flashbacks", "Varying randomly", "None of the above"
    ],
    ["Which of the following are capabilities of functions in JavaScript?", 3, "Return a value",
        "Accept parameters and Return a value", "Accept parameters", "None of the above"
    ],
    ["Which built-in method combines the text of two strings and returns a new string?", 2, "append()",
        "concat()", "attach()", "None of the above"
    ]
];

/* variables holding the html element references */
let myHeader = document.getElementById("quizHeader");
let title = document.getElementById("title");
let hstitle = document.getElementById("hs");
let classname = document.getElementsByClassName("answer");
let myQuestion = document.getElementById("questions");
let btnStart = document.getElementById("startQuiz");
let remark = document.getElementById("remark");
let firstNameInput = document.querySelector("#first-name");
let submitButton = document.querySelector("#submit");
let msgDiv = document.querySelector("#msg");
let userFirstNameSpan = document.querySelector("#user-name");
let card = document.getElementById("finalize");
let table = document.getElementById("table");
let clearhighButton = document.querySelector("#clear");
let gobackButton = document.querySelector("#goback");
let para = document.querySelector(".para");

//event listener for start button clicked
btnStart.addEventListener("click", checkPage);

//event listeners for each answer choices selected by user
for (let i = 0; i < classname.length; i++) {
    classname[i].addEventListener('click', myAnswer, false);
}

function displayMessage(type, message) {
    msgDiv.textContent = message;
    msgDiv.setAttribute("class", type);
}

// count holds the max timer duration calculated by the (number of questions * 15secs) 
let count = myQuiz.length * 15;
let interval;

/* Timer Function */
function countDown() {
    interval = setInterval(function () {
        document.getElementById('count').innerHTML = 'Time Left : ' + count;
        count--;
        if (count === 0) { //when timer expires end the quiz
            clearInterval(interval);
            endQuiz();
        }
    }, 1000);
}

/* Function invoked when user clicks on an answer
 * Validates the user's answer with the index 1 of quiz array
 * to determine correct or wrong
 */
function myAnswer() {
    let idAnswer = this.getAttribute("data-id");
    /// check for correct answer
    myAnswers[curPage] = idAnswer;
    if (myQuiz[curPage][1] == idAnswer) {
        remark.innerHTML = "Correct";
        //console.log('Correct Answer');
    } else { // in case of wrong answer decrement timer value by 10
        remark.innerHTML = "Wrong";
        count -= 10;
        //console.log('Wrong Answer');
    }
    moveNext(); //move to the next question
}

/* Function that moves to the next question after user selected an answer 
 * on reaching the end of all questions, ends the quiz,stops the timer 
 */
function moveNext() {
    ///check if an answer has been made
    if (myAnswers[curPage]) {
        //console.log('okay to proceed');
        if (curPage < (myQuiz.length - 1)) {
            curPage++;
            checkPage(curPage);
        } else {
            ///check if quiz is completed
            //console.log(curPage + ' ' + myQuiz.length);
            if (myQuiz.length >= curPage) {
                clearInterval(interval);
                endQuiz();
            } else {
                //console.log('end of quiz Page ' + curPage);
            }
        }
    } else {
        //console.log('not answered');
    }
}

/* Function called at the end of the quiz to display Result message with score */
function endQuiz() {
    title.innerHTML = "All Done!!";
    let output = '<p>Your Final Score is ' + count + '</p></div> ';
    document.getElementById("quizContent").innerHTML = output + "<br>";
    card.classList.remove("hide"); //unhides the form to be displayed for user name 
}

/* function called at the beginning of quiz when user clicks on start button.
 * Also called when moving to next question to verify the current page and update the
 * quiz array with every invocation to present the next set of question
 */
function checkPage(i) {
    /* after user clicks on start,for page 0,which corresponds to 1st question
     * hide the title and start button as they are no longer relevant from this
     * window onwards.unhide the question and answer sets.
     * Start the timer since first question is loaded
     */
    if (curPage == 0) {
        btnStart.classList.add("hide");
        para.classList.add("hide");
        for (let i = 0; i < classname.length; i++) {
            classname[i].classList.remove("hide");
        }
        title.innerHTML = "";
        countDown(); //start the timer
    }

    //present new page on the window
    myHeader.innerHTML = myQuiz[curPage][0];
    for (let i = 0; i < myQuestion.children.length; i++) {
        let curNode = myQuestion.children[i];
        curNode.childNodes[1].innerHTML = capitalise(myQuiz[curPage][(i + 2)]);
    }
}

/* event listener called when user enters name and clicks on submit button 
 * at the end of the quiz.
 * the user name and score is stored locally using localStorage and retrived to be displayed 
 * on the window 
 */
submitButton.addEventListener("click", function (event) {
    event.preventDefault();

    // create user object from submission
    let user = {
        Name: firstNameInput.value.trim()
    };

    console.log(user);

    // validate the fields
    if (user.Name === "") {
        displayMessage("error", "Name cannot be blank");
    } else {
        displayMessage("success", "Registered successfully");
        title.innerHTML = "";
        document.getElementById("quizContent").innerHTML = "";
        card.classList.add("hide");
        // set new submission
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("score", JSON.stringify(count));

        // get most recent submission
        let lastUser = JSON.parse(localStorage.getItem("user"));
        let lastScore = JSON.parse(localStorage.getItem("score"));
        //map the user name to score
        userFirstNameSpan.textContent = lastUser.Name + "  " + lastScore;
        table.classList.remove("hide");
        table.style.fontWeight = 'bold';
        table.style.fontSize = '25px';
    }
});

/* event listener called when user clicks on clearHighscores button.
 * clears the localStorage items
 */
clearhighButton.addEventListener("click", function (event) {
    event.preventDefault();
    localStorage.clear();
    userFirstNameSpan.textContent = "";
});

/* event listener called when user clicks on Go Back button.
 * reloads the quiz 
 */
gobackButton.addEventListener("click", function (event) {
    event.preventDefault();
    location.reload();
});

// capitalizes the First letter of answer choices from the quiz array 
function capitalise(str) {
    return str.substr(0, 1).toUpperCase() + str.substr(1);
}