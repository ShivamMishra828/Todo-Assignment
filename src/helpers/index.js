const mongoose = require("mongoose");
const { createObjectCsvWriter } = require("csv-writer");

// Function to validate a MongoDB ObjectId
async function isValidObjectId(id) {
    return mongoose.Types.ObjectId.isValid(id);
}

// Function to generate a CSV file from an array of todo objects
async function generateTodosCSV(todos) {
    const csvFilePath = `public/downloads/todos-${Date.now()}.csv`;

    // Create a CSV writer with the specified path and headers
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

    // Map the todo objects to the CSV format
    const records = todos.map((todo) => ({
        title: todo.title,
        description: todo.description,
        dueDate: todo.dueDate.toISOString(),
        status: todo.status,
        createdAt: todo.createdAt.toISOString(),
        updatedAt: todo.updatedAt.toISOString(),
    }));

    // Write the records to the CSV file
    await csvWriter.writeRecords(records);

    return csvFilePath;
}

module.exports = {
    isValidObjectId,
    generateTodosCSV,
};
