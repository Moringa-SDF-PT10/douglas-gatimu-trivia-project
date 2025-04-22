# Interactive Quiz Game

This project was built to fulfill an end-of-phase project requirement involving DOM manipulation, event handling, and dynamic UI updates using JavaScript. It allows users to test their knowledge through random trivia questions fetched from API endpoint and provides feedback, scoring, and a review option.

## Description

This repository contains a browser-based interactive quiz application that enables users to:

- Start a quiz with a click.
- Answer multiple choice or true/false questions.
- Get immediate feedback on whether their selected answer is correct.
- See their total score after completing all questions.
- Review correct answers for any questions they got wrong.
- Restart the quiz to play again.

**JavaScript concepts used**:

- DOM traversal and manipulation (`querySelector`, `appendChild`, etc.)
- Event listeners and form submission handling
- Dynamic element creation
- Fetch API for getting quiz questions from a public API, https://opentdb.com/api_config.php in this project.


---

## Project Setup

### 1. Clone the Repository

To get started, clone this repository to your local machine:

```bash
git clone https://github.com/douglasgatimu/douglas-gatimu-trivia-project
cd douglas-gatimu-trivia-project
```



### 2. Branch Setup for Deployment

Ensure you have a `gh-pages` branch for deployment to GitHub Pages:

```bash
git checkout -b gh-pages
git push -u origin gh-pages
```


## How to Run the Project

Simply open the `index.html` file in your browser.

### Steps:

1. Open the project folder.
2. Double-click or right-click on `index.html` and open it in your preferred browser.
3. Click **Start Quiz** and begin answering questions.
4. Submit each answer and receive instant feedback.
5. At the end, view your score and review the questions you missed.
6. Restart the quiz to try again!

---

## File Structure

```
📁 root/
├── index.html          
├── index.js            
├── style.css           
└── README.md           
```

---

## Features

- Random questions from API.
- Multiple choice and true/false formats supported.
- Real-time feedback on answers.
- Track and display user score.
- Review of incorrect answers.
- Responsive UI.

---

## Credits

- Trivia questions sourced from [Open Trivia DB](https://opentdb.com).
- Icons from [Boxicons](https://boxicons.com/).

---

## 📄 License

This project is for educational and demonstration purposes only.