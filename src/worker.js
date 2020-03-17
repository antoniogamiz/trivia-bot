const { parentPort } = require("worker_threads");
const puppeteer = require("puppeteer");
const {
  getQuestion,
  getAnswers,
  clickAnswer,
  getCorrectAnswer
} = require("./scraping");

let STOP_EXECUTION = false;
const URL = "https://www.trivinet.com/es/trivial-online/jugar";

const sleep = milliseconds => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
};

const QuestionManager = require("./QuestionManager").QuestionManager;

async function play() {
  let questionManager = new QuestionManager();
  questionManager.readQuestionFile("questions.json");
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(URL);

  try {
    while (!STOP_EXECUTION) {
      let question = await getQuestion(page);
      let answers = await getAnswers(page);
      let answerToClick = questionManager.getAnswer(question);

      await clickAnswer(page, answerToClick, answers);
      await sleep(500);

      let correctAnswer = await getCorrectAnswer(page);
      parentPort.postMessage({
        type: "question",
        question: question,
        answer: correctAnswer
      });
      await sleep(3500);
    }
  } finally {
    await browser.close();
  }
}

(async function recoverFromErrors() {
  while (!STOP_EXECUTION) {
    try {
      await play();
    } catch (e) {
      console.log(e);
      parentPort.postMessage({
        type: "reportFail"
      });
    }
  }
})();

process.on("SIGINT", function() {
  console.log("Exiting...");
  STOP_EXECUTION = true;
});
