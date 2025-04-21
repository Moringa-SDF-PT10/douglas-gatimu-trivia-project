
// let allQuestionsObj = [
//     {
//         "type": "multiple",
//         "difficulty": "easy",
//         "category": "Entertainment: Vampire Diaries",
//         "question": "Who turned Caroline Forbes into a vampire?",
//         "correct_answer": "Katherine Pierce",
//         "incorrect_answers": [
//             "Stefan Salvatore",
//             "Elena Gilbert",
//             "Damon Salvatore"
//         ]
//     },
//     {
//         "type": "multiple",
//         "difficulty": "easy",
//         "category": "Geography: Kenya",
//         "question": "What is the capital city of Kenya?",
//         "correct_answer": "Nairobi",
//         "incorrect_answers": [
//             "Mombasa",
//             "Kisumu",
//             "Nakuru"
//         ]
//     },
//     {
//         "type": "multiple",
//         "difficulty": "easy",
//         "category": "Animals: Cats",
//         "question": "What breed of cat is known for being hairless?",
//         "correct_answer": "Sphynx",
//         "incorrect_answers": [
//             "Persian",
//             "Maine Coon",
//             "Bengal"
//         ]
//     },
//     {
//         "type": "multiple",
//         "difficulty": "easy",
//         "category": "Science: Human Body",
//         "question": "Which organ is responsible for pumping blood throughout the body?",
//         "correct_answer": "Heart",
//         "incorrect_answers": [
//             "Liver",
//             "Lungs",
//             "Kidneys"
//         ]
//     },
//     {
//         "type": "multiple",
//         "difficulty": "easy",
//         "category": "Entertainment: Vampire Diaries",
//         "question": "What is the name of Elena's doppelgänger ancestor?",
//         "correct_answer": "Katherine Pierce",
//         "incorrect_answers": [
//             "Isobel Flemming",
//             "Rebekah Mikaelson",
//             "Lexi Branson"
//         ]
//     },
//     {
//         "type": "multiple",
//         "difficulty": "easy",
//         "category": "Geography: Kenya",
//         "question": "Which famous wildlife migration occurs in Kenya and Tanzania?",
//         "correct_answer": "The Great Migration",
//         "incorrect_answers": [
//             "The Sahara Trek",
//             "The Savannah Drift",
//             "The Big Five Journey"
//         ]
//     },
//     {
//         "type": "multiple",
//         "difficulty": "easy",
//         "category": "Animals: Cats",
//         "question": "What is a group of cats called?",
//         "correct_answer": "Clowder",
//         "incorrect_answers": [
//             "Flock",
//             "Pack",
//             "Herd"
//         ]
//     },
//     {
//         "type": "multiple",
//         "difficulty": "easy",
//         "category": "Science: Human Body",
//         "question": "How many bones are in the adult human body?",
//         "correct_answer": "206",
//         "incorrect_answers": [
//             "201",
//             "208",
//             "210"
//         ]
//     },
//     {
//         "type": "multiple",
//         "difficulty": "easy",
//         "category": "Entertainment: Vampire Diaries",
//         "question": "Who is the original hybrid in The Vampire Diaries?",
//         "correct_answer": "Klaus Mikaelson",
//         "incorrect_answers": [
//             "Elijah Mikaelson",
//             "Tyler Lockwood",
//             "Stefan Salvatore"
//         ]
//     },
//     {
//         "type": "multiple",
//         "difficulty": "easy",
//         "category": "Science: Human Body",
//         "question": "What part of the human body contains the smallest bones?",
//         "correct_answer": "Ear",
//         "incorrect_answers": [
//             "Hand",
//             "Foot",
//             "Nose"
//         ]
//     }
// ]
// let questionsObj = allQuestionsObj.slice(0, 3)

const questionsOrderedList = document.querySelector('.quiz ol')
const quizDiv = document.querySelector('.quiz')
//const scoreElement = document.querySelector('.score span')
const startBtn = document.querySelector('.start-btn')
const startPage = document.querySelector('.start-page')
const scoreBoardScoreElement = document.querySelector('aside > div > p.score-board')
const restartBtn = document.querySelector('aside > div > p.restart')
const scoreBoard = document.querySelector('aside')
const tryAgainBtn = document.querySelector('.try-again-btn')
const mainContainer = document.querySelector('.container')

const overlay = document.querySelector('.overlay');
const correctCount = document.getElementById('correct-count')
const percentage = document.getElementById('score-percentage');
const feedback = document.getElementById('feedback')
const reviewBtn = document.querySelector('.review-btn')


let totalAnswered = 0

let totalQuestions;

let score = 0;
function insertQuestionNumber(questionsObj) {
    for (let i = 0; i < questionsObj.length; i++) {
        questionsObj[i]['question_id'] = i
    }
}
let questionsGotWrong = []

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
    formElement.innerHTML = `<input type="submit" value="Submit Answer">`
    for (let i = 0; i < choices.length; i++) {
        createChoiceElement(formElement, choices[i], `choice-${i}`)
    }



    return formElement
}



function createQuestionElement(questionObj) {
    let questionWrapper = document.createElement('li')
    questionWrapper.classList.add("question-wrapper")
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

    //Eventlistner to form
    formElement.addEventListener('submit', (e) => {
        e.preventDefault()

        let selected = formElement.querySelector('input[name="choice"]:checked')
        if (selected) {
            console.log("Selected answer:", selected.value,);



            renderAnswerResultv2(selected, questionObj, formElement)
            console.log(selected.checked)
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

function resetQuiz() {
    questionsOrderedList.innerHTML = ''
    quizDiv.classList.add('temp-hidden')
    mainContainer.classList.add('temp-hidden')
    startPage.classList.remove('hidden')
    score = 0;
    totalAnswered = 0
    questionsGotWrong = []
    //scoreElement.textContent = score
    scoreBoardScoreElement.textContent = '😺'
    scoreBoard.classList.add('temp-hidden')


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
    console.log(correctCount.textContent)

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

        console.log("parent for selected:", selected.parentElement)
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

        console.log("parent for selected:", selected.parentElement)
        selected.parentElement.style.backgroundColor = 'red'
        selected.parentElement.style.borderRadius = '7.5%'
        formElement.parentElement.style.border = '3px solid red'
        console.log('parent for form:', formElement.parentElement)

        let correctAnswer = document.createElement('div')
        correctAnswer.classList.add('correction')
        correctAnswer.innerHTML = `<p>The correct answer is ${questionObject['correct_answer']}.</p>`
        formElement.parentElement.appendChild(correctAnswer)
        selected.parentElement.querySelector('.icons .bx-x').style.display = 'block'
        //formElement.parentElement.style.pointerEvents = "none";
        console.log(correctAnswer)
        totalAnswered += 1
        console.log(totalAnswered)
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
    return seeResultsDiv

}

document.addEventListener('DOMContentLoaded', () => renderTrivia)

function renderTrivia() {


    startBtn.addEventListener('click', () => {

        startPage.classList.add('hidden')
        // startBtn.classList.add('temp-hidden')
        mainContainer.classList.remove('temp-hidden')
        quizDiv.classList.remove('temp-hidden')
        scoreBoard.classList.remove('temp-hidden')

        fetch(`https://opentdb.com/api.php?amount=10`)
            .then(res => res.json())
            .then(questionsObj => {
                console.log(questionsObj)
                totalQuestions = questionsObj.length
                insertQuestionNumber(questionsObj)
                //console.log(questionsObj)              
                insertChoicesArray(questionsObj)
                console.log(questionsObj)
                renderTrivia(questionsObj)

            })
        questionsObj.forEach((questionObj) => createQuestionElement(questionObj))
        questionsOrderedList.appendChild(createSeeResults())


        document.querySelector('.quiz ol').style.display = 'flex'
        resultsBtn = document.querySelector('ol > div > p')
        resultsBtn.addEventListener('click', () => {

            if (totalQuestions === totalAnswered) {
                renderResults()
                console.log(score)
            } else {
                alert(`You haven't answered ${totalQuestions - totalAnswered} questions.`)
            }

        })

    })

    restartBtn.addEventListener('click', () => {
        resetQuiz()
    })





    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.classList.add('hidden');
        }
    });

    reviewBtn.addEventListener('click', () => {
        overlay.classList.add('hidden')
        if (questionsGotWrong.length > 0) {
            questionsOrderedList.innerHTML = ''
            console.log(questionsGotWrong)
            questionsGotWrong.forEach((questionObj) => createQuestionAnswerElement(questionObj))
        }
        scoreBoardScoreElement.textContent = '😺'

    })


    tryAgainBtn.addEventListener('click', () => {
        overlay.classList.add('hidden')
        resetQuiz()
    }
    )
    //Ask person to confirm answer.









}