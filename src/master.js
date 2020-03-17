const { Worker, isMainThread } = require("worker_threads");
const QuestionManager = require("./QuestionManager").QuestionManager;
const chalk = require("chalk");
let fails = 0;

function newWorker(questionManager) {
  let worker = new Worker("./src/worker.js");
  worker.on("message", data => {
    if (data.type === "question") {
      questionManager.markAnswerAsCorrect(data.question, data.answer);
    }
    if (data.type === "reportFail") {
      fails += 1;
    }
  });

  worker.on("error", err => {
    console.log(err);
  });

  worker.on("exit", code => {
    if (code != 0) console.error(`Worker 1 stopped with exit code ${code}`);
  });
}

// ---------------------------------------------------------------------------

function master({ nworkers, backupTime }) {
  if (isMainThread) {
    const questionManager = new QuestionManager();
    questionManager.readQuestionFile("questions.json");

    for (let i = 0; i < nworkers; i++) {
      console.log("Worker ", i, " up and running");
      newWorker(questionManager);
    }

    setInterval(() => {
      questionManager.writeQuestionFile("questions.json");

      let totalQuestions = Object.keys(questionManager.questions).length;
      console.clear();
      console.log(
        chalk.green("Questions answered:"),
        totalQuestions,
        chalk.blueBright("Errors:"),
        fails
      );
    }, backupTime);
  }
}

module.exports = {
  master
};
