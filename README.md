# Trivia Bot

Bot to win https://www.trivinet.com/es/trivial-online/version-web

## Usage

~~~
Usage: bot.js <command> [options]

Commands:
  bot.js run  Start up the bot

Options:
  --help                Show help                                      [boolean]
  --version             Show version number                            [boolean]
  -f, --answers-file    path to answers file[string] [default: "questions.json"]
  -n, --workers-number  number of workers                           [default: 3]
  -t, --backup-time     time between backups (milliseconds)      [default: 2000]

Examples:
  bot.js run -f question.json  Run the scraper from a specific file
  bot.js run -n 3              Launch three different workers
  bot.js run -t 1000           Answers file will be saved every second

Enjoy the trivial :D
~~~