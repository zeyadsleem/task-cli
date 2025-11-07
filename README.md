# Task Tracker CLI

[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Simple zero-dependency command-line task manager written in Node.js.  
Tasks are stored in a local `tasks.json` file created automatically in the working directory.

---

## Features

| Feature            | Command                                       |
| ------------------ | --------------------------------------------- |
| Add a task         | `task-cli add "Buy milk"`                     |
| Update description | `task-cli update 1 "Buy milk and bread"`      |
| Delete a task      | `task-cli delete 1`                           |
| Mark in-progress   | `task-cli mark-in-progress 1`                 |
| Mark done          | `task-cli mark-done 1`                        |
| List all tasks     | `task-cli list`                               |
| List by status     | `task-cli list done` / `todo` / `in-progress` |
| JSON output        | `task-cli list --json`                        |
| Clear done tasks   | `task-cli clear-done`                         |
| Help               | `task-cli help`                               |
| Version            | `task-cli version`                            |

---

## Project URL

https://roadmap.sh/projects/task-tracker

---

## Installation

```bash
# Clone the repository
git clone https://github.com/zeyadsleem/task-cli.git
cd task-cli

# Make the script executable
chmod +x task-cli.js

# Install globally (optional)
npm link
```
