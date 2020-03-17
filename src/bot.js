#!/usr/bin/env node
const { master } = require("./master");

const argv = require("yargs")
  .usage("Usage: $0 <command> [options]")
  .command("run", "Start up the bot", {}, argv => {
    console.log("Starting the bot with ", argv.n, " workers...");
    master({ nworkers: argv.n, backupTime: argv.t });
  })
  .example("$0 run -f question.json", "Run the scraper from a specific file")
  .example("$0 run -n 3", "Launch three different workers")
  .example("$0 run -t 1000", "Answers file will be saved every second")
  .option("f", {
    alias: "answers-file",
    demandOption: false,
    default: "questions.json",
    describe: "path to answers file",
    type: "string"
  })
  .option("n", {
    alias: "workers-number",
    demandOption: false,
    default: 3,
    describe: "number of workers",
    type: "int"
  })
  .option("t", {
    alias: "backup-time",
    demandOption: false,
    default: 2000,
    describe: "time between backups (milliseconds)",
    type: "int"
  })
  .epilog("Enjoy the trivial :D").argv;

// master(argv.nworkers);
