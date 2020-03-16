const { Builder, By } = require("selenium-webdriver");
const sleep = require("sleep");
const fs = require("fs");

let STOP_EXECUTION = false;

process.on("SIGINT", function() {
  console.log("Caught interrupt signal");
  STOP_EXECUTION = true;
});

class Question {
  constructor(name) {
    this.name = name;
    this.correctAnswer = undefined;
  }
  getCorrectAnswer() {
    return this.correctAnswer;
  }
}

class QuestionManager {
  constructor() {
    this.questions = {};
  }
  addQuestion(question) {
    this.questions[question.name] = question;
  }
  questionAlreadyExists(question) {
    return this.questions[question.name] !== undefined;
  }
  getAnswer(question) {
    return this.questions[question.name].getCorrectAnswer();
  }
  markAnswerAsCorrect(question, name) {
    this.questions[question.name].correctAnswer = name;
  }
}

async function getQuestion(driver) {
  return await driver
    .findElement(By.css("h2"))
    .then(element => element.getText());
}

async function getAnswers(driver) {
  return await driver
    .findElements(By.css(".col-lg-12"))
    .then(element =>
      Promise.all([
        element[0].getText(),
        element[1].getText(),
        element[2].getText(),
        element[3].getText()
      ])
    );
}

async function clickAnswer(driver, name, answersInAppearingOrder) {
  let index = answersInAppearingOrder.findIndex(e => e === name);
  return await driver
    .findElement(
      By.css(
        `.row:nth-child(${index === -1 ? 1 : index + 1}) > .col-lg-12 > p > a`
      )
    )
    .then(element => element.click());
}

async function getCorrectAnswer(driver) {
  return await driver
    .findElement(By.css(".btn.btn-success.btn-md.btn-block"))
    .then(e => e.getText());
}

(async function example() {
  let driver = await new Builder().forBrowser("firefox").build();
  try {
    await driver.get("https://www.trivinet.com/es/trivial-online/jugar");

    const questionManager = new QuestionManager();

    while (!STOP_EXECUTION) {
      let name = await getQuestion(driver);
      let answers = await getAnswers(driver);
      let question = new Question(name);

      if (!questionManager.questionAlreadyExists(question)) {
        questionManager.addQuestion(question);
      }

      let answerToClick = questionManager.getAnswer(question);
      await clickAnswer(driver, answerToClick, answers);
      sleep.msleep(500);

      questionManager.markAnswerAsCorrect(
        question,
        await getCorrectAnswer(driver)
      );

      sleep.msleep(4000);
    }
  } finally {
    await driver.quit();
  }
})();
