const { Builder, By } = require("selenium-webdriver");

const worker_threads = require("worker_threads");
const parentPort = worker_threads.parentPort;

const QuestionManager = require("./QuestionManager").QuestionManager;

let STOP_EXECUTION = false;

const sleep = milliseconds => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
};

process.on("SIGINT", function() {
  console.log("Caught interrupt signal");
  STOP_EXECUTION = true;
});

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

async function play() {
  let driver = await new Builder().forBrowser("firefox").build();
  try {
    await driver.get("https://www.trivinet.com/es/trivial-online/jugar");

    const questionManager = new QuestionManager();
    questionManager.readQuestionFile("questions.json");

    while (!STOP_EXECUTION) {
      let question = await getQuestion(driver);
      let answers = await getAnswers(driver);
      let answerToClick = questionManager.getAnswer(question);

      await clickAnswer(driver, answerToClick, answers);
      await sleep(500);

      let correctAnswer = await getCorrectAnswer(driver);
      parentPort.postMessage({ question: question, answer: correctAnswer });
      await sleep(3500);
    }
  } finally {
    await driver.quit();
  }
}

(async function controller() {
  while (!STOP_EXECUTION) {
    try {
      await play();
    } catch (e) {
      console.log(e);
    }
  }
})();
