const fs = require("fs");

class QuestionManager {
  constructor() {
    this.questions = {};
  }
  addQuestion(question) {
    this.questions[question.name] = "";
  }
  questionAlreadyExists(question) {
    return this.questions[question.name] !== undefined;
  }
  getAnswer(question) {
    return this.questions[question];
  }
  markAnswerAsCorrect(question, name) {
    this.questions[question] = name;
  }
  readQuestionFile(path) {
    let rawdata = fs.readFileSync(path);
    this.questions = JSON.parse(rawdata);
  }
  writeQuestionFile(path) {
    fs.writeFileSync(path, JSON.stringify(this.questions, null, 4));
  }
}

module.exports = { QuestionManager };
