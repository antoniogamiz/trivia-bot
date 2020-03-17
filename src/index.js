const { Worker, isMainThread } = require("worker_threads");
const QuestionManager = require("./QuestionManager").QuestionManager;

function newWorker(questionManager) {
  let worker = new Worker("./src/worker.js");
  worker.on("message", data => {
    let totalQuestions = Object.keys(questionManager.questions).length;
    console.log("Questions answered:", totalQuestions);
    questionManager.markAnswerAsCorrect(data.question, data.answer);
  });

  worker.on("error", err => {
    console.log(err);
  });

  worker.on("exit", code => {
    if (code != 0) console.error(`Worker 1 stopped with exit code ${code}`);
  });
}

if (isMainThread) {
  console.log("Starting job...");

  const questionManager = new QuestionManager();
  questionManager.readQuestionFile("questions.json");

  newWorker(questionManager);
  newWorker(questionManager);
  newWorker(questionManager);

  setInterval(() => {
    questionManager.writeQuestionFile("questions.json");
  }, 2000);
}
