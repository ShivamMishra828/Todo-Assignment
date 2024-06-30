const mongoose = require("mongoose");
const { createObjectCsvWriter } = require("csv-writer");

async function isValidObjectId(id) {
    return mongoose.Types.ObjectId.isValid(id);
}

async function generateTodosCSV(todos) {
    const csvFilePath = `public/downloads/todos-${Date.now()}.csv`;
    const csvWriter = createObjectCsvWriter({
        path: csvFilePath,
        header: [
            { id: "title", title: "Title" },
            { id: "description", title: "Description" },
            { id: "dueDate", title: "Due Date" },
            { id: "status", title: "Status" },
            { id: "createdAt", title: "Created At" },
            { id: "updatedAt", title: "Updated At" },
        ],
    });

    const records = todos.map((todo) => ({
        title: todo.title,
        description: todo.description,
        dueDate: todo.dueDate.toISOString(),
        status: todo.status,
        createdAt: todo.createdAt.toISOString(),
        updatedAt: todo.updatedAt.toISOString(),
    }));

    await csvWriter.writeRecords(records);
    return csvFilePath;
}

module.exports = {
    isValidObjectId,
    generateTodosCSV,
};
