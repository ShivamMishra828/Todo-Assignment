# Todo List Backend Application

This project is a backend application developed using Node.js and Express.js to manage a todo list. Users can perform CRUD operations on todo items, upload todo items from a CSV file, download the todo list in CSV format, and set a status flag for each todo item.

## Features

-   **CRUD Operations**: Create, read, update, and delete todo items.
-   **CSV File Upload**: Upload todo items from a CSV file.
-   **CSV File Download**: Download the todo list in CSV format.
-   **Status Flag**: Set and update the status flag for todo items.
-   **Filtering**: Fetch todo list items based on their status (e.g., fetching only completed items, only pending items, etc.).

## API Endpoints

-   `GET /todos`: Fetch all todo items.
-   `GET /todos/:id`: Fetch a single todo item by ID.
-   `POST /todos`: Add a new todo item.
-   `PUT /todos/:id`: Update an existing todo item.
-   `DELETE /todos/:id`: Delete a todo item.
-   `POST /todos/upload`: Upload todo items from a CSV file.
-   `GET /todos/download`: Download the todo list in CSV format.
-   `GET /todos/filter?status=:status`: Filter todo list items based on status.
-   `POST /users/signup`: Create a new user object.
-   `POST /users/signin`: Login in the system.
-   `GET /users/logout`: Logout from the system.

## Getting Started

### Installation

1. **Clone the repository**

    ```bash
    git clone https://github.com/ShivamMishra828/Todo-Assignment
    cd Todo-Assignment
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Set up environment variables**

    Copy the `.env.example` file to `.env` and fill in your own secrets:

    ```bash
    cp .env.example .env
    ```

4. **Start the server**
    ```bash
    npm start
    ```

### Usage

1. **Sign Up**

    ```http
    POST /api/v1/users/signup
    ```

2. **Sign In**

    ```http
    POST /api/v1/users/signin
    ```

3. **Create Todo**

    ```http
    POST /api/v1/todos
    ```

4. **Get All Todos**

    ```http
    GET /api/v1/todos
    ```

5. **Get Todo by ID**

    ```http
    GET /api/v1/todos/:id
    ```

6. **Update Todo**

    ```http
    PUT /api/v1/todos/:id
    ```

7. **Delete Todo**

    ```http
    DELETE /api/v1/todos/:id
    ```

8. **Upload Todos from CSV**

    ```http
    POST /api/v1/todos/upload
    ```

9. **Download Todos as CSV**

    ```http
    GET /api/v1/todos/download
    ```

10. **Filter Todos by Status**
    ```http
    GET /api/v1/todos/filter?status=pending
    ```

## API Documentation

For detailed API documentation, visit: [Postman API Documentation](https://documenter.getpostman.com/view/30772478/2sA3duGtXZ)
