async function getTextFromElement(page, selector) {
  const element = await page.$(selector);
  const text = await (await element.getProperty("textContent")).jsonValue();
  return text;
}

async function getQuestion(page) {
  return await getTextFromElement(page, "h2");
}

async function getAnswers(page) {
  const textInButtons = await Promise.all([
    getTextFromElement(page, ".row:nth-child(1) > .col-lg-12 > p > a"),
    getTextFromElement(page, ".row:nth-child(2) > .col-lg-12 > p > a"),
    getTextFromElement(page, ".row:nth-child(3) > .col-lg-12 > p > a"),
    getTextFromElement(page, ".row:nth-child(4) > .col-lg-12 > p > a")
  ]);
  return textInButtons;
}

async function clickAnswer(page, name, answersInAppearingOrder) {
  let index = answersInAppearingOrder.findIndex(e => e === name);
  await page.click(
    `.row:nth-child(${index === -1 ? 1 : index + 1}) > .col-lg-12 > p > a`
  );
}

async function getCorrectAnswer(page) {
  return await getTextFromElement(page, ".btn.btn-success.btn-md.btn-block");
}

module.exports = {
  getQuestion,
  getAnswers,
  clickAnswer,
  getCorrectAnswer
};
