

const fetchURL = {
    local: `http://localhost:3000/questionsObj`,
    real: `https://opentdb.com/api.php?amount=10`

}
const questionsOrderedList = document.querySelector('.quiz ol')
const quizDiv = document.querySelector('.quiz')

const startBtn = document.querySelector('.start-btn')
const startPage = document.querySelector('.start-page')
const scoreBoardScoreElement = document.querySelector('aside > div > p.score-board')
const forfeitBtn = document.querySelector('aside > div > p.restart-fresh')
const restartExactBtn = document.querySelector('aside > div > p.restart-exact')
const scoreBoard = document.querySelector('aside')
const tryAgainBtn = document.querySelector('.try-again-btn')
const mainContainer = document.querySelector('.container')

const resultsBtn = document.querySelector('.results-summary-btn')
const controlQuestion = document.querySelector('.question-control')
const previousQuestion = document.getElementById('previous-question')
const nextQuestion = document.getElementById('next-question')
const finishBtn = document.getElementById('finish-btn')

const overlay = document.querySelector('.overlay');
const correctCount = document.getElementById('correct-count')
const percentage = document.getElementById('score-percentage');
const feedback = document.getElementById('feedback')
const reviewBtn = document.querySelector('.review-btn')
const startPageRetryExactBtn = document.querySelector('.start-retry-btn')
const overlayRetryExactBtn = document.querySelector('.retry-exact-in-overlay')

let totalAnswered = 0
let questionsObj;
//let myQuestionsObj;
let totalQuestions;
let storedQuestions;
let freshQuizFlag = true;
let score = 0;
let questionsGotWrong = [];

mainDOM = { questionsOrderedList, quizDiv, startPage, startBtn, }

function insertQuestionNumber(questionsObj) {
    for (let i = 0; i < questionsObj.length; i++) {
        questionsObj[i]['question_id'] = i
    }
}


function insertChoicesArray(questionsObj) {
    for (let i = 0; i < questionsObj.length; i++) {
        let choices = [...questionsObj[i]["incorrect_answers"]]
        let insertAtIndex = Math.floor(Math.random() * (questionsObj[i]['incorrect_answers'].length + 1));
        choices.splice(insertAtIndex, 0, questionsObj[i]["correct_answer"])
        questionsObj[i]["choices"] = choices
    }
}
function createChoiceElement(formElement, choice, choiceId) {
    let choiceDiv = document.createElement('div')
    choiceDiv.classList.add('choice')
    choiceDiv.innerHTML = `
                        
                        <input type="radio" id="${choiceId}" name="choice" value="${choice}">
                        <label for="${choiceId}">${choice}</label>
                        <div class="icons">
                            <i class='bx bx-check'></i>
                            <i class='bx bx-x'></i>
                        </div>
                    
                    `
    formElement.prepend(choiceDiv)
}
function populateFormElement(choices) {
    let formElement = document.createElement('form')
    formElement.classList.add('choices-form')
    formElement.innerHTML = `<input class='submit-btn' type="submit" value="Submit Answer">`
    for (let i = 0; i < choices.length; i++) {
        createChoiceElement(formElement, choices[i], `choice-${i}`)
    }



    return formElement
}

function createQuestionElement(questionObj) {
    let questionWrapper = document.createElement('li')
    questionWrapper.classList.add("question-wrapper")
    questionWrapper.classList.add("hidden")
    questionWrapper.id = `q-${questionObj['question_id']}`

    let questionMetaElement = document.createElement('div')
    questionMetaElement.classList.add("meta-info")
    let questionNumber = questionObj['question_id'] + 1
    questionObj['question-number'] = questionNumber
    questionMetaElement.innerHTML = ` <div class="question-no">
                        <p>Question: ${questionNumber}</p>
                    </div>
                    <div class="category">
                        <p>Category: ${questionObj['category']}</p>
                    </div>
                    <div class="difficulty">
                        <p>Level: ${questionObj['difficulty']}</p>`



    questionWrapper.appendChild(questionMetaElement)

    let questionElement = document.createElement('div')
    questionElement.classList.add("question")
    questionElement.innerHTML = `
        <p>${questionObj['question']}</p>

    `

    questionWrapper.appendChild(questionElement)


    let formElement = populateFormElement(questionObj['choices'])
    formElement.id = `q${questionObj['question_id']}-submission`
    let submitBtn = formElement.querySelector('.submit-btn')
    //Eventlistner to form
    //console.log(submitBtn)
    formElement.addEventListener('submit', (e) => {
        e.preventDefault()

        let selected = formElement.querySelector('input[name="choice"]:checked')
        if (selected) {
            //console.log("Selected answer:", selected.value,);


            submitBtn.classList.add('submit-disabled')
            renderAnswerResultv2(selected, questionObj, formElement)
            // console.log(selected.checked)
            questionWrapper.style.pointerEvents = 'none';


        } else {
            alert("No option selected.");

        }
    })


    questionWrapper.appendChild(formElement)

    questionsOrderedList.appendChild(questionWrapper)


}

function createQuestionAnswerElement(questionObj) {

    let questionWrapper = document.createElement('li')
    questionWrapper.classList.add("question-answer-wrapper")
    questionWrapper.id = `qa-${questionObj['question_id']}`

    let questionMetaElement = document.createElement('div')
    questionMetaElement.classList.add("meta-info")

    questionMetaElement.innerHTML = ` <div class="question-no">
                        <p>Question: ${questionObj['question-number']}</p>
                    </div>
                    `



    questionWrapper.appendChild(questionMetaElement)

    let questionElement = document.createElement('div')
    questionElement.classList.add("question-answer")
    questionElement.innerHTML = `
        <p>${questionObj['question']}</p>

    `

    questionWrapper.appendChild(questionElement)


    let correctAnswerElement = document.createElement('p')
    correctAnswerElement.classList.add('the-answer')
    correctAnswerElement.textContent = `Correct Answer: ${questionObj['correct_answer']}`




    questionWrapper.appendChild(correctAnswerElement)

    questionsOrderedList.appendChild(questionWrapper)

}

function createNextPreviousBtns() {
    controlsDiv = document.createElement('div')
    controlsDiv.classList.add('controls')
    controlsDiv.classList.add('offscreen')
    controlsDiv.innerHTML = `<button id='previous-question'>Previous</button><button id='next-question'>Next</button>`
    quizDiv.appendChild(controlsDiv)
}


function resetQuiz(freshQuizFlag) {

    console.log(freshQuizFlag)
    score = 0;
    totalAnswered = 0
    questionsGotWrong = []
    questionsOrderedList.innerHTML = ''
    scoreBoardScoreElement.textContent = '😺'

    if (freshQuizFlag) {
        restartFreshHomeScreen()

    } else {


        console.log('unhiding now')
        restartExactHomeScreen()

    }

}

function restartExactHomeScreen() {

    startPageRetryExactBtn.classList.remove('hidden')

    quizOffScreen()

    startBtn.textContent = 'Start Fresh Quiz🚀'
}

function restartFreshHomeScreen() {
    startPageRetryExactBtn.classList.add('hidden')

    quizOffScreen()


    startBtn.textContent = 'Start Quiz🚀'


}

function quizOffScreen() {
    startPage.classList.remove('hidden')
    mainContainer.classList.add('temp-hidden')
    quizDiv.classList.add('temp-hidden')
    scoreBoard.classList.add('temp-hidden')
    resultsBtn.classList.add('hidden')
}

function quizOnScreen() {
    startPage.classList.add('hidden')
    mainContainer.classList.remove('temp-hidden')
    quizDiv.classList.remove('temp-hidden')
    scoreBoard.classList.remove('temp-hidden')
    resultsBtn.classList.remove('hidden')
}




function autoRenderResults() {
    if (totalQuestions === totalAnswered && totalAnswered > 0) {
        setTimeout(renderResults, 1000);
    } else {
        setTimeout(autoRenderResults, 500);
    }
}

//autoRenderResults()
function renderResults() {

    correctCount.textContent = `${score} out of ${totalQuestions}`
    // console.log(correctCount.textContent)

    let scoreAsPercentage = (score / totalQuestions * 100).toFixed(0)
    percentage.textContent = scoreAsPercentage
    feedback.textContent = getPerformanceFeedback(scoreAsPercentage)
    overlay.classList.remove('hidden')
}

function getPerformanceFeedback(percentage) {
    let message = "";
    let emoji = "";

    if (percentage >= 90) {
        message = "Outstanding! You crushed it 💯";
        emoji = "🔥";
    } else if (percentage >= 75) {
        message = "Great job! You're doing really well 👏";
        emoji = "😊";
    } else if (percentage >= 50) {
        message = "Not bad, but there's room to grow 📈";
        emoji = "🤔";
    } else if (percentage >= 30) {
        message = "Keep at it! Progress takes time 🛠️";
        emoji = "💪";
    } else {
        message = "Don't give up — every expert was once a beginner 🌱";
        emoji = "🌧️";
    }

    return `${message} ${emoji}`;
}

function renderAnswerResultv2(selected, questionObject, formElement) {
    //check correctness
    const isCorrect = () => selected.value === questionObject['correct_answer'] ? true : false


    if (isCorrect()) {
        // console.log('your correct')
        // formElement.style.pointerEvents = "none";
        // selected.parentElement.style.backgroundColor = 'yellow'

        // console.log("parent for selected:", selected.parentElement)
        selected.parentElement.style.backgroundColor = 'lightgreen'
        selected.parentElement.style.borderRadius = '7.5%'
        formElement.parentElement.style.border = '3px solid green'
        selected.parentElement.querySelector('.icons .bx-check').style.display = 'block'
        //formElement.parentElement.style.pointerEvents = "none";

        score += 1
        totalAnswered += 1
        //scoreElement.textContent = score
        scoreBoardScoreElement.textContent = '😹'

        //formElement.parentElement.classList.add('correct')
        // formElement.style.pointerEvents = "none";




    } else {
        // console.log(`you are wrong. correct answer is ${questionObject['correct_answer']}`)
        // selected.parentElement.style.backgroundColor = 'red'
        // formElement.style.pointerEvents = "none";

        // console.log("parent for selected:", selected.parentElement)
        selected.parentElement.style.backgroundColor = 'red'
        selected.parentElement.style.borderRadius = '7.5%'
        formElement.parentElement.style.border = '3px solid red'
        // console.log('parent for form:', formElement.parentElement)

        let correctAnswer = document.createElement('div')
        correctAnswer.classList.add('correction')
        correctAnswer.innerHTML = `<p>The correct answer is ${questionObject['correct_answer']}.</p>`
        formElement.parentElement.appendChild(correctAnswer)
        selected.parentElement.querySelector('.icons .bx-x').style.display = 'block'
        //formElement.parentElement.style.pointerEvents = "none";
        // console.log(correctAnswer)
        totalAnswered += 1
        // console.log(totalAnswered)
        scoreBoardScoreElement.textContent = '😿'
        let questionGotWrong = { ...questionObject }
        questionGotWrong['incorrect_answer'] = selected.value
        questionsGotWrong.push(questionGotWrong)

    }
}

function createSeeResults() {
    let seeResultsDiv = document.createElement('div')
    seeResultsDiv.classList.add('results-summary-btn')
    seeResultsDiv.innerHTML = `<p>See Results Summary</p>`
    console.log(seeResultsDiv)
    return seeResultsDiv

}



function renderStoredQuestions() {
    freshQuizFlag = false
    resetQuiz(freshQuizFlag)
    freshQuizFlag = true
    quizOnScreen()
    storedQuestions.sort(() => 0.5 - Math.random())
    startQuiz(storedQuestions)
}

forfeitBtn.addEventListener('click', () => {
    freshQuizFlag = true
    resetQuiz(freshQuizFlag)
})



resultsBtn.addEventListener('click', () => {

    if (totalQuestions === totalAnswered) {
        resultsBtn.classList.add('hidden')
        renderResults()
        // console.log(score)
    } else {
        alert(`You haven't answered ${totalQuestions - totalAnswered} questions.`)
    }

})

restartExactBtn.addEventListener('click', () => renderStoredQuestions())

overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
        overlay.classList.add('hidden');
    }
});

tryAgainBtn.addEventListener('click', () => {
    overlay.classList.add('hidden')
    resetQuiz(freshQuizFlag)
}
)

reviewBtn.addEventListener('click', () => {
    resultsBtn.classList.add('hidden')
    overlay.classList.add('hidden')
    if (questionsGotWrong.length > 0) {
        questionsOrderedList.innerHTML = ''
        // console.log(questionsGotWrong)
        questionsGotWrong.forEach((questionObj) => createQuestionAnswerElement(questionObj))
    }
    scoreBoardScoreElement.textContent = '😺'

})

overlayRetryExactBtn.addEventListener('click', () => {
    overlay.classList.add('hidden')
    renderStoredQuestions()
})

startPageRetryExactBtn.addEventListener('click', () => {
    freshQuizFlag = true
    quizOnScreen()
    storedQuestions.sort(() => 0.5 - Math.random())
    startQuiz(storedQuestions)

})

function buildShowQuestions(showFlag = 'one') {
    questionsObj.forEach((questionObj) => createQuestionElement(questionObj))
    let questionsNodeListy = questionsOrderedList.querySelectorAll('li')
    if (showFlag === 'all') {

        questionsNodeListy.forEach((questionElement) => questionElement.classList.remove('hidden'))

    } else if (showFlag === 'one') {
        resultsBtn.classList.add('hidden')
        controlQuestion.classList.remove('hidden')
        nextQuestion.classList.remove('hidden')
        finishBtn.classList.add('hidden')
        let currentQuestiony = 0;
        
        showOneHideRest(currentQuestiony, questionsNodeListy)

        console.log('hi')
    }

}

finishBtn.addEventListener('click', () => {

    if (totalQuestions === totalAnswered) {
        controlQuestion.classList.add('hidden')
        renderResults()
        // console.log(score)
    } else {
        alert(`You haven't answered ${totalQuestions - totalAnswered} questions.`)
    }

})

function showOneHideRest(currentQuestion, questionsNodeList) {
    questionsNodeList[currentQuestion].classList.remove('hidden')

    if (questionsNodeList.length === 1) {

        //nextQuestion.classList.add('inactive-btn')
        nextQuestion.classList.add('hidden')
        finishBtn.classList.remove('hidden')


    }

    if (currentQuestion === 0) {
        previousQuestion.classList.add('inactive-btn')
    }



    nextQuestion.addEventListener('click', () => {


        let prevQuestion = currentQuestion;
        

        if (prevQuestion < questionsNodeList.length - 1) {
            currentQuestion += 1
            questionsNodeList[prevQuestion].classList.add('hidden')
            questionsNodeList[currentQuestion].classList.remove('hidden')
            console.log('after:', currentQuestion)
        } else {
            
            console.log(`We are at the End.${(currentQuestion === questionsNodeList.length - 1)}`)

        }
        console.log('prevq-next', prevQuestion, 'currentQ-next:', currentQuestion)




        if (currentQuestion === questionsNodeList.length - 1) {

            nextQuestion.classList.add('hidden')
            finishBtn.classList.remove('hidden')


        } else {
            nextQuestion.classList.remove('inactive-btn')
        }

        currentQuestion > 0 ? previousQuestion.classList.remove('inactive-btn') : previousQuestion.classList.add('inactive-btn')


    })

    previousQuestion.addEventListener('click', () => {


        let prevQuestion = currentQuestion;

        if (prevQuestion > 0) {

            currentQuestion -= 1
            questionsNodeList[prevQuestion].classList.add('hidden')
            questionsNodeList[currentQuestion].classList.remove('hidden')
            
        } else {
            console.log('We are at the Beginning.')
        }
        //console.log('prv-prevq', prevQuestion, 'prv-currentQ:', currentQuestion)
        currentQuestion > 0 ? previousQuestion.classList.remove('inactive-btn') : previousQuestion.classList.add('inactive-btn')

        if (currentQuestion === questionsNodeList.length - 1) {
            nextQuestion.classList.add('inactive-btn')
        } else {
            nextQuestion.classList.remove('inactive-btn')
            nextQuestion.classList.remove('hidden')
            finishBtn.classList.add('hidden')
        }



    })


}



function startQuiz(questionsObj) {
    // console.log(questionsObj)
    totalQuestions = questionsObj.length
    insertQuestionNumber(questionsObj)
    //console.log(questionsObj)              
    insertChoicesArray(questionsObj)
    // console.log(questionsObj)
    buildShowQuestions()

    //quizDiv.appendChild(createSeeResults())
    document.querySelector('.quiz ol').style.display = 'flex'




}



function renderTrivia() {
    
    console.log('engines running')
    startBtn.addEventListener('click', () => {
        freshQuizFlag = true
        quizOnScreen()
        
        fetch(fetchURL.local)
            .then(res => res.json())
            .then(data => {
                questionsObj = data.results.slice(0, 3)
                storedQuestions = [...questionsObj]
                startQuiz(questionsObj)
            })

    })

}

document.addEventListener('DOMContentLoaded', renderTrivia)

