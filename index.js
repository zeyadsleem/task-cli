const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);
const command = args[0];

const FILE = path.join(process.cwd(), "tasks.json");

function loadTasks() {
    if (!fs.existsSync(FILE)) {
        fs.writeFileSync(FILE, "[]");
    }
    const data = fs.readFileSync(FILE, "utf-8");
    return JSON.parse(data);
}
function saveTasks(tasks) {
    fs.writeFileSync(FILE, JSON.stringify(tasks, null, 2));
}

function addTask() {
    const description = args.slice(1).join(" ");
    if (!description) {
        console.log("Error: task description is required.");
        return;
    }

    const tasks = loadTasks();
    const newTask = {
        id: tasks.length + 1,
        description,
        status: "todo",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    tasks.push(newTask);
    saveTasks(tasks);
    console.log(`Task added successfully (ID: ${newTask.id})`);
}
function listTasks() {
    const filter = args[1];
    const tasks = loadTasks();

    let filtered = tasks;
    if (filter === "done") filtered = tasks.filter((t) => t.status === "done");
    else if (filter === "todo")
        filtered = tasks.filter((t) => t.status === "todo");
    else if (filter === "in-progress")
        filtered = tasks.filter((t) => t.status === "in-progress");
    else if (filter) {
        console.log("Invalid filter. Use: done, todo, in-progress");
        return;
    }

    if (filtered.length === 0) {
        console.log("No tasks found");
        return;
    }

    filtered.forEach((t) => {
        console.log(`${t.id}: [${t.status}] ${t.description}`);
    });
}
function deleteTask() {
    const id = parseInt(args[1]);
    if (isNaN(id)) {
        console.log("Usage: delete <id>");
        return;
    }
    const tasks = loadTasks();
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) {
        console.log(`No task with ID: ${id}`);
        return;
    }

    tasks.splice(index, 1);
    saveTasks(tasks);
    console.log(`Task ${id} deleted successfully`);
    return;
}
function updateTask() {
    const id = parseInt(args[1]);
    const newDesc = args.slice(2).join(" ");

    if (isNaN(id) || !newDesc) {
        console.log("Usage: update <id> <new description>");
        return;
    }
    const tasks = loadTasks();
    const task = tasks.find((t) => t.id === id);
    if (!task) {
        console.log(`No task with ID: ${id}`);
        return;
    }

    task.description = newDesc;
    task.updatedAt = new Date().toISOString();
    saveTasks(tasks);
    console.log(`Task ${id} updated successfully`);
    return;
}
function changeTaskStatus() {
    const id = parseInt(args[1]);
    if (isNaN(id)) {
        console.log(`Usage: ${command} <id>`);
        return;
    }

    const tasks = loadTasks();
    const task = tasks.find((t) => t.id === id);
    if (!task) {
        console.log(`No task with ID: ${id}`);
        return;
    }

    const newStatus = command === "mark-done" ? "done" : "in-progress";
    task.status = newStatus;
    task.updatedAt = new Date().toISOString();
    saveTasks(tasks);
    console.log(`Task ${id} is now ${newStatus}`);
    return;
}

switch (command.toLocaleLowerCase()) {
    case "add":
        addTask();
        break;
    case "list":
        listTasks();
        break;
    case "delete":
        deleteTask();
        break;
    case "update":
        updateTask();
        break;
    case "mark-in-progress":
    case "mark-done":
        changeTaskStatus();
        break;

    default:
        console.log("Unknown command");
        break;
}
