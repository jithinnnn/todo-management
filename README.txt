Todo Application

Description:
This project is a Todo application with a React frontend and an Express.js backend, connected to a MySQL database. Users can manage projects and todos, including adding, editing, deleting, and marking todos as complete.

Setup Instructions:

1. Prerequisites:
   - Ensure you have Node.js and npm installed.
   - Ensure MySQL is installed and running.

2. Clone the Repository:
   $ git clone https://github.com/jithinnnn/todo-application.git
   $ cd todo-application

3. Backend Setup:
   a. Navigate to the backend directory:
      $ cd backend
   b. Install dependencies:
      $ npm install
   c. Create a .env file in the backend directory with the following content:
      DB_HOST=localhost
      DB_USER=root
      DB_PASSWORD=
      DB_NAME=todousers
      GITHUB_TOKEN=your_github_personal_access_token
   d. Create the MySQL database and tables by running the following SQL commands:
      CREATE DATABASE todousers;

      USE todousers;

      CREATE TABLE login (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL
      );

      CREATE TABLE projects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL
      );

      CREATE TABLE todos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        description TEXT NOT NULL,
        status ENUM('pending', 'complete') DEFAULT 'pending',
        created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        project_id INT,
        FOREIGN KEY (project_id) REFERENCES projects(id)
      );

4. Frontend Setup:
   a. Navigate to the frontend directory:
      $ cd projectapp
   b. Install dependencies:
      $ npm install
   c. Update the API endpoints in the React app to match your backend server URL.

Run Instructions:

1. Start the Backend Server:
   a. Navigate to the backend directory:
      $ cd backend
   b. Start the server:
      $ npm start
   The backend server will run on http://localhost:8081.

2. Start the Frontend Development Server:
   a. Navigate to the frontend directory:
      $ cd projectapp
   b. Start the development server:
      $ npm start
   The frontend development server will run on http://localhost:3000.


API Endpoints:

- Register a new user: POST /register
- Login a user: POST /login
- Add a new project: POST /projects
- Delete a project: DELETE /projects/:id
- Get all projects: GET /projects
- Fetch a specific project by ID with todos: GET /projects/:id
- Update project title: PUT /projects/:id
- Add a new todo to a project: POST /projects/:id/todos
- Update a todo: PUT /todos/:id
- Update todo status: PUT /todos/:id/status
- Delete a todo: DELETE /todos/:id

Contributing:
Contributions are welcome! Please follow these steps to contribute:
1. Fork the repository.
2. Create a new branch (git checkout -b feature/your-feature).
3. Commit your changes (git commit -am 'Add some feature').
4. Push to the branch (git push origin feature/your-feature).
5. Create a new Pull Request.
