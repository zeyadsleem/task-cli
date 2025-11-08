#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { version } = require('./package.json');

const FILE = path.join(process.cwd(), 'tasks.json');

function printHelp() {
    console.log(`
Task Tracker CLI v${version}

Commands:
    add "description"                Add a new task
    update <id> "new description"    Update task description
    delete <id>                      Delete a task
    mark-in-progress <id>            Mark as in-progress
    mark-done <id>                   Mark as done
    list                             List all tasks
    list done                        List completed tasks
    list todo                        List pending tasks
    list in-progress                 List in-progress tasks
    clear-done                       Remove all done tasks
    list --json                      Output as JSON
    help                             Show this help
    version                          Show version
`);
}

function loadTasks() {
    try {
        if (!fs.existsSync(FILE)) {
            saveTasks([]);
            return [];
        }
        const data = fs.readFileSync(FILE, 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Failed to read tasks.json. Starting with empty list.');
        return [];
    }
}

function saveTasks(tasks) {
    try {
        fs.writeFileSync(FILE, JSON.stringify(tasks, null, 2));
    } catch (err) {
        console.error('Failed to save tasks:', err.message);
    }
}

function generateId(tasks) {
    return tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;
}

function getTask(tasks, id) {
    return tasks.find((t) => t.id === id);
}

function exitWithError(msg) {
    console.error(`Error: ${msg}`);
    process.exit(1);
}

function addTask(args) {
    const description = args.slice(1).join(' ').trim();
    if (!description) exitWithError('task description is required');

    const tasks = loadTasks();
    const newTask = {
        id: generateId(tasks),
        description,
        status: 'todo',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    tasks.push(newTask);
    saveTasks(tasks);
    console.log(`Task added successfully (ID: ${newTask.id})`);
}

function listTasks(args) {
    const filter = args[1];
    const isJson = args.includes('--json');
    const tasks = loadTasks();
    let filtered = tasks;

    if (filter === 'done') filtered = tasks.filter((t) => t.status === 'done');
    else if (filter === 'todo') filtered = tasks.filter((t) => t.status === 'todo');
    else if (filter === 'in-progress') filtered = tasks.filter((t) => t.status === 'in-progress');
    else if (filter && !isJson) exitWithError('invalid filter. Use: done, todo, in-progress');

    if (filtered.length === 0) {
        console.log(isJson ? '[]' : 'No tasks found');
        return;
    }

    if (isJson) {
        console.log(JSON.stringify(filtered, null, 2));
    } else {
        filtered.forEach((t) => {
            console.log(`${t.id}: [${t.status}] ${t.description}`);
        });
    }
}

function deleteTask(args) {
    const id = parseInt(args[1]);
    if (isNaN(id)) exitWithError('usage: delete <id>');

    const tasks = loadTasks();
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) exitWithError(`task with ID ${id} not found`);

    tasks.splice(index, 1);
    saveTasks(tasks);
    console.log(`Task ${id} deleted successfully`);
}

function updateTask(args) {
    const id = parseInt(args[1]);
    const newDesc = args.slice(2).join(' ').trim();
    if (isNaN(id) || !newDesc) exitWithError('usage: update <id> <new description>');

    const tasks = loadTasks();
    const task = getTask(tasks, id);
    if (!task) exitWithError(`task with ID ${id} not found`);

    task.description = newDesc;
    task.updatedAt = new Date().toISOString();
    saveTasks(tasks);
    console.log(`Task ${id} updated successfully`);
}

function changeTaskStatus(args, command) {
    const id = parseInt(args[1]);
    if (isNaN(id)) exitWithError(`usage: ${command} <id>`);

    const tasks = loadTasks();
    const task = getTask(tasks, id);
    if (!task) exitWithError(`task with ID ${id} not found`);

    task.status = command === 'mark-done' ? 'done' : 'in-progress';
    task.updatedAt = new Date().toISOString();
    saveTasks(tasks);
    console.log(`Task ${id} is now ${task.status}`);
}

function clearDoneTasks() {
    const tasks = loadTasks();
    const doneCount = tasks.filter((t) => t.status === 'done').length;
    if (doneCount === 0) {
        console.log('No done tasks to clear.');
        return;
    }
    const remaining = tasks.filter((t) => t.status !== 'done');
    saveTasks(remaining);
    console.log(`Cleared ${doneCount} done task(s).`);
}

function main() {
    const args = process.argv.slice(2);
    if (args.length === 0) {
        printHelp();
        return;
    }

    const command = args[0];

    switch (command) {
        case 'add':
            addTask(args);
            break;
        case 'list':
            listTasks(args);
            break;
        case 'delete':
            deleteTask(args);
            break;
        case 'update':
            updateTask(args);
            break;
        case 'mark-in-progress':
        case 'mark-done':
            changeTaskStatus(args, command);
            break;
        case 'clear-done':
            clearDoneTasks();
            break;
        case 'help':
            printHelp();
            break;
        case 'version':
            console.log(`v${version}`);
            break;
        default:
            exitWithError(`unknown command: ${command}`);
    }
}

main();
